import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Hostels() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/hostels").then((res) => setRooms(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Find Your Space
          </h2>
          <p className="mt-1 text-slate-400">
            Browse through our curated list of premium student accommodations.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 shadow-sm backdrop-blur">
          Total Rooms:{" "}
          <span className="font-semibold text-white">{rooms.length}</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rooms.map((r) => {
          const isAvailable = Number(r.availableBeds) > 0;

          return (
            <div
              key={r._id}
              className="group rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#ff7a45]/40 hover:shadow-[0_0_0_1px_rgba(255,111,61,0.2),0_26px_70px_rgba(255,111,61,0.16)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-extrabold text-white">
                    {r.hostelName} <span className="text-slate-600">•</span>{" "}
                    Room {r.roomNumber}
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Total Beds
                      </div>
                      <div className="mt-1 text-base font-extrabold text-white">
                        {r.totalBeds}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Available
                      </div>
                      <div
                        className={[
                          "mt-1 text-base font-extrabold",
                          isAvailable ? "text-emerald-400" : "text-rose-400",
                        ].join(" ")}
                      >
                        {r.availableBeds}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={[
                    "shrink-0 rounded-2xl px-3 py-2 text-xs font-extrabold tracking-wide ring-1",
                    isAvailable
                      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                      : "bg-rose-500/10 text-rose-300 ring-rose-500/30",
                  ].join(" ")}
                >
                  {isAvailable ? "AVAILABLE" : "FULL"}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/hostels/${r._id}`}
                  className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.06]"
                >
                  View Details
                </Link>

                <Link
                  to={`/booking/${r._id}`}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-semibold text-white",
                    isAvailable
                      ? "bg-[#ff6f3d] shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_12px_30px_rgba(255,111,61,0.3)] hover:bg-[#ff7a45]"
                      : "bg-slate-700 cursor-not-allowed pointer-events-none",
                  ].join(" ")}
                  aria-disabled={!isAvailable}
                >
                  Book now →
                </Link>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Room ID: <span className="font-mono">{r._id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}