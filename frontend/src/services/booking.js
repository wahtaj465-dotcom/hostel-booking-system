// src/services/booking.js
import api from "./api";

export const bookRoom = (data) => api.post("/bookings/book-room", data);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);
export const getMyBookings = () => api.get("/bookings/my-bookings");