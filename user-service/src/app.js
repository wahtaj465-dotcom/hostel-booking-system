const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/user.routes"));

const PORT = 4001;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
