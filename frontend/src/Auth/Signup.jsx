import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="bg-[var(--glass)] p-6 rounded-2xl border border-[var(--glass-border)]">
        <h2 className="text-2xl mb-4">Signup</h2>
        <input className="w-full mb-3 p-2 rounded" placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Email"
          onChange={(e)=>setForm({...form,email:e.target.value})} />
        <input className="w-full mb-3 p-2 rounded" placeholder="Password" type="password"
          onChange={(e)=>setForm({...form,password:e.target.value})} />
        <button className="w-full bg-[var(--primary)] text-white py-2 rounded">Create account</button>
      </form>
    </div>
  );
}