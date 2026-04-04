import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BuildingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 8h4M10 12h4M10 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 text-white shadow-[0_16px_35px_rgba(124,58,237,0.35)]">
            <BuildingIcon className="h-6 w-6" />
          </span>
          <div className="text-xl font-black tracking-tight">
            <span className="text-violet-600">Hostel</span>
            <span className="text-slate-900">Booking</span>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold text-slate-600">
          <Link to="/hostels" className="hover:text-slate-900">Explore Hostels</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
              {user.isAdmin && (
                <>
                  <Link to="/admin/rooms" className="hover:text-slate-900">Admin</Link>
                  <Link to="/admin/analytics" className="hover:text-slate-900">Analytics</Link>
                </>
              )}
              <button
                onClick={logout}
                className="rounded-full bg-rose-50 px-4 py-2 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-slate-900">Login</Link>
              <Link to="/signup" className="rounded-full bg-violet-600 px-5 py-2 text-white shadow-sm hover:bg-violet-500">
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}