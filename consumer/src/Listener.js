class Listener {
    constructor(playlistsService, mailSender) {
        this._playlistsService = playlistsService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    // fungsi yang memeriksa apakah ada queue baru pada message broker
    async listen(message) {
        try {
            // ambil data queue message (berisi userId dan targetEmail) yang dikirimkan oleh producer
            const { playlist_id, targetEmail } = JSON.parse(message.content.toString());
            // cari songs berdasarkan playlist id
            const songs = await this._playlistsService.getSongsInsidePlaylist(playlist_id);
            // cari playlist berdasarkan id
            const playlist = await this._playlistsService.getPlaylist(playlist_id);
            const playlistData = {
                playlist: {
                    id: playlist.id,
                    name: playlist.name,
                    songs,
                },
            };
            console.log(playlistData);
            // kirim playlist kepada email target
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistData));
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Listener;
