const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const utils = require('../../utils');

router.get('/', async (req, res) => {
    try {
      const allUsers = await models.User.find({});
      res.status(200).json(allUsers).populate('cart');
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  });

router.get('/p/:page', async (req, res) => {
    const { page } = req.params;
    try {
      const allUsers = await models.User.paginate({}, { page, limit: 10, populate:'cart' });
      res.status(200).json(allUsers);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  });

router.get("/s/", async (req, res) => {
  try {
    const allCodes = await models.Admin.find({});
    res.status(200).json(allCodes);
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

  
  module.exports = router;