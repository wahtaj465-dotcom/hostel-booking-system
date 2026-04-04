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
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Admin Rooms
        </h2>
        <p className="mt-1 text-slate-600">
          Create rooms, manage beds, and delete rooms.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <h3 className="text-lg font-extrabold text-slate-900">Create Room</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400/40"
            placeholder="Hostel Name"
            onChange={(e) => setForm({ ...form, hostelName: e.target.value })}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400/40"
            placeholder="Room Number"
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400/40"
            type="number"
            placeholder="Total Beds"
            onChange={(e) => setForm({ ...form, totalBeds: +e.target.value })}
          />
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-400/40"
            type="number"
            placeholder="Available Beds"
            onChange={(e) =>
              setForm({ ...form, availableBeds: +e.target.value })
            }
          />
        </div>

        <button
          className="mt-4 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500"
          onClick={create}
        >
          Create
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {rooms.map((r) => (
          <div
            key={r._id}
            className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="text-lg font-extrabold text-slate-900">
              {r.hostelName} — {r.roomNumber}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Total: <span className="font-semibold text-slate-900">{r.totalBeds}</span>{" "}
              • Available:{" "}
              <span className="font-semibold text-slate-900">{r.availableBeds}</span>
            </div>

            <button
              onClick={() => remove(r._id)}
              className="mt-4 rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}