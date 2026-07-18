const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;