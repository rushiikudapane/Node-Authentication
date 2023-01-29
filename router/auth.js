const router = require("express").Router();
require("../db/connection");
const { response } = require("express");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.get("/", (req, res) => {
  res.send("Hello form router");
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({
      error: "please fill all fields",
    });
  }

  //Using promises

  //   User.findOne({ email: email }).then((check) => {
  //     if (check) {
  //       return res.status(400).json({
  //         error: "user already exist. please login",
  //       });
  //     }

  //     //to add new user in db
  //     //save method is used to push document into collection
  //     const user = new User({ name, email, phone, work, password, cpassword });
  //     user
  //       .save()
  //       .then(() => {
  //         res
  //           .status(201)
  //           .json({
  //             msg: "User registered successfully",
  //           })
  //           .catch((err) => {
  //             return res.status(400).json({
  //               error: err,
  //             });
  //           });
  //       })
  //       .catch((err) => {
  //         return res.status(500).json({
  //           error: err,
  //         });
  //       });
  //   });

  //using async await
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({
        error: "user already exist. please login",
      });
    } else if (password !== cpassword) {
      return res.status(400).json({
        msg: "Password did not match",
      });
    }

    const user = new User({ name, email, phone, work, password, cpassword });

    const userRegistered = await user.save();
    if (userRegistered) {
      res.status(201).json({
        msg: "user registered sccessfully",
      });
    } else {
      res.sendStatus(201).json({
        msg: "error occured",
      });
    }
  } catch (err) {
    return res.status(400).json({
      err: err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "Fill Data properly",
      });
    }

    const userLogin = await User.findOne({ email: email });

    // console.log(userLogin);
    //to compare hashed password and password sent in req
    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (userLogin) {
      if (isMatch) {
        res.json({ msg: "Login sucessfull" });

        //for token generation in user schema
        const token = await userLogin.generateAuthToken();
        // console.log(token);
        //jwt token in browser cookie
        res.cookie("jwttoken", token);
      } else {
        res.status(400).json({ msg: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ msg: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// router.post("/checkLogin", (req, res) => {});
//to logout from existing user by destroying cookie
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
