const ClientError = require("../../exceptions/ClientError");

// kelas ini hanya menangani request dan response terhadap client tanpa menangani pengolahan data songs (CRUD)
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.addSongHandler = this.addSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.updateSongByIdHandler = this.updateSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async addSongHandler(request, h) {
        try {
            // melakukan validasi data dengan validateSongPayload (this._validator)
            this._validator.validateSongPayload(request.payload);
            // memanggil class SongsService (diinisialisasikan kedalam this._service) dengan fungsi addSong (akan mengembalikan songId)
            const { songId } = await this._service.addSong(request.payload);
            const response = h.response({
                status: "success",
                data: {
                    songId,
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

    async getSongsHandler(request, h) {
        // mengambil id song
        const { id } = request.params;
        // mengambil query parameter
        const { title, performer } = request.query;
        // jika terdapat id maka respon harus mengembalikan hanya satu song (query parameter sebagai objek kosong)
        if (id) {
            try {
                // memanggil class SongsService (diinisialisasikan kedalam this._service) dengan fungsi getSongs (dapat sebuah song)
                const song = await this._service.getSongs(id, {});
                const response = h.response({
                    status: "success",
                    data: {
                        song,
                    },
                });
                response.code(200);
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
        try {
            // jika tidak terdapat id (null) maka respon harus mengembalikan semua song atau songs berdasarkan query parameter (title, performer)
            const songs = await this._service.getSongs(null, { title, performer });
            const response = h.response({
                status: "success",
                data: {
                    songs,
                },
            });
            response.code(200);
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

    async updateSongByIdHandler(request, h) {
        try {
            // melakukan validasi data dengan validateSongPayload (this._validator)
            this._validator.validateSongPayload(request.payload);
            // mengambil id song
            const { id } = request.params;
            // mengambil data note baru yang dikirimkan
            const { title, year, genre, performer, duration = null, albumId = null } = request.payload;
            // memanggil class SongsService (diinisialisasikan kedalam this._service) dengan fungsi updateSongById
            await this._service.updateSongById(id, { title, year, genre, performer, duration, albumId });
            const response = h.response({
                status: "success",
                message: "Song berhasil diperbarui",
            });
            response.code(200);
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

    async deleteSongByIdHandler(request, h) {
        try {
            // mengambil id song
            const { id } = request.params;
            // memanggil class SongsService (diinisialisasikan kedalam this._service) dengan fungsi deleteSongById
            await this._service.deleteSongById(id);
            const response = h.response({
                status: "success",
                message: "Song berhasil dihapus",
            });
            response.code(200);
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
}

module.exports = SongsHandler;
