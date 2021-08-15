const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Blog = mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      
      ref: "User",
    },
    timeToRead: { type: Number },
    thumbnail: { type: String, required: true },
    content: { type: String, required: true },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    blogCategory: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" },
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("Blog", Blog);
