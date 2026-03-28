require("dotenv").config();

module.exports = {
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://user-service:4001",
  HOSTEL_SERVICE_URL: process.env.HOSTEL_SERVICE_URL || "http://hostel-service:4002",
  BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL || "http://booking-service:4003",
};