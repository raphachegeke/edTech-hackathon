import { MongoClient } from "mongodb";
import africastalking from "africastalking";

const client = new MongoClient(process.env.MONGO_URI);

// Configure Africa’s Talking
const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: "Phone and password required" });

    await client.connect();
    const db = client.db("loginDB");
    const users = db.collection("users");

    const existing = await users.findOne({ phone });
    if (existing) return res.status(400).json({ error: "Phone already registered" });

    // Generate code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await users.insertOne({
      phone,
      password,
      verified: false,
      verificationCode
    });

    // Send SMS
    const sms = at.SMS;
    await sms.send({ to: phone, message: `Your verification code is: ${verificationCode}` });

    res.status(201).json({ message: "Verification code sent via SMS" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
