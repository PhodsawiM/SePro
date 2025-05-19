// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "taoism.3214steam1331@gmail.com",
    pass: "3214",
  },
});

function sendMail(to, subject, message) {
  const mailOptions = {
    from: "taoism.3214steam1331@gmail.com",
    to,
    subject,
    text: message,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
