require("dotenv").config();

const amqp = require("amqplib");

const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");
const Listener = require("./Listener");

const init = async () => {
    const playlistsService = new PlaylistsService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistsService, mailSender);

    // buat koneksi kedalam rabbitmq
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    // buat channel
    const channel = await connection.createChannel();
    // cek jika queue yang dikirimkan oleh producer telah tersedia (export:notes)
    channel.assertQueue("export:playlist", { durable: true });
    // kemudian konsumsi queue
    channel.consume("export:playlist", listener.listen, { noAck: true });
};

init();
