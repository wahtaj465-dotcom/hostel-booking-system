import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loadCurrentUser = async () => {
    const me = await api.get("/users/me");
    const u = me.data.user;

    const userWithAdmin = {
      ...u,
      isAdmin: u.role === "admin",
    };

    setUser(userWithAdmin);
    return userWithAdmin;
  };

  const login = async (data) => {
    const res = await api.post("/users/login", data);
    const token = res.data.token;
    localStorage.setItem("token", token);

    return loadCurrentUser();
  };

  const requestLoginOtp = async (data) => {
    await api.post("/users/auth/login/request-otp", data);
  };

  const requestSignupOtp = async (data) => {
    await api.post("/users/auth/signup/request-otp", data);
  };

  const verifyOtp = async (data) => {
    const res = await api.post("/users/auth/verify-otp", data);
    const token = res.data.token;
    localStorage.setItem("token", token);

    return loadCurrentUser();
  };

  const register = async (data) => {
    await api.post("/users/register", data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    loadCurrentUser().catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, requestLoginOtp, requestSignupOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
