const express = require("express");
const mongo = require("mongodb");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");

const emailRouter = express.Router();

const mongoClient = mongo.MongoClient;

const mongoURL = process.env.MONGO_URL;

const smtpConfig = {
  service: "smtp.gmail.com",
  port: 567,
  secure: false, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
};

mongoClient.connect(mongoURL, (err, dbname) => {
  if (err) throw err;

  let db = dbname.db("reset-password");
  db.collection("emails", (err) => {
    if (err) throw err;
  });

  emailRouter
    .post("/", (req, res) => {
      if (!req.body.email) {
        res.status(400).send("Email ID not present in request");
      } else if (!req.body.password) {
        res.status(400).send("Password not present in request");
      } else {
        db.collection("emails").findOne(
          { email: req.body.email },
          (err, response) => {
            if (err) throw err;
            if (response != null) {
              res.status(404).send("User already exists.");
            } else {
              db.collection("emails").insertOne(req.body, (err, response2) => {
                if (err) throw err;
                res.status(200).send("User created successfully!");
              });
            }
          }
        );
      }
    })
    .put("/", (req, res) => {
      var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
                port: 587,
  secure: false, 
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});
      db.collection("emails").findOne(
        { email: req.body.email },
        (err, response) => {
          if (err) throw err;
          if (response == null) {
            res.status(404).send();
          } else {
            const rand = randomString.generate(20);

            db.collection("emails").updateOne(
              { email: req.body.email },
              { $set: { randomString: rand } },
              (err, response) => {
                if (err) throw err;
              }
            );

            const mailBodyUrl = `https://password-reset-kartik.netlify.app/newPassword.html?mail=${req.body.email}&rand=${rand}`;
            const mailBody = `<p>Open the following link for verification<p><br/><i>${mailBodyUrl}</i>`;
            var mailOptions = {
              from: process.env.USER_EMAIL,
              to: req.body.email,
              subject: "Verification link",
              html: mailBody,
            };
            transporter.sendMail(mailOptions, function (err) {
              if (err) throw err;
            });
            res.status(200).send();
          }
        }
      );
    })
    .patch("/", (req, res) => {
      if (!req.body.email) {
        res.status(404).send("Email ID not present in request");
      } else if (!req.body.password) {
        res.status(404).send("Password not present in request");
      } else {
        db.collection("emails").updateOne(
          { email: req.body.email },
          { $set: { password: req.body.password } },
          (err, response) => {
            if (err) throw err;
            if (response != null)
              res.status(200).send("User created successfully!");
            else res.status(404).send("User not found!");
          }
        );
      }
    })
    .get("/:rand", (req, res) => {
      db.collection("emails").findOne(
        { randomString: req.params.rand },
        (err, response2) => {
          if (response2 != null) res.status(200).send("User found!");
          else res.status(404).send("Verification failed.");
        }
      );
    });

  //   dbname.close();
});

module.exports = emailRouter;
