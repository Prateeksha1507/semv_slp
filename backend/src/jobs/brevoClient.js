import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const EMAIL_FROM_EMAIL = process.env.EMAIL_FROM_EMAIL;
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME;

if (!BREVO_API_KEY) {
  console.warn("⚠ BREVO_API_KEY (Brevo API key) is not set");
}

export async function sendEmail({ to, subject, text, html }) {
  const payload = {
    "sender":{"email":EMAIL_FROM_EMAIL,"name":EMAIL_FROM_NAME},
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent: html,
  };

  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error(
      "Error sending email via Brevo API:",
      err.response?.data || err.message
    );
    throw err;
  }
}
