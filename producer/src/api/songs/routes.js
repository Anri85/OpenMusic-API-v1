// fungsi route menerima parameter handler (albumsHandler)
const routes = (handler) => [
    {
        method: "POST",
        path: "/songs",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.addSongHandler,
    },
    {
        method: "GET",
        path: "/songs/{id?}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.getSongsHandler,
    },
    {
        method: "PUT",
        path: "/songs/{id}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.updateSongByIdHandler,
    },
    {
        method: "DELETE",
        path: "/songs/{id}",
        // baris dibawah merujuk pada fungsi-fungsi yang ada pada handler (albumsHandler)
        handler: handler.deleteSongByIdHandler,
    },
];

module.exports = routes;
