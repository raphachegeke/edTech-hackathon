import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password required" });
    }

    await client.connect();
    const db = client.db("loginDB");
    const users = db.collection("users");

    const user = await users.findOne({ phone });
    if (!user) return res.status(400).json({ error: "User not found" });
    if (!user.verified) return res.status(400).json({ error: "Phone not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
}
