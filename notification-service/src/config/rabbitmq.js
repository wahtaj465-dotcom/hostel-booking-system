const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  const RABBITMQ_URL = process.env.RABBITMQ_URL;

  while (true) {
    try {
      console.log("Connecting to RabbitMQ...");

      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      console.log("✅ RabbitMQ Connected (Notification Service)");
      break;

    } catch (error) {
      console.error("❌ RabbitMQ not ready, retrying in 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

module.exports = {
  connectRabbitMQ,
  getChannel,
};