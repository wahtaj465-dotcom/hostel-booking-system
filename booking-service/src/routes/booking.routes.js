const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
// ❗ NO AUTH HERE (handled by gateway)

const requireAdmin = (req, res, next) => {
  if (req.headers["x-user-role"] !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

router.post("/book-room", bookingController.bookRoom);
router.get("/my-bookings", bookingController.getMyBookings);
router.get("/all", requireAdmin, bookingController.getAllBookings);
router.delete("/:id", bookingController.cancelBooking);

module.exports = router;