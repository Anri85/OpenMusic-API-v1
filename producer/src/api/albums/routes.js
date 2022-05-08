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
    {
        method: "POST",
        path: "/albums/{id}/likes",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.likeUnlikeAlbumhandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        method: "GET",
        path: "/albums/{id}/likes",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.getAlbumLikeCountHandler,
    },
];

module.exports = routes;
