import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent } from "../components/ui/Card";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      if (user?.isAdmin) navigate("/dashboard");
      else navigate("/hostels");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500" />

        <CardHeader className="space-y-2">
          <div className="text-xs font-bold tracking-widest text-emerald-700">
            SECURE ACCESS
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-600">
            Login to manage bookings and continue.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-600">Email</label>
              <Input
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-600">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-semibold text-violet-700 hover:underline">
                Signup
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}