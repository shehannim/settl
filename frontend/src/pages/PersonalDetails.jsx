import { useState } from "react";
import logo from "../assets/Settl Logo.png";

const steps = ["Personal Details", "Income Stream Link", "PDPA Data Consent", "Settl Score Calibration", "Financing Offers"];
const locations = ["Western — Colombo", "Western — Gampaha", "Central — Kandy", "Southern — Galle", "Northern — Jaffna"];

export default function PersonalDetails({ go }) {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("onboarding_profile") || '{"firstName":"","lastName":"","phone":"","location":"Western — Colombo","language":"English"}'));
  const update = (key) => (event) => setProfile((current) => ({ ...current, [key]: event.target.value }));
  const continueFlow = () => { localStorage.setItem("onboarding_profile", JSON.stringify(profile)); const name = `${profile.firstName} ${profile.lastName}`.trim(); if (name) localStorage.setItem("name", name); go("income-streams"); };
  return <main className="flex min-h-screen flex-col bg-white lg:flex-row">
    <aside className="hidden min-h-screen w-1/2 flex-col justify-between bg-[#eff6ff] p-12 lg:p-14 lg:flex">
      <div>
        <img src={logo} alt="Settl" className="h-10 sm:h-12 w-auto object-contain" />
        <span className="mt-8 inline-block rounded-full border border-blue-100 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#004fc5]">Step 3 of 5</span>
        <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Personal Details</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">We only need the identity basics to issue your alternative credit report.</p>
        <ol className="mt-10 space-y-4">
          {steps.map((step, index) => (
            <li key={step} className={`flex items-center gap-4 ${index ? "opacity-60" : ""}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${index === 0 ? "border-[#004fc5] bg-[#004fc5] text-white" : "border-slate-200 bg-white text-slate-500"}`}>{index + 1}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{step}</p>
                <p className="text-xs text-slate-500">{index === 0 ? "In progress · Legal verification" : "Complete later"}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-xs">
        <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Encrypted institutional identity</p>
        <p className="mt-1.5 text-slate-500 leading-relaxed">Your personal data is encrypted and never sold to third parties.</p>
      </div>
    </aside>

    <section className="flex min-h-screen flex-1 flex-col justify-between p-8 sm:p-12 lg:p-14">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 pb-5">
          <div>
            <img src={logo} alt="Settl" className="mb-5 h-10 sm:h-12 w-auto object-contain lg:hidden" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Let&apos;s get started</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Just the basics for now — you can fill in the rest later.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">~1 min remaining</span>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name" value={profile.firstName} onChange={update("firstName")} placeholder="Kasun" />
          <Field label="Last name" value={profile.lastName} onChange={update("lastName")} placeholder="Perera" />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
          <p className="border-b border-slate-200/60 pb-3 text-xs font-bold uppercase tracking-wider text-slate-700">More details</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Phone number" value={profile.phone} onChange={update("phone")} placeholder="77 412 8901" />
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Residential Province / City</label>
              <select value={profile.location} onChange={update("location")} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-[#004fc5] focus:ring-4 focus:ring-blue-100">
                {locations.map((place) => <option key={place}>{place}</option>)}
              </select>
            </div>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-700">Preferred communication language</p>
          <div className="mt-2 flex gap-2">
            {["English", "සිංහල", "தமிழ்"].map((language) => (
              <button key={language} type="button" onClick={() => setProfile((current) => ({ ...current, language }))} className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold transition-all ${profile.language === language ? "bg-[#004fc5] text-white shadow-sm" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
        <button onClick={() => go("income-streams")} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition">Skip for now</button>
        <button onClick={continueFlow} className="rounded-full bg-[#004fc5] px-7 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#003a94]">Continue to Step 4 →</button>
      </div>
    </section>
  </main>;
}
function Field({ label, ...props }) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return <div><label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label><input id={id} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-[#004fc5] focus:ring-4 focus:ring-blue-100" {...props} /></div>;
}
