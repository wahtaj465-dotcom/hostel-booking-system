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

const requireAdmin = (req, res, next) => {
  if (req.headers["x-user-role"] !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

router.post("/", requireAdmin, createRoom);
router.get("/", getRooms);
router.get("/:id", getRoomById);
router.patch("/:id/reduce-bed", reduceBed);
router.patch("/:id/increase-bed", increaseBed);

// ✅ Admin-only CRUD
router.patch("/:id", requireAdmin, updateRoom);
router.delete("/:id", requireAdmin, deleteRoom);

module.exports = router;