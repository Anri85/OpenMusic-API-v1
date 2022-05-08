const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { albumMapper } = require("./utility/albumMapper");
const { parse } = require("pg-protocol");

// membuat kelas untuk mengelola resource albums (CRUD)
class AlbumsService {
    constructor(cacheService) {
        this._cacheService = cacheService;
        this._pool = new Pool();
    }

    // fungsi mengecek apakah album memiliki cover atau tidak
    async addCoverAlbum(filename, id) {
        const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
        // merancang perintah query
        const order = {
            text: "UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id",
            values: [coverUrl, id],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal menambahkan cover album. Id tidak ditemukan");
        }
    }

    async likeUnlikeAlbum(albumId, userId) {
        const id = `like-${nanoid(16)}`;
        const order = {
            text: "SELECT * FROM user_album_likes WHERE album_id = $1",
            values: [albumId],
        };
        const likes = await this._pool.query(order);
        if (!likes.rowCount) {
            const order = {
                text: "INSERT INTO user_album_likes VALUES($1, $2, $3)",
                values: [id, userId, albumId],
            };
            await this._pool.query(order);
        }
        if (likes.rowCount) {
            const like = likes.rows.filter((like) => like.user_id === userId);
            if (!like.length) {
                const order = {
                    text: "INSERT INTO user_album_likes VALUES($1, $2, $3)",
                    values: [id, userId, albumId],
                };
                await this._pool.query(order);
            }
            if (like.length) {
                const order = {
                    text: "DELETE FROM user_album_likes WHERE user_id = $1",
                    values: [userId],
                };
                await this._pool.query(order);
            }
        }
        await this._cacheService.del(`albumLikes:${albumId}`);
    }

    async getAlbumLikeCount(albumId) {
        try {
            const result = await this._cacheService.get(`albumLikes:${albumId}`);
            const dataCache = JSON.parse(result);
            return { isFromCache: true, likeCount: dataCache };
        } catch (error) {
            const order = {
                text: "SELECT id FROM user_album_likes WHERE album_id = $1",
                values: [albumId],
            };
            const dataQuery = await this._pool.query(order);
            await this._cacheService.set(`albumLikes:${albumId}`, JSON.stringify(dataQuery.rowCount));
            return { isFromCache: false, likeCount: parseInt(dataQuery.rowCount) };
        }
    }

    // fungsi menambahkan album
    async addAlbum({ name, year, cover_url }) {
        const id = `album-${nanoid(16)}`;
        // merancang perintah query
        const order = {
            text: "INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id",
            values: [id, name, year, cover_url],
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
                text: "SELECT id, name, year, cover_url FROM albums WHERE id = $1",
                values: [id],
            };
            const order2 = {
                text: 'SELECT id, title, performer FROM songs WHERE "album_id" = $1',
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
