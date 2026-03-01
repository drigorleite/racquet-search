import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, RotateCcw, Target } from "lucide-react";
import { RacketResult } from "@/lib/recommendationEngine";
import ScoreRing from "./ScoreRing";

interface Props {
  results: RacketResult[];
  onRestart: () => void;
  onFindStrings: () => void;
}

const BRAND_COLORS: Record<string, string> = {
  Wilson: "#C8102E",
  Babolat: "#FF6B00",
  Head: "#1E3A8A",
  Yonex: "#16A34A",
  Tecnifibre: "#0EA5E9",
  Prince: "#7C3AED",
  Dunlop: "#B45309",
};

const ATTR_LABELS: Record<string, string> = {
  power: "Power",
  control: "Control",
  spin: "Spin",
  maneuverability: "Maneuverability",
  feel: "Feel",
  stability: "Stability",
  comfort: "Comfort",
  forgiveness: "Forgiveness",
};

function AttributeBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80 font-medium">{pct}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function RacketCard({ racket, index }: { racket: RacketResult; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const brandColor = BRAND_COLORS[racket.brand] || "#22c55e";
  const isTop = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`rounded-2xl border overflow-hidden ${
        isTop
          ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent"
          : "border-white/10 bg-white/5"
      }`}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Rank badge */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: brandColor }}
        >
          {racket.rank}
        </div>

        {/* Score ring */}
        <ScoreRing score={racket.score} size={72} rank={racket.rank} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {racket.name}
            </h3>
            {isTop && (
              <span className="bg-green-500 text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                Best Match
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-white/50 text-sm">{racket.brand}</span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/50 text-sm">{racket.weight}g</span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-white/50 text-sm">{racket.headSize} in²</span>
            {racket.price && (
              <>
                <span className="text-white/30 text-xs">•</span>
                <span className="text-green-400 text-sm font-semibold">{racket.price}</span>
              </>
            )}
          </div>
        </div>

        <button className="text-white/40 hover:text-white transition-colors flex-shrink-0">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-white/10 px-5 pb-5 pt-4"
        >
          <p className="text-white/60 text-sm mb-5 leading-relaxed">{racket.description}</p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Weight", value: `${racket.weight}g` },
              { label: "Head Size", value: `${racket.headSize} in²` },
              { label: "Stiffness", value: `${racket.stiffness} RA` },
              { label: "Balance", value: racket.balance },
              { label: "String Pattern", value: racket.stringPattern },
              { label: "Player Level", value: racket.playerLevel.join(", ") },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-lg p-3">
                <div className="text-white/40 text-xs mb-1">{s.label}</div>
                <div className="text-white text-sm font-semibold">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Attribute bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {Object.entries(ATTR_LABELS).map(([key, label]) => (
              <AttributeBar key={key} label={label} value={(racket as any)[key] || 0} />
            ))}
          </div>

          {/* Play styles */}
          <div className="flex flex-wrap gap-2 mb-5">
            {racket.playStyle.map(s => (
              <span key={s} className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>

          {/* Affiliate CTA */}
          {racket.amazonUrl && (
            <a
              href={racket.amazonUrl}
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

export default function RacketResults({ results, onRestart, onFindStrings }: Props) {
  return (
    <div className="min-h-screen bg-[#0A1628] pt-20 pb-16">
      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-4xl mb-3">🏆</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Your Racket Recommendations
          </h1>
          <p className="text-white/50">Ranked by compatibility with your player profile</p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-4 mb-10">
          {results.map((r, i) => (
            <RacketCard key={r.id} racket={r} index={i} />
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

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 py-3 rounded-xl transition-all"
          >
            <RotateCcw size={16} /> Retake Quiz
          </button>
          <button
            onClick={onFindStrings}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold py-3 rounded-xl transition-all btn-glow"
          >
            <Target size={16} /> Find My Strings
          </button>
        </div>
      </div>
    </div>
  );
}
