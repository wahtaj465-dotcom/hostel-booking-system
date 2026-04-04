import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const pricing = useMemo(() => {
    const monthlyRent = 450;
    const serviceFee = 25;
    return { monthlyRent, serviceFee, total: monthlyRent + serviceFee };
  }, []);

  const handleBook = async () => {
    try {
      setLoading(true);
      await api.post("/bookings/book-room", { roomId: id });
      alert("Booking successful!");
      navigate("/dashboard");
    } catch {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500" />

        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-600">
                CHECKOUT
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                Confirm Booking
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Room ID: <span className="font-semibold">{id}</span>
              </p>
            </div>

            <Link to="/hostels" className="text-sm font-semibold text-violet-700 hover:underline">
              Back to Hostels
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between text-sm text-slate-700">
              <span>Monthly Rent</span>
              <span className="font-semibold">₹{pricing.monthlyRent}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-700">
              <span>Service Fee</span>
              <span className="font-semibold">₹{pricing.serviceFee}</span>
            </div>

            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Total</span>
              <span className="text-lg font-extrabold text-slate-900">
                ₹{pricing.total}
              </span>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Book Room"}
          </button>

          <p className="mt-4 text-xs text-slate-500">
            * UI pricing is for display only. Your booking API remains unchanged.
          </p>
        </div>
      </div>
    </div>
  );
}