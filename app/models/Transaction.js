const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number }
    }
  ],
  authority: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  paymentStatus: { type: Boolean, default: false },
  date: { type: String }
});

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("Transaction", transactionSchema);
