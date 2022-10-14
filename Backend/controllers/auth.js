require("dotenv").config();
const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      //If user is saved successfully, then return these fields in form of json
      name: user.email,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body; //Destructuring

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  //Clear the Cooky
  res.clearCookie("token");

  res.json({
    message: "User signout successfully",
  });
};

/*------PROTECTED ROUTES---------------------------------------------------------------------------------------------------*/

/* 1. IsSignedIN   */

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
}); //Here we are not writing next even being a middleware because expressJWt has already got that covered

//Custom Middlewares

/* 2. IsAuthenticated   */

exports.isAuthenticated = (req, res, next) => {
  //req.profile is being check by the frontend & req.auth is being checked by expressJWT
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

/* 3. IsAdmin  */

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIC, Access denied",
    });
  }

  next();
};

/*****CONCEPTS************************************************/

/*
  exports.signup = (req, res) => {
    console.log("REQ BODY", req.body);
    res.json({
      message: "signup route works!",
    });
  }
*/
