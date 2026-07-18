require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const hostelRoutes = require("./routes/hostel.routes");
const bookingRoutes = require("./routes/booking.routes");
const { verifyToken } = require("./middlewares/auth.middleware");

const app = express();

app.use(cors());
app.use(express.json());

// PUBLIC
app.use("/users", userRoutes);
app.use("/hostels", hostelRoutes); // GET public, write protected inside routes

// PROTECTED
app.use("/bookings", verifyToken, bookingRoutes);

app.listen(4000, () => console.log("Gateway running on 4000"));