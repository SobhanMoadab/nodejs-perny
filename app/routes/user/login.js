const express = require('express');
const router = express.Router();
const models = require('../../models');
const jwt = require('jsonwebtoken');
const utils = require('../../utils');
const { statusCodes, configs } = require('../../values');

// =============== Login
router.post('/', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!utils.validation.validPhoneNumber(phoneNumber))
      res.status(400).json({ CODE: statusCodes.ER_PARAMS });
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await models.Verification({ verificationCode, phoneNumber }).save();
    utils.sendSms(phoneNumber, verificationCode);
    res.status(200).json({ CODE: statusCodes.SC_SMS_SEND_TO_USER });
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

router.put('/', async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  try {
    if (
      !utils.validation.validVerificationCode(verificationCode) ||
      !utils.validation.validPhoneNumber(phoneNumber)
    )
      return res.status(500).json({ CODE: statusCodes.ER_PARAMS });

    const foundedVerificationCode = await models.Verification.findOne({
      verificationCode,
      phoneNumber,
    });
    if (foundedVerificationCode) {
      const token = jwt.sign({ phoneNumber }, configs.TOKEN_SECRET, {
        expiresIn: '9000h',
      });
      const foundedMember = await models.User.findOne({ phoneNumber });
      if (foundedMember)
        await models.User.findOneAndUpdate(
          { phoneNumber },
          { $push: { token } }
        );
      else await models.User({ phoneNumber, token: [token] }).save();

      res.status(200).json({ token });
    } else {
      res.status(500).json('LOGIN FAILED');
    }

    const resFindToken = await models.Verification.findOne({ phoneNumber });
    if (!resFindToken || !resFindVerification)
      res.status(400).json({ CODE: statusCodes.ER_VERIFICATION_TOKEN_WRONG });
    else {
      const token = jwt.sign({ phoneNumber }, configs.TOKEN_SECRET, {
        expiresIn: '9000h',
      });
      await models.User.findOneAndUpdate({ phoneNumber }, { $push: { token } });
      res.status(200).json({ token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
