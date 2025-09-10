import mongoose from "mongoose";
import bcrypt from "bcrypt";

let conn = null;
async function connectDB() {
  if (conn) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI);
  return conn;
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { username, password } = req.body;

    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
      username: String,
      password: String
    }));

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed });
    await user.save();

    return res.status(200).json({ message: "Signup successful" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
