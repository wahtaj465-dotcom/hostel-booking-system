import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Hostels() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/hostels").then((res) => setRooms(res.data));
  }, []);

  return (
    <div className="px-6 py-10 grid md:grid-cols-2 gap-6">
      {rooms.map((r) => (
        <div key={r._id} className="p-6 bg-slate-800 rounded">
          <h3 className="text-xl font-bold">{r.hostelName} — {r.roomNumber}</h3>
          <p>Total Beds: {r.totalBeds}</p>
          <p>Available Beds: {r.availableBeds}</p>
          <Link to={`/booking/${r._id}`} className="text-blue-400">Book now →</Link>
        </div>
      ))}
    </div>
  );
}