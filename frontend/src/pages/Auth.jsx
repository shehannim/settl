import { useState } from "react";
import axios from "axios";
import logo from "../assets/Settl Logo.png";

const API = import.meta.env.VITE_API_URL || "https://settl-backend-s3rc.onrender.com";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!form.email.trim()) return setError("Please enter your email address.");
    if (!form.password || form.password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const payload = isRegister
        ? { full_name: form.fullName.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };
      const response = await axios.post(`${API}/api/auth/${isRegister ? "register" : "login"}`, payload);
      onAuthenticated({
        accessToken: response.data.access_token,
        id: response.data.user_id,
        email: form.email.trim(),
        name: isRegister ? form.fullName.trim() : "",
      });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "We could not reach Settl. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="flex min-h-screen w-full flex-col overflow-hidden bg-white lg:h-screen lg:min-h-0 lg:flex-row">
        <section className="relative flex min-h-[52vh] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#004fc5] via-[#0d62e0] to-[#043b9c] p-8 text-white lg:min-h-0 lg:w-1/2 lg:p-10 xl:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <img src={logo} alt="Settl" className="h-10 sm:h-12 w-auto object-contain" />
          </div>
          <div className="relative z-10 my-7 max-w-lg lg:my-0">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">Your work.<br />Your credit profile.</h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100 lg:text-lg">Underwrite your real freelance earnings across Upwork, Fiverr, PickMe &amp; Daraz into a verified institutional credit score.</p>
            <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-inner backdrop-blur-md">
              <div className="flex items-center gap-4"><strong className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 font-mono text-lg">784</strong><div><p className="text-xs font-medium uppercase tracking-wider text-blue-200">Average Settl Baseline</p><p className="text-sm font-semibold">Unlocked LKR 450,000 credit limit</p></div></div>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3">{[["01 Verify", "Instant Work Auth"], ["02 Consent", "Read-only Stream"], ["03 Score", "Institutional Tier"]].map(([step, detail]) => <div key={step} className="rounded-xl border border-white/10 bg-white/10 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-blue-200">{step}</p><p className="mt-1 text-xs font-semibold">{detail}</p></div>)}</div>
        </section>
        <section className="flex min-h-[48vh] flex-1 flex-col justify-center p-8 sm:p-10 lg:min-h-0 lg:px-10 lg:py-8 xl:px-14">
          <div className="mx-auto w-full max-w-md"><div className="flex justify-end border-b border-slate-100 pb-4"><p className="text-sm text-slate-500">{isRegister ? "Already have an account?" : "New to Settl?"} <button onClick={() => switchMode(isRegister ? "login" : "register")} className="ml-1 font-bold text-[#004fc5] hover:underline">{isRegister ? "Sign in" : "Create an account"}</button></p></div>
          <form onSubmit={submit} className="w-full pt-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{isRegister ? "Start establishing your portable freelancer credit score in under two minutes." : "Sign in to continue building your portable credit profile."}</p>
            <div className="mt-6 space-y-3">
              {isRegister && <Field label="Full name" value={form.fullName} onChange={update("fullName")} placeholder="Kasun Perera" autoComplete="name" />}
              <Field label="Work or personal email" type="email" value={form.email} onChange={update("email")} placeholder="you@domain.com" autoComplete="email" helper={isRegister ? "Use the email linked to your gig accounts when possible." : undefined} />
              <Field label="Password" type="password" value={form.password} onChange={update("password")} placeholder="At least 8 characters" autoComplete={isRegister ? "new-password" : "current-password"} />
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
            <button disabled={loading} className="mt-6 flex w-full items-center justify-center rounded-full bg-[#004fc5] px-6 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#003a94] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Please wait…" : isRegister ? "Continue with email →" : "Sign in →"}</button>
            {isRegister && <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">By signing up, you agree to Settl&apos;s <a href="#" className="font-medium text-slate-600 underline">Terms of Service</a> and <a href="#" className="font-medium text-slate-600 underline">Privacy Policy</a>.</p>}
          </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, helper, ...props }) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return <div><label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label><input id={id} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#004fc5] focus:ring-4 focus:ring-blue-100" {...props} />{helper && <p className="mt-1.5 text-[11px] text-slate-400">{helper}</p>}</div>;
}
