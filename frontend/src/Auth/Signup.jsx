import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={submit} className="px-6 py-10 space-y-4">
      <input className="p-2 bg-slate-700" placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input className="p-2 bg-slate-700" placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input className="p-2 bg-slate-700" type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
      <button className="bg-green-600 px-4 py-2">Signup</button>
    </form>
  );
}