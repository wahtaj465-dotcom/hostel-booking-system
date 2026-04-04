import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/70 bg-white/50">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} HostelBooking. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/hostels" className="hover:text-slate-900">Hostels</Link>
            <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}