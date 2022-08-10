const Joi = require('joi')

const registerValidation = Joi.object().keys({
  full_name: Joi.string().required().empty(''),
  mobile: Joi.string().pattern(/^[0-9]+$/).required().empty(''),
  email: Joi.string().email().required().empty(''),
  password: Joi.string().required().empty(''),
  address:Joi.string().required().empty(''),
})

const loginValidation = Joi.object().keys({
  email: Joi.string().email().required().empty(''),
  password: Joi.string().required().empty(''),
})

const forgotPasswordValidation = Joi.object().keys({
  email: Joi.string().email().required().empty(''),
})

const forgotPasswordVerifyValidation = Joi.object().keys({
  token: Joi.string().required().empty(''),
  newpassword: Joi.string().required().empty(''),
  confirmpassword: Joi.string().required().empty(''),
})

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  forgotPasswordVerifyValidation
}
