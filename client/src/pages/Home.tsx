import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Questionnaire from "@/components/Questionnaire";
import RacketResults from "@/components/RacketResults";
import StringResults from "@/components/StringResults";
import { HowItWorks, BrandsSection, EmailCapture, Footer } from "@/components/LandingSections";
import FeaturedRackets from "@/components/FeaturedRackets";
import { Testimonials, ProChoices } from "@/components/SocialProof";
import { racquetQuestions, stringQuestions } from "@/data/questions";
import { generateRacketRecommendations, generateStringRecommendations, RacketResult, StringResult } from "@/lib/recommendationEngine";

type View =
  | "landing"
  | "racket-quiz"
  | "racket-results"
  | "string-quiz"
  | "string-results";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [racketResults, setRacketResults] = useState<RacketResult[]>([]);
  const [stringResults, setStringResults] = useState<StringResult[]>([]);

  const handleRacketComplete = (answers: Record<string, any>) => {
    const results = generateRacketRecommendations(answers);
    setRacketResults(results);
    setView("racket-results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStringComplete = (answers: Record<string, any>) => {
    const results = generateStringRecommendations(answers);
    setStringResults(results);
    setView("string-results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToLanding = () => {
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Intercept anchor clicks from landing to start quizzes
  const handleFindRacket = () => {
    setView("racket-quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFindStrings = () => {
    setView("string-quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence mode="wait">
      {view === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Navbar />
          <Hero onFindRacket={handleFindRacket} onFindStrings={handleFindStrings} />
          <BrandsSection />
          <HowItWorks />

          {/* Racket quiz trigger section */}
          <section id="racket-quiz" className="py-24 bg-[#0A1628]">
            <div className="container max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Racket Finder</div>
                <h2
                  className="text-3xl md:text-4xl font-black text-white mb-4"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Find Your Ideal Racket
                </h2>
                <p className="text-white/50 mb-8 max-w-xl mx-auto">
                  Our algorithm analyzes your playing style, physical profile, and preferences to match you with the
                  perfect racket from 25+ models.
                </p>
                <button
                  onClick={handleFindRacket}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-[#0A1628] font-bold text-lg px-10 py-4 rounded-xl transition-all btn-glow"
                >
                  🎾 Start Racket Finder
                </button>
              </motion.div>
            </div>
          </section>

          {/* String quiz trigger section */}
          <section id="string-quiz" className="py-24 bg-[#0D1E35]">
            <div className="container max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">String Finder</div>
                <h2
                  className="text-3xl md:text-4xl font-black text-white mb-4"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Find Your Perfect Strings
                </h2>
                <p className="text-white/50 mb-8 max-w-xl mx-auto">
                  Strings make a bigger difference than most players realize. Tell us about your game and we'll match
                  you with the ideal string from 15+ options.
                </p>
                <button
                  onClick={handleFindStrings}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#0A1628] font-bold text-lg px-10 py-4 rounded-xl transition-all"
                  style={{ boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}
                >
                  🎯 Start String Finder
                </button>
              </motion.div>
            </div>
          </section>

          <FeaturedRackets />
          <ProChoices />
          <Testimonials />
          <EmailCapture />
          <Footer />
        </motion.div>
      )}

      {view === "racket-quiz" && (
        <motion.div
          key="racket-quiz"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
        >
          <Questionnaire
            mode="racket"
            questions={racquetQuestions}
            onComplete={handleRacketComplete}
            onBack={goToLanding}
          />
        </motion.div>
      )}

      {view === "racket-results" && (
        <motion.div
          key="racket-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Navbar />
          <RacketResults
            results={racketResults}
            onRestart={() => setView("racket-quiz")}
            onFindStrings={handleFindStrings}
          />
          <Footer />
        </motion.div>
      )}

      {view === "string-quiz" && (
        <motion.div
          key="string-quiz"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35 }}
        >
          <Questionnaire
            mode="string"
            questions={stringQuestions}
            onComplete={handleStringComplete}
            onBack={goToLanding}
          />
        </motion.div>
      )}

      {view === "string-results" && (
        <motion.div
          key="string-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Navbar />
          <StringResults
            results={stringResults}
            onRestart={() => setView("string-quiz")}
            onFindRacket={handleFindRacket}
          />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
