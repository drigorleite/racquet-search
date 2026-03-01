import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, BarChart2, ChevronRight } from "lucide-react";
import { rackets, Racket } from "@/data/rackets";

const BRAND_COLORS: Record<string, string> = {
  Wilson: "#C8102E",
  Babolat: "#FF6B00",
  Head: "#1E3A8A",
  Yonex: "#16A34A",
  Tecnifibre: "#0EA5E9",
  Prince: "#7C3AED",
  Dunlop: "#B45309",
};

const ATTR_LABELS = [
  { key: "power", label: "Power" },
  { key: "control", label: "Control" },
  { key: "spin", label: "Spin" },
  { key: "comfort", label: "Comfort" },
  { key: "stability", label: "Stability" },
  { key: "maneuverability", label: "Maneuverability" },
];

const LEVEL_FILTERS = ["All", "Beginner", "Intermediate", "Advanced"];

// Show only top 12 featured rackets
const featured = rackets.slice(0, 12);

function MiniBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="h-1 rounded-full bg-white/10 overflow-hidden flex-1">
      <div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

function CompareModal({ rackets, onClose }: { rackets: Racket[]; onClose: () => void }) {
  if (rackets.length < 2) return null;
  const [a, b] = rackets;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0D1E35] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Racket Comparison
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          {/* Names */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div />
            {[a, b].map(r => (
              <div key={r.id} className="text-center">
                <div
                  className="text-xs font-bold uppercase tracking-wide mb-1"
                  style={{ color: BRAND_COLORS[r.brand] || "#22c55e" }}
                >
                  {r.brand}
                </div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {r.name}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{r.price || "—"}</div>
              </div>
            ))}
          </div>

          {/* Specs */}
          {[
            { label: "Weight", va: `${a.weight}g`, vb: `${b.weight}g` },
            { label: "Head Size", va: `${a.headSize} in²`, vb: `${b.headSize} in²` },
            { label: "Stiffness", va: `${a.stiffness} RA`, vb: `${b.stiffness} RA` },
            { label: "Balance", va: a.balance, vb: b.balance },
            { label: "String Pattern", va: a.stringPattern, vb: b.stringPattern },
            { label: "Player Level", va: a.playerLevel.join(", "), vb: b.playerLevel.join(", ") },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-3 gap-4 py-2.5 border-b border-white/5">
              <div className="text-white/40 text-xs">{row.label}</div>
              <div className="text-white text-xs font-medium text-center">{row.va}</div>
              <div className="text-white text-xs font-medium text-center">{row.vb}</div>
            </div>
          ))}

          {/* Attribute bars */}
          <div className="mt-5 space-y-3">
            {ATTR_LABELS.map(({ key, label }) => {
              const av = Math.round(((a as any)[key] || 0) * 100);
              const bv = Math.round(((b as any)[key] || 0) * 100);
              const aWins = av >= bv;
              return (
                <div key={key} className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-white/40 text-xs text-right">{label}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-white/10 flex-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${av}%`,
                          background: aWins ? "#22c55e" : "#6b7280",
                        }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-6 text-right ${aWins ? "text-green-400" : "text-white/40"}`}>
                      {av}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold w-6 ${!aWins ? "text-amber-400" : "text-white/40"}`}>
                      {bv}
                    </span>
                    <div className="h-2 rounded-full bg-white/10 flex-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${bv}%`,
                          background: !aWins ? "#f59e0b" : "#6b7280",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buy buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[a, b].map(r => (
              <a
                key={r.id}
                href={r.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#FF9900] hover:bg-[#FFB347] text-[#0A1628] font-bold text-sm py-3 rounded-xl transition-all"
              >
                Buy {r.brand} <ExternalLink size={12} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturedRackets() {
  const [levelFilter, setLevelFilter] = useState("All");
  const [compareList, setCompareList] = useState<Racket[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const filtered = featured.filter(r =>
    levelFilter === "All" || r.playerLevel.includes(levelFilter)
  );

  const toggleCompare = (racket: Racket) => {
    setCompareList(prev => {
      if (prev.find(r => r.id === racket.id)) return prev.filter(r => r.id !== racket.id);
      if (prev.length >= 2) return [prev[1], racket];
      return [...prev, racket];
    });
  };

  const isInCompare = (id: number) => compareList.some(r => r.id === id);

  return (
    <section className="py-24 bg-[#0A1628]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-2">Browse</div>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Featured Rackets
            </h2>
            <p className="text-white/40 text-sm mt-1">Select up to 2 to compare side-by-side</p>
          </div>

          {/* Level filter */}
          <div className="flex gap-2 flex-wrap">
            {LEVEL_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setLevelFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  levelFilter === f
                    ? "bg-green-500 text-[#0A1628]"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((racket, i) => {
            const inCompare = isInCompare(racket.id);
            const brandColor = BRAND_COLORS[racket.brand] || "#22c55e";
            return (
              <motion.div
                key={racket.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className={`rounded-xl border p-4 transition-all cursor-pointer ${
                  inCompare
                    ? "border-green-500/60 bg-green-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }`}
                onClick={() => toggleCompare(racket)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: brandColor }}>
                      {racket.brand}
                    </div>
                    <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {racket.name}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {racket.price && (
                      <span className="text-green-400 text-sm font-bold">{racket.price}</span>
                    )}
                    {inCompare && (
                      <span className="text-green-400 text-xs">✓ Selected</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 text-white/40 text-xs mb-3">
                  <span>{racket.weight}g</span>
                  <span>·</span>
                  <span>{racket.headSize} in²</span>
                  <span>·</span>
                  <span>{racket.stringPattern}</span>
                </div>

                {/* Mini attribute bars */}
                <div className="space-y-1.5">
                  {ATTR_LABELS.slice(0, 3).map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-white/30 text-xs w-14 flex-shrink-0">{label}</span>
                      <MiniBar value={(racket as any)[key] || 0} />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1 flex-wrap">
                    {racket.playerLevel.map(l => (
                      <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">{l}</span>
                    ))}
                  </div>
                  {racket.amazonUrl && (
                    <a
                      href={racket.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[#FF9900] hover:text-[#FFB347] transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compare bar */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0D1E35] border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl"
            >
              <BarChart2 size={18} className="text-green-400" />
              <span className="text-white text-sm font-medium">
                {compareList.length === 1
                  ? `${compareList[0].name} selected — pick one more`
                  : `${compareList[0].name} vs ${compareList[1].name}`}
              </span>
              {compareList.length === 2 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold text-sm px-4 py-2 rounded-lg transition-all"
                >
                  Compare <ChevronRight size={14} />
                </button>
              )}
              <button
                onClick={() => setCompareList([])}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare modal */}
        <AnimatePresence>
          {showCompare && compareList.length === 2 && (
            <CompareModal rackets={compareList} onClose={() => setShowCompare(false)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
