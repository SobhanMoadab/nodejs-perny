const mongoose = require("mongoose");

const SmsPanel = mongoose.Schema({
  phoneNumber: { type: String, required: true },
  content: {type: String, required: true}
},
{timestamps: true}
);

module.exports = mongoose.model("SmsPanel", SmsPanel);
