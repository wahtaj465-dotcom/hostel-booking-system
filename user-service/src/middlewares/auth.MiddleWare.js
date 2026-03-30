const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};