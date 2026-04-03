import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.isAdmin) {
      api.get("/bookings/all").then((res) => setBookings(res.data));
    } else {
      api.get("/bookings/my-bookings").then((res) => setBookings(res.data));
    }
  }, [user]);

  const cancel = async (id) => {
    await api.delete(`/bookings/${id}`);
    setBookings(bookings.filter((b) => b._id !== id));
  };

  return (
    <div className="px-6 py-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {user?.isAdmin ? "All Bookings (Admin)" : "My Bookings"}
        </h2>

        {user?.isAdmin && (
          <Link to="/admin/rooms" className="text-blue-400">
            Manage Rooms
          </Link>
        )}
      </div>

      {bookings.map((b) => (
        <div key={b._id} className="p-4 bg-slate-800 rounded mt-4">
          <p>Room ID: {b.roomId}</p>
          <p>Status: {b.status}</p>
          {!user?.isAdmin && (
            <button onClick={() => cancel(b._id)} className="text-red-400">
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}