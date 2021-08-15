const express = require('express');
const router = express.Router();
const models = require('../../models');
const mongoose = require('mongoose');
const statusCodes = require('../../values/statusCodes');
const cleanCache = require('../../middleware/cleanCache');
const utils = require('../../utils');

const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

router.get('/', cleanCache, async (req, res) => {
  const { page, search } = req.query;
  try {
    if (page) {
      if (search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const allBlogCategories = await models.Blog.paginate(
          { title: regex },
          { page: req.query.page, limit: 10, populate: 'blogCategory' }
        );
        const blogCategories = await models.BlogCategory.find({});
        res
          .status(200)
          .json({ categories: blogCategories, blogs: allBlogCategories });
      } else {
        const allBlogs = await models.Blog.paginate(
          {},
          {
            page: req.query.page,
            limit: 10,
            populate: 'blogCategory',
          }
        );
        const blogCategories = await models.BlogCategory.find({});

        res.status(200).json({ allBlogs, blogCategories });
      }
    } else {
      const allBlogs = await models.Blog.find({}).populate('blogCategory').cache({key: req.userId});
      // utils.setCache(req.route.path, allBlogs);
      res.status(200).json(allBlogs);
    }
  } catch (error) {
    console.log(error);
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
      const foundedBlogs = await models.Blog.findById(id);

      // utils.setCache(id, foundedBlogs);
      res.status(200).send(JSON.stringify(foundedBlogs));
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  }
);

// get blog by category id
router.get('/category/:catId', async (req, res) => {
  try {
    const foundedBlogs = await models.Blog.paginate(
      { blogCategory: req.params.catId },
      { page: req.query.page, limit: 10, populate: 'blogCategory' }
    );
    res.status(200).json(foundedBlogs);
  } catch (error) {
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
