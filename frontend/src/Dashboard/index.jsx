import { useEffect, useState } from "react";
import { getMyBookings } from "../services/booking";
import { getMe } from "../services/auth";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then((res) => setUser(res.data.user));
    getMyBookings().then((res) => setBookings(res.data || []));
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {user && (
        <div className="mt-4 bg-[var(--glass)] p-4 rounded-xl border border-[var(--glass-border)]">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      )}

      <h3 className="text-2xl mt-8 mb-4">My Bookings</h3>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b._id} className="bg-[var(--glass)] p-4 rounded-xl border border-[var(--glass-border)]">
            <p>Room: {b.roomId}</p>
            <p>Status: {b.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}