import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Question } from "@/data/questions";

interface Props {
  mode: "racket" | "string";
  questions: Question[];
  onComplete: (answers: Record<string, any>) => void;
  onBack: () => void;
}

const RACKET_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663059447673/KpZHaiY9RFn96ybFsB2KHD/racquet-hero-En4mGxh8Rb5h2WebXyZnAE.webp";
const STRINGS_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663059447673/KpZHaiY9RFn96ybFsB2KHD/strings-hero-SQ89UmwG8csymUWEAioo9s.webp";

export default function Questionnaire({ mode, questions, onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState(1);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    questions.forEach(q => {
      if (q.type === "sliderGroup" && q.attributes) {
        q.attributes.forEach(a => { init[a.key] = a.default; });
      }
    });
    return init;
  });

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const currentAnswer = answers[currentQ.id];
  const isSlider = currentQ.type === "sliderGroup";
  const isAnswered = isSlider ? true : !!currentAnswer;

  const handleOption = useCallback((value: string, text: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: { value, text } }));
  }, [currentQ.id]);

  const handleSlider = useCallback((key: string, val: number) => {
    setSliderValues(prev => ({ ...prev, [key]: val }));
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        type: "sliderGroup",
        attributes: currentQ.attributes?.map(a => ({
          key: a.key,
          label: a.label,
          min: a.min,
          max: a.max,
          default: key === a.key ? val : (sliderValues[a.key] ?? a.default),
        })),
      },
    }));
  }, [currentQ, sliderValues]);

  const goNext = () => {
    if (!isAnswered) return;
    if (isSlider) {
      setAnswers(prev => ({
        ...prev,
        [currentQ.id]: {
          type: "sliderGroup",
          attributes: currentQ.attributes?.map(a => ({
            key: a.key,
            label: a.label,
            min: a.min,
            max: a.max,
            default: sliderValues[a.key] ?? a.default,
          })),
        },
      }));
    }
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(i => i + 1);
    } else {
      const finalAnswers = { ...answers };
      if (isSlider) {
        finalAnswers[currentQ.id] = {
          type: "sliderGroup",
          attributes: currentQ.attributes?.map(a => ({
            key: a.key, label: a.label, min: a.min, max: a.max,
            default: sliderValues[a.key] ?? a.default,
          })),
        };
      }
      onComplete(finalAnswers);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(i => i - 1);
    } else {
      onBack();
    }
  };

  const isLast = currentIndex === questions.length - 1;
  const sideImage = mode === "racket" ? RACKET_IMAGE : STRINGS_IMAGE;

  return (
    <div className="min-h-screen bg-[#0A1628] flex">
      {/* Side image — desktop only */}
      <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 relative overflow-hidden">
        <img src={sideImage} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A1628]" />
        <div className="absolute bottom-12 left-6 right-6">
          <div className="text-white/40 text-xs uppercase tracking-widest mb-2">
            {mode === "racket" ? "Racket Finder" : "String Finder"}
          </div>
          <div className="text-white font-black text-2xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full bg-green-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <button
            onClick={goPrev}
            className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <span className="text-white/40 text-sm">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-16" />
        </div>

        {/* Question area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <h2
                  className="text-2xl md:text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {currentQ.question}
                </h2>
                {currentQ.subtitle && (
                  <p className="text-white/50 text-sm mb-8">{currentQ.subtitle}</p>
                )}

                {/* Radio options */}
                {!isSlider && currentQ.options && (
                  <div className="flex flex-col gap-3">
                    {currentQ.options.map(opt => {
                      const selected = currentAnswer?.value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleOption(opt.value, opt.text)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                            selected
                              ? "border-green-500 bg-green-500/15 text-white"
                              : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                          }`}
                        >
                          {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                          <span className="font-medium flex-1">{opt.text}</span>
                          {selected && <CheckCircle2 size={18} className="text-green-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Slider group */}
                {isSlider && currentQ.attributes && (
                  <div className="flex flex-col gap-6">
                    {currentQ.attributes.map(attr => {
                      const val = sliderValues[attr.key] ?? attr.default;
                      return (
                        <div key={attr.key}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium text-sm">{attr.label}</span>
                            <span className="text-green-400 font-bold text-sm">{val} / {attr.max}</span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min={attr.min}
                              max={attr.max}
                              value={val}
                              onChange={e => handleSlider(attr.key, parseInt(e.target.value))}
                              className="w-full h-2 rounded-full appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #22c55e ${((val - attr.min) / (attr.max - attr.min)) * 100}%, rgba(255,255,255,0.1) 0%)`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-white/30 text-xs mt-1">
                            <span>Not important</span>
                            <span>Very important</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 border-t border-white/10">
          <div className="max-w-xl mx-auto">
            <button
              onClick={goNext}
              disabled={!isAnswered}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all ${
                isAnswered
                  ? "bg-green-500 hover:bg-green-400 text-[#0A1628] btn-glow"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              {isLast ? "See My Results 🏆" : (
                <>Next <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
