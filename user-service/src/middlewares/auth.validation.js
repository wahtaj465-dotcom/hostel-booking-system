const Joi = require("joi");

const PASSWORD_MESSAGE =
  "Password must be at least 8 characters and must include numbers/digits.";

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Name is required.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name must be at most 100 characters long.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email is required.",
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).pattern(/\d/).required().messages({
    "string.base": PASSWORD_MESSAGE,
    "string.empty": PASSWORD_MESSAGE,
    "string.min": PASSWORD_MESSAGE,
    "string.pattern.base": PASSWORD_MESSAGE,
    "any.required": PASSWORD_MESSAGE,
  }),
})
  .required()
  .messages({
    "object.unknown": "Unexpected field is not allowed.",
  });

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": "Email is required.",
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).pattern(/\d/).required().messages({
    "string.base": PASSWORD_MESSAGE,
    "string.empty": PASSWORD_MESSAGE,
    "string.min": PASSWORD_MESSAGE,
    "string.pattern.base": PASSWORD_MESSAGE,
    "any.required": PASSWORD_MESSAGE,
  }),
})
  .required()
  .messages({
    "object.unknown": "Unexpected field is not allowed.",
  });

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: true,
    allowUnknown: false,
    convert: true,
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  req.body = value;
  return next();
};

exports.validateRegister = validateBody(registerSchema);
exports.validateLogin = validateBody(loginSchema);
