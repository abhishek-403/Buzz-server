const bodyParser = require("body-parser");
const express = require("express");
const app = express();
require("dotenv").config();
const mongoDb = require("./dbConnect");
const cors = require("cors");
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());

const port = process.env.PORT || 4001;
mongoDb();
let origin = "exp://192.168.1.10:8081";
app.use(
  cors({
    credentials: true,
    origin,
  })
);

const mainRouter = require("./routes");

app.use("/api", mainRouter);

app.get("/hi", (req, res) => {
  return res.send({ message: "Hi route hit!" });
});

app.listen(port, () => {
  console.log("Listening at", port);
});
