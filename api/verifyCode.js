import { MongoClient } from "mongodb";
import africastalking from "africastalking";

const client = new MongoClient(process.env.MONGO_URI);
const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    await client.connect();
    const db = client.db("loginDB");
    const users = db.collection("users");

    const user = await users.findOne({ phone });
    if (!user) return res.status(400).json({ error: "User not found" });

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await users.updateOne({ phone }, { $set: { verificationCode: newCode } });

    const sms = at.SMS;
    await sms.send({
      to: phone,
      message: `Your new verification code is: ${newCode}`
    });

    res.status(200).json({ message: "New code sent" });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
