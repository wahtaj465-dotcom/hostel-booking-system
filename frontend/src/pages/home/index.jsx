import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen px-6 py-10 text-center">
      <h1 className="text-4xl md:text-6xl font-bold">
        Hostel Booking <span className="text-[var(--accent)]">Platform</span>
      </h1>
      <p className="text-[var(--muted)] mt-4">
        Modern, fast, and beautiful booking experience.
      </p>

      <div className="mt-8 flex gap-4 justify-center">
        <Link to="/hostels" className="px-6 py-2 bg-[var(--accent)] text-black rounded-xl">
          Explore Hostels
        </Link>
        <Link to="/login" className="px-6 py-2 bg-[var(--primary)] text-white rounded-xl">
          Login
        </Link>
      </div>
    </div>
  );
}