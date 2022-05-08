const { Pool } = require("pg");
const { mapper } = require("./utility/mapper");

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getSongsInsidePlaylist(playlist_id) {
        // merancang perintah query
        const order = {
            text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
                JOIN songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1`,
            values: [playlist_id],
        };
        const result = await this._pool.query(order);
        return result.rows;
    }

    async getPlaylist(playlist_id) {
        // merancang perintah query
        const order = {
            text: "SELECT id, name FROM playlists WHERE id = $1",
            values: [playlist_id],
        };
        const result = await this._pool.query(order);
        return result.rows[0];
    }
}

module.exports = PlaylistsService;
