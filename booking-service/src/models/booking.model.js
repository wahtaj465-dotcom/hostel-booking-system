const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "CONFIRMED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
