import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    hostelName: "",
    roomNumber: "",
    totalBeds: 0,
    availableBeds: 0,
  });

  useEffect(() => {
    api.get("/hostels").then((res) => setRooms(res.data));
  }, []);

  const create = async () => {
    const res = await api.post("/hostels", form);
    setRooms([...rooms, res.data]);
  };

  const remove = async (id) => {
    await api.delete(`/hostels/${id}`);
    setRooms(rooms.filter((r) => r._id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Admin Rooms</h2>
        <p className="mt-1 text-slate-400">Create rooms, manage beds, and delete rooms.</p>
      </div>

      <div className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-extrabold text-white">Create Room</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#ff6f3d]/60 focus:ring-2 focus:ring-[#ff6f3d]/20 placeholder:text-slate-500"
            placeholder="Hostel Name"
            onChange={(e) => setForm({ ...form, hostelName: e.target.value })}
          />
          <input
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#ff6f3d]/60 focus:ring-2 focus:ring-[#ff6f3d]/20 placeholder:text-slate-500"
            placeholder="Room Number"
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          />
          <input
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#ff6f3d]/60 focus:ring-2 focus:ring-[#ff6f3d]/20 placeholder:text-slate-500"
            type="number"
            placeholder="Total Beds"
            onChange={(e) => setForm({ ...form, totalBeds: +e.target.value })}
          />
          <input
            className="rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#ff6f3d]/60 focus:ring-2 focus:ring-[#ff6f3d]/20 placeholder:text-slate-500"
            type="number"
            placeholder="Available Beds"
            onChange={(e) => setForm({ ...form, availableBeds: +e.target.value })}
          />
        </div>

        <button
          className="mt-4 rounded-2xl bg-[#ff6f3d] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_12px_28px_rgba(255,111,61,0.30)] hover:bg-[#ff7a45]"
          onClick={create}
        >
          Create
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rooms.map((r) => (
          <div
            key={r._id}
            className="rounded-3xl border border-[#ff6f3d]/25 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,111,61,0.12),0_25px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="text-lg font-extrabold text-white">
              {r.hostelName} — {r.roomNumber}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              Total: <span className="font-semibold text-white">{r.totalBeds}</span> • Available:{" "}
              <span className="font-semibold text-white">{r.availableBeds}</span>
            </div>

            <button
              onClick={() => remove(r._id)}
              className="mt-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 ring-1 ring-rose-400/30 hover:bg-rose-500/20"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}