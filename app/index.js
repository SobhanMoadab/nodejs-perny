const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const configs = require("./values/configs");
const MongoClient = require('mongodb').MongoClient;
const swaggerUi = require("swagger-ui-express");
const { adminRoutes, userRoutes } = require("./routes");
const yaml = require("js-yaml");
const fs = require("fs");
const swaggerDoc = yaml.safeLoad(fs.readFileSync(__dirname + "/Perny.yml"));
//==================socket conf


//============================
mongoose
  // .connect(configs.MONGOOSE_CONNECTION_URL,configs.MONGOOSE_CONFIG)
  .connect('mongodb://localhost:27017/perni', {useNewUrlParser: true})
  .then(() => console.log("MONGOOSE CONNECTED"))
  .catch((err) => console.log({ err }));


//=============================
//Express Config
app.use(morgan("dev"));
app.use("/images", express.static("images"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use("/api/v1/admin/product", adminRoutes.product);
app.use("/api/v1/admin/upload", adminRoutes.uploadImage);
app.use("/api/v1/admin/category", adminRoutes.category);
app.use("/api/v1/admin/banner", adminRoutes.banner);
app.use("/api/v1/admin/slider", adminRoutes.slider);
app.use("/api/v1/admin/login", adminRoutes.login);
app.use("/api/v1/admin/image", adminRoutes.image);
app.use("/api/v1/admin/blog", adminRoutes.blog);
app.use("/api/v1/admin/contactUs", adminRoutes.contactUs);
app.use("/api/v1/admin/blogCategory", adminRoutes.blogCategory);
app.use("/api/v1/admin/user", adminRoutes.user);
app.use("/api/v1/admin/comment", adminRoutes.comment);
app.use("/api/v1/admin/transcation", adminRoutes.transcation);
app.use("/api/v1/admin/coupon", adminRoutes.coupon);
app.use("/api/v1/admin/smsPanel", adminRoutes.smsPanel);




app.use("/api/v1/homeScreen", userRoutes.homeScreen);
app.use("/api/v1/slider", userRoutes.slider);
app.use("/api/v1/category", userRoutes.category);
app.use("/api/v1/banner", userRoutes.banner);
app.use("/api/v1/product", userRoutes.product);
app.use("/api/v1/login", userRoutes.login);
app.use("/api/v1/signup", userRoutes.signup);
app.use("/api/v1/cart", userRoutes.cart);
app.use("/api/v1/comment", userRoutes.comment);
app.use("/api/v1/blog", userRoutes.blog);
app.use("/api/v1/payment", userRoutes.payment);



// CORS Settings
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );
    return res.status(200).json({});
  }
  next();
});

//404 Error
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status(404).json("Not found");
});

module.exports = app;
