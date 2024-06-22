import nodemailer, { Transporter } from 'nodemailer';
import Config from '../config';

// Define the interface for the email options
interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

// Define the EmailSender class
export default class EmailSender {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: Config.GMAIL_NAME,
                pass: Config.GMAIL_PASSWORD,
            },
        });
    }

    // Method to send the email
    async send(options: EmailOptions): Promise<void> {
        const mailOptions = {
            from: 'ITSA DEMO <itsahackathon3@gmail.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: '',
        };

        await this.transporter.sendMail(mailOptions);
    }
}
