const router = require('express').Router();
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');
const { AD_ADMIN_CREATED } = require('../../values/statusCodes');
const _ = require('lodash');

router.get('/', async (req, res) => {
  try {
    const { page, isConfirmed, parentType } = req.query;

    let comments;
    if (page) {
      comments = await models.Comment.paginate(
        { isConfirmed, parentType },
        { page, limit: 10, populate: [{ path: 'parent' }, { path: 'user' }] }
      );
    } else {
      comments = await models.Comment.find({
        isConfirmed,
        parentType,
      }).populate([{ path: 'parent' }, { path: 'user' }]);
    }
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.patch('/:commentId', async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const isValid = utils.mongoId(req.params.commentId);
    if (!isValid) throw new Error('Invalid Id');
    const comment = await models.Comment.findById(req.params.commentId);

    if (!comment.isConfirmed) {
      console.log({ comment });
      if (comment.parentType === 'Product') {
        //Product
        const product = await models.Product.findById(comment.parent);
        const rate = (parseInt(product.rate) + parseInt(comment.rate)) / 2;
        console.log({
          currentRate: product.rate,
          commentRate: comment.rate,
          rate,
        });
        await models.Product.findByIdAndUpdate(comment.parent, { rate });
        await models.Comment.findByIdAndUpdate(comment._id, {
          isConfirmed: true,
        });
      } else {
        // Blog
      }
      res.status(200).json({ Code: statusCodes.UP_COMMENT_APPROVED });
    } else {
      res.status(500).json({ CODE: 'Comment Not Found' });
    }

    // if (comment.parentType == 'Product') {
    //   let avg, CurrentProdRate;

    //   const cm = await models.Comment.findById(req.params.commentId).populate(
    //     'parent'
    //   );
    //   const prodCm = await models.Product.findById(comment.parent);
    //   console.log(prodCm);
    //   if (!prodCm.rate) CurrentProdRate = 5;
    //   else {
    //     CurrentProdRate = prodCm.rate;
    //   }

    //   avg = (parseInt(CurrentProdRate) + parseInt(cm.rate)) / 2;
    //   console.log({ m: parseInt(CurrentProdRate), n: parseInt(cm.rate) });
    //   console.log({ avg: avg });

    //   await models.Product.findOneAndUpdate(
    //     { _id: comment.parent },
    //     { $set: { rate: avg } }
    //   );
    //   const comment = await models.Comment.findOneAndUpdate(
    //     { _id: req.params.commentId },
    //     { isConfirmed: true },
    //     { new: true }
    //   );

    //   await models.Product.findOneAndUpdate(
    //     { _id: comment.parent },
    //     { $push: { comments: comment } }
    //   );
    // } else {
    //   await models.Blog.findOneAndUpdate(
    //     { _id: comment.parent },
    //     { $push: { comments: comment } }
    //   );
    // }

    // await models.User.findOneAndUpdate(
    //   { _id: comment.user },
    //   { $push: { comments: comment } }
    // );
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case 'Not Found':
        res.status(422).json({ Code: statusCodes.ER_PARAMS });
        break;
      case 'Invalid Id':
        res.status(422).json({ Code: statusCodes.ER_PARAMS });
        break;
      default:
        res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
        break;
    }
  }
});

router.delete('/:commentId', async (req, res) => {
  try {
    const isValid = utils.mongoId(req.params.commentId);
    if (!isValid) {
      throw new Error('Invalid Id');
    }
    const comment = await models.Comment.findById(req.params.commentId);
    console.log(comment);

    if (!comment) {
      throw new Error('Not Found');
    }

    if (comment.parentType == 'Product') {
      await models.Product.findOneAndUpdate(
        { _id: comment.parent },
        { $pull: { comments: comment.id } }
      );
    } else {
      await models.Blog.findOneAndUpdate(
        { _id: comment.parent },
        { $pull: { comments: comment.id } }
      );
    }
    await models.User.findOneAndUpdate(
      { _id: comment.user },
      { $pull: { comments: comment.id } }
    );
    await models.Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({ Code: statusCodes.DL_COMMENT });
  } catch (error) {
    console.log(error.message);
    switch (error.message) {
      case 'Not Found':
        res.status(422).json({ Code: statusCodes.ER_PARAMS });
        break;
      case 'Invalid Id':
        res.status(422).json({ Code: statusCodes.ER_PARAMS });
        break;
      default:
        res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
        break;
    }
  }
});

module.exports = router;
