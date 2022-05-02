const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const InvariantError = require("../exceptions/InvariantError");
const AuthenticationError = require("../exceptions/AuthenticationError");

class UsersService {
    constructor() {
        this._pool = new Pool();
    }

    async verifyNewUsername(username) {
        // verifikasi apakah username sudah digunakan
        const order = {
            text: "SELECT username FROM users WHERE username = $1",
            values: [username],
        };
        const result = await this._pool.query(order);
        if (result.rows.length > 0) {
            throw new InvariantError("Gagal menambahkan user. Username sudah digunakan.");
        }
    }

    // fungsi pengecekan apakah user telah melakukan registrasi atau belum
    async verifyUserCredential(username, password) {
        const order = {
            text: "SELECT id, password FROM users WHERE username = $1",
            values: [username],
        };
        const result = await this._pool.query(order);
        // jika user tidak ditemukan keluarkan error
        if (!result.rowCount) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah");
        }
        // cek jika password yang diberikan user sudah cocok
        const { id, password: hashPassword } = result.rows[0];
        const matchedPassword = await bcrypt.compare(password, hashPassword);
        // jika password tidak cocok keluarkan error
        if (!matchedPassword) {
            throw new AuthenticationError("Kredensial yang Anda berikan salah");
        }
        // return id user untuk pembuatan jwt token
        return id;
    }

    async addUser({ username, password, fullname }) {
        // verifikasi apakah username sudah digunakan
        await this.verifyNewUsername(username);
        const id = `user-${nanoid(16)}`;
        const hashPassword = await bcrypt.hash(password, 10);
        const order = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
            values: [id, username, hashPassword, fullname],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new InvariantError("User gagal ditambahkan");
        }
        return result.rows[0].id;
    }
}

module.exports = UsersService;
