const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ContactUs = mongoose.Schema({
  title: { type: String, required: true, default: 'فروشگاه پرنی' },
  phoneNumber: { type: String, required: true, default: '123456' },
  instagramAddress: { type: String, default: 'instagram address' },
  telegramAddress: { type: String, default: 'telegram address' },
  address: { type: String, default: ' address' },
});

mongoose.plugin(mongoosePaginate);
module.exports = mongoose.model('ContactUs', ContactUs);
