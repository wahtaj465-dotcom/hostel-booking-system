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
    if (msg) {
      const bookingData = JSON.parse(msg.content.toString());

      console.log("📩 Booking event received:", bookingData);

      await sendEmail(bookingData);

      console.log("✅ Email simulation complete");

      channel.ack(msg);
    }
  });
};

module.exports = { startBookingConsumer };