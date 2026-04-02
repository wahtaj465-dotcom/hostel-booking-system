import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import Hostels from "../Hostels";
import HostelDetails from "../Hostels/Details";
import Booking from "../Booking";
import Dashboard from "../Dashboard";
import AdminRooms from "../components/shared/AdminRooms";
import Notifications from "../Notifications";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hostels" element={<Hostels />} />
      <Route path="/hostels/:id" element={<HostelDetails />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <AdminRoute>
            <AdminRooms />
          </AdminRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}