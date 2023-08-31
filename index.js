const express = require("express");
const app = express();
const dotenv = require('dotenv')
dotenv.config('./.env')
const mongoDb = require('./dbConnect')

const port = process.env.PORT || 4001;

mongoDb();



const mainRouter = require('./routes')

app.use('/api', mainRouter)


app.listen(port, () => {
    console.log("Listening at", port);
  })