const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const AuthorizationError = require("../exceptions/AuthorizationError");
const NotFoundError = require("../exceptions/NotFoundError");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    // memverifikasi kesesuaian playlist dengan ownernya (user yang sedang login)
    async verifyPlaylistOwner(id, credentialId) {
        // meracang perintah query
        const query = {
            text: "SELECT * FROM playlists WHERE id = $1",
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError("Playlist tidak ditemukan");
        }
        // periksa kecocokan owner
        const playlist = result.rows[0];
        if (playlist.owner !== credentialId) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;
        // merancang perintah query
        const query = {
            text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
            values: [id, name, owner],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError("Playlist gagal ditambahkan");
        }
        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        // merancang perintah query (join table dengan tabel users berdasarkan kesesuaian playlists.owner dengan users.id atau forgeinKey)
        const order = {
            text: "SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner=users.id WHERE playlists.owner = $1",
            values: [owner],
        };
        const result = await this._pool.query(order);
        return result.rows;
    }

    async deletePlaylistById(id) {
        // merancang perintah query
        const order = {
            text: "DELETE FROM playlists WHERE id = $1",
            values: [id],
        };
        await this._pool.query(order);
    }

    async addSongIntoPlaylist(playlistId, songId) {
        const id = `playlist-song-${nanoid(16)}`;
        // merancang perintah query
        const order = {
            text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
            values: [id, playlistId, songId],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new InvariantError("Song gagal ditambahkan kedalam playlist");
        }
    }

    async getSongInsidePlaylist(playlistId) {
        // merancang perintah query
        const order = {
            text: `SELECT playlists.*, songs.id AS songid, songs.title, songs.performer, users.username FROM playlists
                LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
                LEFT JOIN songs ON songs.id = playlist_songs.song_id
                LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1`,
            values: [playlistId],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Data tidak ditemukan");
        }
        const songs = result.rows.map((song) => ({
            id: song.songid,
            title: song.title,
            performer: song.performer,
        }));
        const data = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            username: result.rows[0].username,
            songs,
        };
        return data;
    }

    async deleteSongInsidePlaylist(playlistId, songId) {
        // merancang perintah query
        const order = {
            text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2  RETURNING id",
            values: [playlistId, songId],
        };
        const result = await this._pool.query(order);
        if (!result.rowCount) {
            throw new NotFoundError("Gagal menghapus song");
        }
    }
}

module.exports = PlaylistsService;
