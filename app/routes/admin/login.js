const { statusCodes, configs } = require('../../values');
const models = require('../../models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const utils = require('../../utils');
const jwt = require('jsonwebtoken');

//Login Admin
router.post('/', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (
      (await utils.validation.validPassword(password)) &&
      (await utils.validation.validPhoneNumber(phoneNumber))
    ) {
      const foundedAdmin = await models.Admin.findOne({ phoneNumber });
      const checkPassword = await bcrypt.compare(
        password,
        foundedAdmin.password
      );
      if (!checkPassword)
        return res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });

      if (checkPassword) {
        const token = await utils.generateToken(phoneNumber);
        console.log({ token });

        const mehrad = await models.Admin.findOneAndUpdate(
          { phoneNumber },
          { $push: { token } }
        );
        console.log(mehrad);
        res.status(200).json({ token });
      } else res.status(500).json({ CODE: statusCodes.ER_AUTH_FAILED });
    } else res.status(400).json({ CODE: statusCodes.ER_PARAMS });
  } catch (error) {
    console.log(error);
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

// for adding admin
router.put('/', async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    if (
      (await utils.validation.validPassword(password)) &&
      (await utils.validation.validPhoneNumber(phoneNumber))
    ) {
      const isAvailable = await models.Admin.findOne({ phoneNumber });

      if (isAvailable) {
        return res
          .status(500)
          .json({ CODE: statusCodes.ER_ADMIN_IS_ALREADY_REGISTERED });
      } else {
        const token = jwt.sign({ phoneNumber }, configs.TOKEN_SECRET, {
          expiresIn: '9000h',
        });
        const createAdmin = await models
          .Admin({
            phoneNumber,
            token,
            password: await utils.hashedPassword(password),
            role: 'Admin',
          })
          .save();
        // if(createAdmin){
        // await models.Admin.findOneAndUpdate(
        //   {phoneNumber},
        //   {$set: {role: Admin}}
        // )
        // }

        await models.User.findOneAndUpdate(
          { phoneNumber },
          { $set: { isAdmin: true } }
        );
        res.status(200).json({ CODE: statusCodes.AD_ADMIN_CREATED });
      }
    } else res.status(400).json({ CODE: statusCodes.ER_PARAMS });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ CODE: statusCodes.ER_SMT_WRONG });
  }
});

module.exports = router;
