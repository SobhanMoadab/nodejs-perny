const express = require("express");
const router = express.Router();
const models = require("../../models");
const mongoose = require("mongoose");
const statusCodes = require("../../values/statusCodes");
const middleware = require("../../middleware")
const utils = require("../../utils");

router.get("/", async (req, res) => {
 
    const { page } = req.query;
    try {
      if (page) {
        const allBanners = await models.Banner.paginate(
          {},
          { page, limit: 10, populate: "parent" }
        );
        res.status(200).json(allBanners);
      } else {
        const allBanners = await models.Banner.find({}).populate("parent");
        // utils.setCache(req.route.path, allBanners);
        res.status(200).json(allBanners);
      }
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
 
});

router.get("/:id", async (req, res) => {
  
 
    const id = req.params.id;

    //TODO Validate object id
    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedBanner = await models.Banner.findById(id).populate("parent");
      utils.setCache(id, foundedBanner);
      res.status(200).send(JSON.stringify(foundedBanner));
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }

});

module.exports = router;