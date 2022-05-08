const nodemailer = require("nodemailer");

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        this.sendEmail = this.sendEmail.bind(this);
    }

    sendEmail(targetEmail, content) {
        // buat objek message
        const message = {
            from: "Open Music API",
            to: targetEmail,
            subject: "Export your playlist",
            text: "Terlampir hasil dari ekspor playlist",
            attachments: [
                {
                    filename: "playlist.json",
                    content,
                },
            ],
        };
        // kirim objek message
        return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;
