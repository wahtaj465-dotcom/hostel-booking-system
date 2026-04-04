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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {user?.isAdmin ? "All Bookings" : "My Bookings"}
          </h2>
          <p className="mt-1 text-slate-600">
            {user?.isAdmin
              ? "Admin view: monitor bookings across users."
              : "Track your bookings and cancel if needed."}
          </p>
        </div>

        {user?.isAdmin && (
          <Link
            to="/admin/rooms"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Manage Rooms
          </Link>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-600">
                  BOOKING
                </div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  Room ID: {b.roomId}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Status:{" "}
                  <span className="font-semibold text-slate-900">{b.status}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">
                {user?.isAdmin ? "ADMIN" : "STUDENT"}
              </div>
            </div>

            {!user?.isAdmin && (
              <button
                onClick={() => cancel(b._id)}
                className="mt-5 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-slate-600">
          No bookings found.
        </div>
      )}
    </div>
  );
}