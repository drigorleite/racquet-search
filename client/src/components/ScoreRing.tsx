import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: number;
  rank?: number;
}

const RANK_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#3b82f6",
  3: "#f59e0b",
  4: "#8b5cf6",
  5: "#ec4899",
};

export default function ScoreRing({ score, size = 80, rank = 1 }: Props) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = RANK_COLORS[rank] || "#22c55e";
  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={6}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-fill"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-black text-white leading-none" style={{ fontSize: size * 0.22, fontFamily: 'Outfit, sans-serif' }}>
          {score}%
        </span>
      </div>
    </div>
  );
}
