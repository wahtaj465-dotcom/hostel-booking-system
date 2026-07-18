const { getChannel } = require("../config/rabbitmq");
const { sendEmail } = require("../services/email.service");

const EXCHANGE_NAME = "booking_events";
const QUEUE_NAME = "notification_booking_queue";  // ← its own queue

const startBookingConsumer = async () => {
  const channel = getChannel();

  // Assert the fanout exchange
  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

  // Create this service's own queue
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  // Bind our queue to the exchange
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

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