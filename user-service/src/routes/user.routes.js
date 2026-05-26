// user-service/src/routes/user.routes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.MiddleWare");
const authRateLimit = require("../middlewares/auth.rate-limit");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/auth.validation");

router.post("/register", authRateLimit, validateRegister, userController.register);
router.post("/login", authRateLimit, validateLogin, userController.login);
router.get("/me", verifyToken, userController.getMe); // VERIFYTOKEN HERE

router.get("/internal/:id", userController.getUserEmailInternal);

module.exports = router;