const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
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
// get category by id              /category/:categoryId
router.get('/:id', async (req, res) => {
  console.log('Slam');
  const id = req.params.id;
  const page = req.query.page;
  const filter = req.query.filter;
  try {
    mongoose.Types.ObjectId.isValid(id);
    const sliders = await models.Slider.find({ parent: id });
    const allCat = await models.Category.find().select('name');
    const selectedCategory = await models.Category.findById(id);
    let cat = [];
    if (page) {
      switch (filter) {
        case 'offer':
          console.log('============= ON OFFER ============== ');
          cat = await models.Product.paginate(
            { category: id, isOnOffer: true, isDisable: false },
            {
              page,
              limit: 10,
              sort: { createdAt: -1 },
            }
          );
          break;
        case 'latest':
          console.log('============= LATEST ============== ');
          cat = await models.Product.paginate(
            { category: id, isDisable: false },
            {
              page,
              limit: 10,
              sort: { createdAt: -1 },
            }
          );
          break;
        case 'mostDiscount':
          console.log('============= mostDiscount ============== ');
          cat = await models.Product.paginate(
            { category: id, isOnOffer: true, isDisable: false },
            {
              page,
              limit: 10,
              sort: { discount: -1 },
            }
          );
          break;
        case 'expensive':
          console.log('============= expensive ============== ');
          cat = await models.Product.paginate(
            { category: id, isDisable: false },
            {
              page,
              limit: 10,
              sort: { realPrice: -1 },
            }
          );
          break;
        case 'cheapest':
          console.log('============= cheapest ============== ');
          cat = await models.Product.paginate(
            { category: id, isDisable: false },
            {
              page,
              limit: 10,
              sort: { realPrice: 1 },
            }
          );
          break;
        default:
          console.log('DEFAULT');
          const allCategories = await models.Product.find({
            category: id,
            isDisable: false,
          });
          console.log({ allCategories: allCategories.length });
          cat = await models.Product.paginate(
            { category: id, isDisable: false },
            { page: req.query.page, limit: 10 }
          );
          break;
      }
    } else {
      console.log('ELSE');
      cat = await models.Product.findById({ category: id, isDisable: false });
    }

    res
      .status(200)
      .json({ cat, allCat, sliders, category: selectedCategory.name });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.get('/:id/:page', async (req, res) => {
  const id = req.params.id;
  try {
    mongoose.Types.ObjectId.isValid(id);
    const foundedCategory = await models.Category.findById(id).select(
      '-products'
    );
    const products = await models.Product.paginate(
      { category: id },
      { page: req.params.page, limit: 8, select: '-category' }
    );
    const sliders = await models.Slider.find({ parent: id });
    // utils.setCache(id, (foundedCategory,products,sliders));
    res.status(200).json({ sliders, foundedCategory, products });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
