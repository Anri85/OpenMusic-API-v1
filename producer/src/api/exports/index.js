const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "exports",
    version: "1.0.0",
    register: async (server, { producersService, playlistsSevice, validator }) => {
        const exportsHandler = new ExportsHandler(producersService, playlistsSevice, validator);
        server.route(routes(exportsHandler));
    },
};
