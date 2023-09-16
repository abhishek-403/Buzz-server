const bodyParser = require("body-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const mongoDb = require("./dbConnect");
mongoDb();
const cors = require("cors");
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const port = process.env.PORT || 4001;
let origin = "exp://192.168.1.10:8081";

app.use(
  cors()
);

const mainRouter = require("./routes");

app.use("/api", mainRouter);

app.get("/hi", (req, res) => {
  return res.send({ message: "Hi route hit!" });
});

app.listen(port, () => {
  console.log("Listening at", port);
});
