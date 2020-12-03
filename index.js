const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const emailRouter = require("./routers/emailRouter");

const app = express();

app
  //.use(cors())
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(bodyParser.json())
  .use(bodyParser.urlencoded())
  .use("/email", emailRouter)
  .listen(8000);
