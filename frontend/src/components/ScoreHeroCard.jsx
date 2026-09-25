/**
 * @param {{
 *   score: number;
 *   band: "Poor" | "Fair" | "Good" | "Very Good" | "Excellent";
 *   confidence: number;
 *   verification: "verified" | "pending" | "needs_review";
 *   improvementTip?: string;
 *   collapsed?: boolean;
 * }} props
 */
export default function ScoreHeroCard({
  score,
  band,
  confidence,
  verification,
  improvementTip,
  collapsed = false,
}) {
  const safeConfidence = Math.min(1, Math.max(0, Number(confidence) || 0));
  const confidenceHelper = safeConfidence < 0.5
    ? "Add another source to strengthen this score"
    : safeConfidence < 0.8
      ? "Getting there — one more source helps"
      : "Backed by strong, recent data";

  const glass = "relative overflow-hidden rounded-3xl border border-white/30 bg-[linear-gradient(135deg,rgba(0,79,197,0.88),rgba(69,143,232,0.64))] shadow-[0_20px_55px_rgba(0,79,197,0.22)] backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]";

  if (collapsed) {
    return (
      <section aria-label="Settl score summary" className={`${glass} flex min-h-16 items-center gap-4 px-5 py-3 sm:px-6`}>
        <span className="font-mono text-3xl font-bold tracking-[-0.06em] text-white">{score}</span>
        <span aria-hidden="true" className="h-7 w-px bg-white/20" />
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-sm font-semibold text-white">{safeConfidence.toFixed(2)}</span>
          <span className="text-xs font-medium text-blue-50/80">Confidence</span>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Your Settl Score" className={`${glass} min-w-0 p-8 sm:p-10`}>
      {verification === "verified" ? (
        <div aria-label="Profile verified" title="Profile verified" className="absolute right-7 top-7 flex h-5 w-5 items-center justify-center rounded-full border border-white/40 bg-white/20 text-xs font-bold text-white backdrop-blur-md">✓</div>
      ) : (
        <div className="absolute right-6 top-6 rounded-full border border-amber-100/40 bg-amber-400/20 px-3 py-1.5 text-xs font-semibold text-amber-50 backdrop-blur-md sm:right-8 sm:top-8">
          {verification === "pending" ? "Verifying" : "Needs Review"}
        </div>
      )}

      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-50/70">Your Settl Score</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-6xl font-bold leading-none tracking-[-0.075em] text-white sm:text-7xl">{score}</span>
        <span className="rounded-full border border-white/20 bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">{band}</span>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold text-white">{safeConfidence.toFixed(2)}</span>
          <span className="text-sm font-medium text-blue-50/90">Confidence</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-blue-50/75">{confidenceHelper}</p>
      </div>

      {improvementTip && (
        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="flex items-center gap-2 text-sm leading-6 text-blue-50/80"><span aria-hidden="true">→</span>{improvementTip}</p>
        </div>
      )}
    </section>
  );
}
