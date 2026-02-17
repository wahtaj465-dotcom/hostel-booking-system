const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hostelName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  totalBeds: {
    type: Number,
    required: true
  },
  availableBeds: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
