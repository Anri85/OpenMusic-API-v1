const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
        this._authenticationsService = authenticationsService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
        this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
        this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    }

    // ketika user login
    async postAuthenticationHandler(request, h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload);
            // ambil data request.payload
            const { username, password } = request.payload;
            // verifikasi status regustrasi user
            const id = await this._usersService.verifyUserCredential(username, password);
            // kemudian buat accessToken dan refreshToken
            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id });
            // simpan refresh token kedalam database untuk penggunaan lebih lanjut
            await this._authenticationsService.addRefreshToken(refreshToken);
            const response = h.response({
                status: "success",
                message: "Authentication berhasil ditambahkan",
                data: {
                    accessToken,
                    refreshToken,
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

    // ketika user merefresh access token mereka
    async putAuthenticationHandler(request, h) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);
            // ambil data payload
            const { refreshToken } = request.payload;
            // verifikasi apakah refresh token (request.payload) tersimpan dalam database
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            // decode refresh token (request.payload) sehingga menghasilkan id user
            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
            // buat access token yang baru berdasarkan id user yang barusan didapatkan
            const accessToken = this._tokenManager.generateAccessToken({ id });
            return {
                status: "success",
                message: "Access Token berhasil diperbarui",
                data: {
                    accessToken,
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

    // ketika user logout
    async deleteAuthenticationHandler(request, h) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);
            // ambil data request.payload
            const { refreshToken } = request.payload;
            // verifikasi apakah refresh token (request.payload) tersimpan dalam database
            await this._authenticationsService.verifyRefreshToken(refreshToken);
            // jika refresh token (request.payload) tersedia hapus refresh token pada database
            await this._authenticationsService.deleteRefreshToken(refreshToken);
            return {
                status: "success",
                message: "Refresh token berhasil dihapus",
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

module.exports = AuthenticationsHandler;
