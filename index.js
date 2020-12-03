const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const emailRouter = require("./routers/emailRouter");

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded())
  .use("/email", emailRouter)
  .listen(process.env.PORT, "0.0.0.0");
