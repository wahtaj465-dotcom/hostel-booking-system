const { createClient } = require("redis");

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis Error:", err);
    });

    await redisClient.connect();

    console.log("✅ Redis Connected (Hostel Service)");
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

module.exports = {
  connectRedis,
  getRedisClient,
};