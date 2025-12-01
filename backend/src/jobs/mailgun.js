import mailgun from "mailgun-js";

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

await mg.messages().send({
  from: process.env.MAILGUN_FROM_EMAIL,
  to: email,
  subject: "Verify your email",
  text: `Your OTP is: ${otpCode}. It expires in 10 minutes.`,
});
