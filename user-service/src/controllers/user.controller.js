const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { publishAuthEvent } = require("../events/producer");

// ✅ Hardcoded admin
const ADMIN_EMAIL = "admin@hostel.com";
const ADMIN_PASSWORD = "admin123";
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const signToken = (user) => jwt.sign(
  { userId: user._id, role: user.role || "user" },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

const saveOtpAndNotify = async (user, purpose) => {
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  user.otp = hashedOtp;
  user.otpExpiresAt = otpExpiresAt;
  user.otpPurpose = purpose;
  await user.save();

  await publishAuthEvent({
    type: "OTP_REQUESTED",
    purpose,
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    otp,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  });
};

// REGISTER (existing password-based flow kept for backwards compatibility)
exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    // ✅ block admin signup to keep credentials fixed
    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin registration not allowed" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, isEmailVerified: true });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (existing password-based flow kept for backwards compatibility)
exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

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
          isEmailVerified: true,
        });
      }

      return res.json({ token: signToken(admin) });
    }

    // normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ token: signToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STEP 1: Request OTP for passwordless login
exports.requestLoginOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email }).select("+otp +otpExpiresAt +otpPurpose");

    if (!user) return res.status(404).json({ message: "User not found" });
    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin must login with password" });
    }

    await saveOtpAndNotify(user, "login");

    return res.json({ message: "OTP sent to your email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// STEP 1: Request OTP for signup. Creates an unverified user until OTP is verified.
exports.requestSignupOtp = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (email === ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin registration not allowed" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    let user = await User.findOne({ email }).select("+otp +otpExpiresAt +otpPurpose");

    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({
        name,
        email,
        password: hashed,
        isEmailVerified: false,
      });
    } else {
      user.name = name;
      user.password = hashed;
      user.isEmailVerified = false;
    }

    await saveOtpAndNotify(user, "signup");

    return res.status(201).json({ message: "Signup OTP sent to your email" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// STEP 2: Verify OTP and issue the standard JWT used by the rest of the app.
exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp, purpose } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiresAt +otpPurpose");
    if (!user || !user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (purpose && user.otpPurpose !== purpose) {
      return res.status(400).json({ message: "Invalid OTP purpose" });
    }

    if (new Date() > user.otpExpiresAt) {
      user.otp = null;
      user.otpExpiresAt = null;
      user.otpPurpose = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    user.otpPurpose = null;
    user.isEmailVerified = true;
    await user.save();

    return res.json({ token: signToken(user) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

// ✅ INTERNAL: GET USER EMAIL BY ID (for notification-service)
// In a real production setup, protect this endpoint with a service token.
exports.getUserEmailInternal = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("email name");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ email: user.email, name: user.name });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
