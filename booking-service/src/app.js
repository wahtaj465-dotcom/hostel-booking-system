require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const bookingRoutes = require("./routes/booking.routes");
const { connectRabbitMQ } = require("./events/producer");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 4003;

// Connect DB, then RabbitMQ, then start server
connectDB()
  .then(() => {
    connectRabbitMQ(); // ✅ connect to RabbitMQ
    app.listen(PORT, () => console.log(`Booking service running on ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
  });