const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyToken, userController.getMe);

module.exports = router;