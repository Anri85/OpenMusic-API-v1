const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class AuthenticationsService {
    constructor() {
        this._pool = new Pool();
    }

    async addRefreshToken(refreshToken) {
        // menyimpan refresh token kedalam database
        const order = {
            text: "INSERT INTO authentications VALUES($1)",
            values: [refreshToken],
        };
        await this._pool.query(order);
    }

    async verifyRefreshToken(refreshToken) {
        // verifikasi refresh token untuk pembuatan token jwt yang baru
        const order = {
            text: "SELECT token FROM authentications WHERE token = $1",
            values: [refreshToken],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new InvariantError("Refresh token tidak valid");
        }
    }

    // jika pengguna telah logout, hapus refresh token pada database
    async deleteRefreshToken(refreshToken) {
        await this.verifyRefreshToken(refreshToken);
        // hapus token
        const order = {
            text: "DELETE FROM authentications WHERE token = $1",
            values: [refreshToken],
        };
        await this._pool.query(order);
    }
}

module.exports = AuthenticationsService;
