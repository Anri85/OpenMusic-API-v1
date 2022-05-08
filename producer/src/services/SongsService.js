const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    // fungsi menambahkan song
    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = `song-${nanoid(16)}`;
        const album_id = albumId;
        // merancang perintah query
        const order = {
            text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
            values: [id, title, year, genre, performer, duration, album_id],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rows[0].id) {
            throw new InvariantError("Song gagal ditambahkan");
        }
        return { songId: result.rows[0].id };
    }

    // fungsi mengambil data songs
    async getSongs(id, { title, performer }) {
        // jika terdapat query parameter id dalam url, maka ambil data song berdasarkan id
        if (id) {
            // merancang perintah query
            const order = {
                text: 'SELECT id, title, year, genre, performer, "duration", "album_id" FROM songs WHERE id = $1',
                values: [id],
            };
            // mengeksekusi query
            const result = await this._pool.query(order);
            if (!result.rowCount) {
                throw new NotFoundError("Song tidak ditemukan");
            }
            return result.rows[0];
        }
        // jika terdapat query parameter title atau query parameter performance
        if (title && performer) {
            const result = await this._pool.query(`SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' AND lower(performer) LIKE '%${performer}%'`);
            return result.rows;
        }
        if (title || performer) {
            const result = await this._pool.query(`SELECT id, title, performer FROM songs WHERE lower(title) LIKE '%${title}%' OR lower(performer) LIKE '%${performer}%'`);
            return result.rows;
        }
        // jika tidak ada query parameter dalam url, maka ambil semua data song
        const result = await this._pool.query("SELECT id, title, performer FROM songs");
        return result.rows;
    }

    // fungsi update data album berdasarkan id
    async updateSongById(id, { title, year, genre, performer, duration, albumId }) {
        const album_id = albumId;
        // merancang perintah query
        const order = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "album_id" = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, album_id, id],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbarui song. Id tidak ditemukan");
        }
    }

    // fungsi delete data album berdasarkan id
    async deleteSongById(id) {
        // merancang query
        const order = {
            text: "DELETE FROM songs WHERE id = $1 RETURNING id",
            values: [id],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal menghapus song. Id tidak ditemukan");
        }
    }
}

module.exports = SongsService;
