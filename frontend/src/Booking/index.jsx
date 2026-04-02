import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBook = async () => {
    try {
      await api.post("/bookings/book-room", { roomId: id });
      alert("Booking successful!");
      navigate("/dashboard");
    } catch {
      alert("Booking failed");
    }
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-bold">Confirm Booking</h2>
      <button onClick={handleBook} className="mt-4 px-6 py-2 bg-green-500 rounded">
        Book Room
      </button>
    </div>
  );
}