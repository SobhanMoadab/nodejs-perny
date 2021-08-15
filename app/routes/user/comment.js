const router = require('express').Router();
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const middleware = require('../../middleware');
const utils = require('../../utils');

router.post('/', middleware.userAuthentication, async (req, res) => {
  console.log('============ ADD COMMENT ==============');
  try {
    const { name, content, parentType, parent, rate } = req.body;

    const comment = new models.Comment({
      user: req.userId,
      content: content,
      name,
      parentType,
      parent,
      rate,
    });

    const resComment = await comment.save();
    await models.User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { comments: resComment } }
    );
    res.status(201).json({ Code: statusCodes.AD_COMMENT });
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.get('/', async (req, res) => {
  try {
    const approved = req.query.approved;
    const page = req.query.page;
    if (approved == 'true') {
      const approvedComments = await models.Comment.find({
        isConfirmed: true,
      }).populate([
        { path: 'parent' },
        { path: 'user', select: '-token -cart' },
      ]);
      if (page) {
        const paginatedApprovedComments = utils.paginate(
          approvedComments,
          10,
          page
        );
        res.status(200).json(paginatedApprovedComments);
      } else {
        res.status(200).json(approvedComments);
      }
    } else if (approved == 'false') {
      const unApprovedComments = await models.Comment.find({
        isConfirmed: false,
      }).populate([
        { path: 'parent' },
        { path: 'user', select: '-token -cart' },
      ]);
      if (page) {
        const paginatedUnapprovedComments = utils.paginate(
          unApprovedComments,
          10,
          page
        );
        res.status(200).json(paginatedUnapprovedComments);
      } else {
        res.status(200).json(unApprovedComments);
      }
    } else {
      const comments = await models.Comment.find().populate([
        { path: 'parent' },
        { path: 'user', select: '-token -cart' },
      ]);
      if (page) {
        const paginatedComments = utils.paginate(comments, 10, page);
        res.status(200).json(paginatedComments);
      } else {
        res.status(200).json(comments);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const page = req.query.page;
    const approvedComments = await models.Comment.find({
      isConfirmed: true,
      parent: req.params.productId,
    }).populate([{ path: 'parent' }, { path: 'user', select: '-token -cart' }]);
    if (page) {
      const paginatedApprovedComments = utils.paginate(
        approvedComments,
        10,
        page
      );
      res.status(200).json(paginatedApprovedComments);
    } else {
      res.status(200).json(approvedComments);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
