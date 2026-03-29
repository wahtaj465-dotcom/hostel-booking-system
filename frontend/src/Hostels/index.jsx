import { useEffect, useState } from "react";
import { getRooms } from "../services/hostels";
import { Link } from "react-router-dom";

export default function Hostels() {
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getRooms().then((res) => setRooms(res.data || []));
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">Available Rooms</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-[var(--glass)] p-6 rounded-2xl border border-[var(--glass-border)]">
            <h3 className="text-xl font-semibold">
              {room.hostelName} — Room {room.roomNumber}
            </h3>
            <p className="text-[var(--muted)]">Total Beds: {room.totalBeds}</p>
            <p className="text-[var(--muted)]">Available Beds: {room.availableBeds}</p>

            {token ? (
              <Link to={`/booking/${room._id}`} className="inline-block mt-3 text-[var(--accent)]">
                Book now →
              </Link>
            ) : (
              <Link to="/login" className="inline-block mt-3 text-[var(--accent)]">
                Login to book →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}