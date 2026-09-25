import { useState } from "react";
import logo from "./assets/Settl Logo Black.png";
import Auth from "./pages/Auth.jsx";
import KYC from "./pages/KYC.jsx";
import PersonalDetails from "./pages/PersonalDetails.jsx";
import IncomeStreams from "./pages/IncomeStreams.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BillUpload from "./pages/BillUpload.jsx";
import PayPalConnect from "./pages/PayPalConnect.jsx";
import PayPalCallback from "./pages/PayPalCallback.jsx";
import PayPalDashboard from "./pages/PayPalDashboard.jsx";
import PayPalSuccess from "./pages/PayPalSuccess.jsx";

const onboardingPages = new Set(["auth", "kyc", "personal-details", "income-streams"]);

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [page, setPage] = useState(() => {
    if (window.location.search.includes("code=")) return "paypal-callback";
    if (window.location.pathname.includes("/connect/paypal/success")) return "paypal-success";
    return localStorage.getItem("token") ? "dashboard" : "auth";
  });

  const go = (nextPage) => setPage(nextPage);

  const completeAuth = ({ accessToken, id, email, name }) => {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("userId", id);
    if (email) localStorage.setItem("email", email);
    if (name) localStorage.setItem("name", name);
    setToken(accessToken);
    setUserId(id);
    go("kyc");
  };

  const logout = () => {
    ["token", "userId", "user_id", "email", "name", "kyc_verified", "kyc_status"].forEach((key) => localStorage.removeItem(key));
    setToken("");
    setUserId("");
    go("auth");
  };

  if (onboardingPages.has(page)) {
    if (page === "auth") return <Auth onAuthenticated={completeAuth} />;
    if (page === "kyc") return <KYC token={token} go={go} />;
    if (page === "personal-details") return <PersonalDetails go={go} />;
    return <IncomeStreams go={go} />;
  }

  const userName = localStorage.getItem("name") || "Your profile";
  const tabs = [["dashboard", "Dashboard"], ["paypal-dashboard", "Income"], ["bill-upload", "Bills"]];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <button onClick={() => go("dashboard")} className="flex items-center gap-2.5" aria-label="Settl dashboard">
            <img src={logo} alt="Settl" className="h-14 w-14 object-contain" />
          </button>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {tabs.map(([id, label]) => <button key={id} onClick={() => go(id)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === id ? "bg-[#004fc5] text-white" : "text-slate-600 hover:bg-blue-50 hover:text-[#004fc5]"}`}>{label}</button>)}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-500 sm:block">{userName}</span>
            <button onClick={logout} className="rounded-full border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">Sign out</button>
          </div>
        </div>
      </header>
      <main>
        {page === "dashboard" && <Dashboard token={token} userId={userId} go={go} />}
        {page === "bill-upload" && <BillUpload token={token} go={go} />}
        {page === "paypal-connect" && <PayPalConnect go={go} />}
        {page === "paypal-callback" && <PayPalCallback go={go} setUserId={setUserId} />}
        {page === "paypal-success" && <PayPalSuccess go={go} />}
        {page === "paypal-dashboard" && <PayPalDashboard go={go} />}
      </main>
    </div>
  );
}
