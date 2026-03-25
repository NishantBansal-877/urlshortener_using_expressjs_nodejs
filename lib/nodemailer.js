import nodemailer from "nodemailer";

// 1. Create fake account
let testAccount = await nodemailer.createTestAccount();

// 2. Create transporter using ethereal email and pass
let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "ned.nienow27@ethereal.email",
    pass: "6E7fy8Wvgj17SbSRb2",
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: `"URL SHORTENER" <${testAccount.user}>`,
    to,
    subject,
    html,
  });
  const testEmailURL = nodemailer.getTestMessageUrl(info);
  console.log("Verify Email:", testEmailURL);
};
