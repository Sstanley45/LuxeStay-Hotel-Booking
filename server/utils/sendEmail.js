const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");
const Mailgen = require("mailgen");

//refactor the send email fxn to use it multiple times

//testing with ethereal

// const sendEmail = async ({to, subject, html}) => {
//     const transporter = nodemailer.createTransport(nodemailerConfig);

//      return transporter.sendMail({
//        from: '"Lucky Devs : " <lucky@dev.com>', // sender address
//        to,subject, html
//      });
// }

//send email using gmail
const sendEmail = async ({ to, subject, message, name }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Yelnats-Tech",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name,
      intro: "follow instruction below",
      table: {
        data: [
          {
            message,
          },
        ],
      },
      outro: "subscribe to our news letter",
    },
  };

  let mail = MailGenerator.generate(response);

  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    html: mail,
  });
};

module.exports = sendEmail;
