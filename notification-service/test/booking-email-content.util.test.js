const test = require("node:test");
const assert = require("node:assert/strict");

const { buildEmailContent } = require("../src/utils/booking-email-content.util");

test("booking confirmation email content includes roomType, price and bookerName", () => {
  const content = buildEmailContent({
    type: "BOOKING_CREATED",
    bookingId: "b1",
    roomId: "r1",
    roomType: "Deluxe AC",
    price: 3200,
    bookerName: "Rahul",
    checkInDate: "2026-06-10",
    checkOutDate: "2026-06-12",
    guests: 2,
  });

  assert.match(content.text, /Room Type: Deluxe AC/);
  assert.match(content.text, /Price: 3200/);
  assert.match(content.text, /Booker Name: Rahul/);
  assert.match(content.html, /<b>Room Type:<\/b> Deluxe AC/);
  assert.match(content.html, /<b>Price:<\/b> 3200/);
  assert.match(content.html, /<b>Booker Name:<\/b> Rahul/);
});

test("booking cancellation email content handles missing details gracefully", () => {
  const content = buildEmailContent({
    type: "BOOKING_CANCELLED",
    bookingId: "b2",
    roomId: "r2",
    roomType: null,
    price: null,
    bookerName: null,
  });

  assert.match(content.text, /Room Type: N\/A/);
  assert.match(content.text, /Price: N\/A/);
  assert.match(content.text, /Booker Name: N\/A/);
  assert.match(content.subject, /Booking Cancelled/);
});
