import { MongoClient } from "mongodb";
import africastalking from "africastalking";
import bcrypt from "bcryptjs";

const client = new MongoClient(process.env.MONGO_URI);

// Configure Africa’s Talking
const at = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password required" });
    }

    // Hash the password before storing
    password = await bcrypt.hash(password, 10);

    await client.connect();
    const db = client.db("loginDB");
    const users = db.collection("users");

    let user = await users.findOne({ phone });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      // Create new user
      await users.insertOne({
        phone,
        password,
        verified: false,
        verificationCode
      });
    } else if (!user.verified) {
      // Update code and password for unverified user
      await users.updateOne(
        { phone },
        { $set: { verificationCode, password } }
      );
    } else {
      return res.status(400).json({ error: "Phone already registered and verified" });
    }

    // Send SMS via Career Buddy
    const sms = at.SMS;
    await sms.send({
      to: phone,
      message: `Your Career Buddy verification code is: ${verificationCode}`,
      from: "Career Buddy"
    });

    res.status(201).json({ message: "Verification code sent via SMS" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
