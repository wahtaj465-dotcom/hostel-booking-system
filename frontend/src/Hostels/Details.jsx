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
    // UI-only pricing (does NOT affect backend/features)
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

  if (!room) return <div className="p-10 text-slate-600">Loading...</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {room.hostelName} — Room {room.roomNumber}
        </h2>

        <p className="mt-3 text-slate-600">
          Total Beds: <span className="font-semibold">{room.totalBeds}</span>
        </p>
        <p className="text-slate-600">
          Available Beds:{" "}
          <span className="font-semibold">{room.availableBeds}</span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {token ? (
            <button
              onClick={handleBook}
              className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Book Now
            </button>
          ) : (
            <button
              className="rounded-2xl bg-violet-600/50 px-5 py-3 text-sm font-semibold text-white cursor-not-allowed"
              disabled
            >
              Please log in to book
            </button>
          )}

          <button
            onClick={handleReduce}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Reduce Bed
          </button>

          <button
            onClick={handleIncrease}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Increase Bed
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-7 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <h3 className="text-lg font-extrabold text-slate-900">Price Details</h3>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-700">
            <span>Monthly Rent</span>
            <span className="font-semibold">₹{pricing.monthlyRent}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>Service Fee</span>
            <span className="font-semibold">₹{pricing.serviceFee}</span>
          </div>
          <div className="mt-3 h-px bg-slate-200" />
          <div className="flex items-center justify-between text-slate-900">
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