const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Image = mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, require: true },
    type: {
      type: String,
      enum: ['slider', 'category', 'product'],
      require: true,
    },
  },
  { timestamps: true }
);

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model('Image', Image);
