const Room = require("../models/room.model");

// Create Room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atomic Reduce Bed
exports.reduceBed = async (req, res) => {
  try {
    const roomId = req.params.id;

    const result = await Room.updateOne(
      { _id: roomId, availableBeds: { $gt: 0 } },
      { $inc: { availableBeds: -1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No beds available" });
    }

    return res.status(200).json({ message: "Bed reduced successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atomic Increase Bed (for cancellation)
exports.increaseBed = async (req, res) => {
  try {
    const roomId = req.params.id;

    const result = await Room.updateOne(
      { _id: roomId },
      { $inc: { availableBeds: 1 } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ message: "Bed increased successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};