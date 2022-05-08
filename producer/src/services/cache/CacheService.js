const redis = require("redis");

class CacheService {
    constructor() {
        // membuat client redis
        this._client = redis.createClient({
            socket: {
                host: process.env.REDIS_SERVER,
            },
        });
        // pengecekan jika terjadi error pada redis
        this._client.on("error", (error) => {
            console.log(error);
        });
        // megkoneksikan redis
        this._client.connect();
    }

    // fungsi menympan data kedalam redis
    async set(key, value, expirationInSecond = 1800) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    // fungsi mendapatkan data dalam redis
    async get(key) {
        // cari data berdasarkan keynya
        const result = await this._client.get(key);
        if (result === null) {
            throw new Error("Cache tidak ditemukan");
        }
        return parseInt(result);
    }

    // fungsi hapus data didalam redis
    async del(key) {
        return this._client.del(key);
    }
}

module.exports = CacheService;
