const sendEmail = require("./sendEmail");

const sendResetPassword = async ({ name, email, token, origin }) => {
  const resetEmail = `${origin}user/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link:  <a href="${resetEmail}">Reset Password</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4> ${message}`,
  });
};

module.exports = sendResetPassword;
