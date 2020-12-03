const express = require("express");
const mongo = require("mongodb");

const emailRouter = express.Router();

const mongoClient = mongo.MongoClient;

const mongoURL =
  "mongodb+srv://admin:testing1@cluster1.gfegd.mongodb.net/reset-password?retryWrites=true&w=majority";

mongoClient.connect(mongoURL, (err, dbname) => {
  if (err) throw err;

  let db = dbname.db("reset-password");
  db.collection("emails", (err) => {
    if (err) throw err;
  });

  emailRouter
    .post("/", (req, res) => {
      console.log(req.body);
      if (!req.body.email) {
        res.status(400).send("Email ID not present in request");
      } else if (!req.body.password) {
        res.status(400).send("Password not present in request");
      } else {
        db.collection("emails").insertOne(req.body, (err, res) => {
          if (err) throw err;
        });
        res.status(200).send("User created successfully!");
      }
    })
    .put("/", (req, res) => {
      console.log(req.body);
      db.collection("emails").findOne(
        { email: req.body.email },
        (err, response) => {
          if (err) throw err;
          console.log(req.body.email);
          if (response == null) res.status(201).send({ responseIs: null });
          else res.status(200).send(response);
        }
      );
    })
    .get("/", (req, res) => {
      res.send("ok");
    });
  //   dbname.close();
});

module.exports = emailRouter;
