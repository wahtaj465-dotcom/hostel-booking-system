const nodemailer = require("nodemailer");
const { getUserEmailById } = require("./user.service");
const { buildEmailContent } = require("../utils/booking-email-content.util");
const { buildOtpEmailContent } = require("../utils/otp-email-content.util");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.BREVO_SMTP_HOST;
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;

  if (!host || !user || !pass) {
    console.log("Brevo SMTP env vars missing. Check BREVO_SMTP_HOST/USER/PASS.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // STARTTLS on 587
    auth: { user, pass },
  });

  return transporter;
}

const sendEmailMessage = async ({ toEmail, subject, text, html, eventData }) => {
  if (process.env.MAIL_ENABLED === "false") return;

  if (!toEmail) {
    console.log("No recipient email found for event. Skipping email.", eventData);
    return;
  }

  const tx = getTransporter();
  if (!tx) return;

  const fromName = process.env.MAIL_FROM_NAME || "Hostel Booking System";
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  if (!fromEmail) {
    console.log("MAIL_FROM_EMAIL missing in env.");
    return;
  }

  const info = await tx.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject,
    text,
    html,
  });

  console.log("✅ Email sent:", info.messageId, "to:", toEmail);
};

const sendEmail = async (bookingData) => {
  try {
    // Determine recipient:
    // Prefer explicit userEmail if event includes it, otherwise fetch from user-service.
    let toEmail = bookingData.userEmail || null;

    if (!toEmail && bookingData.userId) {
      toEmail = await getUserEmailById(bookingData.userId);
    }

    const { subject, text, html } = buildEmailContent(bookingData);

    await sendEmailMessage({ toEmail, subject, text, html, eventData: bookingData });
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

const sendOtpEmail = async (authData) => {
  try {
    const { subject, text, html } = buildOtpEmailContent(authData);

    await sendEmailMessage({
      toEmail: authData.userEmail,
      subject,
      text,
      html,
      eventData: authData,
    });
  } catch (err) {
    console.error("❌ OTP email send failed:", err.message);
  }
};

module.exports = { sendEmail, sendOtpEmail };