import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardHeader, CardContent } from "../components/ui/Card";

export default function Signup() {
  const { requestSignupOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestSignupOtp({ name: form.name, email: form.email, password: form.password });
      setOtpRequested(true);
      alert("Signup OTP sent to your email");
    } catch {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp({ email: form.email, otp: form.otp, purpose: "signup" });
      if (user?.isAdmin) navigate("/dashboard");
      else navigate("/hostels");
    } catch {
      alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <Card className="w-full max-w-md overflow-hidden border-[#ff6f3d]/25">
        <div className="h-2 bg-gradient-to-r from-[#ff6f3d] via-[#ff8a5f] to-[#ff6f3d]" />

        <CardHeader className="space-y-2">
          <div className="text-xs font-bold tracking-widest text-slate-300">
            CREATE ACCOUNT
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-sm text-slate-400">
            Verify your email with an OTP to activate your account.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={otpRequested ? submitOtp : requestOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Full Name</label>
              <Input
                placeholder="John Doe"
                value={form.name}
                disabled={otpRequested}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Email</label>
              <Input
                placeholder="name@example.com"
                value={form.email}
                disabled={otpRequested}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                disabled={otpRequested}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {otpRequested && (
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
              {loading ? "Please wait..." : otpRequested ? "Verify OTP" : "Send Signup OTP"}
            </Button>

            {otpRequested && (
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#ff8a5f] hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}