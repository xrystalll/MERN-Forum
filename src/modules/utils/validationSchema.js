const Joi = require("joi");

// const registerSchema = Joi.object({
//   username: Joi.string()
//     .min(3)
//     .max(21)
//     .required()
//     // .regex(/^[a-zA-Zа-яА-Я0-9_\u3040-\u309f\u30a0-\u30ff]+$/) given the transilerate is not needed
//     .messages({
//       "string.pattern.base":
//         "Allowed: latin, cyrillic, hiragana, katakana, 0-9 and symbol _",
//     }),
//   email: Joi.string().email().lowercase().required(),
//   password: Joi.string().min(6).max(50).required(),
// });

const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "User name is required" }),
  username: Joi.string().required().min(3).max(21).messages({
    "string.min": "username must be atleast 3 characters long",
    "string.max": "username must not be more than 21 characters",
    "any.required": "username is required for signup",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "An email is needed for signup",
  }),
  password: Joi.string().required().min(6).max(50).messages({
    "string.min": "Your password must be atleast 6 characters long",
    "string.max": "Password exceeds maximum limit of 50 characters",
    "any.required": "Please provide your password for signup",
  }),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "passwords do not match",
    "any.required": "please confirm password",
  }),
  role: Joi.string()
    .required()
    .valid(
      "researcher",
      "talent",
      "founder",
      "mentor",
      "lead",
      "coop-member",
      "organization",
      "institution",
      "student"
    )
    .messages({
      "any.only":
        "role must be either researcher, talent, founder, mentor, lead, coop-member, organization, institution or student",
      "any.required": "Please provide a role to continue registration",
    }),
  //Validation on uris that we will be expecting from 3rd parties such as github, behance, e.t.c
  experience: Joi.array().items({
    companyUrl: Joi.string()
      .uri()
      .messages({ "string.uri": "Must be a valid company link" }),
  }),
  certifications: Joi.array().items(
    Joi.string().uri().messages({ "string.uri": "Must be a valid course link" })
  ),
  portfolio: Joi.array().items(
    Joi.string()
      .uri()
      .messages({ "string.uri": "Must be a valid link to project/portfolio" })
  ),
}).options({ abortEarly: false });

const loginSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(21)
    .required()
    .regex(/^[a-zA-Zа-яА-Я0-9_\u3040-\u309f\u30a0-\u30ff]+$/)
    .messages({
      "string.pattern.base":
        "Allowed: latin, cyrillic, hiragana, katakana, 0-9 and symbol _",
    }),
  password: Joi.string().min(6).max(50).required(),
});

module.exports = { registerSchema, loginSchema };
