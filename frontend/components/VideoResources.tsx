"use client";
import { useState } from "react";
import type { VideoResource } from "@/lib/resources";

const LEVEL_COLORS = {
  beginner: { text: "#10B981", bg: "#10B98112", border: "#10B98130" },
  intermediate: { text: "#F59E0B", bg: "#F59E0B12", border: "#F59E0B30" },
  advanced: { text: "#7C3AED", bg: "#7C3AED12", border: "#7C3AED30" },
};

function VideoCard({ video }: { video: VideoResource }) {
  const lc = LEVEL_COLORS[video.level];

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-bg border border-border hover:border-accent/40 transition-all duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "#0D1117" }}>
        <img
          src={`https://img.youtube.com/vi/${video.thumbnail}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-200"
          loading="lazy"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-10 h-10 border border-accent/60 flex items-center justify-center bg-bg/70">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#00E5FF">
              <polygon points="3,1 13,7 3,13" />
            </svg>
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-1.5 right-1.5 bg-bg/90 px-1.5 py-0.5">
          <span className="font-mono text-[10px] text-dim">{video.duration}</span>
        </div>
        {/* Scan line effect on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.05) 2px, rgba(0,229,255,0.05) 4px)"
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="font-body text-xs text-dim leading-snug group-hover:text-text transition-colors line-clamp-2 flex-1">
            {video.title}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted">{video.channel}</span>
          <span
            className="font-mono text-[10px] px-1.5 py-0.5 border capitalize"
            style={{ color: lc.text, background: lc.bg, borderColor: lc.border }}
          >
            {video.level}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function VideoResources({
  videos,
  gapCategories,
}: {
  videos: VideoResource[];
  gapCategories: string[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(videos.map((v) => v.category)))];

  const filtered =
    filter === "all" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div className="bg-surface border border-border p-6 glow-box mt-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="font-mono text-xs text-muted tracking-widest uppercase mb-1">
            Skill Building Resources
          </div>
          <p className="font-body text-xs text-muted leading-relaxed">
            Curated YouTube courses for your{" "}
            {gapCategories.length > 0 ? "gap skill areas" : "learning journey"}
          </p>
        </div>
        <div className="font-mono text-xs text-accent border border-accent/30 px-2 py-1 shrink-0">
          {videos.length} courses
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="font-mono text-[10px] px-2.5 py-1 border tracking-wide transition-all duration-150 capitalize"
            style={{
              borderColor: filter === cat ? "#00E5FF40" : "#1C2333",
              color: filter === cat ? "#00E5FF" : "#4B5563",
              background: filter === cat ? "#00E5FF0A" : "transparent",
            }}
          >
            {cat === "all" ? "All" : cat.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((video) => (
          <VideoCard key={video.url} video={video} />
        ))}
      </div>

      <p className="font-mono text-[10px] text-muted mt-4">
        Opens YouTube in a new tab. All courses are free.
      </p>
    </div>
  );
}
