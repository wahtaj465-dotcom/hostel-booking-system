const express = require("express");
const axios = require("axios");
const { HOSTEL_SERVICE_URL } = require("../config/env");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// ✅ Only protect write operations (POST/PATCH/DELETE)
router.use((req, res, next) => {
  if (req.method === "GET") return next();
  return verifyToken(req, res, next);
});

router.use(async (req, res) => {
  try {
    const headers = { ...req.headers };
    delete headers["content-length"];
    delete headers["host"];

    const response = await axios({
      method: req.method,
      url: `${HOSTEL_SERVICE_URL}${req.originalUrl}`,
      data: req.body,
      headers,
      timeout: 10000,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Hostel service error" });
  }
});

module.exports = router;