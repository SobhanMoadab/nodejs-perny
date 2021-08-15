const express = require("express");
const router = express.Router();
const models = require("../../models");
const mongoose = require("mongoose");
const statusCodes = require("../../values/statusCodes");
const middleware = require("../../middleware");
const utils = require("../../utils");
//Get all banners


router.get("/:id", 

async(req, res) => {
  const id = req.params.id;
  
  //TODO Validate object id
  try {
    mongoose.Types.ObjectId.isValid(id);
    const foundedSlider = await models.Slider.findById(id);
    utils.setCache(id, foundedSlider);
    res.status(200).json(foundedSlider);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.get("/",  async (req, res) => {
  const { page } = req.query;
  try {
    if (page) {
      
      const allSliders = await models.Slider.paginate(
        {},
        { page, limit: 10, populate: "parent" }
      );
      res.status(200).json(allSliders);
    } else {
      const allSliders = await models.Slider.find({}).populate("parent");
      // utils.setCache(req.route.path, allSliders);
      res.status(200).json(allSliders);
    }
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});



module.exports = router;
