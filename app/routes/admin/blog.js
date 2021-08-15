const express = require("express");
const router = express.Router();
const models = require("../../models");
const mongoose = require("mongoose");
const statusCodes = require("../../values/statusCodes");
const middleware = require("../../middleware");
const utils = require("../../utils");
const cleanCache = require('../../middleware/cleanCache')
var moment = require("moment-jalaali");
const ac = require("./access");
const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", middleware.adminAuthentication ,async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny("blogs");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const { page, search } = req.query;
    try {
      if (page) {
        if (search) {
          console.log({ search });
          const regex = new RegExp(escapeRegex(req.query.search), "gi");
          const allBlogCategories = await models.Blog.paginate(
            { title: regex },
            { page: req.query.page, limit: 10, populate: "blogCategory" }
          );

          res.status(200).json(allBlogCategories);
        } else {
          const allBlogs = await models.Blog.paginate(
            {},
            {
              page: req.query.page,
              limit: 10,
              populate: "product blogCategory",
            }
          );
          res.status(200).json(allBlogs);
        }
      } else {
        const allBlogs = await models.Blog.find({}).populate(
          "product blogCategory"
        ).cache({key: req.userId});
        // utils.setCache(req.route.path, allBlogs);
        res.status(200).json(allBlogs);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

//api/v1/admin/article/:SearchItem/:page
// router.get("/:title/:page", async (req, res) => {
//   try {
//     const regex = new RegExp(escapeRegex(req.params.title), "gi");

//     const foundedBlogs = await models.Blog.paginate(
//       { title: regex },
//       {
//         page: req.params.page,
//         limit: 10,
//         populate: "author product blogCategory",
//       }
//     );
//     console.log({ foundedBlogs });
//     res.status(200).json(foundedBlogs);
//   } catch (error) {
//     console.log({ error });
//     res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
//   }
// });

router.get(
  "/:id",
  middleware.adminAuthentication,
  async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny("blogs");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const id = req.params.id;

    //TODO Validate object id
    try {
      mongoose.Types.ObjectId.isValid(id);
      const foundedBlogs = await models.Blog.findById(id);

      // utils.setCache(id, foundedBlogs);
      res.status(200).json(foundedBlogs);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }

  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
  });

router.post("/", middleware.adminAuthentication,async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).createAny("blogs");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
  const {
    title,
    author,
    timeToRead,
    thumbnail,
    content,

    product,
    blogCategory,
  } = req.body;
  try {
    await models
      .Blog({
        title,
        author,
        timeToRead,
        thumbnail,
        content,

        product,
        blogCategory,
      })
      .save();
    res.status(200).json({ CODE: statusCodes.AD_BLOG });
    await models.BlogCategory.findOneAndUpdate(
      { _id: blogCategory },
      { $inc: { count: 1 } }
    );
  } catch (error) {
    if (error.message.includes("require"))
      return res.status(500).json({ CODE: statusCodes.ER_PARAMS });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
  });

router.put("/:blogId", middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).updateAny("blogs");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const blogId = req.params.blogId;
    try {
      mongoose.Types.ObjectId.isValid(blogId);

      // check id in database
      const foundedBlogs = await models.Blog.findById(blogId);
      if (!foundedBlogs)
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      const {
        title,
        author,
        timeToRead,
        thumbnail,
        content,

        product,
        blogCategory,
      } = req.body;

      await models.Blog.findByIdAndUpdate(blogId, {
        $set: {
          title,
          author,
          timeToRead,
          thumbnail,
          content,

          product,
          blogCategory,
        },
      });
      res.status(200).json({ CODE: statusCodes.UP_BLOG });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

router.delete("/:blogId", async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).deleteAny("blogs");
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    const blogId = req.params.blogId;
    try {
      mongoose.Types.ObjectId.isValid(blogId);
      const foundedBlogs = await models.Blog.findById(blogId);
      if (!foundedBlogs)
        return res.status(500).json({ CODE: statusCode.ER_SMT_WRONG });
      await models.Blog.findByIdAndDelete(blogId);
      res.status(200).json({ CODE: statusCodes.DL_BLOG });
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

module.exports = router;
