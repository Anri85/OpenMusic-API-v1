const InvariantError = require("../../exceptions/InvariantError");
const PlaylistSongsPayload = require("./schema");

const PlaylistSongsValidator = {
    validatePlaylistSongsPayload: (payload) => {
        const validationResult = PlaylistSongsPayload.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistSongsValidator;
