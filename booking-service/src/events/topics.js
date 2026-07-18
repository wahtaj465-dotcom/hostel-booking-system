/**
 * Central place to manage all RabbitMQ queue / event names.
 * This prevents hardcoding strings across the application.
 */

const EXCHANGES = {
  BOOKING_EXCHANGE: "booking_events",
};

const EVENTS = {
  BOOKING_CREATED: "BOOKING_CREATED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
};

module.exports = {
  ...EXCHANGES,
  ...EVENTS,
};