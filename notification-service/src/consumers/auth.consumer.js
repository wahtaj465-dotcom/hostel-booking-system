const { getChannel } = require("../config/rabbitmq");
const { sendOtpEmail } = require("../services/email.service");

const EXCHANGE_NAME = "auth_events";
const QUEUE_NAME = "notification_auth_queue";

const startAuthConsumer = async () => {
  const channel = getChannel();

  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

  console.log("👂 Waiting for auth messages...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const authData = JSON.parse(msg.content.toString());
      console.log("📩 Auth event received:", { ...authData, otp: "[hidden]" });

      if (authData.type === "OTP_REQUESTED") {
        console.log("📧 Sending OTP email...");
        await sendOtpEmail(authData);
      }

      channel.ack(msg);
    } catch (err) {
      console.error("❌ Failed to process auth event:", err.message);
      channel.nack(msg, false, false);
    }
  });
};

module.exports = { startAuthConsumer };
