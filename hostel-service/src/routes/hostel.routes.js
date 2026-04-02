const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  reduceBed,
  increaseBed,
  updateRoom,
  deleteRoom,
} = require("../controllers/hostel.controller");

router.post("/", createRoom);
router.get("/", getRooms);
router.get("/:id", getRoomById);
router.patch("/:id/reduce-bed", reduceBed);
router.patch("/:id/increase-bed", increaseBed);

// ✅ NEW CRUD
router.patch("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;