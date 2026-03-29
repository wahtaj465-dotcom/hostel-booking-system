import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import Hostels from "../Hostels";
import HostelDetails from "../Hostels/Details";
import Booking from "../Booking";
import Dashboard from "../Dashboard";
import Notifications from "../Notifications";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  return user || token ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/hostels" element={<Hostels />} />
      <Route path="/hostels/:id" element={<HostelDetails />} />

      {/* 🔒 Booking must be logged in */}
      <Route
        path="/booking/:id"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}