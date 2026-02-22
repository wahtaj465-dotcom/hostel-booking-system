const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { startBookingConsumer } = require("./events/booking.consumer");
const { connectRedis } = require("./cache/redis.client");

dotenv.config();
connectDB();
connectRedis();
startBookingConsumer();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/hostels", require("./routes/hostel.routes"));

const PORT = process.env.PORT || 4002;


app.listen(PORT, () => {
  console.log(`Hostel Service running on port ${PORT}`);
});
