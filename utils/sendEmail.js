// utils/sendVerificationEmail.js
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, uniqueString) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
  const verificationLink = `${frontendUrl}/verify/${uniqueString}`;
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Email Verification",
    html: `<p>Please verify your email by clicking the link: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
