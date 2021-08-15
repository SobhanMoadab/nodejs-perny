const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name:{type:String },
    rate:{type:Number},
    content: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    parentType: { type: String, enum: ["Blog", "Product"], required: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "parentType",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
