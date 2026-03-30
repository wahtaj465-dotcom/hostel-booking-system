const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// ❗ NO AUTH HERE (handled by gateway)

router.post("/book-room", bookingController.bookRoom);
router.get("/my-bookings", bookingController.getMyBookings);
router.delete("/:id", bookingController.cancelBooking);

module.exports = router;