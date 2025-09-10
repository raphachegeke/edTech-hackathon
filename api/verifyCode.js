import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: "Phone and code required" });

    await client.connect();
    const db = client.db("loginDB");
    const users = db.collection("users");

    const user = await users.findOne({ phone });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.verificationCode !== code) return res.status(401).json({ error: "Invalid code" });

    await users.updateOne(
      { phone },
      { $set: { verified: true }, $unset: { verificationCode: "" } }
    );

    const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Phone verified", token });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
