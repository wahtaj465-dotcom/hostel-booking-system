// user-service/src/routes/user.routes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/Auth.MiddleWare");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/auth/login/request-otp", userController.requestLoginOtp);
router.post("/auth/signup/request-otp", userController.requestSignupOtp);
router.post("/auth/verify-otp", userController.verifyOtp);
router.get("/me", verifyToken, userController.getMe); // VERIFYTOKEN HERE

router.get("/internal/:id", userController.getUserEmailInternal);

module.exports = router;