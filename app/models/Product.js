const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Product = mongoose.Schema(
  {
    images: [{ type: String, required: true }],
    name: { type: String, required: true },
    realPrice: { type: Number, required: true },
    weight: { type: Number, required: true },
    newPrice: { type: Number },
    isOnOffer: { type: Boolean, default: false },
    rate: { type: Number, default: 5 },
    unit: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    discount: { type: Number },
    isDisable: { type: Boolean, default: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', Product);


