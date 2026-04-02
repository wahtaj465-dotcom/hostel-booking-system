import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();
const ADMIN_EMAILS = ["admin1@example.com"];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await api.post("/users/login", data);
    const token = res.data.token;
    localStorage.setItem("token", token);

    const me = await api.get("/users/me");
    const u = me.data.user;
    setUser({
      ...u,
      isAdmin: ADMIN_EMAILS.includes(u.email),
    });
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
    api.get("/users/me")
      .then((res) => {
        const u = res.data.user;
        setUser({ ...u, isAdmin: ADMIN_EMAILS.includes(u.email) });
      })
      .catch(() => logout());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);