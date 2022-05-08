const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const TokenManager = {
    // fungsi membuat access token
    generateAccessToken(payload) {
        return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
    },

    // fungsi membuat refresh token
    generateRefreshToken(payload) {
        return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
    },

    // fungsi mempverifikasi refresh token
    verifyRefreshToken(refreshToken) {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
        } catch (error) {
            throw new InvariantError("Refresh token tidak valid");
        }
    },
};

module.exports = TokenManager;
