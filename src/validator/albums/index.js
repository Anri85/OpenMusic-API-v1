const AlbumsPayloadSchema = require("./schema");
const InvariantError = require("../../exceptions/InvariantError");

// membuat plugin untuk validasi data
const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        // lakukan validasi data payload
        const validationResult = AlbumsPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AlbumsValidator;
