const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');

router.get('/', async (req, res) => {
  const { page, type } = req.query;
  try {
    if (page) {
      console.log({ page, type });
      const allSliders = await models.Slider.paginate(
        { parentType: type },
        { page, limit: 10, populate: 'parent' }
      );
      res.status(200).json(allSliders);
    } else {
      const allSliders = await models.Slider.find({}).populate('parent');
      // utils.setCache(req.route.path, allSliders);
      res.status(200).json(allSliders);
    }
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});
router.get(
  '/:id',

  async (req, res) => {
    const id = req.params.id;

    //TODO Validate object id
    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedSlider = await models.Slider.findById(id).populate('parent');
      utils.setCache(id, foundedSlider);
      res.status(200).json(foundedSlider);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  }
);

// add a new Slider              /category POST {BODY}
router.post('/', async (req, res) => {
  const { image, parent, parentType } = req.body;
  try {
    const postedSlider = await models
      .Slider({ image, parent, parentType })
      .save();
    console.log(postedSlider);

    res.status(201).json({ CODE: statusCodes.DL_SLIDER });
  } catch (error) {
    console.log({ error: error.message });
    if (error.message.includes('require'))
      res.status(500).json({ CODE: statusCode.ER_PARAMS });
    else res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

//update Slider by id            /category/:categoryId  {body}
router.put('/:sliderId', async (req, res) => {
  const sliderId = req.params.sliderId;
  try {
    mongoose.Types.ObjectId.isValid(sliderId);

    // check id in database
    const foundedSlider = await models.Slider.findById(sliderId);
    if (!foundedSlider)
      return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    const { image, parent, parentType } = req.body;
    await models.Slider.findByIdAndUpdate(sliderId, req.body);
    res.status(200).json({ CODE: statusCodes.UP_SLIDER });
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

//delete a banner by id          /banner/:bannerId
router.delete('/:sliderId', async (req, res) => {
  const sliderId = req.params.sliderId;
  try {
    mongoose.Types.ObjectId.isValid(sliderId);
    // check id in database
    const foundedSlider = await models.Slider.findById(sliderId);
    if (!foundedSlider)
      return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    await models.Slider.findByIdAndDelete(sliderId);
    res.status(200).json({ CODE: statusCodes.DL_SLIDER });
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});
module.exports = router;
