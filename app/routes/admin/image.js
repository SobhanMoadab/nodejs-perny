const express = require('express');
const router = express.Router();
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const multer = require('multer');
const mongoose = require('mongoose');
const configs = require('../../values/configs');
const fs = require('fs');
const moment = require('moment-jalaali');
const sharp = require('sharp');
const middleware = require('../../middleware');
const utils = require('../../utils');
const ac = require('./access');

//  Get all images by page
const escapeRegex = (text) => {
  console.log({ text });
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
router.get('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  const permission = ac.can(requester.role).readAny('image');
  if (permission.granted) {
    const { page, search, filter } = req.query;
    try {
      if (page) {
        if (search) {
          const regex = new RegExp(escapeRegex(req.query.search), 'gi');
          const allImage = await models.Image.paginate(
            { name: regex },
            { page: req.query.page, limit: 10 }
          );
          res.status(200).json(allImage);
        } else if (filter) {
          const images = await models.Image.paginate(
            { type: filter },
            { page, limit: 10, sort: { createdAt: -1 } }
          );
          res.status(200).json(images);
        } else {
          const allImages = await models.Image.paginate(
            {},
            { page, limit: 10, sort: { createdAt: -1 } }
          );
          res.status(200).json(allImages);
        }
      } else {
        const allImages = await models.Image.find({}).sort({ createdAt: -1 });
        res.status(200).json(allImages);
      }
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// Get all images
router.get('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('image');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    try {
      const allImages = await models.Image.find({});
      res.status(200).json(allImages);
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// let imageName = false;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (!fs.existsSync("./images"))
//       fs.mkdirSync("./images", { recursive: true });
//     cb(null, "./images/");
//   },
//   filename: function (req, file, cb) {
//     if (file.mimetype === "image/png") imageName = req.body.imageName + ".png";
//     else if (file.mimetype === "image/jpeg")
//       imageName = req.body.imageName ;
//     cb(null, imageName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
//     cb(null, true);
//   else cb(null, false);
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: fileFilter,
// });

// router.post("/", upload.single("image"), async (req, res) => {
//   if (!req.file) res.status(500).json({ Error: "Error" });
//   console.log(req.file)
//   try {
//     const imageUrl = configs.BASE_URL + `images/${imageName}.${req.file.mimetype.split("/")[1]}`;
//     await sharp(req.file.path)
//     .withMetadata()
//     .resize(400, 400)
//     .toFile(`./images/${imageName}.jpg`);
//     fs.unlinkSync(req.file.path)
//      await models.Image({ name: req.body.imageName, url: imageUrl }).save();
//     res.status(200).json(`${imageUrl}.jpg`)
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
//   }
// });

router.delete('/:imageId', async (req, res) => {
  const imageId = req.params.imageId;
  try {
    mongoose.Types.ObjectId.isValid(imageId);
    const foundedImage = await models.Image.findById(imageId);
    if (!foundedImage)
      return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    await models.Image.findByIdAndDelete(imageId);
    const imageUrl = foundedImage.url.substr(30);
    console.log(imageUrl);
    // fs.unlinkSync(imageUrl)
    res.status(200).json({ CODE: statusCodes.DL_Image });
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});
module.exports = router;
