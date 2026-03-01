import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, RotateCcw, Zap } from "lucide-react";
import { StringResult } from "@/lib/recommendationEngine";
import ScoreRing from "./ScoreRing";

interface Props {
  results: StringResult[];
  onRestart: () => void;
  onFindRacket: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  "Natural Gut": "#F59E0B",
  "Polyester": "#3B82F6",
  "Multifilament": "#22C55E",
  "Synthetic Gut": "#8B5CF6",
};

const STRING_ATTRS = [
  { key: "power", label: "Power" },
  { key: "control", label: "Control" },
  { key: "spin", label: "Spin" },
  { key: "comfort", label: "Comfort" },
  { key: "durability", label: "Durability" },
];

function StringCard({ string, index }: { string: StringResult; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const typeColor = TYPE_COLORS[string.type] || "#22c55e";
  const isTop = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`rounded-2xl border overflow-hidden ${
        isTop ? "border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-transparent" : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: typeColor }}
        >
          {string.rank}
        </div>
        <ScoreRing score={string.score} size={72} rank={string.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {string.name}
            </h3>
            {isTop && (
              <span className="bg-amber-500 text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                Best Match
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-white/50 text-sm">{string.brand}</span>
            <span className="text-white/30 text-xs">•</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${typeColor}25`, color: typeColor }}
            >
              {string.type}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/50 text-sm">{string.gauge}</span>
            {string.priceLabel && (
              <>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-amber-400 text-sm font-semibold">{string.priceLabel}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {string.arm_friendly ? (
              <span className="text-green-400 text-xs flex items-center gap-1">✓ Arm-friendly</span>
            ) : (
              <span className="text-orange-400 text-xs flex items-center gap-1">⚠ Not arm-friendly</span>
            )}
          </div>
        </div>
        <button className="text-white/40 hover:text-white transition-colors flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 px-5 pb-5 pt-4"
        >
          <p className="text-white/60 text-sm mb-5 leading-relaxed">{string.description}</p>

          {/* Recommended tension */}
          {string.recommended_tension && (
            <div className="bg-white/5 rounded-lg p-3 mb-5 flex items-center gap-3">
              <Zap size={16} className="text-amber-400 flex-shrink-0" />
              <div>
                <div className="text-white/40 text-xs">Recommended Tension</div>
                <div className="text-white font-semibold text-sm">{string.recommended_tension}</div>
              </div>
            </div>
          )}

          {/* Attribute bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {STRING_ATTRS.map(({ key, label }) => {
              const val = (string as any)[key] || 0;
              const pct = Math.round(val * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{label}</span>
                    <span className="text-white/80 font-medium">{pct}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: typeColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="text-green-400 text-xs font-semibold uppercase tracking-wide mb-2">Pros</div>
              <ul className="space-y-1">
                {string.pros.map(p => (
                  <li key={p} className="text-white/60 text-xs flex items-start gap-1.5">
                    <span className="text-green-400 mt-0.5">+</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-red-400 text-xs font-semibold uppercase tracking-wide mb-2">Cons</div>
              <ul className="space-y-1">
                {string.cons.map(c => (
                  <li key={c} className="text-white/60 text-xs flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Affiliate CTA */}
          {string.amazonUrl && (
            <a
              href={string.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#FF9900] hover:bg-[#FFB347] text-[#0A1628] font-bold py-3 rounded-xl transition-all"
            >
              <span>🛒</span>
              Check Price on Amazon
              <ExternalLink size={14} />
            </a>
          )}
          <p className="text-white/25 text-xs text-center mt-2">
            Affiliate link — we may earn a small commission at no extra cost to you.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function StringResults({ results, onRestart, onFindRacket }: Props) {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-20 pb-16">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your String Recommendations
          </h1>
          <p className="text-white/50">Ranked by compatibility with your playing style</p>
        </motion.div>

        <div className="flex flex-col gap-4 mb-10">
          {results.map((s, i) => (
            <StringCard key={s.id} string={s} index={i} />
          ))}
        </div>

        {/* AdSense placeholder */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center mb-8">
          <p className="text-white/20 text-xs">Advertisement</p>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-9440937515445471"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 py-3 rounded-xl transition-all"
          >
            <RotateCcw size={16} /> Retake Quiz
          </button>
          <button
            onClick={onFindRacket}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold py-3 rounded-xl transition-all btn-glow"
          >
            <Zap size={16} /> Find My Racket
          </button>
        </div>
      </div>
    </div>
  );
}
