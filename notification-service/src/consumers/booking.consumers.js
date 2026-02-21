const { getChannel } = require("../config/rabbitmq");
const { sendEmail } = require("../services/email.service");

const QUEUE_NAME = "booking_queue";

const startBookingConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  console.log("👂 Waiting for booking messages...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const bookingData = JSON.parse(msg.content.toString());

    console.log("📩 Event received:", bookingData);

    if (bookingData.type === "BOOKING_CREATED") {
      console.log("📧 Sending booking confirmation email...");
      await sendEmail(bookingData);
    }

    if (bookingData.type === "BOOKING_CANCELLED") {
      console.log("📧 Sending cancellation email...");
      await sendEmail(bookingData);
    }

    channel.ack(msg);
  });
};

module.exports = { startBookingConsumer };