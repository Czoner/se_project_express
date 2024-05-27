const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateId = celebrate({
  params: Joi.object()
    .keys({
      postId: Joi.string().alphanum().length(24),
      headers: Joi.object().keys({}),
      query: Joi.object().keys({}),
    })
    .unknown(true),
});

const BodyValidation = celebrate({
  clothingItemBody: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageURL: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
  userInfoBody: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.url": 'the "imageUrl" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "You must enter an email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "You must enter an password",
    }),
  }),
  authenticationBody: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "You must enter an email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "You must enter an password",
    }),
  }),
  idBody: Joi.object().keys({
    ID: Joi.string().alphanum().length(24),
  }),
});

module.exports = { validateId, BodyValidation };
