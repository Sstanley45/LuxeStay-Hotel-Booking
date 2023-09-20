const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig')


//refactor the send email fxn to use it multiple times

const sendEmail = async ({to, subject, html}) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    
     return transporter.sendMail({
       from: '"Lucky Devs : " <lucky@dev.com>', // sender address
       to,subject, html
     });

}

module.exports = sendEmail;


