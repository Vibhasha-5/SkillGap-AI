# SKILLGAP.AI — Resume Intelligence Platform

> Quantify your placement readiness. Paste a resume + job description, get a precision NLP match score, skill gap analysis, and actionable recommendations.

## Prerequisites

- Node.js 18+ (check: `node -v`)
- npm 9+ (check: `npm -v`)
- Python 3.11+ (only if running the backend — optional)

## Quick Start — Frontend Only (Recommended)

This is all you need to run and deploy the app. The NLP runs in the browser.

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:3000]

### 3. Build for production (optional local test)

```bash
npm run build
npm run start
```

---

## Running the Python Backend (Optional)

Only needed if you want to extend the backend with heavier NLP models.

### 1. Create a virtual environment

```bash
cd api
python -m venv venv

# Mac/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the API server

```bash
uvicorn main:app --reload --port 8000
```

API docs available at [http://localhost:8000/docs]

### 4. Connect frontend to backend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Restart the frontend dev server.

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Vercel / `.env.local` | Optional: URL of FastAPI backend. If empty, browser NLP is used. |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| NLP Engine | Custom TF-IDF + cosine similarity (client-side) |
| OCR | Tesseract.js v5 (image → text, client-side) |
| PDF Parsing | pdfjs-dist v4 (PDF → text, client-side) |
| Charts | Recharts (radar chart) |
| Animations | Framer Motion + CSS keyframes |
| Backend (opt.) | FastAPI, Python 3.11, Pydantic |
| Deployment | Vercel (frontend), Railway (backend) |

---

## Extending the Project

### Add BERT embeddings to the backend

```bash
pip install sentence-transformers
```

```python
# In api/main.py
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def semantic_similarity(text_a: str, text_b: str) -> float:
    emb_a = model.encode(text_a, convert_to_tensor=True)
    emb_b = model.encode(text_b, convert_to_tensor=True)
    return float(util.cos_sim(emb_a, emb_b))
```

### Add spaCy NER

```bash
pip install spacy
python -m spacy download en_core_web_sm
```

---

## License

MIT — free to use, modify, and deploy.
