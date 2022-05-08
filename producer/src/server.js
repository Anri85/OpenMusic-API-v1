require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const path = require("path");
const TokenManager = require("./tokenize/TokenManager");

// albums
const albums = require("./api/albums");
const AlbumsService = require("./services/AlbumsService");
const AlbumsValidator = require("./validator/albums/index");

// songs
const songs = require("./api/songs");
const SongsService = require("./services/SongsService");
const SongsValidator = require("./validator/songs/index");

// users
const users = require("./api/users");
const UsersService = require("./services/UsersService");
const UsersValidator = require("./validator/users/index");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications/index");

// playlists
const playlists = require("./api/playlists");
const PlaylistsService = require("./services/PlaylistsService");
const PlaylistsValidator = require("./validator/playlists/index");
const PlaylistSongsValidator = require("./validator/playlist_songs/index");

// exports
const _exports = require("./api/exports");
const ProducersService = require("./services/message_broker/ProducersService");
const ExportsValidator = require("./validator/exports/index");

// uploads
const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads/index");

// cache
const CacheService = require("./services/cache/CacheService");

const init = async () => {
    const cacheService = new CacheService();

    const albumsService = new AlbumsService(cacheService);
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsSevice = new PlaylistsService();
    const storageService = new StorageService(path.resolve(__dirname, "api/uploads/file/images"));

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // registrasi plugin eksternal (bawaan @hapi/jwt) untuk mempermudah proses autentikasi (jwt)
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt berdasarkan plugin yang didaftarkan diatas (plugin jwt)
    server.auth.strategy("openmusic_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    // menerapkan plugin albums dan songs
    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                playlistsSevice,
                songsService,
                PlaylistsValidator,
                PlaylistSongsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                producersService: ProducersService,
                playlistsSevice,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                storageService,
                albumsService,
                validator: UploadsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
