import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import cebLogo from "../assets/ceylon-electricity-board-logo-png_seeklogo-226257.png";
import sltLogo from "../assets/SLT.png";
import dialogLogo from "../assets/png-clipart-dialog-axiata-axiata-group-xl-axiata-colombo-dialog-broadband-networks-dialog-axiata-angle-rectangle.png";

const API = import.meta.env.VITE_API_URL || "https://settl-backend-s3rc.onrender.com";

export default function Dashboard({ token, go }) {
  const [score, setScore] = useState(null);
  const [sources, setSources] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [billStatus, setBillStatus] = useState(() => localStorage.getItem("utility_bill_review_status") || "");
  const [verificationScore, setVerificationScore] = useState(() => Number(localStorage.getItem("profile_verification_score") || 0));
  const kycVerified = localStorage.getItem("kyc_verified") === "true";
  const authToken = token || localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${authToken}` };
  const paypal = sources.find((source) => source.source === "paypal");

  const loadSources = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/connect/sources`, { headers: { Authorization: `Bearer ${authToken}` } });
      setSources(response.data.sources || []);
    } catch (requestError) { console.error("Failed to load sources", requestError); }
  }, [authToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => { loadSources(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSources]);

  const uploadBill = async () => {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const form = new FormData(); form.append("file", file);
      const response = await axios.post(`${API}/api/ingest/utility-bill`, form, { headers: { ...headers, "Content-Type": "multipart/form-data" } });
      const nextScore = response.data.profile_verification_score || 0;
      const nextStatus = response.data.status || "";
      setVerificationScore(nextScore); setBillStatus(nextStatus);
      localStorage.setItem("profile_verification_score", String(nextScore));
      localStorage.setItem("utility_bill_review_status", nextStatus);
    } catch (requestError) { setError(requestError.response?.data?.detail || "Bill upload failed."); }
    finally { setUploading(false); }
  };

  const syncPaypal = async () => { setSyncing(true); try { await axios.post(`${API}/api/score/compute`, {}, { headers }); await loadSources(); } finally { setSyncing(false); } };
  const scoreValue = score?.score || 745;
  const sourceRows = paypal ? [{ name: "PayPal income", detail: `${paypal.transaction_count || 0} transactions analyzed`, amount: paypal.account_name || "Connected", status: "Active", icon: "◫" }] : [{ name: "PayPal income", detail: "Connect a verified income stream", amount: "Not connected", status: "Connect", icon: "◫" }];
  const bills = [{ name: "CEB Electricity", amount: "Upload to verify", logo: cebLogo }, { name: "SLT Fibre Broadband", amount: "Upload to verify", logo: sltLogo }, { name: "Dialog Postpaid", amount: "Upload to verify", logo: dialogLogo }];

  return <div className="min-h-[calc(100vh-72px)] bg-[#f8f9ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8"><main className="mx-auto max-w-[1180px]"><header className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Credit Score Insights</h1></div>{kycVerified ? <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#004fc5]">Verified identity</span> : <button onClick={() => go("kyc")} className="rounded-full bg-[#004fc5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#003a94]">Verify identity</button>}</header>
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="relative overflow-hidden rounded-2xl bg-transparent p-6 lg:col-span-5"><div className="py-8"><p className="font-mono text-6xl font-bold tracking-tighter sm:text-7xl">{scoreValue}</p><p className="mt-2 text-sm font-medium text-slate-500">Calculated Settl score</p>{score?.band && <span className="mt-3 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#004fc5]">{score.band}</span>}</div></div>
      <SignalChart />
    </section>
    <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] lg:col-span-6"><SectionTitle title="Connected Income Sources" subtitle="Aggregated income signals and consistency" action="Manage income" onClick={() => go("paypal-dashboard")} />{sourceRows.map((row) => <div key={row.name} className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-[#004fc5]">{row.icon}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{row.name} <span className="ml-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] text-[#004fc5]">{row.status}</span></p><p className="truncate text-[11px] text-slate-400">{row.detail}</p></div></div>{paypal ? <button onClick={syncPaypal} disabled={syncing} className="rounded-full border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#004fc5] hover:bg-blue-50">{syncing ? "Syncing…" : "Sync"}</button> : <button onClick={() => go("paypal-connect")} className="rounded-full bg-[#004fc5] px-3 py-1.5 text-xs font-bold text-white">Connect</button>}</div>)}<div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 p-3.5"><div><p className="text-sm font-bold">Profile verification</p><p className="text-[11px] text-slate-400">Utility bills and identity confidence</p></div><span className="font-mono text-sm font-bold text-[#004fc5]">{verificationScore}%</span></div><button onClick={() => go("paypal-dashboard")} className="mt-4 text-xs font-bold text-[#004fc5] hover:underline">View all streams →</button></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] lg:col-span-6"><SectionTitle title="Latest Utility Bills" subtitle="Repayment signals calibrated for score weight" action="Upload bill" onClick={() => document.getElementById("dashboard-bill").click()} /><input id="dashboard-bill" className="hidden" type="file" accept=".pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />{bills.map((bill) => <div key={bill.name} className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white"><img src={bill.logo} alt="" className="h-full w-full object-contain p-1" /></span><div><p className="text-xs font-bold">{bill.name}</p><p className="text-[10px] text-slate-400">{billStatus === "verified" ? "Verified repayment signal" : bill.amount}</p></div></div><span className="text-[10px] font-bold text-[#004fc5]">{billStatus === "verified" ? "Verified" : "Pending"}</span></div>)}<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="max-w-[200px] truncate text-xs text-slate-500">{file ? file.name : "Select a PDF utility bill"}</span><button onClick={uploadBill} disabled={!file || uploading} className="rounded-full bg-[#004fc5] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{uploading ? "Uploading…" : "Analyze bill"}</button></div></div></section>
    {error && <p role="alert" className="mt-5 text-xs font-medium text-red-600">{error}</p>}
  </main></div>;
}

function SectionTitle({ title, subtitle, action, onClick }) { return <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3"><div><h2 className="text-base font-bold">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{subtitle}</p></div><button onClick={onClick} className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#004fc5] hover:bg-blue-100">{action}</button></div>; }

function SignalChart() { const bars = [{ label: "Income", value: "h-[72%]" }, { label: "Payment", value: "h-[42%]" }, { label: "Platform", value: "h-[65%]" }, { label: "Digital", value: "h-[82%]" }]; return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04)] lg:col-span-7"><h2 className="border-b border-slate-100 pb-3 text-base font-bold">Scoring Signals Weighted Impact</h2><div className="relative mt-5 flex h-40 items-end justify-around border-b border-dashed border-slate-200 px-4">{bars.map((bar) => <div key={bar.label} className="flex h-full flex-col items-center justify-end gap-2"><div className={`w-8 rounded-t-lg bg-[#004fc5] opacity-85 ${bar.value}`} /><span className="text-[10px] font-semibold text-slate-500">{bar.label}</span></div>)}</div><p className="mt-5 text-xs text-slate-500">Signal strength increases as verified income and repayment history are connected.</p></div>; }
