//db password: LRrLE1jWVl3GandH

const { json } = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config.env" });
require("./db/connection");
const User = require("./model/userSchema");

//to link all router apis
const auth = require("./router/auth");

const PORT = process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/", auth);

// app.get("/", (req, res) => {
//   res.send("Express working properly");
// });
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT} !!!!`);
});
