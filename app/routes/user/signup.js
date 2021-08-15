const express = require("express");
const router = express.Router();
const { statusCodes, configs } = require("../../values");
const models = require("../../models");
const jwt = require("jsonwebtoken");
const utils = require("../../utils");

// get phone number and name and send sms
router.post("/", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (await utils.validation.validPhoneNumber(phoneNumber)) {
      const foundedPhone = await models.Verification.findOne({ phoneNumber });
      if (foundedPhone)
        return res.status(400).json({ CODE: statusCodes.ER_TOO_MANY_ATTEMPTS });
      else {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        console.log(verificationCode); // 6 DIGITS
        utils.sendSms(phoneNumber, verificationCode);
        await models.Verification({ verificationCode, phoneNumber }).save();
        console.log(utils.sendSms);
        res.status(200).json({ CODE: statusCodes.AD_USER_CREATED });
      }
    } else {
      return res.status(400).json({ CODE: statusCodes.ER_PARAMS });
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

// verification code
router.put("/", async (req, res) => {
  const { phoneNumber, verificationCode } = req.body;
  try {
    if (
      (await !utils.validation.validVerificationCode(verificationCode)) ||
      (await !utils.validation.validPhoneNumber(phoneNumber))
    )
      return res.status(500).json({ CODE: statusCodes.ER_PARAMS });

    const resFindToken = await models.Verification.findOne({ phoneNumber });
    if (!resFindToken || resFindToken.verificationCode !== verificationCode)
      return res
        .status(400)
        .json({ CODE: statusCodes.ER_VERIFICATION_TOKEN_WRONG });

    const token = jwt.sign({ phoneNumber }, configs.TOKEN_SECRET, {
      expiresIn: "9000h",
    });

    await models.User({ phoneNumber, token }).save();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ CODE: ER_SMT_WRONG });
  }
});

module.exports = router;
