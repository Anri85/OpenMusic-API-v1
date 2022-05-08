const Joi = require("joi");

// schema saat user login
const PostAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// schema saat user mendapatkan access token baru berdasarkan refresh token
const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

// schema saat user melakukan logout dan menghapus refresh token
const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
};
