import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="px-6 py-12 space-y-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold">Hostel Booking Platform</h1>
        <p className="text-gray-400 mt-4">Find and book your perfect room</p>
        <Link
          to="/hostels"
          className="inline-block mt-6 px-6 py-2 bg-blue-600 rounded"
        >
          Explore Hostels
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-800 rounded">Secure Booking</div>
        <div className="p-6 bg-slate-800 rounded">Modern Rooms</div>
        <div className="p-6 bg-slate-800 rounded">Instant Notifications</div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="p-4 bg-slate-800 rounded">How to book?</div>
        <div className="p-4 bg-slate-800 rounded">How to cancel?</div>
      </section>
    </div>
  );
}