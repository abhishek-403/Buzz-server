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


app.use(cors());
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);


io.on('connection', (socket) => {
  console.log('A user connected');

  
  

 
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.io = io;
const mainRouter = require("./routes");
app.use("/api", mainRouter);

server.listen(port, () => {
  console.log("Listening at", port);
});
