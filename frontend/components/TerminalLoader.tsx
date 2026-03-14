"use client";
import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> SKILLGAP_AI v2.4.1 — initializing...",
  "> Loading NLP kernel...",
  "> Importing skill taxonomy [O*NET v27.0]...",
  "> Mounting cosine similarity engine...",
  "> Warming BERT embedding cache...",
  "> All systems nominal.",
  "> Ready.",
];

export default function TerminalLoader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg grid-bg transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="w-full max-w-xl px-6">
        {/* Logo */}
        <div className="mb-10">
          <div className="font-display text-5xl font-extrabold tracking-tighter text-accent glow-accent glitch-text" data-text="SKILLGAP">
            SKILLGAP
          </div>
          <div className="font-mono text-xs text-dim tracking-[0.4em] mt-1 uppercase">
            Resume Intelligence Platform
          </div>
        </div>

        {/* Terminal window */}
        <div className="bg-surface border border-border rounded-sm bracket-box glow-box overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg/60">
            <div className="w-2.5 h-2.5 rounded-full bg-danger opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-warn opacity-70" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent3 opacity-70" />
            <span className="ml-2 font-mono text-xs text-muted tracking-wider">
              system_boot — bash
            </span>
          </div>
          <div className="p-5 min-h-[220px]">
            {lines.map((line, idx) => (
              <div
                key={idx}
                className="font-mono text-xs leading-relaxed text-accent3 fade-in-up"
                style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
              >
                {line}
              </div>
            ))}
            {!done && (
              <span className="font-mono text-xs text-accent cursor">
                {" "}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-xs text-muted tracking-widest uppercase">Loading</span>
            <span className="font-mono text-xs text-accent">{progress}%</span>
          </div>
          <div className="w-full h-px bg-border overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%`, boxShadow: "0 0 10px rgba(0,229,255,0.8)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
