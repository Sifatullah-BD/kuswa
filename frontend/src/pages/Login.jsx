import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { formatApiError } from "../lib/api";
import { LogIn, Lock } from "lucide-react";
import { toast } from "sonner";

const LOGO = "https://customer-assets.emergentagent.com/job_bb744ec9-a084-4368-b9f5-270ac09fd22f/artifacts/cetkcmdm_Untitled%20design.png";

export default function Login() {
  const { user, login, checking } = useAuth();
  const { lang } = useLang();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (checking) return <div className="min-h-screen grid place-items-center text-kuswa-muted">Loading...</div>;
  if (user && user.role === "admin") return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
      toast.success(lang === "bn" ? "সফলভাবে লগইন হয়েছে" : "Logged in successfully");
      nav("/admin");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-soft p-6" data-testid="login-page">
      <div className="w-full max-w-md card-soft">
        <div className="text-center">
          <img src={LOGO} alt="KUSWA" className="w-16 h-16 mx-auto rounded-full" />
          <h1 className={`mt-4 text-2xl font-bold ${lang === "bn" ? "font-bn" : "font-display"} text-kuswa-dark-blue`}>
            {lang === "bn" ? "অ্যাডমিন লগইন" : "Admin Login"}
          </h1>
          <p className="text-sm text-kuswa-muted">{lang === "bn" ? "শুধু অ্যাডমিনের জন্য" : "For administrators only"}</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4" data-testid="login-form">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-kuswa-muted font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email"
              className="px-4 py-2.5 rounded-lg border border-kuswa-bg focus:border-kuswa-dark-blue focus:ring-2 focus:ring-kuswa-light-blue/30 outline-none" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-kuswa-muted font-medium">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-kuswa-muted" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-kuswa-bg focus:border-kuswa-dark-blue focus:ring-2 focus:ring-kuswa-light-blue/30 outline-none" />
            </div>
          </label>
          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60" data-testid="login-submit">
            <LogIn size={16} /> {busy ? "..." : (lang === "bn" ? "লগইন" : "Login")}
          </button>
        </form>
      </div>
    </div>
  );
}
