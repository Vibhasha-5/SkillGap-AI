"use client";
import { useEffect, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 80; // r=80 → 502.65

function getColor(score: number) {
  if (score >= 75) return "#10B981";
  if (score >= 55) return "#F59E0B";
  if (score >= 35) return "#7C3AED";
  return "#EF4444";
}

function getLabel(score: number) {
  if (score >= 75) return "STRONG";
  if (score >= 55) return "GOOD";
  if (score >= 35) return "PARTIAL";
  return "WEAK";
}

export default function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * animated) / 100;
  const color = getColor(score);
  const label = getLabel(score);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Outer glow ring */}
        <circle
          cx="100" cy="100" r="88"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.1"
        />
        {/* Track */}
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke="#1C2333"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="butt"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          style={{
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)",
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
        {/* Inner decoration rings */}
        <circle cx="100" cy="100" r="66" fill="none" stroke="#1C2333" strokeWidth="0.5" opacity="0.5" />
        <circle cx="100" cy="100" r="72" fill="none" stroke="#1C2333" strokeWidth="0.5" opacity="0.3" />

        {/* Score number */}
        <text
          x="100" y="92"
          textAnchor="middle"
          fontFamily="'Syne', sans-serif"
          fontWeight="800"
          fontSize="36"
          fill={color}
        >
          {animated}
        </text>
        {/* Percent */}
        <text
          x="100" y="110"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="400"
          fontSize="11"
          fill="#94A3B8"
          letterSpacing="3"
        >
          MATCH
        </text>
        {/* Label */}
        <text
          x="100" y="128"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="700"
          fontSize="10"
          fill={color}
          letterSpacing="4"
        >
          {label}
        </text>
      </svg>

      {/* Tick marks */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" className="absolute">
          {[0, 25, 50, 75, 100].map((pct) => {
            const angle = ((pct / 100) * 360 - 90) * (Math.PI / 180);
            const r1 = 76, r2 = 84;
            const x1 = 100 + r1 * Math.cos(angle);
            const y1 = 100 + r1 * Math.sin(angle);
            const x2 = 100 + r2 * Math.cos(angle);
            const y2 = 100 + r2 * Math.sin(angle);
            return (
              <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2D3748" strokeWidth="1.5" />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
