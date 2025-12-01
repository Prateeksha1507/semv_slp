import cron from "node-cron";
import Borrow from "../models/Borrow.js";
import mg from "./mailgun.js";

// Run everyday at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("📬 Running Return Reminder Job...");

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = new Date(tomorrow);
    start.setHours(0, 0, 0, 0);

    const end = new Date(tomorrow);
    end.setHours(23, 59, 59, 999);

    const borrows = await Borrow.find({
      returnDate: { $gte: start, $lte: end },
      status: "borrowed",
      reminderSent: false,
    }).populate("borrower book");

    console.log(`Found ${borrows.length} reminders to send`);

    for (const b of borrows) {
      if (!b.borrower?.email) continue;

      const emailData = {
        from: process.env.MAILGUN_FROM,
        to: b.borrower.email,
        subject: `📕 Return Reminder: ${b.book.title}`,
        text: `Hello ${b.borrower.name},

This is a reminder that your borrowed book:

"${b.book.title}"

is due tomorrow on ${b.returnDate.toDateString()}.

Please return it on time to avoid penalties.

Library Admin`
      };

      await mg.messages().send(emailData);

      b.reminderSent = true;
      await b.save();

      console.log("Reminder sent to:", b.borrower.email);
    }

  } catch (error) {
    console.error("Error in Reminder Job:", error.message);
  }
});

console.log("Return Reminder Cron Job Scheduled.");
