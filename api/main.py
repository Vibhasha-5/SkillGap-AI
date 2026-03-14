"""
SkillGap.AI — FastAPI Backend
Enhanced NLP analysis with sentence-transformers (optional)
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import re
import math
from collections import Counter

app = FastAPI(
    title="SkillGap.AI API",
    description="Resume–JD NLP match analysis",
    version="2.4.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Skill Taxonomy ───────────────────────────────────────────────────────────
SKILL_TAXONOMY: Dict[str, List[str]] = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "c", "go",
        "golang", "rust", "kotlin", "swift", "scala", "r", "ruby", "php",
        "dart", "matlab", "perl", "bash", "shell", "powershell", "sql",
        "plsql", "haskell", "elixir",
    ],
    "ML / AI": [
        "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn", "xgboost",
        "lightgbm", "huggingface", "transformers", "bert", "gpt", "llm", "nlp",
        "computer vision", "deep learning", "machine learning", "neural networks",
        "reinforcement learning", "generative ai", "diffusion", "langchain",
        "openai", "spacy", "nltk", "feature engineering", "model training",
        "fine-tuning", "rag",
    ],
    "Data Engineering": [
        "pandas", "numpy", "spark", "apache spark", "hadoop", "kafka", "airflow",
        "dbt", "etl", "data pipeline", "flink", "hive", "pig", "presto", "dask",
        "polars", "databricks", "snowflake", "bigquery", "redshift",
        "data warehouse", "data lake", "delta lake", "iceberg",
    ],
    "Cloud / DevOps": [
        "aws", "gcp", "azure", "google cloud", "docker", "kubernetes", "k8s",
        "terraform", "ansible", "ci/cd", "jenkins", "github actions", "gitlab ci",
        "mlops", "devops", "linux", "nginx", "helm", "argocd", "prometheus",
        "grafana", "cloudformation", "pulumi",
    ],
    "Web / API": [
        "react", "nextjs", "next.js", "vue", "angular", "svelte", "node.js",
        "nodejs", "express", "fastapi", "flask", "django", "spring", "graphql",
        "rest", "grpc", "html", "css", "tailwind", "webpack", "vite", "redux",
    ],
    "Databases": [
        "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra",
        "dynamodb", "oracle", "sql server", "sqlite", "neo4j", "vector database",
        "pinecone", "chromadb", "weaviate",
    ],
    "Soft Skills": [
        "communication", "leadership", "teamwork", "problem solving", "agile",
        "scrum", "project management", "presentation", "collaboration",
        "mentoring", "analytical", "critical thinking", "time management",
    ],
}

STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "must",
    "also", "as", "its", "it", "this", "that", "these", "those", "their",
    "they", "we", "our", "you", "your", "he", "she", "who", "which",
    "such", "more", "other", "each", "about", "using", "work", "working",
    "experience", "years", "year", "strong", "good", "excellent",
    "knowledge", "understanding", "familiarity", "ability", "skills",
    "skill", "required", "preferred", "plus", "bonus", "minimum", "team",
    "role", "position", "candidate", "responsibilities", "requirements",
}


def tokenize(text: str) -> List[str]:
    cleaned = re.sub(r"[^a-z0-9\s./#+-]", " ", text.lower())
    tokens = cleaned.split()
    return [t for t in tokens if len(t) > 1 and t not in STOPWORDS]


def extract_skills(text: str) -> Dict[str, str]:
    lower = " " + text.lower().replace(r"[^a-z0-9\s./#+\-]", " ") + " "
    found: Dict[str, str] = {}
    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            pattern = r"\b" + re.escape(skill) + r"\b"
            if re.search(pattern, lower, re.IGNORECASE):
                found[skill] = category
    return found


def cosine_similarity(tokens_a: List[str], tokens_b: List[str]) -> float:
    vocab = set(tokens_a) | set(tokens_b)
    freq_a = Counter(tokens_a)
    freq_b = Counter(tokens_b)
    len_a = max(len(tokens_a), 1)
    len_b = max(len(tokens_b), 1)

    dot = sum(
        (freq_a.get(w, 0) / len_a) * (freq_b.get(w, 0) / len_b)
        for w in vocab
    )
    mag_a = math.sqrt(sum((v / len_a) ** 2 for v in freq_a.values()))
    mag_b = math.sqrt(sum((v / len_b) ** 2 for v in freq_b.values()))
    return dot / (mag_a * mag_b) if mag_a and mag_b else 0.0


# ─── Request / Response models ─────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    resume: str
    job_description: str


class SkillItem(BaseModel):
    skill: str
    category: str
    priority: Optional[str] = None


class CategoryItem(BaseModel):
    category: str
    matched: int
    total: int
    pct: int


class AnalyzeResponse(BaseModel):
    match_score: int
    semantic_score: int
    skill_score: int
    matched_skills: List[SkillItem]
    gap_skills: List[SkillItem]
    category_breakdown: List[CategoryItem]
    recommendations: List[str]
    verdict: str
    verdict_text: str
    resume_skill_count: int
    jd_skill_count: int


# ─── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "online", "version": "2.4.1"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    if not req.resume.strip() or not req.job_description.strip():
        raise HTTPException(status_code=400, detail="Resume and job description are required.")

    resume_tokens = tokenize(req.resume)
    jd_tokens = tokenize(req.job_description)
    resume_skills = extract_skills(req.resume)
    jd_skills = extract_skills(req.job_description)

    semantic_score = round(cosine_similarity(resume_tokens, jd_tokens) * 100)

    jd_skill_list = list(jd_skills.items())
    total = len(jd_skill_list)

    matched_skills = []
    gap_skills = []

    for i, (skill, category) in enumerate(jd_skill_list):
        if skill in resume_skills:
            matched_skills.append(SkillItem(skill=skill, category=category))
        else:
            if i < total * 0.4:
                priority = "critical"
            elif i < total * 0.8:
                priority = "important"
            else:
                priority = "nice-to-have"
            gap_skills.append(SkillItem(skill=skill, category=category, priority=priority))

    skill_score = round((len(matched_skills) / total) * 100) if total > 0 else 0
    match_score = round(semantic_score * 0.35 + skill_score * 0.65)

    # Category breakdown
    cat_map: Dict[str, Dict[str, int]] = {}
    for _, cat in jd_skill_list:
        if cat not in cat_map:
            cat_map[cat] = {"matched": 0, "total": 0}
        cat_map[cat]["total"] += 1

    for item in matched_skills:
        if item.category in cat_map:
            cat_map[item.category]["matched"] += 1

    category_breakdown = [
        CategoryItem(
            category=cat,
            matched=vals["matched"],
            total=vals["total"],
            pct=round((vals["matched"] / vals["total"]) * 100) if vals["total"] > 0 else 0,
        )
        for cat, vals in sorted(cat_map.items(), key=lambda x: -x[1]["total"])
    ]

    # Verdict
    if match_score >= 78:
        verdict, verdict_text = "strong", "Strong match — proceed to application"
    elif match_score >= 58:
        verdict, verdict_text = "good", "Good match — minor skill gaps to address"
    elif match_score >= 38:
        verdict, verdict_text = "partial", "Partial match — upskill before applying"
    else:
        verdict, verdict_text = "weak", "Low match — significant gap exists"

    # Recommendations
    recs = []
    critical = [g.skill for g in gap_skills if g.priority == "critical"][:3]
    important = [g.skill for g in gap_skills if g.priority == "important"][:2]
    if critical:
        recs.append(f"Prioritize learning: {', '.join(critical)} — listed as core requirements.")
    if important:
        recs.append(f"Secondary focus: {', '.join(important)} — adds significant value.")
    if skill_score < 60:
        recs.append("Consider building a project that demonstrably uses 3+ of the missing skills.")
    if semantic_score < 40:
        recs.append("Rewrite your resume summary to mirror language used in this JD for better ATS scoring.")
    if match_score >= 70:
        recs.append("Your profile is competitive. Tailor your cover letter to highlight matched skills.")
    if not recs:
        recs.append("Excellent alignment. Focus on quantifying your impact in resume bullet points.")

    return AnalyzeResponse(
        match_score=match_score,
        semantic_score=semantic_score,
        skill_score=skill_score,
        matched_skills=matched_skills,
        gap_skills=gap_skills,
        category_breakdown=category_breakdown,
        recommendations=recs,
        verdict=verdict,
        verdict_text=verdict_text,
        resume_skill_count=len(resume_skills),
        jd_skill_count=total,
    )
