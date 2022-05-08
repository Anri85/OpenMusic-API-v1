const ClientError = require("../../exceptions/ClientError");

// kelas ini hanya menangani request dan response terhadap client tanpa menangani pengolahan data albums (CRUD)
class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.addAlbumHandler = this.addAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.updateAlbumByIdHandler = this.updateAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
        this.likeUnlikeAlbumhandler = this.likeUnlikeAlbumhandler.bind(this);
        this.getAlbumLikeCountHandler = this.getAlbumLikeCountHandler.bind(this);
    }

    async likeUnlikeAlbumhandler(request, h) {
        try {
            const { id: albumId } = request.params;
            const { id: userId } = request.auth.credentials;
            await this._service.getAlbums(albumId);
            await this._service.likeUnlikeAlbum(albumId, userId);
            const response = h.response({
                status: "success",
                message: "Like/Unlike successfull",
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

    async getAlbumLikeCountHandler(request, h) {
        try {
            const { id: albumId } = request.params;
            const { likeCount, isFromCache } = await this._service.getAlbumLikeCount(albumId);
            const response = h.response({
                status: "success",
                data: {
                    likes: likeCount,
                },
            });
            response.code(200);
            if (isFromCache) {
                return response.header("X-Data-Source", "cache");
            }
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

    async addAlbumHandler(request, h) {
        try {
            // melakukan validasi data dengan validateAlbumPayload (this._validator)
            this._validator.validateAlbumPayload(request.payload);
            // mengambil semua request yang dikirimkan
            const { name, year } = request.payload;
            // memanggil class AlbumsService (diinisialisasikan kedalam this._service) dengan fungsi addAlbum (akan mengembalikan album_id)
            const { albumId } = await this._service.addAlbum({ name, year, cover_url: null });
            const response = h.response({
                status: "success",
                data: {
                    albumId,
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

    async getAlbumsHandler(request, h) {
        // mengambil id album
        const { id } = request.params;
        // jika terdapat id  maka respon harus mengembalikan hanya satu album
        if (id) {
            try {
                // memanggil class AlbumsService (diinisialisasikan kedalam this._service) dengan fungsi getAlbums (dapat sebuah album)
                const result = await this._service.getAlbums(id);
                const response = h.response({
                    status: "success",
                    data: {
                        album: result,
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
            // jika tidak terdapat id maka respon harus mengembalikan semua album
            const albums = await this._service.getAlbums();
            const response = h.response({
                status: "success",
                data: {
                    albums,
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

    async updateAlbumByIdHandler(request, h) {
        try {
            // melakukan validasi data dengan validateAlbumPayload (this._validator)
            this._validator.validateAlbumPayload(request.payload);
            // mengambil id album
            const { id } = request.params;
            // mengambil data album baru yang dikirimkan
            const { name, year } = request.payload;
            // memanggil class AlbumsService (diinisialisasikan kedalam this._service) dengan fungsi updateAlbumById
            await this._service.updateAlbumById(id, { name, year });
            const response = h.response({
                status: "success",
                message: "Album berhasil diperbarui",
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

    async deleteAlbumByIdHandler(request, h) {
        try {
            // mengambil id album
            const { id } = request.params;
            // memanggil class AlbumsService (diinisialisasikan kedalam this._service) dengan fungsi deleteAlbumById
            await this._service.deleteAlbumById(id);
            const response = h.response({
                status: "success",
                message: "Album berhasil dihapus",
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

module.exports = AlbumsHandler;
