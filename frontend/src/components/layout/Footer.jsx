export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-400">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>© {new Date().getFullYear()} HostelBooking. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white">Home</a>
            <a href="/hostels" className="hover:text-white">Hostels</a>
            <a href="/dashboard" className="hover:text-white">Dashboard</a>
          </div>
        </div>
      </div>
    </footer>
  );
}