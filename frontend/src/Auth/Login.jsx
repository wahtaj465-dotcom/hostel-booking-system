import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/hostels");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="px-6 py-10 space-y-4">
      <input className="p-2 bg-slate-700" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input className="p-2 bg-slate-700" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button className="bg-blue-600 px-4 py-2">Login</button>
    </form>
  );
}