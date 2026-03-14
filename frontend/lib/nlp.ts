// ─── Skill taxonomy ──────────────────────────────────────────────────────────
export const SKILL_TAXONOMY: Record<string, string[]> = {
  "Programming Languages": [
    "python", "java", "javascript", "typescript", "c++", "c#", "c", "go", "golang",
    "rust", "kotlin", "swift", "scala", "r", "ruby", "php", "dart", "matlab",
    "perl", "bash", "shell", "powershell", "sql", "plsql", "haskell", "elixir",
  ],
  "ML / AI": [
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "xgboost", "lightgbm",
    "huggingface", "transformers", "bert", "gpt", "llm", "nlp", "computer vision",
    "deep learning", "machine learning", "neural networks", "reinforcement learning",
    "generative ai", "diffusion", "langchain", "openai", "spacy", "nltk",
    "feature engineering", "model training", "fine-tuning", "rag",
  ],
  "Data Engineering": [
    "pandas", "numpy", "spark", "apache spark", "hadoop", "kafka", "airflow",
    "dbt", "etl", "data pipeline", "flink", "hive", "pig", "presto", "dask",
    "polars", "databricks", "snowflake", "bigquery", "redshift", "data warehouse",
    "data lake", "delta lake", "iceberg",
  ],
  "Cloud / DevOps": [
    "aws", "gcp", "azure", "google cloud", "docker", "kubernetes", "k8s",
    "terraform", "ansible", "ci/cd", "jenkins", "github actions", "gitlab ci",
    "mlops", "devops", "linux", "nginx", "helm", "argocd", "prometheus", "grafana",
    "cloudformation", "pulumi",
  ],
  "Web / API": [
    "react", "nextjs", "next.js", "vue", "angular", "svelte", "node.js", "nodejs",
    "express", "fastapi", "flask", "django", "spring", "graphql", "rest", "grpc",
    "html", "css", "tailwind", "typescript", "webpack", "vite", "redux",
  ],
  "Databases": [
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
    "dynamodb", "oracle", "sql server", "sqlite", "neo4j", "vector database",
    "pinecone", "chromadb", "weaviate",
  ],
  "Soft Skills": [
    "communication", "leadership", "teamwork", "problem solving", "agile",
    "scrum", "project management", "presentation", "collaboration", "mentoring",
    "analytical", "critical thinking", "time management",
  ],
};

// ─── Stopwords ────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "must",
  "also", "as", "its", "it", "this", "that", "these", "those", "their",
  "they", "we", "our", "you", "your", "he", "she", "who", "which",
  "such", "more", "other", "each", "about", "using", "work", "working",
  "experience", "years", "year", "strong", "good", "excellent", "knowledge",
  "understanding", "familiarity", "ability", "skills", "skill", "required",
  "preferred", "plus", "bonus", "minimum", "team", "role", "position",
  "candidate", "responsibilities", "requirements", "qualifications",
]);

// ─── Tokenize ─────────────────────────────────────────────────────────────────
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s./#+\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// ─── Extract skills from text ─────────────────────────────────────────────────
export function extractSkills(text: string): Map<string, string> {
  const lower = " " + text.toLowerCase().replace(/[^a-z0-9\s./#+\-]/g, " ") + " ";
  const found = new Map<string, string>(); // skill -> category

  for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
    for (const skill of skills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(lower)) {
        found.set(skill, category);
      }
    }
  }
  return found;
}

// ─── TF-IDF Cosine Similarity ────────────────────────────────────────────────
export function cosineSimilarity(tokensA: string[], tokensB: string[]): number {
  const vocab = new Set([...tokensA, ...tokensB]);
  const freq = (tokens: string[]) => {
    const f: Record<string, number> = {};
    for (const t of tokens) f[t] = (f[t] || 0) + 1;
    return f;
  };
  const fa = freq(tokensA);
  const fb = freq(tokensB);
  let dot = 0, ma = 0, mb = 0;
  for (const w of vocab) {
    const a = (fa[w] || 0) / tokensA.length;
    const b = (fb[w] || 0) / tokensB.length;
    dot += a * b;
    ma += a * a;
    mb += b * b;
  }
  return ma && mb ? dot / (Math.sqrt(ma) * Math.sqrt(mb)) : 0;
}

