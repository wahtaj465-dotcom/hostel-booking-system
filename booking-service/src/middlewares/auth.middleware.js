const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId =
      decoded.userId || decoded.id || decoded._id || decoded.user?.id;

    if (!userId) return res.status(401).json({ message: "Invalid token" });

    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};