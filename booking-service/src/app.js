require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bookingRoutes = require("./routes/booking.routes");
const { connectRabbitMQ } = require("./events/producer");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(express.json());

// ===============================
// Routes
// ===============================
app.use("/bookings", bookingRoutes);

// ===============================
// Database Connection
// ===============================
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Booking Service - MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// ===============================
// Start Server
// ===============================
async function startServer() {
  try {
    await connectDB();
    await connectRabbitMQ();

    const PORT = process.env.PORT || 4003;

    app.listen(PORT, () => {
      console.log(`Booking Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();
