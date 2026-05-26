# Notification details (booking + cancellation)

Booking and cancellation notifications now include enriched details (when available from persisted services):

- bookingId
- roomId
- roomType (or nearest equivalent room descriptor)
- price
- bookerName
- checkInDate
- checkOutDate
- guests

These fields are included in booking-service responses (`bookingDetails`) and in Brevo SMTP email content for both booking confirmation and cancellation. Missing upstream values are handled gracefully.

## User-service auth endpoint checks (manual)

The user-service currently has no automated tests. To verify auth validation/rate-limiting locally:

1. Start the user service (`cd user-service && npm install && node src/app.js`).
2. Validate register payload checks:
   - `POST /users/register` with missing/invalid fields should return `400` and `{ "message": "..." }`.
   - Password errors always mention it must include numbers/digits.
3. Validate login payload checks:
   - `POST /users/login` with invalid email/password payload should return `400` and `{ "message": "..." }`.
4. Validate rate limiting:
   - Repeated calls to `/users/register` or `/users/login` should return a friendly rate-limit message after the configured threshold.