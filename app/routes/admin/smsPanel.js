const express = require("express");
const router = express.Router();
const models = require("../../models");
const mongoose = require("mongoose");
const statusCodes = require("../../values/statusCodes");
const middleware = require("../../middleware");
const utils = require("../../utils");
const ac = require('./access');


router.post("/", middleware.adminAuthentication,async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).createAny('smsPanel');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    try {
      const { phoneNumber,content } = req.body;
      if (await utils.validation.validPhoneNumber(phoneNumber)) {
        utils.sendSms(phoneNumber, content);
         await models.SmsPanel({ content, phoneNumber }).save();
          console.log(utils.sendSms);
          res.status(200).json({ CODE: statusCodes.SC_SMS_SEND_TO_USER });
        } else {
        return res.status(400).json({ CODE: statusCodes.ER_PARAMS });
      }
    } catch (error) {
      console.log({ error });
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});



  router.get("/", middleware.adminAuthentication,async (req, res) => {
  const requester = await models.Admin.findById(req.userId);
  console.log({ requester });
  const permission = ac.can(requester.role).readAny('smsPanel');
  console.log({ permission });
  console.log(permission.granted);
  if (permission.granted) {
    try {
        const allSms = await models.SmsPanel.find({}).sort({ createdAt: -1 });
        res.status(200).json(allSms); 
      
    } catch (error) {
      res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
    }
  } else {
    res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
  }
});

router.delete(
  '/:smsId',
  middleware.adminAuthentication,
  async (req, res) => {
    const requester = await models.Admin.findById(req.userId);
    console.log({ requester });
    const permission = ac.can(requester.role).deleteAny('smsPanel');
    console.log({ permission });
    console.log(permission.granted);
    if (permission.granted) {
      const smsId = req.params.smsId;
      try {
        mongoose.Types.ObjectId.isValid(smsId);
        const foundedSms = await models.SmsPanel.findById(smsId);
        if (!foundedSms)
          return res.status(500).json({ CODE: statusCode.ER_SMT_WRONG });
        await models.SmsPanel.findByIdAndDelete(smsId);
        res.status(200).json({ CODE: statusCodes.DL_SMS});
      } catch (error) {
        res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
      }
    } else {
      res.status(500).json({ CODE: statusCodes.ACCESS_DENIED });
    }
  }
);

module.exports = router;
