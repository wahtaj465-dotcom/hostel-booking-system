function toDisplayValue(value) {
  if (value === null || value === undefined || value === "") return "N/A";
  return value;
}

function buildEmailContent(event) {
  const type = event.type;

  const details = {
    bookingId: event.bookingId,
    roomId: event.roomId,
    roomType: event.roomType,
    price: event.price,
    bookerName: event.bookerName,
    checkInDate: event.checkInDate,
    checkOutDate: event.checkOutDate,
    guests: event.guests,
  };

  const title = type === "BOOKING_CANCELLED" ? "Booking Cancelled" : "Booking Confirmed";
  const actionText = type === "BOOKING_CANCELLED" ? "has been cancelled" : "is confirmed";

  return {
    subject: `${title} (Booking ID: ${toDisplayValue(details.bookingId)})`,
    text: `Your booking ${actionText}.
Booking ID: ${toDisplayValue(details.bookingId)}
Room ID: ${toDisplayValue(details.roomId)}
Room Type: ${toDisplayValue(details.roomType)}
Price: ${toDisplayValue(details.price)}
Booker Name: ${toDisplayValue(details.bookerName)}
Check-in Date: ${toDisplayValue(details.checkInDate)}
Check-out Date: ${toDisplayValue(details.checkOutDate)}
Guests: ${toDisplayValue(details.guests)}
`,
    html: `<h2>${title}</h2>
           <p>Your booking ${actionText}.</p>
           <p><b>Booking ID:</b> ${toDisplayValue(details.bookingId)}</p>
           <p><b>Room ID:</b> ${toDisplayValue(details.roomId)}</p>
           <p><b>Room Type:</b> ${toDisplayValue(details.roomType)}</p>
           <p><b>Price:</b> ${toDisplayValue(details.price)}</p>
           <p><b>Booker Name:</b> ${toDisplayValue(details.bookerName)}</p>
           <p><b>Check-in Date:</b> ${toDisplayValue(details.checkInDate)}</p>
           <p><b>Check-out Date:</b> ${toDisplayValue(details.checkOutDate)}</p>
           <p><b>Guests:</b> ${toDisplayValue(details.guests)}</p>`,
  };
}

module.exports = { buildEmailContent };
