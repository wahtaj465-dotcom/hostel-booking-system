const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/hostels", require("./routes/hostel.routes"));

const PORT = 4002;

app.listen(PORT, () => {
  console.log(`Hostel Service running on port ${PORT}`);
});
