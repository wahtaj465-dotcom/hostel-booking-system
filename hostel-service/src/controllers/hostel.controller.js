const Room = require("../models/room.model");
const { getRedisClient } = require("../cache/redis.client");

// ==========================================
// 🏗 CREATE ROOM (Invalidate Cache)
// ==========================================
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    // 🔥 Invalidate cache
    const redis = getRedisClient();
    await redis.del("all_rooms");

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 📥 GET ALL ROOMS (With Redis Cache)
// ==========================================
exports.getRooms = async (req, res) => {
  try {
    const redis = getRedisClient();

    const cachedRooms = await redis.get("all_rooms");

    if (cachedRooms) {
      console.log("⚡ Cache HIT");
      return res.json(JSON.parse(cachedRooms));
    }

    console.log("💾 Cache MISS - Fetching from DB");

    const rooms = await Room.find();

    await redis.set("all_rooms", JSON.stringify(rooms), {
      EX: 60, // Cache expires in 60 seconds
    });

    res.json(rooms);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🔽 ATOMIC REDUCE BED (Concurrency Safe)
// ==========================================
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

    // 🔥 Invalidate cache after update
    const redis = getRedisClient();
    await redis.del("all_rooms");

    return res.status(200).json({ message: "Bed reduced successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// 🔼 ATOMIC INCREASE BED (Cancellation)
// ==========================================
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

    // 🔥 Invalidate cache after update
    const redis = getRedisClient();
    await redis.del("all_rooms");

    return res.status(200).json({ message: "Bed increased successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};