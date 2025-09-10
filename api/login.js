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

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Wrong password" });

    return res.status(200).json({ message: "Login success" });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
