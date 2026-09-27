import { useState } from "react";
import logo from "../assets/Settl Logo.png";
const platforms = [["Up", "Upwork", "USD Payouts", "text-[#004fc5]"], ["Fi", "Fiverr", "Global Freelance", "text-emerald-600"], ["PM", "PickMe", "Domestic LKR", "text-amber-600"], ["Dz", "Daraz", "Merchant Store", "text-orange-600"]];
export default function IncomeStreams({ go }) {
  const [notice, setNotice] = useState("");
  return (
    <main className="flex min-h-screen flex-col bg-white lg:flex-row">
      <section className="flex min-h-[46vh] w-full flex-col justify-between bg-gradient-to-br from-[#004fc5] via-[#0043aa] to-[#00388c] p-8 text-white lg:min-h-screen lg:w-1/2 lg:p-14">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Settl" className="h-10 sm:h-12 w-auto object-contain" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Alternative Credit</span>
          </div>
          <h1 className="mt-8 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
            Your Freelance Profile is Ready.
          </h1>
          <p className="mt-4 max-w-lg text-base lg:text-lg leading-relaxed text-blue-100">
            Connect your income sources to calibrate your baseline alternative credit score.
          </p>
        </div>

        <div className="my-8 max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 shadow-inner backdrop-blur-md">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span>Projected baseline</span>
            <span className="rounded-full bg-teal-400/20 px-2.5 py-0.5 normal-case tracking-normal text-teal-200">Ready to Calibrate</span>
          </div>
          <p className="mt-4 font-mono text-4xl font-bold">650 – 750</p>
          <p className="mt-1 text-sm text-blue-100">Tier: Emerging Earner <span className="ml-2 font-semibold text-teal-300">High Confidence</span></p>
        </div>

        <p className="text-xs text-blue-200">🛡️ 256-bit encryption · Sri Lanka PDPA compliant</p>
      </section>

      <section className="flex min-h-[54vh] flex-1 flex-col justify-between p-8 sm:p-12 lg:min-h-screen lg:p-14">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <img src={logo} alt="Settl" className="h-10 sm:h-12 w-auto object-contain" />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Step 4 of 5 · Almost done</span>
          </div>

          <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-slate-900">
            Connect Income Streams
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Link your gig accounts in under 60 seconds with read-only access.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {platforms.map(([short, name, detail, tone]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:bg-white hover:shadow-xs">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-100 bg-white font-bold shadow-sm ${tone}`}>{short}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{name}</h3>
                    <p className="text-xs font-medium text-slate-500">{detail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotice(`${name} connection is coming soon. PayPal is available from Income after setup.`)}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-[#004fc5] shadow-xs transition hover:border-[#004fc5] hover:bg-[#004fc5] hover:text-white"
                >
                  + Connect
                </button>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
            🔒 Bank-grade security: credential-free OAuth connections. Revoke anytime.
          </p>

          {notice && (
            <p role="status" className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-[#004fc5]">
              {notice}
            </p>
          )}
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <button onClick={() => go("dashboard")} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition">
            Skip for now / View Dashboard
          </button>
          <button onClick={() => go("dashboard")} className="w-full rounded-full bg-[#004fc5] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#00388c] sm:w-auto">
            Finish Setup &amp; View Score →
          </button>
        </div>
      </section>
    </main>
  );
}

