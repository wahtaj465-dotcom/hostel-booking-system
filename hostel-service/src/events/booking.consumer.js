const amqp = require("amqplib");
const Room = require("../models/room.model");

const QUEUE_NAME = "booking_queue";

async function startBookingConsumer() {
  try {
    console.log("🏨 Hostel Service connecting to RabbitMQ...");

    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log("🏨 Hostel Service listening for booking events...");

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString());

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