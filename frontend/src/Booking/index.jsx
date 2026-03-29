import { useNavigate, useParams } from "react-router-dom";
import { bookRoom } from "../services/booking";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await bookRoom({ roomId: id });
      alert("Booking successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-3xl font-bold">Confirm Booking</h2>
      <button className="mt-6 px-6 py-2 bg-[var(--accent)] text-black rounded-xl" onClick={handleBook}>
        Book Room
      </button>
    </div>
  );
}