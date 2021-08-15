const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    phoneNumber: { type: String },
    name: { type: String },

    cart: [
      {
        coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: { type: Number },
      },
    ],
    email: { type: String },
    token: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    boughtProducts: [
      {
        productDelivery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Delivery",
        },
      },
    ],
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
