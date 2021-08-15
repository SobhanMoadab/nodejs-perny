const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../../models');
const statusCodes = require('../../values/statusCodes');
const ac = require('./access');
const middleware = require('../../middleware');

router.get('/', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('contactUs');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    try {
      const contactInformation = await models.ContactUs.find({});
      res.status(200).json(contactInformation[0]);
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

// router.post("/", middleware.adminAuthentication,async (req, res) => {
//   const requester = await models.Admin.findById(req.userId);
//   console.log({ requester });
//   const permission = ac.can(requester.role).createAny('contactUs');
//   console.log({ permission });
//   console.log(permission.granted);
//   if (permission.granted) {
//   const { phoneNumber, instagramAddress, telegramAddress, content,address} = req.body;
//   try {
//     await models
//       .ContactUs({
//         phoneNumber,
//         instagramAddress,
//         telegramAddress,
//         content,
//         address
//       })
//       .save();
//     res.status(200).json({ CODE: statusCodes.AD_CONTACT_INFORMATION });
//   } catch (error) {
//     if (error.message.includes("require"))
//       return res.status(500).json({ CODE: statusCodes.ER_PARAMS });
//     res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
//   }
// } else {
//   res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
// }
// });
router.post('/:contactId', middleware.adminAuthentication, async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  const permission = ac.can(requester.role).updateAny('contactUs');
  if (permission.granted) {
    const contactId = req.params.contactId;
    try {
      mongoose.Types.ObjectId.isValid(contactId);
      const contactUs = await models.ContactUs.findById(contactId);
      if (!contactUs) {
        res.status(500).json('Contact us not found');
        // await models.ContactUs({ ...req.body }).save();
        // res.status(200).json({ CODE: 'Contact us updated' });
      } else {
        await models.ContactUs.findByIdAndUpdate(contactId, { ...req.body });
        res.status(200).json({ CODE: statusCodes.UP_CONTACT_INFORMATION });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

module.exports = router;
