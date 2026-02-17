const Room = require("../models/room.model");

/**
 * ✅ Add a New Room
 */
exports.addRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * ✅ Get All Rooms
 */
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * ✅ Get Room By ID
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * ✅ Reduce Available Bed (Atomic Version)
 * This prevents race condition
 */
exports.reduceBed = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Atomic update
    const result = await Room.updateOne(
      { _id: roomId, availableBeds: { $gt: 0 } },
      { $inc: { availableBeds: -1 } }
    );

    // If no document was updated
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "No beds available or room not found"
      });
    }

    const updatedRoom = await Room.findById(roomId);

    res.json({
      message: "Bed reduced successfully",
      room: updatedRoom
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
