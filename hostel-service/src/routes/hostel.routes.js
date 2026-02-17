const express = require("express");
const router = express.Router();
const hostelController = require("../controllers/hostel.controller");

// Add Room
router.post("/add-room", hostelController.addRoom);

// Get All Rooms
router.get("/", hostelController.getRooms);

// Get Room By ID
router.get("/:id", hostelController.getRoomById);

// Reduce Available Bed
router.patch("/:id/reduce-bed", hostelController.reduceBed);

module.exports = router;
