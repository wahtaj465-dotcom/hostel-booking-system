import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom, reduceBed, increaseBed } from "../services/hostels";
import { bookRoom } from "../services/booking";

export default function HostelDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getRoom(id).then((res) => setRoom(res.data));
  }, [id]);

  const handleBook = async () => {
    await bookRoom({ roomId: id });
    alert("Booking successful!");
  };

  const handleReduce = async () => {
    await reduceBed(id);
    const res = await getRoom(id);
    setRoom(res.data);
  };

  const handleIncrease = async () => {
    await increaseBed(id);
    const res = await getRoom(id);
    setRoom(res.data);
  };

  if (!room) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold">
        {room.hostelName} — Room {room.roomNumber}
      </h2>

      <p className="text-[var(--muted)] mt-2">
        Total Beds: {room.totalBeds}
      </p>
      <p className="text-[var(--muted)] mt-1">
        Available Beds: {room.availableBeds}
      </p>

      <div className="mt-6 flex gap-3">
        <button onClick={handleBook} className="px-5 py-2 bg-[var(--accent)] text-black rounded-xl">
          Book Now
        </button>
        <button onClick={handleReduce} className="px-5 py-2 bg-[var(--primary)] text-white rounded-xl">
          Reduce Bed
        </button>
        <button onClick={handleIncrease} className="px-5 py-2 bg-white text-black rounded-xl">
          Increase Bed
        </button>
      </div>
    </div>
  );
}