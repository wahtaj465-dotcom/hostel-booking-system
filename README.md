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