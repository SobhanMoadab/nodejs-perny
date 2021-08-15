const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');
const { product } = require('../user');
const ac = require('./access');

const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('products');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
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
              sort: { createdAt: -1 },
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
              sort: { createdAt: -1 },
            }
          );
          return res.status(200).json(productsPaginated);
        }
      } else {
        //================================ All data
        const allProducts = await models.Product.find({}).populate([
          { path: 'category', select: '-products', sort: { createdAt: -1 } },
        ]);

        // utils.setCache(req.route.path, allProducts);
        res.status(200).json(allProducts);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

router.get('/:id', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  const permission = ac.can(requester.role).readAny('products');
  if (permission.granted) {
    const id = req.params.id;

    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedProduct = await models.Product.findById(id).populate(
        'category'
      );
      console.log({ foundedProduct });
      // utils.setCache(id, foundedProduct);
      res.status(200).json(foundedProduct);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// add a new category              /category POST {BODY}
router.post('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  const permission = ac.can(requester.role).createAny('products');
  console.log(permission.granted);
  if (permission.granted) {
    const {
      name,
      images,
      realPrice,
      weight,
      unit,
      newPrice,
      category,
      isOnOffer,
    } = req.body;
    //TODO : check url is our server
    try {
      let discount = 0;
      if (newPrice)
        discount = Math.floor(((realPrice - newPrice) / realPrice) * 100);
      const newProduct = await models
        .Product({
          name,
          images,
          realPrice,
          weight,
          unit,
          newPrice,
          category,
          discount,
          isOnOffer,
        })
        .save();
      await models.Category.findOneAndUpdate(
        { _id: category },
        { $push: { products: newProduct._id } }
      );
      res.status(201).json({ CODE: statusCodes.AD_PRODUCT });
    } catch (error) {
      if (error.message.includes('require'))
        return res.status(500).json({ CODE: statusCodes.ER_PARAMS });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//update category by id            /category/:categoryId  {body}
router.put('/:productId', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  const permission = ac.can(requester.role).updateAny('products');
  if (permission.granted) {
    const productId = req.params.productId;
    try {
      mongoose.Types.ObjectId.isValid(productId);

      // check id in database
      const foundedProduct = await models.Product.findById(productId);
      if (!foundedProduct)
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      const {
        name,
        images,
        realPrice,
        weight,
        unit,
        newPrice,
        category,
        isOnOffer,
        isDisable,
      } = req.body;
      let discount = 0;
      if (newPrice) {
        discount = Math.floor(((realPrice - newPrice) / realPrice) * 100);
      }
      await models.Product.findByIdAndUpdate(productId, {
        $set: {
          name,
          images,
          realPrice,
          weight,
          unit,
          category,
          discount,
          newPrice,
          isOnOffer,
          isDisable,
        },
      });

      res.status(200).json({ CODE: statusCodes.UP_PRODUCT });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//delete a product by id          /category/:categoryId
router.delete(
  '/:productId',
  middleware.adminAuthentication,
  async (req, res) => {
    const requester = await models.Admin.findById(req.userId);
    console.log({ requester });
    const permission = ac.can(requester.role).deleteAny('products');
    console.log({ permission });
    console.log(permission.granted);
    if (permission.granted) {
      const productId = req.params.productId;
      try {
        mongoose.Types.ObjectId.isValid(productId);
        const foundedProduct = await models.Product.findById(productId);
        if (!foundedProduct)
          return res.status(500).json({ CODE: statusCode.ER_SMT_WRONG });
        await models.Product.findByIdAndDelete(productId);
        res.status(200).json({ CODE: statusCodes.DL_PRODUCT });
      } catch (error) {
        res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      }
    } else {
      res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
    }
  }
);

module.exports = router;
