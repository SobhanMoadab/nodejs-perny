const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("../../models");
const statusCodes = require("../../values/statusCodes");
const utils = require("../../utils");
const middleware = require("../../middleware");
const cc = require("coupon-code");
router.get("/", async (req, res) => {
  try {
    const allCodes = await models.Coupon.find({}).populate("members");
    res.status(200).json(allCodes);
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

const generatedCode = cc.generate({ parts: 4 });
router.post("/", async (req, res) => {
  const {
   customCode,
    percent,
    isActive,
    members,
    
} = req.body;
  try {
    if ((percent, isActive, members)) {
      await models
        .Coupon({
          percent,
          isActive,
          members,
          generatedCode,
        })
        .save();
         res.status(200).json({ generatedCode });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});
router.delete("/:couponId", async (req, res) => {
  const couponId = req.params.couponId;
  try {
    mongoose.Types.ObjectId.isValid(couponId);
    const foundedCoupons = await models.Coupon.findById(couponId);
    if (!foundedCoupons)
      return res.status(500).json({ CODE: statusCode.ER_SMT_WRONG });
    await models.Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ CODE: statusCodes.DL_PRODUCT });
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
