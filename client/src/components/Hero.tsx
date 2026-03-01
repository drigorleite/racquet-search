import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663059447673/KpZHaiY9RFn96ybFsB2KHD/hero-bg-oTQyMUaYDToKms68dxhac3.webp";

const stats = [
  { value: "25+", label: "Rackets Analyzed" },
  { value: "15+", label: "Strings Catalogued" },
  { value: "9", label: "Questions to Match" },
  { value: "Free", label: "Always" },
];

interface Props {
  onFindRacket: () => void;
  onFindStrings: () => void;
}

export default function Hero({ onFindRacket, onFindStrings }: Props) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/60 to-[#0A1628]" />

      {/* Content */}
      <div className="relative z-10 container text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-medium">AI-Powered Recommendation Engine</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Perfect
            </span>
            <br />
            Tennis Equipment
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Answer 9 questions about your game and our algorithm matches you with the ideal racket and strings — 
            based on real specs, not guesswork.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onFindRacket}
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold text-lg px-8 py-4 rounded-xl transition-all btn-glow"
            >
              🎾 Find My Racket
            </button>
            <button
              onClick={onFindStrings}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all backdrop-blur-sm"
            >
              🎯 Find My String
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4">
                <div className="text-2xl font-black text-green-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
