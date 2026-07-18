function buildOtpEmailContent(authData) {
  const purposeLabel = authData.purpose === "signup" ? "complete your signup" : "login";
  const subject = `Your Hostel Booking System OTP: ${authData.otp}`;

  const text = [
    `Hi ${authData.userName || "there"},`,
    "",
    `Use this OTP to ${purposeLabel}: ${authData.otp}`,
    `This code expires in ${authData.expiresInMinutes || 10} minutes.`,
    "",
    "If you did not request this code, you can safely ignore this email.",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f172a;">
      <h2 style="color: #ff6f3d;">Hostel Booking System OTP</h2>
      <p>Hi ${authData.userName || "there"},</p>
      <p>Use the verification code below to ${purposeLabel}.</p>
      <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; padding: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; text-align: center; color: #111827;">
        ${authData.otp}
      </div>
      <p style="margin-top: 18px;">This code expires in <strong>${authData.expiresInMinutes || 10} minutes</strong>.</p>
      <p style="font-size: 13px; color: #64748b;">If you did not request this code, you can safely ignore this email.</p>
    </div>
  `;

  return { subject, text, html };
}

module.exports = { buildOtpEmailContent };
