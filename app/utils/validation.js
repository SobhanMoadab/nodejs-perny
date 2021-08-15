const joi = require('@hapi/joi');

const phoneNumberValidator = joi.object({
  phoneNumber: joi.string().required().max(11).min(11),
});

const passwordValidator = joi.object({
  password: joi
    .string()
    .required()
    .regex(/[a-zA-Z0-9]{3,30}/),
});

const verificationCodeValidator = joi.object({
  verificationCode: joi.number().required().max(6).min(6),
});

const validPhoneNumber = async (phoneNumber) => {
  const isValid = await phoneNumberValidator.validate({ phoneNumber });
  if (isValid.error)  return false;
  else return true;
};

const validVerificationCode = async (verificationCode) => {
  const isValid = await verificationCodeValidator.validate({
    verificationCode,
  });
  if (isValid.error) return false;
  else return true;
};

const validPassword = async (validPassword) => {
  console.log({ validPassword });
  const isValid = await passwordValidator.validate({ password: validPassword });
  console.log({ isValid });
  if (isValid.error) return false;
  else return true;
};

const validImage = async (imageUrl) => {
  if (imageUrl.toLowerCase().startsWith('https://pernymarket.ir')) return true;
  else return false;
};

const validText = (text) => {
  if (text && text.length > 0) return true;
  else return false;
};
module.exports = {
  validPhoneNumber,
  validVerificationCode,
  validPassword,
  validText,
  validImage,
};
