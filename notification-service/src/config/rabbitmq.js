const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    console.log("✅ RabbitMQ Connected (Notification Service)");

    return channel;
  } catch (error) {
    console.error("❌ RabbitMQ connection failed:", error);
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
