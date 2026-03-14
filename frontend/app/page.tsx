"use client";
import { useState, useCallback } from "react";
import TerminalLoader from "@/components/TerminalLoader";
import ResultsPanel from "@/components/ResultsPanel";
import DropZone from "@/components/DropZone";
import { analyzeMatch, type AnalysisResult } from "@/lib/nlp";

const DEMO_RESUME = `EDUCATION
B.Tech Computer Science — Mumbai University, 2025
CGPA: 8.6/10

SKILLS
Languages: Python, JavaScript, TypeScript, SQL, Bash
ML/AI: TensorFlow, scikit-learn, NLTK, spaCy, BERT, Pandas, NumPy
Web: React, Next.js, Flask, REST APIs, Node.js
Tools: Git, Linux, Docker, Tableau

PROJECTS
Sentiment Analysis Engine (2024)
- Built LSTM-based sentiment classifier using TensorFlow achieving 91% accuracy on 50K tweet dataset
- Processed text pipeline with NLTK tokenization and TF-IDF feature extraction
- Deployed REST API via Flask, handling 200+ requests/hour

Resume Parser Tool (2024)
- Extracted structured data from PDF resumes using spaCy NER
- Reduced manual screening time by 60% for campus placement committee

EXPERIENCE
Data Science Intern — TechCorp, Summer 2024
- Developed ML classification models with Python and scikit-learn
- Built dashboards in Tableau for business stakeholders
- Collaborated in Agile sprints; used Git for version control`;

