// fungsi route menerima parameter handler (albumsHandler)
const routes = (handler) => [
    {
        method: "POST",
        path: "/albums",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.addAlbumHandler,
    },
    {
        method: "GET",
        path: "/albums/{id?}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.getAlbumsHandler,
    },
    {
        method: "PUT",
        path: "/albums/{id}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.updateAlbumByIdHandler,
    },
    {
        method: "DELETE",
        path: "/albums/{id}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.deleteAlbumByIdHandler,
    },
];

module.exports = routes;
