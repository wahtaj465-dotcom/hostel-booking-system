const amqp = require("amqplib");

const EXCHANGE_NAME = "booking_events";

let channel;

async function connectRabbitMQ() {
  try {
    console.log("🔄 Booking Service connecting to RabbitMQ...");
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();

    // Declare a fanout exchange instead of a queue
    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

    console.log("✅ Booking Service connected to RabbitMQ");
  } catch (error) {
    console.error("❌ RabbitMQ Connection Error:", error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}

async function publishBookingEvent(data) {
  if (!channel) {
    console.log("RabbitMQ channel not ready");
    return;
  }

  // Publish to exchange (fanout ignores routing key, so empty string)
  channel.publish(
    EXCHANGE_NAME,
    "",
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("📤 Booking event published to exchange");
}

module.exports = {
  connectRabbitMQ,
  publishBookingEvent,
};