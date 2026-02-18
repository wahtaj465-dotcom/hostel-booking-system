const sendEmail = async (bookingData) => {
  console.log("📧 Sending email notification...");
  console.log("Booking Details:", bookingData);

  // For now just simulate email
  console.log("✅ Email sent successfully!");
};

module.exports = { sendEmail };
