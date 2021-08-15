const express = require("express");
const router = express.Router();
const models = require("../../models");
const { mongoId } = require("../../utils");
const statusCodes = require("../../values/statusCodes");
const middleware = require("../../middleware");

router.get("/", middleware.userAuthentication, async (req, res) => {
  try {
    const user = await models.User.findById(req.userId).populate(
      "cart.product"
    );

    res.status(200).json(user.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.post("/", middleware.userAuthentication, async (req, res) => {
  try {
    const { productId, count } = req.body;
    const isValid = mongoId(productId);

    if (!isValid) {
      throw new Error();
    }

    const user = await models.User.findById(req.userId);
    let newCart = user.cart;
    let isNew = true;

    newCart.map(async (cart, index) => {
      if (cart.product == productId) {
        isNew = false;

        newCart[index].count = count;
        const resUpdateUser = await models.User.findOneAndUpdate(
          { _id: req.userId },
          { cart: newCart },
          { new: true }
        );
        return res.status(201).json({ Code: statusCodes.AD_TO_CART });
      }
    });
    if (isNew) {
      const resUser = await models.User.findOneAndUpdate(
        { _id: req.userId },
        { $push: { cart: { product: productId, count } } },
        { new: true }
      );
      return res.status(201).json({ Code: statusCodes.AD_TO_CART });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.delete(
  "/:productId",
  middleware.userAuthentication,
  async (req, res) => {
    try {
      const isValid = mongoId(req.params.productId);

      if (!isValid) {
        throw new Error();
      }
      const user = await models.User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { cart: { product: req.params.productId } } },
        { new: true }
      );
      return res.status(200).json({ Code: statusCodes.DL_CART });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  }
);

module.exports = router;
