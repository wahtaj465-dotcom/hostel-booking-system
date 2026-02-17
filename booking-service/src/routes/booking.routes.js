const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// 🔒 Protected Booking Route
router.post("/book-room", verifyToken, bookingController.bookRoom);

module.exports = router;
