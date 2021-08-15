const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
const util = require('util');
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec
mongoose.Query.prototype.cache = function (options = {}){
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '')
  return this
}
mongoose.Query.prototype.exec = async function (){
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }
  const key = JSON.stringify(Object.assign({}, this.getQuery(),{
    collection: this.mongooseCollection.name
  })
)


// see if we have cached it before or not
const cacheValue = await client.hget(this.hashKey, key)
if (cacheValue) {
  const doc = JSON.parse(cacheValue)
 return Array.isArray(doc)
 ? doc.map(d=> new this.model(d))
  : this.model(doc)
}


client.hset(hashKey, JSON.stringify(result))

const result = await exec.apply(this, arguments);

return result
}

module.exports = {
  clearCache(hashKey){
    client.del(JSON.stringify(hashKey))
  
  }
}
