const ClientError = require("../../exceptions/ClientError");

class ExportsHandler {
    constructor(producersService, playlistsService, validator) {
        this._producersService = producersService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.exportPlaylistHandler = this.exportPlaylistHandler.bind(this);
    }

    async exportPlaylistHandler(request, h) {
        try {
            this._validator.validateExportPlaylistsPayload(request.payload);
            const { playlistId: playlist_id } = request.params;
            // mengambil data user yang sedang login
            const { id: credentialId } = request.auth.credentials;
            // verifikasi jika playlist adalah milik user itu sendiri
            await this._playlistsService.verifyPlaylistOwner(playlist_id, credentialId);
            // siapkan message yang akan diekspor pada rabbitmq
            const message = {
                playlist_id,
                targetEmail: request.payload.targetEmail,
            };
            await this._producersService.sendMessage("export:playlist", JSON.stringify(message));
            const response = h.response({
                status: "success",
                message: "Permintaan Anda dalam antrean",
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

module.exports = ExportsHandler;
