const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("../../models");
const statusCodes = require("../../values/statusCodes");
const utils = require("../../utils");
const { count } = require("../../models/User");
const middleware = require("../../middleware");
const ac = require("./access");

const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny("blogCateogries");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const { page, search } = req.query;
    try {
      if (page) {
        if (search) {
          console.log({ search });
          const regex = new RegExp(escapeRegex(req.query.search), "gi");
          const allBlogCategories = await models.BlogCategory.paginate(
            { name: regex },
            { page: req.query.page, limit: 10, populate: "blogs" }
          );

          res.status(200).json(allBlogCategories);
        } else {
          const allBlogCategories = await models.BlogCategory.paginate(
            {},
            { page: req.query.page, limit: 10, populate: "blogs" }
          );
          res.status(200).json(allBlogCategories);
        }
      } else {
      }
      const allBlogCategories = await models.BlogCategory.find().populate(
        "blogs"
      );
      res.status(200).json(allBlogCategories);
      // utils.setCache(req.route.path, allBlogCategories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// Get all categories

// get category by id
router.get(
  "/:id",
  middleware.adminAuthentication,
  async (req, res) => {
     const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny("blogCateogries");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const id = req.params.id;
    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedBlogCategories = await models.BlogCategory.findById(id);
      res.status(200).json(foundedBlogCategories);
      // utils.setCache(id, foundedCategory);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  
   } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
  });

// search category by name


// add a new category
router.post("/",middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).createAny("blogCateogries");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    try {
      const { name } = req.body;

      if (utils.validation.validText(name)) {
        await models.BlogCategory({ name }).save();

        res.status(201).json({ CODE: statusCodes.AD_BLOG_CATEGORY });
      } else {
        res.status(500).json({ CODE: statusCodes.ER_PARAMS });
      }
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//update category by id            /category/:categoryId  {body}
router.put(
  "/:blogCategoryId",
  middleware.adminAuthentication,
  async (req, res) => {
    const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).updateAny("blogCateogries");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const blogCategoryId = req.params.blogCategoryId;
    try {
      mongoose.Types.ObjectId.isValid(blogCategoryId);

      // check id in database
      const foundedBlogCategories = await models.BlogCategory.findById(
        blogCategoryId
      );
      if (!foundedBlogCategories) {
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
        const { name } = req.body;
      } else {
        await models.BlogCategory.findByIdAndUpdate(blogCategoryId, req.body);
        res.status(200).json({ CODE: statusCodes.UP_BLOG_CATEGORY });
      }
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  
    } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
  });

//delete a category by id          /category/:categoryId
router.delete(
  "/:blogCategoryId",
  middleware.adminAuthentication,
  async (req, res) => {
     const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).deleteAny("blogCateogries");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    // Check current id in database
    const blogCategoryId = req.params.blogCategoryId;
    try {
      mongoose.Types.ObjectId.isValid(blogCategoryId);
      const foundedCategory = await models.BlogCategory.findById(
        blogCategoryId
      );
      if (!foundedCategory)
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      await models.BlogCategory.findByIdAndDelete(blogCategoryId);
      res.status(204).json({ CODE: statusCodes.BlogCategory });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  
      } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
  });

module.exports = router;
