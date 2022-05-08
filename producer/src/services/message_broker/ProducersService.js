const amqp = require("amqplib");

// producer merupakan instrumen yang mengirimkan pesan ke message broker queue(antrian)
const ProducersService = {
    sendMessage: async (queue, message) => {
        // buat koneksi dengan message broker rabbitmq
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        // buat channel baru
        const channel = await connection.createChannel();
        // hubungkan channel dan queue
        await channel.assertQueue(queue, { durable: true });
        // kirim pesan (buffer) kedalam queue yang ada dalam channel
        await channel.sendToQueue(queue, Buffer.from(message));
        // tutup koneksi 1 detik dari selesainya pengiriman pesan
        setTimeout(() => {
            connection.close();
        }, 1000);
    },
};

module.exports = ProducersService;
