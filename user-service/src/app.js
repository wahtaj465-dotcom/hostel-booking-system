const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connectRabbitMQ } = require("./events/producer");

dotenv.config();
connectDB();
connectRabbitMQ();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/user.routes"));

const PORT = process.env.PORT || 4001;


app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
