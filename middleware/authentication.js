const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwtoken;
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const findUser = await User.findOne({
      _id: verifyToken._id,
      "tokens: token": token,
    });

    if (!findUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.findUser = findUser;
    req.userID = rootUser._id;
  } catch (err) {
    res.status(401).send("Unauthorized");
    connsole.log(err);
  }
};

module.exports = authenticate;
