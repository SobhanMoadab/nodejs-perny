const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const utils = require('../../utils');
const middleware = require('../../middleware');

const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get('/', async (req, res) => {
  const { page, search } = req.query;
  try {
    if (page) {
      if (search) {
        console.log({ search });
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const allCategories = await models.Category.paginate(
          { name: regex },
          { page: req.query.page, limit: 10, populate: 'products' }
        );

        res.status(200).json(allCategories);
      } else {
        const allCategories = await models.Category.paginate(
          {},
          { page: req.query.page, limit: 10, populate: 'products' }
        );
        res.status(200).json(allCategories);
      }
    } else {
      const allCategories = await models.Category.find({}).populate('products');
      // utils.setCache(req.route.path, allCategories);
      res.status(200).json(allCategories);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

// get category by id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    mongoose.Types.ObjectId.isValid(id);

    const cat = await models.Category.findById(id).populate('products');
    const allCat = await models.Category.find().populate('products');
    // utils.setCache(id, foundedCategory);
    res.status(200).json({ cat, allCat });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

// add a new category
router.post('/', async (req, res) => {
  try {
    const { name, image } = req.body;
    console.log({ VALID_IMAGE: await utils.validation.validImage(image) });
    if (
      utils.validation.validImage(image) &&
      utils.validation.validText(name)
    ) {
      await models.Category({ name, image }).save();

      res.status(201).json({ CODE: statusCodes.AD_CATEGORY });
    } else {
      res.status(500).json({ CODE: statusCodes.ER_PARAMS });
    }
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

//update category by id            /category/:categoryId  {body}
router.put('/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    // check valid id
    mongoose.Types.ObjectId.isValid(categoryId);

    // check id in database
    const foundedCategory = await models.Category.findById(categoryId);
    if (!foundedCategory)
      return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    const { name, image } = req.body;

    await models.Category.findByIdAndUpdate(categoryId, req.body);
    res.status(200).json({ CODE: statusCodes.UP_CATEGORY });
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

//delete a category by id          /category/:categoryId
router.delete('/:categoryId', async (req, res) => {
  // Check current id in database
  const categoryId = req.params.categoryId;
  try {
    mongoose.Types.ObjectId.isValid(categoryId);
    const foundedCategory = await models.Category.findById(categoryId);
    if (!foundedCategory)
      return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    await models.Category.findByIdAndDelete(categoryId);
    res.status(204).json({ CODE: statusCodes.DL_CATEGORY });
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
