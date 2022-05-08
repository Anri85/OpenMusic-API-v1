const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler {
    constructor(playlistsService, songsService, playlistsValidator, PlaylistSongsValidator) {
        this._playlistsService = playlistsService;
        this._songsService = songsService;
        this._playlistsValidator = playlistsValidator;
        this._playlistSongsValidator = PlaylistSongsValidator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.postSongIntoPlaylistHandler = this.postSongIntoPlaylistHandler.bind(this);
        this.getSongsInsidePlaylistHandler = this.getSongsInsidePlaylistHandler.bind(this);
        this.deleteSongInsidePlaylistHandler = this.deleteSongInsidePlaylistHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistPayload(request.payload);
            // mengabil data payload
            const { name } = request.payload;
            // mengambil data user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // membuat playlist kedalam database
            const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });
            const response = h.response({
                status: "success",
                message: "Playlist berhasil ditambahkan",
                data: {
                    playlistId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistsHandler(request, h) {
        try {
            // ambil data id user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // ambil playlists berdasarkan id user yang sedang login
            const playlists = await this._playlistsService.getPlaylists(credentialId);
            return {
                status: "success",
                data: {
                    playlists,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deletePlaylistHandler(request, h) {
        try {
            // ambil data id playlist
            const { id } = request.params;
            // ambil data user id yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // verifikasi jika playlist adalah milik user itu sendiri
            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            // jika terverifikasi lakukan penghapusan playlist
            await this._playlistsService.deletePlaylistById(id);
            return {
                status: "success",
                message: "Playlist berhasil dihapus",
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async postSongIntoPlaylistHandler(request, h) {
        try {
            this._playlistSongsValidator.validatePlaylistSongsPayload(request.payload);
            // mengambil data id playlist
            const { id } = request.params;
            // mengambil data id song
            const { songId } = request.payload;
            // mengambil data user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // verifikasi jika playlist adalah milik user itu sendiri
            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            // cek jika song tersedia dalam database berdasarkan songId
            await this._songsService.getSongs(songId, {});
            // selanjutnya masukan song kedalam playlist
            await this._playlistsService.addSongIntoPlaylist(id, songId);
            const response = h.response({
                status: "success",
                message: "Song berhasil ditambahkan kedalam playlist",
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getSongsInsidePlaylistHandler(request, h) {
        try {
            // mengambil data id playlist
            const { id } = request.params;
            // mengambil data user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // verifikasi jika playlist adalah milik user itu sendiri
            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            // kemudian ambil semua data song yang berada dalam playlist tersebut
            const result = await this._playlistsService.getSongInsidePlaylist(id);
            return {
                status: "success",
                data: {
                    playlist: result,
                },
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deleteSongInsidePlaylistHandler(request, h) {
        try {
            this._playlistSongsValidator.validatePlaylistSongsPayload(request.payload);
            // mengambil data id playlist
            const { id } = request.params;
            // mengambil id song
            const { songId } = request.payload;
            // mengambil data user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // verifikasi jika playlist adalah milik user itu sendiri
            await this._playlistsService.verifyPlaylistOwner(id, credentialId);
            // kemudian ambil semua data song yang berada dalam playlist tersebut
            await this._playlistsService.deleteSongInsidePlaylist(id, songId);
            return {
                status: "success",
                message: "Song berhasil dihapus pada playlist",
            };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: "fail",
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            // Server ERROR!
            const response = h.response({
                status: "error",
                message: "Maaf, terjadi kegagalan pada server kami.",
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistsHandler;
