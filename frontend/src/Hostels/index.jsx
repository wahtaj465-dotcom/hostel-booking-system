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
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Hostels
          </h2>
          <p className="mt-1 text-slate-600">
            Choose a room based on availability and book instantly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
          Total Rooms: <span className="font-semibold text-slate-900">{rooms.length}</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rooms.map((r) => {
          const isAvailable = Number(r.availableBeds) > 0;

          return (
            <div
              key={r._id}
              className="group rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-extrabold text-slate-900">
                    {r.hostelName} <span className="text-slate-400">•</span> Room{" "}
                    {r.roomNumber}
                  </h3>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Total Beds
                      </div>
                      <div className="mt-1 text-base font-extrabold text-slate-900">
                        {r.totalBeds}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Available
                      </div>
                      <div
                        className={[
                          "mt-1 text-base font-extrabold",
                          isAvailable ? "text-emerald-700" : "text-rose-700",
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
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200",
                  ].join(" ")}
                >
                  {isAvailable ? "AVAILABLE" : "FULL"}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/hostels/${r._id}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  View Details
                </Link>

                <Link
                  to={`/booking/${r._id}`}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm",
                    isAvailable
                      ? "bg-violet-600 hover:bg-violet-500"
                      : "bg-slate-300 cursor-not-allowed pointer-events-none",
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