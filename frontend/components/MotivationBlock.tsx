"use client";
import { useEffect, useState } from "react";
import type { Quote } from "@/lib/resources";

export default function MotivationBlock({
  quote,
  verdict,
}: {
  quote: Quote;
  verdict: string;
}) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");

  const verdictColors: Record<string, string> = {
    strong: "#10B981",
    good: "#F59E0B",
    partial: "#7C3AED",
    weak: "#EF4444",
  };
  const color = verdictColors[verdict] || "#00E5FF";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Typewriter effect for the quote text
  useEffect(() => {
    if (!visible) return;
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < quote.text.length) {
        setTyped(quote.text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [visible, quote.text]);

  return (
    <div
      className="border p-6 my-6 transition-all duration-700 relative overflow-hidden"
      style={{
        borderColor: `${color}30`,
        background: `${color}06`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {/* Decorative left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />

      {/* Header */}
      <div className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 pl-3" style={{ color }}>
        System Message
      </div>

      {/* Quote */}
      <blockquote className="pl-3">
        <p
          className="font-display text-xl font-semibold leading-relaxed mb-3"
          style={{ color: "#E2E8F0", minHeight: "1.6em" }}
        >
          {typed}
          {typed.length < quote.text.length && (
            <span className="inline-block w-0.5 h-5 ml-0.5 align-middle animate-blink" style={{ background: color }} />
          )}
        </p>
        <footer className="font-mono text-xs" style={{ color }}>
          — {quote.author}
        </footer>
      </blockquote>

      {/* Decorative corner */}
      <div
        className="absolute bottom-0 right-0 w-16 h-16 opacity-5"
        style={{
          background: `radial-gradient(circle at bottom right, ${color}, transparent)`,
        }}
      />
    </div>
  );
}
