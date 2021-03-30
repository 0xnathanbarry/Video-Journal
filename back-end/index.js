const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routesUrls = require("./routes/routes");
const cors = require("cors");

dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_ACCESS, () =>
  console.log("Database connected")
);

app.use(express.json());
app.use(cors());
app.use("/app", routesUrls);

app.listen(5000, () => console.log("server is up and running"));
