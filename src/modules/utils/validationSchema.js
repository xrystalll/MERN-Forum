const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(21)
    .required()
    .regex(/^[a-zA-Zа-яА-Я0-9_\u3040-\u309f\u30a0-\u30ff]+$/)
    .messages({
      'string.pattern.base': 'Allowed: latin, cyrillic, hiragana, katakana, 0-9 and symbol _'
    }),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(50).required()
})

const loginSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(21)
    .required()
    .regex(/^[a-zA-Zа-яА-Я0-9_\u3040-\u309f\u30a0-\u30ff]+$/)
    .messages({
      'string.pattern.base': 'Allowed: latin, cyrillic, hiragana, katakana, 0-9 and symbol _'
    }),
  password: Joi.string().min(6).max(50).required()
})

module.exports = { registerSchema, loginSchema }
