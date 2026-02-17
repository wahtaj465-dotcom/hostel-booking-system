const axios = require("axios");
const Booking = require("../models/booking.model");

/**
 * 🔹 Book Room (Secure Version)
 * Requires JWT
 */
exports.bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const userId = req.userId; // Extracted from JWT middleware

    // 🔹 Call Hostel Service to reduce bed
    const hostelResponse = await axios.patch(
      `http://localhost:4002/hostels/${roomId}/reduce-bed`
    );

    // 🔹 If hostel service succeeds, save booking
    const booking = await Booking.create({
      roomId,
      userId,
      status: "CONFIRMED"
    });

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {

    // If hostel service returns error (like no beds)
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message
      });
    }

    // Other unexpected errors
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
