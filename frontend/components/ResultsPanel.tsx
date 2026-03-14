"use client";
import { useEffect, useRef, useMemo } from "react";
import type { AnalysisResult } from "@/lib/nlp";
import { getRandomQuote, getRelevantVideos } from "@/lib/resources";
import ScoreRing from "./ScoreRing";
import SkillPill from "./SkillPill";
import CategoryBar from "./CategoryBar";
import MotivationBlock from "./MotivationBlock";
import VideoResources from "./VideoResources";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-surface border border-border p-4 bracket-box glow-box relative overflow-hidden">
      <div className="font-mono text-xs text-muted tracking-widest uppercase mb-1">{label}</div>
      <div className="font-display text-3xl font-extrabold" style={{ color: color || "#E2E8F0" }}>
        {value}
      </div>
      {sub && <div className="font-mono text-xs text-muted mt-1">{sub}</div>}
      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-8 h-8 opacity-10"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${color || "#00E5FF"} 50%)`,
        }}
      />
    </div>
  );
}

function getVerdictColor(verdict: string) {
  if (verdict === "strong") return "#10B981";
  if (verdict === "good") return "#F59E0B";
  if (verdict === "partial") return "#7C3AED";
  return "#EF4444";
}

export default function ResultsPanel({ result }: { result: AnalysisResult }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const radarData = result.categoryBreakdown.slice(0, 6).map((c) => ({
    subject: c.category.split(" ")[0],
    score: c.pct,
    fullMark: 100,
  }));

  const verdictColor = getVerdictColor(result.verdict);

  // Stable quote and videos per result (useMemo keyed on matchScore)
  const quote = useMemo(() => getRandomQuote(result.verdict), [result.verdict, result.matchScore]);
  const gapCategories = useMemo(
    () => [...new Set(result.gapSkills.map((g) => g.category))],
    [result.gapSkills]
  );
  const videos = useMemo(
    () => getRelevantVideos(gapCategories),
    [gapCategories]
  );

  return (
    <div ref={ref} className="w-full mt-8 fade-in-up" style={{ opacity: 0 }}>
      {/* Header bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <span className="font-mono text-xs text-dim tracking-[0.4em] uppercase">Analysis Output</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
      </div>

      {/* Verdict banner */}
      <div
        className="border px-5 py-3 mb-6 flex items-center gap-3 font-mono text-sm"
        style={{ borderColor: `${verdictColor}40`, background: `${verdictColor}08` }}
      >
        <span style={{ color: verdictColor }}>{">"}</span>
        <span style={{ color: verdictColor }}>{result.verdictText}</span>
        <span className="ml-auto text-xs text-muted">
          {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC
        </span>
      </div>

      {/* Score + metrics row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: ring + sub-scores */}
        <div className="bg-surface border border-border p-6 bracket-box glow-box flex flex-col items-center gap-6">
          <ScoreRing score={result.matchScore} />
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="border border-border p-3 text-center">
              <div className="font-mono text-xs text-muted mb-1">Skill Match</div>
              <div className="font-display text-2xl font-bold text-warn">{result.skillScore}%</div>
            </div>
            <div className="border border-border p-3 text-center">
              <div className="font-mono text-xs text-muted mb-1">Semantic</div>
              <div className="font-display text-2xl font-bold text-accent">{result.semanticScore}%</div>
            </div>
          </div>
        </div>

        {/* Right: Radar chart */}
        <div className="bg-surface border border-border p-6 bracket-box glow-box">
          <div className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
            Skill Radar
          </div>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1C2333" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#4B5563", fontSize: 10, fontFamily: "JetBrains Mono" }}
                />
                <Radar
                  name="Match"
                  dataKey="score"
                  stroke="#00E5FF"
                  fill="#00E5FF"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0D1117",
                    border: "1px solid #1C2333",
                    fontFamily: "JetBrains Mono",
                    fontSize: "11px",
                    color: "#E2E8F0",
                  }}
                  formatter={(val: number) => [`${val}%`, "Match"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-muted font-mono text-xs">
              No categorized skills detected
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Matched" value={result.matchedSkills.length} color="#10B981" />
        <MetricCard label="Gap Skills" value={result.gapSkills.length} color="#EF4444" />
        <MetricCard label="JD Skills" value={result.jdSkillCount} color="#00E5FF" />
        <MetricCard label="Your Skills" value={result.resumeSkillCount} color="#7C3AED" />
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface border border-border p-6 glow-box">
          <div className="font-mono text-xs text-muted tracking-widest uppercase mb-5">
            Category Breakdown
          </div>
          {result.categoryBreakdown.length > 0 ? (
            result.categoryBreakdown.map((c, i) => (
              <CategoryBar
                key={c.category}
                {...c}
                delay={i * 80}
              />
            ))
          ) : (
            <p className="font-mono text-xs text-muted">No category data available.</p>
          )}
        </div>

        {/* Skills panels */}
        <div className="flex flex-col gap-4">
          {/* Matched */}
          <div className="bg-surface border border-border p-5 flex-1 glow-box">
            <div className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent3 inline-block" style={{ boxShadow: "0 0 6px #10B981" }} />
              <span className="text-muted">Matched Skills</span>
              <span className="ml-auto text-accent3">{result.matchedSkills.length}</span>
            </div>
            <div className="flex flex-wrap">
              {result.matchedSkills.length > 0 ? (
                result.matchedSkills.map(({ skill }) => (
                  <SkillPill key={skill} skill={skill} priority="matched" />
                ))
              ) : (
                <span className="font-mono text-xs text-muted">No skills matched</span>
              )}
            </div>
          </div>

          {/* Gap skills */}
          <div className="bg-surface border border-border p-5 flex-1 glow-box">
            <div className="font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" style={{ boxShadow: "0 0 6px #EF4444" }} />
              <span className="text-muted">Gap Skills — Priority Order</span>
              <span className="ml-auto text-danger">{result.gapSkills.length}</span>
            </div>
            <div className="flex flex-wrap">
              {result.gapSkills.length > 0 ? (
                result.gapSkills.map(({ skill, priority }) => (
                  <SkillPill key={skill} skill={skill} priority={priority} />
                ))
              ) : (
                <span className="font-mono text-xs text-accent3">No gaps — excellent fit</span>
              )}
            </div>
            {result.gapSkills.length > 0 && (
              <div className="flex gap-4 mt-4 pt-3 border-t border-border">
                {(["critical", "important", "nice-to-have"] as const).map((p) => {
                  const count = result.gapSkills.filter((g) => g.priority === p).length;
                  const colors = { critical: "#EF4444", important: "#F59E0B", "nice-to-have": "#7C3AED" };
                  return (
                    <div key={p} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colors[p] }} />
                      <span className="font-mono text-xs text-muted capitalize">{p.replace("-", " ")} ({count})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-surface border border-border p-6 glow-box mb-6">
        <div className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
          Recommendations
        </div>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex gap-3 font-mono text-xs leading-relaxed fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
            >
              <span className="text-accent shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
              <span className="text-dim">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resume bullet templates */}
      <div className="bg-surface border border-border p-6 glow-box">
        <div className="font-mono text-xs text-muted tracking-widest uppercase mb-4">
          Resume Bullet Templates
        </div>
        <div className="space-y-3">
          {[
            `Built NLP pipeline using TF-IDF cosine similarity achieving ${result.matchScore}%+ skill-match accuracy across 200+ resume-JD pairs`,
            `Extracted ${result.jdSkillCount > 0 ? result.jdSkillCount + "+" : "50+"} domain-specific skills via spaCy NER and O*NET taxonomy; surfaced prioritized gap list per candidate`,
            `Deployed REST API on FastAPI with Next.js frontend; processed 500+ queries during placement pilot`,
          ].map((bullet, i) => (
            <div
              key={i}
              className="group relative border border-border bg-bg px-4 py-3 font-mono text-xs text-dim leading-relaxed hover:border-accent/30 transition-colors cursor-pointer"
              onClick={() => {
                navigator.clipboard?.writeText("• " + bullet).catch(() => {});
              }}
              title="Click to copy"
            >
              <span className="text-accent mr-2">•</span>
              {bullet}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] tracking-wider">
                COPY
              </span>
            </div>
          ))}
        </div>
        <p className="font-mono text-xs text-muted mt-3">Click any bullet to copy.</p>
      </div>

      {/* Motivational Quote */}
      <MotivationBlock quote={quote} verdict={result.verdict} />

      {/* YouTube Learning Resources */}
      <VideoResources videos={videos} gapCategories={gapCategories} />
    </div>
  );
}
