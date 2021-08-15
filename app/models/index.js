const Category = require("./Category");
const Product = require("./Product");
const Slider = require("./Slider");
const Banner = require("./Banner");
const User = require("./User");
const Admin = require("./Admin");
const Verification = require("./Verification");
const Image = require("./Image");
const Blog = require("./Blog");
const ContactUs = require("./ContactUs");
const BlogCategory = require("./BlogCategory");
const Comment = require("./Comment");
const Config = require("./Config");
const Transaction = require("./Transaction");
const Delivery = require('./Delivery');
const Coupon = require('./Coupon')
const SmsPanel = require('./SmsPanel')

const models = {
  Category,
  Product,
  Slider,
  Banner,
  User,
  Verification,
  Admin,
  Image,
  Blog,
  ContactUs,
  BlogCategory,
  Comment,
  Config,
  Transaction,
  Delivery,
  Coupon,
  SmsPanel,
};

module.exports = models;
