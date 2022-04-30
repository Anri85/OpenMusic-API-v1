// kelas ini hanya menangani request dan response terhadap client tanpa menangani pengolahan data albums (CRUD)
class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.addAlbumHandler = this.addAlbumHandler.bind(this);
        this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
        this.updateAlbumByIdHandler = this.updateAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }

    async addAlbumHandler(request, h) {
        // melakukan validasi data dengan validateAlbumPayload (this._validator)
        this._validator.validateAlbumPayload(request.payload);
        // mengambil semua request yang dikirimkan
        const { name, year } = request.payload;
        // memanggil class AlbumsService (diinisialisasikan kedalam this._service) dengan fungsi addAlbum (akan mengembalikan albumId)
        const { albumId } = await this._service.addAlbum({ name, year });
        const response = h.response({
            status: "success",
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumsHandler(request, h) {
        // mengambil id album
        const { id } = request.params;
        // jika terdapat id  maka respon harus mengembalikan hanya satu album
        if (id) {
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
        }
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
    }

    async updateAlbumByIdHandler(request, h) {
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
    }

    async deleteAlbumByIdHandler(request, h) {
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
    }
}

module.exports = AlbumsHandler;
