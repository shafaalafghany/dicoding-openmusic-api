const Joi = require('Joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.strng().required(),
});

module.exports = { PlaylistPayloadSchema };
