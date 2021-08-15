const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Coupon = mongoose.Schema(
  {
    customCode: { type: String},
    generatedCode:{type:String},
    percent: { type: Number, require: true},
    expireDate: { type: Date},
    isActive: { type: Boolean, require: true, default: true },
    isForAll: {type:Boolean},
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       
      },
    ],
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model("Coupon", Coupon);
