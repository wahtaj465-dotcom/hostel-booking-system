const axios = require("axios");
const Booking = require("../models/booking.model");
const { publishBookingEvent } = require("../events/producer");
const { BOOKING_CREATED } = require("../events/topics");

// Book Room (Concurrency Safe)
exports.bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const userId = req.userId;

    // 1️⃣ Atomic bed reduction
    const response = await axios.patch(
      `${process.env.HOSTEL_SERVICE_URL}/hostels/${roomId}/reduce-bed`
    );

    if (!response || response.status !== 200) {
      return res.status(400).json({ message: "Room not available" });
    }

    // 2️⃣ Save booking
    const booking = await Booking.create({
      userId,
      roomId,
      status: "CONFIRMED",
    });

    // 3️⃣ Publish event
    await publishBookingEvent({
      type: BOOKING_CREATED,
      bookingId: booking._id,
      userId,
      roomId,
    });

    res.status(201).json({
      message: "Room booked successfully",
      booking,
    });

  } catch (error) {
    console.error("Booking Error:", error.message);
    res.status(400).json({
      message: error.response?.data?.message || "Booking failed",
    });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.userId;

    const booking = await Booking.findOne({
      _id: bookingId,
      userId,
      status: "CONFIRMED",
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 1️⃣ Increase bed
    await axios.patch(
      `${process.env.HOSTEL_SERVICE_URL}/hostels/${booking.roomId}/increase-bed`
    );

    // 2️⃣ Update status
    booking.status = "CANCELLED";
    await booking.save();

    // 3️⃣ Publish event
    await publishBookingEvent({
      type: "BOOKING_CANCELLED",
      bookingId: booking._id,
      userId,
      roomId: booking.roomId,
    });

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error("Cancel Error:", error.message);
    res.status(400).json({ message: "Cancellation failed" });
  }
};