import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BuildingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10 8h4M10 12h4M10 16h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070912]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#ff6f3d] text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_14px_32px_rgba(255,111,61,0.35)]">
            <BuildingIcon className="h-5 w-5" />
          </span>
          <div className="text-xl font-black tracking-tight">
            <span className="text-white">Hostel</span>
            <span className="text-[#ff7a45]">Booking</span>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold text-slate-300">
          <Link to="/hostels" className="hover:text-white">
            Explore
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              {user.isAdmin && (
                <>
                  <Link to="/admin/rooms" className="hover:text-white">
                    Admin
                  </Link>
                  <Link to="/admin/analytics" className="hover:text-white">
                    Analytics
                  </Link>
                </>
              )}
              <button
                onClick={logout}
                className="rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-rose-200 hover:bg-rose-500/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#ff6f3d] px-5 py-2 text-white shadow-[0_0_0_1px_rgba(255,111,61,0.35),0_12px_28px_rgba(255,111,61,0.30)] hover:bg-[#ff7a45]"
              >
                Start Now
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}