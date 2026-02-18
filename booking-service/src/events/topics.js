/**
 * Central place to manage all RabbitMQ queue / event names.
 * This prevents hardcoding strings across the application.
 */

const QUEUES = {
  BOOKING_QUEUE: "booking_queue",
};

const EVENTS = {
  BOOKING_CREATED: "BOOKING_CREATED",
};

module.exports = {
  ...QUEUES,
  ...EVENTS,
};
