const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Banner = mongoose.Schema({
  image: { type: String, require: true },
  parentType: { type: String, enum: ["Product", "Category"], require: true},
  parent: { type: mongoose.Schema.Types.ObjectId, refPath: "parentType", require: true },
});

module.exports = mongoose.model("Banner", Banner);
mongoose.plugin(mongoosePaginate);