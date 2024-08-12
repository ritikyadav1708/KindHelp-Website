var express = require("express");
var passport = require("passport");
var bodyParser = require("body-parser");
LocalStrategy = require("passport-local");
passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/KindHelptDb");
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});
var app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  require("express-session")({
    secret: "Rust is a dog",
    resave: false,
    saveUniinitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Sign_up details
app.post("/sign_up", async (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirm_password = req.body.confirm_password;
  var data = {
    UserName: username,
    Email: email,
    Password: password,
    Confirm_Password: confirm_password,
  };
  db.collection("Login_details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });
  return res.redirect("login.html");
});
// Login Details
//Handling user login
app.post("/sign_in", async function (req, res) {
  try {
    // check if the user exists
    const user = await db
      .collection("Login_details")
      .findOne({ UserName: req.body.username });
    if (user) {
      //check if password matches
      const result = req.body.password === user.Password;
      if (result) {
        return res.redirect("/Dashboard/index.html");
      } else {
        res.status(400).send({ error: "password doesn't match" });
      }
    } else {
      res.status(400).send({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).send({ error });
  }
});
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("login.html");
}
//Donation Details
app.post("/donate", function (req, res) {
  var DonationFrequency = req.body.DonationFrequency;
  var FlexRadioDefault = req.body.FlexRadioDefault;
  var DonationName = req.body.DonationName;
  var DonationEmail = req.body.DonationEmail;
  var DonationPayment = req.body.DonationPayment;
  var data = {
    DonationFrequency: DonationFrequency,
    FlexRadioDefault: FlexRadioDefault,
    DonationName: DonationName,
    DonationEmail: DonationEmail,
    DonationPayment: DonationPayment,
  };
  db.collection("Donation_details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  return res.redirect("payment.html");
});
//  Volunteer details
app.post("/volunteer", function (req, res) {
  var volunteer_name = req.body.volunteer_name;
  var volunteer_email = req.body.volunteer_email;
  var volunteer_subject = req.body.volunteer_subject;
  var volunteer_cv = req.body.volunteer_cv;
  var volunteer_message = req.body.volunteer_message;

  var data = {
    volunteer_name: volunteer_name,
    volunteer_email: volunteer_email,
    volunteer_subject: volunteer_subject,
    volunteer_cv: volunteer_cv,
    volunteer_message: volunteer_message,
  };
  db.collection("Volunteer_details").insertOne(
    data,
    function (err, collection) {
      if (err) throw err;
      console.log("Record inserted Successfully");
    }
  );

  return res.redirect("index.html");
});
// Contact Details
app.post("/contact", function (req, res) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email = req.body.email;
  var message = req.body.message;
  var data = {
    First_Name: first_name,
    Last_Name: last_name,
    Email: email,
    Message: message,
  };
  db.collection("Contact_details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });
  return res.redirect("index.html");
});
// listening on server
app
  .get("/", function (req, res) {
    res.set({
      "Access-control-Allow-Origin": "*",
    });
    return res.redirect("index.html");
  })
  .listen(3000);
console.log("server listening at port 3000");
