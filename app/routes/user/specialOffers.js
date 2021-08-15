const express = require('express');
const router = express.Router();

const models = require('../../models');
const statusCodes = require('../../values/statusCodes');

router.get("/p/:page", async (req, res) => {
    const { page } = req.params;
    try {
      const specialOffers = await models.Product.paginate(
        {isOnOffer: true},
        { page, limit: 10, populate: "category",sort: {createdAt: -1 }}, 
      );
      res.status(200).json(specialOffers);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  });
module.exports = router;