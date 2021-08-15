const {clearCache} = require('../values/cache')
module.exports = async (req,res,next)  => {
  await next();
  clearCache(req.userId)
}
