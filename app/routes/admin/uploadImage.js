const express = require('express');
const fs = require('fs');
const multer = require('multer');
const models = require('../../models');
const { statusCodes, configs } = require('../../values');
const moment = require('jalali-moment');
const sharp = require('sharp');
const ac = require('./access');
const middleware = require('../../middleware');

const router = express.Router();
let imagePath = './images';
let imageName = null;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!req.body.imageType) cb('IMAGE TYPE REQUIRE', null);
    if (!fs.existsSync('./images'))
      fs.mkdirSync('./images', { recursive: true });
    if (!fs.existsSync(`./images/${req.body.imageType}`))
      fs.mkdirSync(`./images/${req.body.imageType}`, { recursive: true });
    imagePath = `./images/${req.body.imageType}`;
    cb(null, `./images/${req.body.imageType}`);
  },
  filename: function (req, file, cb) {
    if (!req.body.imageName) cb('IMAGE MUST HAVE NAME', null);
    else {
      imageName =
        req.body.imageName.replace(/\s+/g, '-') +
        '.' +
        file.mimetype.split('/')[1];
      console.log({ imageName });
      cb(null, imageName);
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg')
    cb(null, true);
  else cb(null, false);
};

const imageUpload = multer({ storage, fileFilter });

router.post(
  '/',
  middleware.adminAuthentication,
  imageUpload.single('image'),
  async (req, res) => {
    const requester = await models.Admin.findById(req.userId);
    const permission = ac.can(requester.role).createAny('image');

    if (permission.granted) {
      try {
        let size = configs.DEFAULT_SIZE;
        const imageType = req.body.imageType;
        if (imageType && imageType == 'slider') {
          size = configs.SLIDER_SIZE;
        }
        const { filename: image } = req.file;
        let i = 0;
        const imageUrl =
          configs.BASE_URL +
          `images/${req.body.imageType}/${
            imageName.split('.')[0]
          }${moment().locale('fa').format('-YYYYMDHHmmss')}.${
            req.file.mimetype.split('/')[1]
          }`;

        await sharp(req.file.path)
          .withMetadata()
          .resize(size)
          .toFile(
            `${imagePath}/${image.split('.')[0]}${moment()
              .locale('fa')
              .format('-YYYYMDHHmmss')}.${req.file.mimetype.split('/')[1]}`
          );
        i++;
        if (i == 1) {
          fs.unlinkSync(req.file.path);
        }

        const galleryImage = {
          name: image,
          url: imageUrl,
          type: req.body.imageType,
        };
        await models.Image(galleryImage).save();
        res.status(200).json(galleryImage);
      } catch (e) {
        console.log(e);
        res.status(500).json({ ERROR: statusCodes.ER_SMT_WRONG });
      }
    } else {
      res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
    }
  }
);

module.exports = router;
