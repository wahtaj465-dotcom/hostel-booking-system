// user-service/src/routes/user.routes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/Auth.MiddleWare");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", verifyToken, userController.getMe); // VERIFYTOKEN HERE

module.exports = router;