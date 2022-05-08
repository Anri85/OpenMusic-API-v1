const routes = (handler) => [
    {
        // membuat playlist
        method: "POST",
        path: "/playlists",
        handler: handler.postPlaylistHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        // menambahkan lagu kedalam playlist
        method: "POST",
        path: "/playlists/{id}/songs",
        handler: handler.postSongIntoPlaylistHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        // mendapatkan semua playlist
        method: "GET",
        path: "/playlists",
        handler: handler.getPlaylistsHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        // mendapatkan semua lagu dalam playlist
        method: "GET",
        path: "/playlists/{id}/songs",
        handler: handler.getSongsInsidePlaylistHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        // menghapus playlist
        method: "DELETE",
        path: "/playlists/{id}",
        handler: handler.deletePlaylistHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
    {
        // menghapus lagu dalam playlist
        method: "DELETE",
        path: "/playlists/{id}/songs",
        handler: handler.deleteSongInsidePlaylistHandler,
        options: {
            auth: "openmusic_jwt",
        },
    },
];

module.exports = routes;
