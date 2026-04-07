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
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            {user?.isAdmin ? "All Bookings" : "My Bookings"}
          </h2>
          <p className="mt-1 text-slate-400">
            {user?.isAdmin
              ? "Admin view: monitor bookings across users."
              : "Track your bookings and cancel if needed."}
          </p>
        </div>

        {user?.isAdmin && (
          <Link
            to="/admin/rooms"
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06]"
          >
            Manage Rooms
          </Link>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold tracking-widest text-slate-500">BOOKING</div>
                <div className="mt-1 text-lg font-extrabold text-white">Room ID: {b.roomId}</div>
                <div className="mt-2 text-sm text-slate-400">
                  Status: <span className="font-semibold text-slate-200">{b.status}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200 ring-1 ring-white/10">
                {user?.isAdmin ? "ADMIN" : "STUDENT"}
              </div>
            </div>

            {!user?.isAdmin && (
              <button
                onClick={() => cancel(b._id)}
                className="mt-5 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-400/30 hover:bg-rose-500/20"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
          No bookings found.
        </div>
      )}
    </div>
  );
}