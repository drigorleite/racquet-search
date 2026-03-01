import { motion } from "framer-motion";

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Carlos M.",
    level: "Intermediate Player",
    avatar: "CM",
    color: "#22c55e",
    text: "I've been playing for 3 years and never knew what racket to buy. This tool recommended the Blade 98 and it completely transformed my game. My control improved immediately.",
  },
  {
    name: "Sofia R.",
    level: "Beginner",
    avatar: "SR",
    color: "#3b82f6",
    text: "As a beginner, I was overwhelmed by the options. RaqueteSearch asked me a few questions and pointed me to the Clash 100. It's exactly what I needed — super comfortable.",
  },
  {
    name: "André T.",
    level: "Advanced / Club Player",
    avatar: "AT",
    color: "#f59e0b",
    text: "The comparison tool is brilliant. I was deciding between the Pro Staff 97 and the Prestige MP. The side-by-side breakdown made the decision easy. Went with the Prestige and love it.",
  },
  {
    name: "Maria L.",
    level: "Intermediate Player",
    avatar: "ML",
    color: "#8b5cf6",
    text: "The string finder is underrated. I had tennis elbow and it recommended the X-One Biphase. Zero arm pain since switching. This tool genuinely cares about your wellbeing.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#0A1628]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Reviews</div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            What Players Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-white/40 text-xs">{t.level}</div>
                </div>
                <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRO PLAYERS' CHOICES ─────────────────────────────────────────────────────

const proChoices = [
  { player: "Carlos Alcaraz", racket: "Babolat Pure Drive", strings: "Babolat RPM Blast 16L", flag: "🇪🇸" },
  { player: "Novak Djokovic", racket: "Head Speed MP", strings: "Luxilon ALU Power 16L", flag: "🇷🇸" },
  { player: "Rafael Nadal", racket: "Babolat Pure Aero", strings: "Babolat RPM Blast 15L", flag: "🇪🇸" },
  { player: "Jannik Sinner", racket: "Head Speed MP", strings: "Luxilon ALU Power Rough", flag: "🇮🇹" },
  { player: "Daniil Medvedev", racket: "Tecnifibre TF-40 305", strings: "Luxilon ALU Power", flag: "🇷🇺" },
  { player: "Aryna Sabalenka", racket: "Head Speed MP", strings: "Luxilon ALU Power", flag: "🇧🇾" },
];

export function ProChoices() {
  return (
    <section className="py-20 bg-[#0D1E35]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Pro Tour</div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            What the Pros Use
          </h2>
          <p className="text-white/40 text-sm mt-2">Current ATP & WTA tour equipment (2024–2025)</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proChoices.map((p, i) => (
            <motion.div
              key={p.player}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{p.flag}</span>
                <div className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {p.player}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 text-xs mt-0.5 flex-shrink-0">🎾</span>
                  <span className="text-white/70 text-sm">{p.racket}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">🎯</span>
                  <span className="text-white/70 text-sm">{p.strings}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
