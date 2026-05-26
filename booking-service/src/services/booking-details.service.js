const axios = require("axios");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:4001";
const HOSTEL_SERVICE_URL = process.env.HOSTEL_SERVICE_URL || "http://hostel-service:4002";

function normalizeBookingId(booking) {
  return booking?._id?.toString?.() || booking?.bookingId || null;
}

function normalizeRoomType(room) {
  return room?.roomType || room?.type || room?.category || room?.hostelName || room?.roomNumber || null;
}

function normalizePrice(booking, room) {
  return booking?.totalPrice ?? booking?.price ?? room?.price ?? room?.rent ?? room?.amount ?? null;
}

function normalizeBookerName(user, booking) {
  return user?.name || user?.fullName || booking?.bookerName || null;
}

function normalizeDate(value) {
  if (!value) return null;
  return value;
}

function buildBookingDetails({ booking, room, user }) {
  return {
    bookingId: normalizeBookingId(booking),
    roomId: booking?.roomId || room?._id?.toString?.() || null,
    roomType: normalizeRoomType(room),
    price: normalizePrice(booking, room),
    bookerName: normalizeBookerName(user, booking),
    checkInDate: normalizeDate(booking?.checkInDate || booking?.checkIn),
    checkOutDate: normalizeDate(booking?.checkOutDate || booking?.checkOut),
    guests: booking?.guests ?? booking?.guestCount ?? null,
  };
}

async function getRoomById(roomId) {
  if (!roomId) return null;
  try {
    const { data } = await axios.get(`${HOSTEL_SERVICE_URL}/hostels/${roomId}`);
    return data || null;
  } catch (error) {
    console.error("Failed to fetch room details:", error.response?.data || error.message);
    return null;
  }
}

async function getUserById(userId) {
  if (!userId) return null;
  try {
    const { data } = await axios.get(`${USER_SERVICE_URL}/users/internal/${userId}`);
    return data || null;
  } catch (error) {
    console.error("Failed to fetch user details:", error.response?.data || error.message);
    return null;
  }
}

async function getEnrichedBookingDetails(booking) {
  const [room, user] = await Promise.all([
    getRoomById(booking?.roomId),
    getUserById(booking?.userId),
  ]);

  const details = buildBookingDetails({ booking, room, user });

  return {
    details,
    room,
    user,
    userEmail: user?.email || null,
  };
}

module.exports = {
  buildBookingDetails,
  getEnrichedBookingDetails,
};
