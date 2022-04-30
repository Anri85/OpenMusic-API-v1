const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { albumMapper } = require("./utility/albumMapper");

// membuat kelas untuk mengelola resource albums (CRUD)
class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    // fungsi menambahkan album
    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        // merancang perintah query
        const order = {
            text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
            values: [id, name, year],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rows[0].id) {
            throw new InvariantError("Album gagal ditambahkan");
        }
        return { albumId: result.rows[0].id };
    }

    // fungsi mengambil data albums
    async getAlbums(id) {
        // jika terdapat query parameter id dalam url, maka ambil data album berdasarkan id
        if (id) {
            // merancang perintah query
            const order1 = {
                text: "SELECT id, name, year FROM albums WHERE id = $1",
                values: [id],
            };
            const order2 = {
                text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
                values: [id],
            };
            // mengeksekusi query
            const album = await this._pool.query(order1);
            const songs = await this._pool.query(order2);
            const data = album.rows.map(albumMapper)[0];
            if (!album.rowCount) {
                throw new NotFoundError("Album tidak ditemukan");
            }
            return { ...data, songs: songs.rows };
        }
        // jika tidak ada query parameter id dalam url, maka ambil semua data album
        const result = await this._pool.query("SELECT id, name, year FROM albums");
        return result.rows;
    }

    // fungsi update data album berdasarkan id
    async updateAlbumById(id, { name, year }) {
        // merancang perintah query
        const order = {
            text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
            values: [name, year, id],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
        }
    }

    // fungsi delete data album berdasarkan id
    async deleteAlbumById(id) {
        // merancang query
        const order = {
            text: "DELETE FROM albums WHERE id = $1 RETURNING id",
            values: [id],
        };
        // mengeksekusi query
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal menghapus album. Id tidak ditemukan");
        }
    }
}

module.exports = AlbumsService;
