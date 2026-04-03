const axios = require("axios");
const Booking = require("../models/booking.model");
const { publishBookingEvent } = require("../events/producer");
const { BOOKING_CREATED, BOOKING_CANCELLED } = require("../events/topics");

// helper
const isAdmin = (req) => req.headers["x-user-role"] === "admin";

// ==========================================
// 📌 BOOK ROOM (Concurrency Safe + Event)
// ==========================================
exports.bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    // ✅ read userId forwarded from gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }

    // 1️⃣ Atomic bed reduction via Hostel Service
    const response = await axios.patch(
      `${process.env.HOSTEL_SERVICE_URL}/hostels/${roomId}/reduce-bed`
    );

    if (!response || response.status !== 200) {
      return res.status(400).json({ message: "Room not available" });
    }

    // 2️⃣ Save booking in DB
    const booking = await Booking.create({
      userId,
      roomId,
      status: "CONFIRMED",
    });

    // 3️⃣ Publish booking created event
    await publishBookingEvent({
      type: BOOKING_CREATED,
      bookingId: booking._id,
      userId,
      roomId,
    });

    return res.status(201).json({
      message: "Room booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error.message);

    return res.status(400).json({
      message: error.response?.data?.message || "Booking failed",
    });
  }
};

// ==========================================
// ❌ CANCEL BOOKING (Event Driven)
// ==========================================
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // ✅ read userId forwarded from gateway
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }

    // 1️⃣ Find confirmed booking
    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "CONFIRMED",
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found or already cancelled",
      });
    }

    // 2️⃣ Update booking status
    booking.status = "CANCELLED";
    await booking.save();

    // 3️⃣ Publish cancellation event
    await publishBookingEvent({
      type: BOOKING_CANCELLED,
      bookingId: booking._id,
      userId,
      roomId: booking.roomId,
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel Error:", error.message);

    return res.status(400).json({
      message: "Cancellation failed",
    });
  }
};

// ==========================================
// ✅ GET MY BOOKINGS
// ==========================================
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found in token" });
    }
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ✅ ADMIN: GET ALL BOOKINGS
// ==========================================
exports.getAllBookings = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Admin only" });
    }
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};