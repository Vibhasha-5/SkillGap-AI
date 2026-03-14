"use client";

type Priority = "critical" | "important" | "nice-to-have" | "matched";

const CONFIG: Record<Priority, { bg: string; text: string; border: string; dot: string }> = {
  matched: {
    bg: "rgba(16,185,129,0.08)",
    text: "#10B981",
    border: "rgba(16,185,129,0.25)",
    dot: "#10B981",
  },
  critical: {
    bg: "rgba(239,68,68,0.08)",
    text: "#EF4444",
    border: "rgba(239,68,68,0.25)",
    dot: "#EF4444",
  },
  important: {
    bg: "rgba(245,158,11,0.08)",
    text: "#F59E0B",
    border: "rgba(245,158,11,0.25)",
    dot: "#F59E0B",
  },
  "nice-to-have": {
    bg: "rgba(124,58,237,0.08)",
    text: "#7C3AED",
    border: "rgba(124,58,237,0.25)",
    dot: "#7C3AED",
  },
};

export default function SkillPill({
  skill,
  priority,
}: {
  skill: string;
  priority: Priority;
}) {
  const c = CONFIG[priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-xs tracking-wide mr-1.5 mb-1.5 transition-all duration-200 hover:scale-105 cursor-default"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.dot, boxShadow: `0 0 4px ${c.dot}` }}
      />
      {skill}
    </span>
  );
}
