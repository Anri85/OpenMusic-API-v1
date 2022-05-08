const ClientError = require("../../exceptions/ClientError");

class UploadsHandler {
    constructor(storageService, albumsService, validator) {
        this._storageService = storageService;
        this._albumsService = albumsService;
        this._validator = validator;

        this.coverUploadsHandler = this.coverUploadsHandler.bind(this);
    }

    async coverUploadsHandler(request, h) {
        try {
            // ambil data payload
            const { cover } = request.payload;
            // ambil id album
            const { id } = request.params;
            // validasi content type data payload yang berada pada headers
            this._validator.validateImageHeaders(cover.hapi.headers);
            // jika tervalidasi lanjutkan proses data gambar
            const filename = await this._storageService.writeFile(cover, cover.hapi);
            await this._albumsService.addCoverAlbum(filename, id);
            const response = h.response({
                status: "success",
                message: "Sampul berhasil diunggah",
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
}

module.exports = UploadsHandler;