// ─── Analyze resume vs JD ─────────────────────────────────────────────────────
export interface AnalysisResult {
  matchScore: number;
  semanticScore: number;
  skillScore: number;
  matchedSkills: Array<{ skill: string; category: string }>;
  gapSkills: Array<{ skill: string; category: string; priority: "critical" | "important" | "nice-to-have" }>;
  categoryBreakdown: Array<{ category: string; matched: number; total: number; pct: number }>;
  recommendations: string[];
  verdict: "strong" | "good" | "partial" | "weak";
  verdictText: string;
  resumeSkillCount: number;
  jdSkillCount: number;
}

export function analyzeMatch(resumeText: string, jdText: string): AnalysisResult {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  // Semantic similarity
  const semanticScore = Math.round(cosineSimilarity(resumeTokens, jdTokens) * 100);

  // Skill match
  const matched: Array<{ skill: string; category: string }> = [];
  const gaps: Array<{ skill: string; category: string; priority: "critical" | "important" | "nice-to-have" }> = [];

  const jdSkillArr = [...jdSkills.entries()];
  const totalJdSkills = jdSkillArr.length;

  for (const [skill, category] of jdSkillArr) {
    if (resumeSkills.has(skill)) {
      matched.push({ skill, category });
    } else {
      // Priority heuristic: first 40% of JD = critical, next 40% = important, rest = nice-to-have
      const idx = jdSkillArr.indexOf([skill, category] as any);
      const priority =
        idx < totalJdSkills * 0.4
          ? "critical"
          : idx < totalJdSkills * 0.8
          ? "important"
          : "nice-to-have";
      gaps.push({ skill, category, priority });
    }
  }

  const skillScore = totalJdSkills > 0 ? Math.round((matched.length / totalJdSkills) * 100) : 0;
  const matchScore = Math.round(semanticScore * 0.35 + skillScore * 0.65);

  // Category breakdown
  const catMap: Record<string, { matched: number; total: number }> = {};
  for (const [, cat] of jdSkillArr) {
    if (!catMap[cat]) catMap[cat] = { matched: 0, total: 0 };
    catMap[cat].total++;
  }
  for (const { category } of matched) {
    if (catMap[category]) catMap[category].matched++;
  }
  const categoryBreakdown = Object.entries(catMap)
    .map(([category, { matched: m, total: t }]) => ({
      category,
      matched: m,
      total: t,
      pct: t > 0 ? Math.round((m / t) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Verdict
  let verdict: AnalysisResult["verdict"];
  let verdictText: string;
  if (matchScore >= 78) { verdict = "strong"; verdictText = "Strong match — proceed to application"; }
  else if (matchScore >= 58) { verdict = "good"; verdictText = "Good match — minor skill gaps to address"; }
  else if (matchScore >= 38) { verdict = "partial"; verdictText = "Partial match — upskill before applying"; }
  else { verdict = "weak"; verdictText = "Low match — significant gap exists"; }

  // Recommendations
  const recs: string[] = [];
  const criticalGaps = gaps.filter((g) => g.priority === "critical").slice(0, 3);
  const importantGaps = gaps.filter((g) => g.priority === "important").slice(0, 2);

  if (criticalGaps.length > 0) {
    recs.push(`Prioritize learning: ${criticalGaps.map((g) => g.skill).join(", ")} — listed as core requirements.`);
  }
  if (importantGaps.length > 0) {
    recs.push(`Secondary focus: ${importantGaps.map((g) => g.skill).join(", ")} — adds significant value.`);
  }
  if (skillScore < 60) {
    recs.push("Consider building a project that demonstrably uses 3+ of the missing skills.");
  }
  if (semanticScore < 40) {
    recs.push("Rewrite your resume summary to mirror the language used in this JD for better ATS scoring.");
  }
  if (matchScore >= 70) {
    recs.push("Your profile is competitive. Tailor your cover letter to highlight the matched skill set.");
  }
  if (recs.length === 0) {
    recs.push("Excellent alignment. Focus on quantifying your impact in resume bullet points.");
  }

  return {
    matchScore,
    semanticScore,
    skillScore,
    matchedSkills: matched,
    gapSkills: gaps,
    categoryBreakdown,
    recommendations: recs,
    verdict,
    verdictText,
    resumeSkillCount: resumeSkills.size,
    jdSkillCount: totalJdSkills,
  };
}
