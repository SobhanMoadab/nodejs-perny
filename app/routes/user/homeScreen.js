const express = require("express");
const router = express.Router();
const models = require("../../models");
const statusCodes = require("../../values/statusCodes");

router.get("/", async (req, res) => {
  try {
    const sliders = await models.Slider.find().populate("parent");
    const categories = await models.Category.find().populate('products');
    const banner = await models.Banner.find().populate("parent").limit(1);
    const products = await models.Product.find().populate("category").limit(4);
    // const mostSoldProducts = await models.Product.find().sort({viewCount: -1}).populate("category");
    // const latestProducts = await models.Product.find().sort({createdAt: -1}).populate("category");
    // const highestDiscount = await models.Product.find().sort({discount: -1}).populate("category");
    const homeScreenData = {
      sliders,
      categories,
      banner,
      products
    };
    res.status(200).json(homeScreenData);
  } catch (error) {
    console.group(error)
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
