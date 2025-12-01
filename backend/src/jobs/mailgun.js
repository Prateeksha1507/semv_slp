import mailgun from "mailgun-js";
import FormData from "form-data";

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  formData
});

export default mg;
