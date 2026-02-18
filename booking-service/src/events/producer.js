const amqp = require("amqplib");
const { BOOKING_QUEUE } = require("./topics");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue(BOOKING_QUEUE);

    console.log("Booking Service connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ Connection Error:", error);
  }
}

async function publishBookingEvent(data) {
  if (!channel) {
    console.log("RabbitMQ channel not ready");
    return;
  }

  channel.sendToQueue(
    BOOKING_QUEUE,
    Buffer.from(JSON.stringify(data))
  );

  console.log("Booking event published");
}

module.exports = {
  connectRabbitMQ,
  publishBookingEvent,
};
