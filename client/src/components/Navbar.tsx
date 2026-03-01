import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-[#0A1628] font-black text-sm">
                RS
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Raquete<span className="text-green-400">Search</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#finder" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Find Racket
            </a>
            <a href="#strings" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Find String
            </a>
            <a href="#how-it-works" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              How It Works
            </a>
            <a
              href="#finder"
              className="bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold text-sm px-4 py-2 rounded-lg transition-all btn-glow"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 flex flex-col gap-3">
            <a href="#finder" className="text-white/80 hover:text-white text-sm font-medium py-1" onClick={() => setMobileOpen(false)}>Find Racket</a>
            <a href="#strings" className="text-white/80 hover:text-white text-sm font-medium py-1" onClick={() => setMobileOpen(false)}>Find String</a>
            <a href="#how-it-works" className="text-white/80 hover:text-white text-sm font-medium py-1" onClick={() => setMobileOpen(false)}>How It Works</a>
            <a href="#finder" className="bg-green-500 text-[#0A1628] font-bold text-sm px-4 py-2 rounded-lg text-center mt-1" onClick={() => setMobileOpen(false)}>Get Started</a>
          </div>
        )}
      </div>
    </header>
  );
}
