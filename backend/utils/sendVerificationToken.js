const sendEmail = require("./sendEmail");

const sendVerificationToken = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Please Confirm your email by clicking on the following link:<a href='${verifyEmail}'>Verify Email</a> </p>`;
  return sendEmail({
    to: email,
    subject: "email confirmation",
    name,
    message: message,
    //  html: `<h4>hello ${name}</h4>, ${message}`,
  });
};

module.exports = sendVerificationToken;
