const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/bookings", require("./routes/booking.routes"));

const PORT = 4003;

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
