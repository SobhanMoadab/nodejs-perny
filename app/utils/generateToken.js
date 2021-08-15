const jwt = require("jsonwebtoken");
const configs = require("../values/configs");

 module.exports = async (phoneNumber) => {
  return jwt.sign({ phoneNumber }, configs.TOKEN_SECRET, {
    expiresIn: "9000h",
  });
};
