import api from "./api";

export const bookRoom = (data) =>
  api.post("/bookings/book-room", data);

export const getMyBookings = () =>
  api.get("/bookings/my-bookings");