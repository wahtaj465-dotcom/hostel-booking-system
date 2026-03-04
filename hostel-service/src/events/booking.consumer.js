const amqp = require("amqplib");
const Room = require("../models/room.model");

const EXCHANGE_NAME = "booking_events";          // ← same exchange as producer
const QUEUE_NAME = "hostel_booking_queue";       // ← its OWN dedicated queue

async function startBookingConsumer() {
  try {
    console.log("🏨 Hostel Service connecting to RabbitMQ...");

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    // 1️⃣ Assert the fanout exchange (must match producer)
    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

    // 2️⃣ Create hostel-service's own queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 3️⃣ Bind this queue to the exchange — THIS IS THE KEY FIX
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

    console.log("🏨 Hostel Service listening for booking events...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString());
      console.log("📩 Hostel event received:", event);

      if (event.type === "BOOKING_CANCELLED") {
        console.log("🔁 Cancellation event received");

        await Room.updateOne(
          { _id: event.roomId },
          { $inc: { availableBeds: 1 } }
        );

        console.log("✅ Bed restored successfully");
      }

      channel.ack(msg);
    });

  } catch (error) {
    console.error("❌ Hostel Consumer Error:", error.message);
    setTimeout(startBookingConsumer, 5000);
  }
}

module.exports = { startBookingConsumer };