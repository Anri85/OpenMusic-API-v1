const Joi = require("joi");

const PlaylistSongsPayload = Joi.object({
    songId: Joi.string().required(),
});

module.exports = PlaylistSongsPayload;
