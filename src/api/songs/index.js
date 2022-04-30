const SongsHandler = require("./handler");
const routes = require("./routes");

// membuat sebuah plugin albums yang menerima parameter service dan validator sehingga terhubung dengan SongsHandler
module.exports = {
    name: "songs",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const songsHandler = new SongsHandler(service, validator);
        // mengaplikasikan perutean
        server.route(routes(songsHandler));
    },
};