const DEMO_JD = `Senior ML Engineer — AI Platform Team

We are looking for a skilled ML Engineer to join our AI platform team.

Required Skills:
- Python (5+ years), PyTorch, TensorFlow
- Deep learning, NLP, BERT, Transformers, Hugging Face
- MLOps: Docker, Kubernetes, CI/CD, GitHub Actions
- Cloud: AWS or GCP (EC2, S3, SageMaker)
- SQL, Spark for data engineering
- REST API design, FastAPI or Flask

Responsibilities:
- Design and train large-scale NLP models
- Build and maintain ML pipelines in production
- Deploy models using Docker and Kubernetes on AWS
- Collaborate with data engineers on Spark pipelines
- Monitor model performance with Prometheus/Grafana

Nice to have:
- LLM fine-tuning, RAG pipelines, LangChain
- React frontend experience
- Scala or Go
- Vector databases (Pinecone, ChromaDB)`;

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(() => {
    if (!resume.trim() || !jd.trim()) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setAnalyzing(true);
    setResult(null);
    // Small delay for terminal feel
    setTimeout(() => {
      try {
        const r = analyzeMatch(resume, jd);
        setResult(r);
      } catch {
        setError("Analysis failed. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    }, 800);
  }, [resume, jd]);

  const handleDemo = useCallback(() => {
    setResume(DEMO_RESUME);
    setJd(DEMO_JD);
    setResult(null);
    setError("");
  }, []);

  const handleReset = useCallback(() => {
    setResume("");
    setJd("");
    setResult(null);
    setError("");
  }, []);

  return (
    <>
      {!booted && <TerminalLoader onComplete={() => setBooted(true)} />}

      <div className={`min-h-screen bg-bg grid-bg transition-opacity duration-700 ${booted ? "opacity-100" : "opacity-0"}`}>
        {/* Nav */}
        <nav className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ boxShadow: "0 0 8px #00E5FF" }} />
              <span className="font-display font-bold text-lg tracking-tight text-text">
                SKILLGAP<span className="text-accent">.</span>AI
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-xs text-muted hidden sm:block">
                NLP Resume Intelligence
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-accent3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent3 animate-pulse" style={{ boxShadow: "0 0 6px #10B981" }} />
                System Online
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Hero */}
          <div className="mb-12 fade-in-up" style={{ opacity: 0, animationDelay: "0.1s" }}>
            <div className="font-mono text-xs text-accent tracking-[0.4em] uppercase mb-3">
              Protocol_v2.4 — Active
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-4 text-text">
              Quantify your
              <br />
              <span className="text-accent glow-accent">placement readiness</span>
            </h1>
            <p className="font-body text-dim text-base sm:text-lg max-w-xl leading-relaxed">
              Paste your resume and a job description. Get a precision match score, skill gap analysis, and actionable recommendations — powered by NLP.
            </p>
          </div>

          {/* Input section */}
          <div className="fade-in-up" style={{ opacity: 0, animationDelay: "0.2s" }}>
            {/* Action bar */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <button
                className="btn-secondary px-4 py-2 rounded-sm text-xs"
                onClick={handleDemo}
              >
                Load Demo Data
              </button>
              {(resume || jd) && (
                <button
                  className="btn-secondary px-4 py-2 rounded-sm text-xs"
                  onClick={handleReset}
                >
                  Clear
                </button>
              )}
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Resume input */}
              <div className="bg-surface border border-border bracket-box glow-box overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-bg/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent3 opacity-70" />
                  <span className="font-mono text-xs text-muted tracking-wider">resume.txt</span>
                  <span className="ml-auto font-mono text-xs text-muted">
                    {resume.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  className="w-full bg-transparent px-4 py-3 text-dim placeholder-muted border-none focus:ring-0"
                  rows={14}
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder={`Paste your resume here...\n\nTip: Include your full skills section, work experience, and project descriptions for best accuracy.`}
                />
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent3" />
                    Or upload document
                  </div>
                  <DropZone
                    label="Resume"
                    fileTag="resume.txt"
                    dotColor="#10B981"
                    onTextExtracted={setResume}
                    existingText={resume}
                  />
                </div>
              </div>

              {/* JD input */}
              <div className="bg-surface border border-border bracket-box glow-box overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-bg/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-warn opacity-70" />
                  <span className="font-mono text-xs text-muted tracking-wider">job_description.txt</span>
                  <span className="ml-auto font-mono text-xs text-muted">
                    {jd.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  className="w-full bg-transparent px-4 py-3 text-dim placeholder-muted border-none focus:ring-0"
                  rows={14}
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder={`Paste the job description here...\n\nTip: Include required skills, nice-to-have, and responsibilities sections for best results.`}
                />
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <div className="font-mono text-[10px] text-muted tracking-widest uppercase mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-warn" />
                    Or upload document
                  </div>
                  <DropZone
                    label="Job Description"
                    fileTag="jd.txt"
                    dotColor="#F59E0B"
                    onTextExtracted={setJd}
                    existingText={jd}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-3 font-mono text-xs text-danger border border-danger/30 bg-danger/5 px-4 py-2.5">
                {">"} {error}
              </div>
            )}

            {/* Analyze button */}
            <div className="mt-4 flex items-center gap-4">
              <button
                className="btn-primary px-8 py-3.5 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={handleAnalyze}
                disabled={analyzing || !resume.trim() || !jd.trim()}
              >
                <span className="flex items-center gap-2">
                  {analyzing ? (
                    <>
                      <span className="inline-flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-current" style={{ animation: "dot1 1.4s infinite" }} />
                        <span className="w-1 h-1 rounded-full bg-current" style={{ animation: "dot1 1.4s 0.16s infinite" }} />
                        <span className="w-1 h-1 rounded-full bg-current" style={{ animation: "dot1 1.4s 0.32s infinite" }} />
                      </span>
                      Analyzing
                    </>
                  ) : (
                    "Run Analysis"
                  )}
                </span>
              </button>
              <span className="font-mono text-xs text-muted">
                {analyzing ? "Computing NLP similarity..." : "Local processing — your data never leaves your browser"}
              </span>
            </div>
          </div>

          {/* Results */}
          {result && <ResultsPanel result={result} />}

          {/* How it works */}
          {!result && (
            <div className="mt-20 fade-in-up" style={{ opacity: 0, animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-xs text-muted tracking-[0.3em] uppercase">How it works</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Tokenization", desc: "Text is cleaned, stop-words removed, and tokenized into normalized terms" },
                  { step: "02", title: "Skill Extraction", desc: "Named entity recognition maps tokens against a curated O*NET skill taxonomy" },
                  { step: "03", title: "Cosine Similarity", desc: "TF-IDF vectors are computed and cosine distance measures semantic overlap" },
                  { step: "04", title: "Gap Analysis", desc: "Missing skills are ranked by criticality based on position in the JD" },
                ].map((item) => (
                  <div key={item.step} className="bg-surface border border-border p-5 bracket-box glow-box-hover transition-all duration-300">
                    <div className="font-mono text-3xl font-bold text-border mb-3">{item.step}</div>
                    <div className="font-display font-semibold text-text mb-2">{item.title}</div>
                    <div className="font-body text-xs text-muted leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-16 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted">
              SKILLGAP.AI — Resume Intelligence Platform
            </span>
            <span className="font-mono text-xs text-muted">
              All processing is local. No data is stored or transmitted.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
