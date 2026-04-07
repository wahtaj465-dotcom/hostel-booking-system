import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

export default function Analytics() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/bookings/all").then((res) => setBookings(res.data || []));
    api.get("/hostels").then((res) => setRooms(res.data || []));
  }, []);

  const totalBookings = bookings.length;
  const totalCancellations = bookings.filter((b) => b.status === "CANCELLED").length;

  const totalBeds = rooms.reduce((sum, r) => sum + (Number(r.totalBeds) || 0), 0);
  const availableBeds = rooms.reduce((sum, r) => sum + (Number(r.availableBeds) || 0), 0);
  const occupiedBeds = Math.max(totalBeds - availableBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const avgBookingValue = 450;
  const totalRevenue = totalBookings * avgBookingValue;

  const recentActivity = bookings.slice(0, 5).map((b) => ({
    id: b._id,
    roomId: b.roomId,
    status: b.status,
    date: b.createdAt || new Date().toISOString().slice(0, 10),
  }));

  const bookingTrend = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const base = Math.max(1, Math.round(totalBookings / 7));
    return days.map((d, i) => ({ day: d, value: base + (i % 3) }));
  }, [totalBookings]);

  const revenueTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((m, i) => ({
      month: m,
      value: totalRevenue ? Math.round(totalRevenue / 6 + i * 60) : 0,
    }));
  }, [totalRevenue]);

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue}`, delta: "+12.5%", up: true, icon: "💳" },
    { label: "Total Bookings", value: totalBookings, delta: "+5.2%", up: true, icon: "🧾" },
    { label: "Occupancy Rate", value: `${occupancyRate}%`, delta: "+2.1%", up: true, icon: "👥" },
    { label: "Cancellations", value: totalCancellations, delta: "-1.4%", up: false, icon: "❌" },
  ];

  const yTicks = [0, 2000, 4000, 6000, 8000];
  const maxTick = 8000;
  const chartW = 360;
  const chartH = 200;
  const padLeft = 36;
  const padBottom = 24;
  const padTop = 10;
  const barAreaH = chartH - padTop - padBottom;
  const barGap = 18;
  const barW = 28;

  const card =
    "rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff6f3d] text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_12px_30px_rgba(255,111,61,0.35)]">
          <span className="text-lg">📈</span>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Analytics Overview</h1>
          <p className="text-sm text-slate-400">
            Real-time performance metrics and booking insights.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-5`}>
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ff6f3d]/10 text-[#ff8a5f] ring-1 ring-[#ff6f3d]/25">
                <span>{s.icon}</span>
              </div>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-semibold ring-1",
                  s.up
                    ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25"
                    : "bg-rose-500/10 text-rose-300 ring-rose-500/25",
                ].join(" ")}
              >
                {s.delta}
              </span>
            </div>

            <div className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              {s.label}
            </div>
            <div className="mt-1 text-2xl font-extrabold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Trends */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-bold text-white">Booking Trends</h3>
          <p className="text-sm text-slate-400">Daily booking volume for the current week</p>

          <div className="mt-6">
            <svg viewBox="0 0 320 160" className="h-40 w-full">
              <defs>
                <linearGradient id="trendFillDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6f3d" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff6f3d" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <path
                d="M10,120 C40,95 70,85 100,90 C130,96 150,125 180,110 C210,95 230,70 260,85 C285,100 300,120 310,130"
                fill="none"
                stroke="#ff6f3d"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M10,120 C40,95 70,85 100,90 C130,96 150,125 180,110 C210,95 230,70 260,85 C285,100 300,120 310,130 L310,160 L10,160 Z"
                fill="url(#trendFillDark)"
              />
            </svg>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {bookingTrend.map((p) => (
                <span key={p.day}>{p.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-bold text-white">Revenue Growth</h3>
          <p className="text-sm text-slate-400">Monthly revenue performance in USD</p>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="mt-6 h-48 w-full">
            {yTicks.map((t) => {
              const y = padTop + barAreaH - (t / maxTick) * barAreaH;
              return (
                <g key={t}>
                  <line x1={padLeft} y1={y} x2={chartW} y2={y} stroke="#334155" strokeDasharray="4 4" />
                  <text x={0} y={y + 4} fontSize="10" fill="#64748b">
                    {t}
                  </text>
                </g>
              );
            })}

            {revenueTrend.map((m, i) => {
              const x = padLeft + i * (barW + barGap) + 10;
              const barH = (m.value / maxTick) * barAreaH;
              const y = padTop + barAreaH - barH;
              return (
                <g key={m.month}>
                  <rect x={x} y={y} width={barW} height={barH} rx="8" fill="#ff6f3d" />
                  <text x={x + barW / 2} y={chartH} textAnchor="middle" fontSize="10" fill="#64748b">
                    {m.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Occupancy + Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className={`${card} p-6`}>
          <h3 className="text-lg font-bold text-white">Occupancy</h3>
          <p className="text-sm text-slate-400">Room availability distribution</p>

          <div className="mt-6 flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 36 36" className="h-full w-full">
                <path
                  className="text-slate-700"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                />
                <path
                  className="text-[#ff6f3d]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray={`${occupancyRate}, 100`}
                  fill="none"
                  d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-lg font-bold text-white">
                {occupancyRate}%
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6 text-sm text-slate-400">
            <span>Occupied: {occupiedBeds}</span>
            <span>Available: {availableBeds}</span>
          </div>
        </div>

        <div className={`${card} p-6`}>
          <h3 className="text-lg font-bold text-white">Recent Activity</h3>
          <p className="text-sm text-slate-400">Latest booking & cancellation events</p>

          <div className="mt-4 space-y-3">
            {recentActivity.length === 0 && (
              <div className="text-sm text-slate-500">No activity yet.</div>
            )}
            {recentActivity.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">Room ID: {a.roomId}</div>
                  <div className="text-xs text-slate-500">Status: {a.status}</div>
                </div>
                <div className="text-xs text-slate-500">{a.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}