const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    
    async sendActivationMail(to, data) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on a test application',
            text: '',
            html:
                `
                    <div>
                        <p><strong>Your user name: ${data.username}</strong></p>
                        <p><strong>Your user email: ${data.email}</strong></p>
                        <p><strong>Your user name: ${data.password}</strong></p>
                        <h2>To activate account follow the link</h2>
                        <a href="${data.link}">${data.link}</a>
                    </div>
                `
        })
    }
    async sendActivationCode(to, code) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation code on a test application',
            text: '',
            html:
                `
                    <div>
                        <h1>Enter code to activate: <strong>${code}</strong></h1>
                    </div>
                `
        })
    }
}

module.exports = new MailService();
