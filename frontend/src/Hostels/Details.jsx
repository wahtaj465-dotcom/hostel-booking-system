import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom, reduceBed, increaseBed } from "../services/hostels";
import { bookRoom } from "../services/booking";

export default function HostelDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getRoom(id).then((res) => setRoom(res.data));
  }, [id]);

  const token = localStorage.getItem("token");

  const pricing = useMemo(() => {
    const monthlyRent = 450;
    const serviceFee = 25;
    return {
      monthlyRent,
      serviceFee,
      total: monthlyRent + serviceFee,
    };
  }, []);

  const refresh = async () => {
    const res = await getRoom(id);
    setRoom(res.data);
  };

  const handleBook = async () => {
    if (!token) {
      alert("Please log in before booking a room!");
      return;
    }
    try {
      await bookRoom({ roomId: id });
      alert("Booking successful!");
      await refresh();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Not authorized. Please log in again.");
      } else if (err.response && err.response.data && err.response.data.message) {
        alert("Booking failed: " + err.response.data.message);
      } else {
        alert("Booking failed: " + err.message);
      }
    }
  };

  const handleReduce = async () => {
    await reduceBed(id);
    await refresh();
  };

  const handleIncrease = async () => {
    await increaseBed(id);
    await refresh();
  };

  if (!room) return <div className="p-10 text-slate-400">Loading...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-7 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          {room.hostelName} — Room {room.roomNumber}
        </h2>

        <p className="mt-3 text-slate-400">
          Total Beds: <span className="font-semibold text-white">{room.totalBeds}</span>
        </p>
        <p className="text-slate-400">
          Available Beds: <span className="font-semibold text-white">{room.availableBeds}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {token ? (
            <button
              onClick={handleBook}
              className="rounded-2xl bg-[#ff6f3d] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_12px_28px_rgba(255,111,61,0.3)] hover:bg-[#ff7a45]"
            >
              Book Now
            </button>
          ) : (
            <button
              className="cursor-not-allowed rounded-2xl bg-[#ff6f3d]/50 px-5 py-3 text-sm font-semibold text-white"
              disabled
            >
              Please log in to book
            </button>
          )}

          <button
            onClick={handleReduce}
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"
          >
            Reduce Bed
          </button>

          <button
            onClick={handleIncrease}
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.06]"
          >
            Increase Bed
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-7 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-extrabold text-white">Price Details</h3>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-300">
            <span>Monthly Rent</span>
            <span className="font-semibold text-white">₹{pricing.monthlyRent}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Service Fee</span>
            <span className="font-semibold text-white">₹{pricing.serviceFee}</span>
          </div>
          <div className="mt-3 h-px bg-white/10" />
          <div className="flex items-center justify-between text-slate-100">
            <span className="font-semibold">Total</span>
            <span className="text-base font-extrabold">₹{pricing.total}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          * Pricing shown is UI-only and does not affect booking logic.
        </p>
      </div>
    </div>
  );
}