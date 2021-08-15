const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Category = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("Category", Category);
