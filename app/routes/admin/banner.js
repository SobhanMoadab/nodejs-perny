const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');
const ac = require('./access');

//Get all banners

router.get('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('banners');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const { page } = req.query;
    try {
      if (page) {
        const allBanners = await models.Banner.paginate(
          {},
          { page, limit: 10, populate: 'parent' }
        );
        res.status(200).json(allBanners);
      } else {
        const allBanners = await models.Banner.find({}).populate('parent');
        res.status(200).json(allBanners);
      }
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

router.get('/:id', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('banners');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const id = req.params.id;

    //TODO Validate object id
    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedBanner = await models.Banner.findById(id).populate('parent');
      utils.setCache(id, foundedBanner);
      res.status(200).json(foundedBanner);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// add a new banner              /category POST {BODY}
router.post('/', middleware.adminAuthentication, async (req, res) => {
  console.log('============= ADDING BANNER ===============');
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).createAny('banners');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const { image, parent, parentType } = req.body;
    try {
      const postedImg = await models
        .Banner({ image, parent, parentType })
        .save();
      console.log(postedImg);

      res.status(201).json({ CODE: statusCodes.DL_BANNER });
    } catch (error) {
      console.log({ error: error.message });
      if (error.message.includes('require'))
        res.status(500).json({ CODE: statusCode.ER_PARAMS });
      else res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//update banner by id            /category/:categoryId  {body}
router.put('/:bannerId', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).updateAny('banners');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const bannerId = req.params.bannerId;
    try {
      mongoose.Types.ObjectId.isValid(bannerId);

      // check id in database
      const foundedBanner = await models.Banner.findById(bannerId);
      if (!foundedBanner)
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      const { image, parent, parentType } = req.body;
      await models.Banner.findByIdAndUpdate(bannerId, req.body);
      res.status(200).json({ CODE: statusCodes.UP_SLIDER });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//delete a banner by id          /banner/:bannerId
router.delete(
  '/:bannerId',
  middleware.adminAuthentication,
  async (req, res) => {
    const requester = await models.Admin.findById(req.userId);
    console.log({ requester });
    const permission = ac.can(requester.role).deleteAny('banners');
    console.log({ permission });
    console.log(permission.granted);
    if (permission.granted) {
      const bannerId = req.params.bannerId;
      try {
        mongoose.Types.ObjectId.isValid(bannerId);
        // check id in database
        const foundedBanner = await models.Banner.findById(bannerId);
        if (!foundedBanner)
          return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
        await models.Banner.findByIdAndDelete(bannerId);
        res.status(200).json({ CODE: statusCodes.DL_BANNER });
      } catch (error) {
        res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      }
    } else {
      res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
    }
  }
);
module.exports = router;
