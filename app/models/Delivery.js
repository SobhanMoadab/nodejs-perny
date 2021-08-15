const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Delivery = mongoose.Schema(
  {
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    //* Order Placed = 0 = در حال بررسی
    //* Packed = 1 = درحال آماده سازی
    //* Shipped = 2 = ارسال شده
    //* Delivered = 3 = تحویل داده شده
    status: { type: Number, enum: [0, 1, 2, 3] },
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("Delivery", Delivery);
