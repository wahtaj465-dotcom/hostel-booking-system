import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent } from "../components/ui/Card";

export default function Login() {
  const { login, requestLoginOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [otpRequested, setOtpRequested] = useState(false);
  const [useOtp, setUseOtp] = useState(true);
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin = (user) => {
    if (user?.isAdmin) navigate("/dashboard");
    else navigate("/hostels");
  };

  const submitPasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      redirectAfterLogin(user);
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestLoginOtp({ email: form.email });
      setOtpRequested(true);
      alert("OTP sent to your email");
    } catch {
      alert("Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp({ email: form.email, otp: form.otp, purpose: "login" });
      redirectAfterLogin(user);
    } catch {
      alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = useOtp ? (otpRequested ? submitOtp : requestOtp) : submitPasswordLogin;

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-md overflow-hidden border-[#ff6f3d]/25">
        <div className="h-2 bg-gradient-to-r from-[#ff6f3d] via-[#ff8a5f] to-[#ff6f3d]" />

        <CardHeader className="space-y-2">
          <div className="text-xs font-bold tracking-widest text-[#ff8a5f]">
            SECURE ACCESS
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400">
            Login with an email OTP or use your password.
          </p>
        </CardHeader>

        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-900/70 p-1">
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${useOtp ? "bg-[#ff6f3d] text-white" : "text-slate-300"}`}
              onClick={() => {
                setUseOtp(true);
                setOtpRequested(false);
              }}
            >
              Email OTP
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${!useOtp ? "bg-[#ff6f3d] text-white" : "text-slate-300"}`}
              onClick={() => setUseOtp(false)}
            >
              Password
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Email</label>
              <Input
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {!useOtp && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}

            {useOtp && otpRequested && (
              <div className="space-y-2">
                <label className="text-xs text-slate-400">OTP</label>
                <Input
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="123456"
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value })}
                />
              </div>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Please wait..." : useOtp ? (otpRequested ? "Verify OTP" : "Send OTP") : "Login"}
            </Button>

            {useOtp && otpRequested && (
              <button
                type="button"
                className="w-full text-sm font-semibold text-[#ff8a5f] hover:underline"
                onClick={requestOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            )}

            <p className="text-center text-sm text-slate-400">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#ff8a5f] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
