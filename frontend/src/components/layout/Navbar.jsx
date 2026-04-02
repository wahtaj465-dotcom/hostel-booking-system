import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="px-6 py-4 flex items-center justify-between bg-slate-900">
      <Link to="/" className="text-xl font-bold">HostelBooking</Link>

      <div className="flex gap-4">
        <Link to="/hostels">Hostels</Link>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user.isAdmin && <Link to="/admin/rooms">Admin</Link>}
            <button onClick={logout} className="text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}