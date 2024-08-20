const nodemailer = require('nodemailer');
const newAccountTemplate = require('./templates/new-account.template');

const config = {
    user: 'info@awwaltech.com',
    pass: 'ckitmjqkovnthass'
};

const sendEmail = (user) => {
    console.time('mailer execution')
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: config
    })
    // Email
    let message = {
        from: 'mohd.fareed1122@gmail.com',
        to: user.email,
        subject: 'Time Tracking Login Credentails',
        html: newAccountTemplate(user),
    }
    // Sending Email
    transporter.sendMail(message, (error, response) => {

        if (error) {
            console.log(error)
            console.timeEnd('mailer execution')
        }
        else {
            console.log(`Email send. id${response.messageId}`)
            console.timeEnd('mailer execution')
        }
    })
}

module.exports = sendEmail;