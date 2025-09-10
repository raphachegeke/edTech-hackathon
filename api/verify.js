import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
}
