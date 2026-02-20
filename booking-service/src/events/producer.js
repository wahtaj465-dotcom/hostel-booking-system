const amqp = require("amqplib");
const { BOOKING_QUEUE } = require("./topics");

let channel;

async function connectRabbitMQ() {
  try {
    console.log("🔄 Booking Service connecting to RabbitMQ...");

    // 🔥 IMPORTANT FIX HERE
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    await channel.assertQueue(BOOKING_QUEUE, {
      durable: true,
    });

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

  channel.sendToQueue(
    BOOKING_QUEUE,
    Buffer.from(JSON.stringify(data)),
    { persistent: true }
  );

  console.log("📤 Booking event published");
}

module.exports = {
  connectRabbitMQ,
  publishBookingEvent,
};