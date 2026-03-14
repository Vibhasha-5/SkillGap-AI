"use client";
import { useEffect, useState } from "react";

function getBarColor(pct: number) {
  if (pct >= 70) return "#10B981";
  if (pct >= 40) return "#F59E0B";
  return "#EF4444";
}

export default function CategoryBar({
  category,
  matched,
  total,
  pct,
  delay = 0,
}: {
  category: string;
  matched: number;
  total: number;
  pct: number;
  delay?: number;
}) {
  const [width, setWidth] = useState(0);
  const color = getBarColor(pct);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="mb-4 fade-in-up" style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs text-dim tracking-wide">{category}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">
            {matched}/{total}
          </span>
          <span
            className="font-mono text-xs font-semibold"
            style={{ color, minWidth: "32px", textAlign: "right" }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <div className="w-full h-0.5 bg-border overflow-hidden relative">
        <div
          className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 8px ${color}80`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
