import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-[var(--glass)] p-6 rounded-2xl border border-[var(--glass-border)]">
        <h2 className="text-2xl mb-4">Login</h2>
        <input className="w-full mb-3 p-2 rounded" placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Password" type="password"
          onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button className="w-full bg-[var(--accent)] text-black py-2 rounded">Login</button>
      </form>
    </div>
  );
}