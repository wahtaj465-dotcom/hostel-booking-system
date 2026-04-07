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
      <div className="w-full max-w-xl rounded-3xl border border-[#ff6f3d]/30 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,111,61,0.14),0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#ff6f3d] via-[#ff8a5f] to-[#ff6f3d]" />

        <div className="p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-400">
                CHECKOUT
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                Confirm Booking
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Room ID: <span className="font-semibold text-slate-200">{id}</span>
              </p>
            </div>

            <Link
              to="/hostels"
              className="text-sm font-semibold text-[#ff8a5f] hover:underline"
            >
              Back to Hostels
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Monthly Rent</span>
              <span className="font-semibold text-white">₹{pricing.monthlyRent}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
              <span>Service Fee</span>
              <span className="font-semibold text-white">₹{pricing.serviceFee}</span>
            </div>

            <div className="mt-4 h-px bg-white/10" />

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">Total</span>
              <span className="text-lg font-extrabold text-white">
                ₹{pricing.total}
              </span>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#ff6f3d] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_14px_36px_rgba(255,111,61,0.35)] hover:bg-[#ff7a45] disabled:opacity-60"
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