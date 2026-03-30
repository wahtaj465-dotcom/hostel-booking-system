import { useEffect, useState } from "react";
import { getMyBookings } from "../services/booking";
import { getMe } from "../services/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getMe();
        const bookingRes = await getMyBookings();

        setUser(userRes?.data?.user);
        setBookings(bookingRes?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {user && (
        <div className="mt-4">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      )}

      <h3 className="mt-6 text-xl">My Bookings</h3>

      {bookings.length === 0 ? (
        <p>No bookings</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id}>
            Room: {b.roomId}
          </div>
        ))
      )}
    </div>
  );
}