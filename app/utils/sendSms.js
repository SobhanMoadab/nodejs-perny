const request = require("request-promise");
const configs = require("../values/configs");
const send = async (receptor, text) => {
  if (receptor.length !== 11) return false;
  if (text.length < 1) return false;
  const resSendSms = await request(
    configs.SEND_SMS_URL + `SmsText=${text}&Receivers=${receptor}`
    
    
    );
    console.log(resSendSms)
    console.log({x:configs.SEND_SMS_URL + `SmsText=${text}&Receivers=${receptor}`});
  if (resSendSms.IsSuccessful) return true;
  else return false;
};

module.exports = send;
