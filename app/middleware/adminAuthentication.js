const jwt = require('jsonwebtoken');
const configs = require('../values/configs');
const models = require('../models');
const statusCode = require('../values/statusCodes');

module.exports = async (req, res, next) => {
  let role;
  try {
    console.log('================== TOKEN ===============');
    console.log({ MMM: req.headers.authorization });
    const token = req.headers.authorization.split(' ')[1];
    const tokenInfo = jwt.verify(token, configs.TOKEN_SECRET);
    req.tokenInfo = tokenInfo;
    const resFindAdmin = await models.Admin.findOne({
      phoneNumber: tokenInfo.phoneNumber,
    });
    const adminRole = resFindAdmin.role;
    if (adminRole === 'Admin') role = 'admin';
    else role = 'accountant';
    if (!resFindAdmin || !resFindAdmin.token.includes(token))
      res.status(500).json({ CODE: statusCode.ER_AUTH_FAILED });
    else {
      req.userId = resFindAdmin._id;
      req.admin = resFindAdmin;
      req.role = role;
      next();
    }
  } catch (e) {
    console.log({ e });
    res.status(500).json({ CODE: statusCode.ER_AUTH_FAILED });
  }
};
