const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');

const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get('/',middleware.cleaCache, async (req, res) => {
  const { page, filter, search } = req.query;
  try {
    if (page) {
      if (search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const products = await models.Product.paginate(
          { name: regex },
          {
            page: req.query.page,
            limit: 10,
            populate: { path: 'category', select: '-products' },
          }
        );

        return res.status(200).json(products);
      } else if (filter) {
        console.log({ filter });
        switch (filter) {
          case 'special':
            //================================ Paginate filter by special offer
            const specialOffers = await models.Product.paginate(
              { isOnOffer: true },
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { createdAt: -1 },
              }
            );
            res.status(200).json(specialOffers);
            break;
          case 'latest':
            const latestProducts = await models.Product.paginate(
              {},
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { createdAt: -1 },
              }
            );
            res.status(200).json(latestProducts);
            break;
          case 'offer':
            const onOffer = await models.Product.paginate(
              { isOnOffer: true },
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { createdAt: -1 },
              }
            );
            res.status(200).json(onOffer);
            break;
          case 'disable':
            const disabledProducts = await models.Product.paginate(
              { isDisable: true },
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { createdAt: -1 },
              }
            );
            res.status(200).json(disabledProducts);
            break;
          case 'discount':
            const discountedProducts = await models.Product.paginate(
              {},
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { createdAt: -1 },
                select: 'discount',
              }
            );
            res.status(200).json(discountedProducts);
            break;

          case 'expensive':
            const mostExpensive = await models.Product.paginate(
              {},
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { realPrice: -1 },
              }
            );
            res.status(200).json(mostExpensive);
            break;
          case 'cheapest':
            const cheapest = await models.Product.paginate(
              {},
              {
                page,
                limit: 10,
                populate: { path: 'category', select: '-products' },
                sort: { realPrice: 1 },
              }
            );
            res.status(200).json(cheapest);
            break;
        }
      } else {
        const productsPaginated = await models.Product.paginate(
          {},
          {
            page,
            limit: 10,
            populate: { path: 'category', select: '-products' },
          }
        ).cache({key: req.userId});
        return res.status(200).json(productsPaginated);
      }
    } else {
      //================================ All data
      const allProducts = await models.Product.find({}).populate([
        { path: 'category', select: '-products' },
      ]);

      // utils.setCache(req.route.path, allProducts);
      res.status(200).json(allProducts);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    mongoose.Types.ObjectId.isValid(id);
    const foundedProduct = await models.Product.findById(id).populate(
      'category'
    );

    // utils.setCache(id, foundedProduct);
    res.status(200).json(foundedProduct);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
