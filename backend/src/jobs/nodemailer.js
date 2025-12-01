import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

transporter.verify((err, success) => {
  if (err) console.error("SMTP Verification Error:", err);
  else console.log("SMTP Verified:", success);
});

export default transporter;
