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
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold">Admin Rooms</h2>

      <div className="mt-4 space-y-2">
        <input className="p-2 bg-slate-700" placeholder="Hostel Name" onChange={(e)=>setForm({...form, hostelName:e.target.value})}/>
        <input className="p-2 bg-slate-700" placeholder="Room Number" onChange={(e)=>setForm({...form, roomNumber:e.target.value})}/>
        <input className="p-2 bg-slate-700" type="number" placeholder="Total Beds" onChange={(e)=>setForm({...form, totalBeds:+e.target.value})}/>
        <input className="p-2 bg-slate-700" type="number" placeholder="Available Beds" onChange={(e)=>setForm({...form, availableBeds:+e.target.value})}/>
        <button className="bg-blue-600 px-4 py-2" onClick={create}>Create</button>
      </div>

      {rooms.map((r) => (
        <div key={r._id} className="p-4 bg-slate-800 rounded mt-4 flex justify-between">
          <div>{r.hostelName} — {r.roomNumber}</div>
          <button onClick={()=>remove(r._id)} className="text-red-400">Delete</button>
        </div>
      ))}
    </div>
  );
}