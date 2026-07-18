const amqp = require("amqplib");

const AUTH_EXCHANGE_NAME = "auth_events";

let channel;

async function connectRabbitMQ() {
  const rabbitUrl = process.env.RABBITMQ_URL;

  if (!rabbitUrl) {
    console.log("RABBITMQ_URL missing. OTP emails will not be published.");
    return;
  }

  try {
    console.log("🔄 User Service connecting to RabbitMQ...");
    const connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(AUTH_EXCHANGE_NAME, "fanout", { durable: true });

    console.log("✅ User Service connected to RabbitMQ");
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

async function publishAuthEvent(data) {
  if (!channel) {
    console.log("RabbitMQ channel not ready. Auth event not published.");
    return;
  }

  channel.publish(
    AUTH_EXCHANGE_NAME,
    "",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("📤 Auth event published to exchange");
}

module.exports = {
  connectRabbitMQ,
  publishAuthEvent,
};