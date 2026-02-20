const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  reduceBed,
  increaseBed,
} = require("../controllers/hostel.controller");

router.post("/", createRoom);
router.get("/", getRooms);
router.patch("/:id/reduce-bed", reduceBed);
router.patch("/:id/increase-bed", increaseBed);

module.exports = router;