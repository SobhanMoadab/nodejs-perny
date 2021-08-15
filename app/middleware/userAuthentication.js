const jwt = require('jsonwebtoken');
const configs = require('../values/configs');
const models = require('../models');
const statusCode = require('../values/statusCodes');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const tokenInfo = jwt.verify(token, configs.TOKEN_SECRET);
    req.tokenInfo = tokenInfo;
    const resFindUser = await models.User.findOne({
      phoneNumber: tokenInfo.phoneNumber,
    });
    console.log({ resFindUser });
    if (resFindUser.isAdmin) {
      req.userId = resFindUser._id;
      req.user = resFindUser;
      next();
    } else if (!resFindUser || !resFindUser.token.includes(token))
      res.status(500).json('AUTH FAILED');
    else {
      req.userId = resFindUser._id;
      req.user = resFindUser;
      next();
    }
  } catch (e) {
    console.log({ e });
    res.status(500).json('AUTH FAILED');
  }
};
