const test = require("node:test");
const assert = require("node:assert/strict");

const { buildBookingDetails } = require("../src/services/booking-details.service");

test("buildBookingDetails returns roomType, price and bookerName from persisted data", () => {
  const booking = {
    _id: "booking123",
    roomId: "room999",
    userId: "user777",
    checkInDate: "2026-06-01",
    checkOutDate: "2026-06-05",
    guests: 2,
  };

  const room = {
    hostelName: "Deluxe AC",
    price: 4500,
  };

  const user = {
    name: "Mohit Ranjan",
  };

  const details = buildBookingDetails({ booking, room, user });

  assert.equal(details.bookingId, "booking123");
  assert.equal(details.roomId, "room999");
  assert.equal(details.roomType, "Deluxe AC");
  assert.equal(details.price, 4500);
  assert.equal(details.bookerName, "Mohit Ranjan");
  assert.equal(details.checkInDate, "2026-06-01");
  assert.equal(details.checkOutDate, "2026-06-05");
  assert.equal(details.guests, 2);
});

test("buildBookingDetails handles missing room and user data gracefully", () => {
  const booking = {
    _id: "booking456",
    roomId: "room456",
    userId: "user456",
  };

  const details = buildBookingDetails({ booking, room: null, user: null });

  assert.equal(details.bookingId, "booking456");
  assert.equal(details.roomId, "room456");
  assert.equal(details.roomType, null);
  assert.equal(details.price, null);
  assert.equal(details.bookerName, null);
  assert.equal(details.checkInDate, null);
  assert.equal(details.checkOutDate, null);
  assert.equal(details.guests, null);
});
