const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ✅ Hardcoded admin
const ADMIN_EMAIL = "admin@hostel.com";
const ADMIN_PASSWORD = "admin123";

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ block admin signup to keep credentials fixed
    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin registration not allowed" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ hardcoded admin login
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // ensure admin exists in DB
      let admin = await User.findOne({ email: ADMIN_EMAIL });
      if (!admin) {
        const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
        admin = await User.create({
          name: "Admin",
          email: ADMIN_EMAIL,
          password: hashed,
          role: "admin",
        });
      }

      const token = jwt.sign(
        { userId: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({ token });
    }

    // normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};