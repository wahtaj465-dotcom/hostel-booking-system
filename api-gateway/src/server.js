require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { rateLimiter } = require("./middlewares/rateLimit.middleware");

const userRoutes = require("./routes/user.routes");
const hostelRoutes = require("./routes/hostel.routes");
const bookingRoutes = require("./routes/booking.routes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Apply global rate limit
app.use(rateLimiter);

// ✅ Route forwarding
app.use("/users", userRoutes);
app.use("/hostels", hostelRoutes);
app.use("/bookings", bookingRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});