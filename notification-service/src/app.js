require("dotenv").config();
const express = require("express");
const { connectRabbitMQ } = require("./config/rabbitmq");
const { startBookingConsumer } = require("./consumers/booking.consumers");

const app = express();

const PORT = process.env.PORT || 4004;

app.get("/", (req, res) => {
  res.send("Notification Service Running 🚀");
});

const startServer = async () => {
  await connectRabbitMQ();
  await startBookingConsumer();

  app.listen(PORT, () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
  });
};

startServer();
