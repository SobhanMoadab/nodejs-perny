const mongoose = require("mongoose");


const Verification = mongoose.Schema({
  verificationCode: { type: String },
  password: {type: String},
  phoneNumber: { type: String },
  createdAt: { type: Date, expires: '2m', default: Date.now }
},{timestamps: true});


module.exports = mongoose.model("Verification", Verification);

