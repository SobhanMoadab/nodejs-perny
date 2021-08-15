const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const BlogCategory = mongoose.Schema({
  name: { type: String, required: true },
  count: {type: Number, default: 0},
  blogs: { type: mongoose.Schema.Types.ObjectId, ref:'Blog'}
});

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("BlogCategory", BlogCategory);