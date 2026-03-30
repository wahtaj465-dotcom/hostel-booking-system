import { useNavigate, useParams } from "react-router-dom";
import { bookRoom } from "../services/booking";
import { useEffect } from "react";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔒 Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  const handleBook = async () => {
    try {
      await bookRoom({ roomId: id });

      alert("Booking successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <h2 className="text-2xl font-bold">Confirm Booking</h2>

      <button
        onClick={handleBook}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
      >
        Book Room
      </button>
    </div>
  );
}