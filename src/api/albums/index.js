const AlbumsHandler = require("./handler");
const routes = require("./routes");

// membuat sebuah plugin albums yang menerima parameter service dan validator sehingga terhubung dengan AlbumsHandler
module.exports = {
    name: "albums",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const albumsHandler = new AlbumsHandler(service, validator);
        // mengaplikasikan perutean
        server.route(routes(albumsHandler));
    },
};
