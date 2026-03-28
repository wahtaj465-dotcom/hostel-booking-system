const express = require("express");
const axios = require("axios");
const { BOOKING_SERVICE_URL } = require("../config/env");

const router = express.Router();

router.use(async (req, res) => {
  try {
    const headers = { ...req.headers };
    delete headers["content-length"];
    delete headers["host"];

    const response = await axios({
      method: req.method,
      url: `${BOOKING_SERVICE_URL}${req.originalUrl}`,
      data: req.body,
      headers,
      timeout: 10000,
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Booking service error" });
  }
});

module.exports = router;