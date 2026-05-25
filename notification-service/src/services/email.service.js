const nodemailer = require("nodemailer");
const { getUserEmailById } = require("./user.service");

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

function buildEmailContent(event) {
  const type = event.type;
  const bookingId = event.bookingId;
  const roomId = event.roomId;

  if (type === "BOOKING_CREATED") {
    return {
      subject: `Booking Confirmed (Booking ID: ${bookingId})`,
      text: `Your booking is confirmed.\nBooking ID: ${bookingId}\nRoom ID: ${roomId}\n`,
      html: `<h2>Booking Confirmed</h2>
             <p><b>Booking ID:</b> ${bookingId}</p>
             <p><b>Room ID:</b> ${roomId}</p>`,
    };
  }

  if (type === "BOOKING_CANCELLED") {
    return {
      subject: `Booking Cancelled (Booking ID: ${bookingId})`,
      text: `Your booking has been cancelled.\nBooking ID: ${bookingId}\nRoom ID: ${roomId}\n`,
      html: `<h2>Booking Cancelled</h2>
             <p><b>Booking ID:</b> ${bookingId}</p>
             <p><b>Room ID:</b> ${roomId}</p>`,
    };
  }

  return {
    subject: `Booking Update`,
    text: `Booking event received.`,
    html: `<p>Booking event received.</p>`,
  };
}

const sendEmail = async (bookingData) => {
  try {
    if (process.env.MAIL_ENABLED === "false") return;

    // Determine recipient:
    // Prefer explicit userEmail if event includes it, otherwise fetch from user-service.
    let toEmail = bookingData.userEmail || null;

    if (!toEmail && bookingData.userId) {
      toEmail = await getUserEmailById(bookingData.userId);
    }

    if (!toEmail) {
      console.log("No recipient email found for event. Skipping email.", bookingData);
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

    const { subject, text, html } = buildEmailContent(bookingData);

    const info = await tx.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId, "to:", toEmail);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

module.exports = { sendEmail };