const fs = require("fs");
const path = require("path");

class StorageService {
    constructor(folder) {
        this._folder = folder;

        // buat fungsi pengecekan jika folder tersedia
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    // fungsi yang memproses file
    writeFile(file, meta) {
        // buat nama file (gabungan dari dateTime dan nama file)
        const filename = +new Date() + meta.filename;
        // tentukan lokasi file disimpan
        const path = `${this._folder}/${filename}`;
        // buat stream dari file berdasarkan path yang dibuat
        const fileStream = fs.createWriteStream(path);
        // atur fungsi ini agar mengembalikan sebuah promise
        return new Promise((resolve, reject) => {
            // saat terjadi error maka reject error tersebut
            fileStream.on("error", (error) => reject(error));
            // jika tidak ada error maka resolve fileStream yang dibuat sebelumnya
            file.pipe(fileStream);
            file.on("end", () => resolve(filename));
        });
    }
}

module.exports = StorageService;
