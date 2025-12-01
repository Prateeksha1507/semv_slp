import mg from "./mailgun.js";
import Borrow from "../models/Borrow.js";

export async function sendReturnReminders() {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + 1); // remind 1 day before

  const booksToReturn = await Borrow.find({
    dueDate: {
      $gte: today,
      $lte: targetDate,
    },
    returned: false,
  }).populate("borrower", "email name");

  for (const record of booksToReturn) {
    const email = record.borrower.email;
    const name = record.borrower.name;

    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "Library <mailgun@" + process.env.MAILGUN_DOMAIN + ">",
      to: email,
      subject: "Return Reminder",
      text: `Hello ${name},\n\nReminder to return your borrowed book by tomorrow.\n\nThank you.`,
    });
  }

  console.log("Return reminders sent!");
}
