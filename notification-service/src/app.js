require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { connectRabbitMQ } = require("./config/rabbitmq");
const { startBookingConsumer } = require("./consumers/booking.consumers");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4004;

app.get("/", (req, res) => {
  res.send("Notification Service Running 🚀");
});

// ✅ Notifications API
app.use("/notifications", notificationRoutes);

const startServer = async () => {
  // ✅ Connect MongoDB first
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  // ✅ Then start RabbitMQ consumer
  await connectRabbitMQ();
  await startBookingConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
  });
};

startServer();