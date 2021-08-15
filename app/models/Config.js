const mongoose = require("mongoose");

const Config = mongoose.Schema({
        refId: { type: Number }
    });

module.exports = mongoose.model("Config", Config);
