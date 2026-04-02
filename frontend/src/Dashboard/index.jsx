import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my-bookings").then((res) => setBookings(res.data));
  }, []);

  const cancel = async (id) => {
    await api.delete(`/bookings/${id}`);
    setBookings(bookings.filter((b) => b._id !== id));
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold">My Bookings</h2>
      {bookings.map((b) => (
        <div key={b._id} className="p-4 bg-slate-800 rounded mt-4">
          <p>Room ID: {b.roomId}</p>
          <p>Status: {b.status}</p>
          <button onClick={() => cancel(b._id)} className="text-red-400">
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}