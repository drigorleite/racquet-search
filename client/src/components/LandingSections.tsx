import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, ShoppingCart, CheckCircle } from "lucide-react";

const COURT_TEXTURE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663059447673/KpZHaiY9RFn96ybFsB2KHD/court-texture-2aHseJDaYFLpEGAqqKFWWB.webp";

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

const steps = [
  {
    icon: <Brain size={28} />,
    number: "01",
    title: "Answer 9 Questions",
    desc: "Tell us about your level, swing style, physical build, and what you value most in equipment. Takes 2–3 minutes.",
    color: "#22c55e",
  },
  {
    icon: <Zap size={28} />,
    number: "02",
    title: "Algorithm Analyzes Your Profile",
    desc: "Our weighted scoring engine compares your profile against real specs from 25+ rackets and 15+ strings.",
    color: "#3b82f6",
  },
  {
    icon: <ShoppingCart size={28} />,
    number: "03",
    title: "Get Ranked Recommendations",
    desc: "Receive 5 ranked matches with compatibility scores, full specs, and direct links to buy at the best price.",
    color: "#f59e0b",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0D1E35]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">The Process</div>
          <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}
              <div className="glass-card rounded-2xl p-6 relative z-10">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${step.color}20`, color: step.color }}
                >
                  {step.icon}
                </div>
                <div className="text-white/20 text-5xl font-black mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {step.number}
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BRANDS SECTION ───────────────────────────────────────────────────────────

const brands = [
  { name: "Wilson", color: "#C8102E" },
  { name: "Babolat", color: "#FF6B00" },
  { name: "Head", color: "#1E3A8A" },
  { name: "Yonex", color: "#16A34A" },
  { name: "Tecnifibre", color: "#0EA5E9" },
  { name: "Prince", color: "#7C3AED" },
  { name: "Dunlop", color: "#B45309" },
  { name: "Luxilon", color: "#6B7280" },
  { name: "Solinco", color: "#DC2626" },
];

export function BrandsSection() {
  return (
    <section className="py-16 bg-[#0A1628] border-y border-white/5">
      <div className="container">
        <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-8">
          Equipment from the world's top brands
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {brands.map(brand => (
            <div
              key={brand.name}
              className="px-5 py-2.5 rounded-full border text-sm font-semibold transition-all hover:scale-105"
              style={{
                borderColor: `${brand.color}40`,
                color: brand.color,
                background: `${brand.color}10`,
              }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINDER CTA SECTION ───────────────────────────────────────────────────────

interface FinderCTAProps {
  onFindRacket: () => void;
  onFindStrings: () => void;
}

export function FinderCTA({ onFindRacket, onFindStrings }: FinderCTAProps) {
  return (
    <section
      id="finder"
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0D2B1A 100%)",
      }}
    >
      {/* Court texture overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: `url(${COURT_TEXTURE})` }}
      />
      <div className="relative container text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-4">🎾</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Ready to find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              perfect racket?
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Stop guessing. Our algorithm analyzes 8 key attributes to match you with the ideal equipment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onFindRacket}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold text-lg px-8 py-4 rounded-xl transition-all btn-glow"
            >
              🎾 Find My Racket
            </button>
            <button
              onClick={onFindStrings}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all"
            >
              🎯 Find My String
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── EMAIL CAPTURE ────────────────────────────────────────────────────────────

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 bg-[#0D1E35]">
      <div className="container max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-3xl mb-3">📬</div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Get Gear Tips & New Racket Alerts
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Join 2,000+ tennis players who get our weekly equipment insights. No spam, unsubscribe anytime.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold">
              <CheckCircle size={20} /> You're in! Welcome to the community.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold px-6 py-3 rounded-xl transition-all btn-glow whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          )}
          <p className="text-white/25 text-xs mt-3">
            We respect your privacy. Your email will never be shared.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-[#060E1A] border-t border-white/5 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-[#0A1628] font-black text-xs">
              RS
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Raquete<span className="text-green-400">Search</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-white/40 text-sm justify-center">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#finder" className="hover:text-white transition-colors">Find Racket</a>
            <a href="#strings" className="hover:text-white transition-colors">Find String</a>
          </div>
          <div className="text-white/25 text-xs text-center">
            © 2025 RaqueteSearch · Contains affiliate links
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-white/20 text-xs max-w-2xl mx-auto">
            RaqueteSearch participates in the Amazon Services LLC Associates Program. 
            When you click our links and make a purchase, we earn a small commission at no additional cost to you. 
            This helps us keep the tool free for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
