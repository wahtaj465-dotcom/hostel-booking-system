import api from "./api";

export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const requestLoginOtp = (data) => api.post("/users/auth/login/request-otp", data);
export const requestSignupOtp = (data) => api.post("/users/auth/signup/request-otp", data);
export const verifyOtp = (data) => api.post("/users/auth/verify-otp", data);
export const getMe = () => api.get("/users/me");
