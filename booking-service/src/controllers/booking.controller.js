const axios = require("axios");
const Booking = require("../models/booking.model");
const { publishBookingEvent } = require("../events/producer");
const { BOOKING_CREATED } = require("../events/topics");

exports.bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        message: "roomId is required",
      });
    }

    // 🔐 userId from JWT middleware
    const userId = req.userId;

    // 1️⃣ Reduce bed via hostel-service
    await axios.patch(
      `http://localhost:4002/hostels/${roomId}/reduce-bed`
    );

    // 2️⃣ Save booking
    const booking = await Booking.create({
      userId,
      roomId,
      status: "CONFIRMED",
    });

    // 3️⃣ Publish RabbitMQ Event
    await publishBookingEvent({
      type: BOOKING_CREATED,
      bookingId: booking._id,
      userId,
      roomId,
      message: "Booking Created Successfully",
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
