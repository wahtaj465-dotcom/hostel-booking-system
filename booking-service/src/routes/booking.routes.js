const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/book-room", verifyToken, bookingController.bookRoom);
router.delete("/:id", verifyToken, bookingController.cancelBooking);

module.exports = router;