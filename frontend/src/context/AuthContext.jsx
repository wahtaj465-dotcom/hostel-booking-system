import { createContext, useContext, useState } from "react";
import { login as loginApi, register as registerApi, getMe } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await loginApi(data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user || null);
  };

  const register = async (data) => {
    const res = await registerApi(data);
    return res.data;
  };

  const fetchMe = async () => {
    const res = await getMe();
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);