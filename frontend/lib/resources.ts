// ─── Motivational Quotes ─────────────────────────────────────────────────────
export interface Quote {
  text: string;
  author: string;
}

export const QUOTES_BY_VERDICT: Record<string, Quote[]> = {
  strong: [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "Success is where preparation and opportunity meet.",
      author: "Bobby Unser",
    },
    {
      text: "Confidence comes from discipline and training.",
      author: "Robert Kiyosaki",
    },
    {
      text: "You are never too old to set another goal or dream a new dream.",
      author: "C.S. Lewis",
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
    },
  ],
  good: [
    {
      text: "Every expert was once a beginner. Every pro was once an amateur.",
      author: "Robin Sharma",
    },
    {
      text: "Small daily improvements over time lead to stunning results.",
      author: "Robin Sharma",
    },
    {
      text: "It does not matter how slowly you go as long as you do not stop.",
      author: "Confucius",
    },
    {
      text: "The difference between ordinary and extraordinary is that little extra.",
      author: "Jimmy Johnson",
    },
    {
      text: "Strive not to be a success, but rather to be of value.",
      author: "Albert Einstein",
    },
  ],
  partial: [
    {
      text: "The gap between who you are and who you want to be is where the work happens.",
      author: "Unknown",
    },
    {
      text: "Every master was once a disaster.",
      author: "T. Harv Eker",
    },
    {
      text: "Growth is never by mere chance; it is the result of forces working together.",
      author: "James Cash Penney",
    },
    {
      text: "Your current skills are the foundation, not the ceiling.",
      author: "Unknown",
    },
    {
      text: "Skill is only developed by hours and hours of work.",
      author: "Usain Bolt",
    },
  ],
  weak: [
    {
      text: "The beginning is the most important part of the work.",
      author: "Plato",
    },
    {
      text: "Do not be embarrassed by your failures. Learn from them and start again.",
      author: "Richard Branson",
    },
    {
      text: "You don't have to be great to start, but you have to start to be great.",
      author: "Zig Ziglar",
    },
    {
      text: "A year from now you may wish you had started today.",
      author: "Karen Lamb",
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
  ],
};

export function getRandomQuote(verdict: string): Quote {
  const pool = QUOTES_BY_VERDICT[verdict] || QUOTES_BY_VERDICT.partial;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── YouTube Learning Resources ───────────────────────────────────────────────
export interface VideoResource {
  title: string;
  channel: string;
  url: string;
  duration: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string; // YouTube video ID for thumbnail
}

export const VIDEO_RESOURCES: VideoResource[] = [
  // Python
  {
    title: "Python for Beginners — Full Course",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    duration: "4h 26m",
    category: "Programming Languages",
    level: "beginner",
    thumbnail: "rfscVS0vtbw",
  },
  {
    title: "Python Full Course for Professionals",
    channel: "TechWorld with Nana",
    url: "https://www.youtube.com/watch?v=t8pPdKYpowI",
    duration: "6h 14m",
    category: "Programming Languages",
    level: "intermediate",
    thumbnail: "t8pPdKYpowI",
  },
  // Machine Learning
  {
    title: "Machine Learning Course for Beginners",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=NWONeJKn6kc",
    duration: "9h 52m",
    category: "ML / AI",
    level: "beginner",
    thumbnail: "NWONeJKn6kc",
  },
  {
    title: "PyTorch for Deep Learning — Full Course",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=V_xro1bcAuA",
    duration: "25h 37m",
    category: "ML / AI",
    level: "intermediate",
    thumbnail: "V_xro1bcAuA",
  },
  {
    title: "TensorFlow 2.0 Complete Course",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=tPYj3fFJGjk",
    duration: "6h 52m",
    category: "ML / AI",
    level: "intermediate",
    thumbnail: "tPYj3fFJGjk",
  },
  {
    title: "NLP with Python — Complete Guide",
    channel: "Sentdex",
    url: "https://www.youtube.com/watch?v=FLZvOKSCkxY",
    duration: "3h 11m",
    category: "ML / AI",
    level: "intermediate",
    thumbnail: "FLZvOKSCkxY",
  },
  {
    title: "LangChain & LLMs — Full Crash Course",
    channel: "Patrick Loeber",
    url: "https://www.youtube.com/watch?v=lG7Uxts9SXs",
    duration: "1h 52m",
    category: "ML / AI",
    level: "advanced",
    thumbnail: "lG7Uxts9SXs",
  },
  // Data Engineering
  {
    title: "Apache Spark Tutorial for Beginners",
    channel: "Simplilearn",
    url: "https://www.youtube.com/watch?v=QaoJNXW6SQo",
    duration: "4h 12m",
    category: "Data Engineering",
    level: "beginner",
    thumbnail: "QaoJNXW6SQo",
  },
  {
    title: "Apache Kafka Full Course",
    channel: "Stephane Maarek",
    url: "https://www.youtube.com/watch?v=ut5kWTz5Y6g",
    duration: "2h 18m",
    category: "Data Engineering",
    level: "intermediate",
    thumbnail: "ut5kWTz5Y6g",
  },
  {
    title: "dbt (Data Build Tool) Full Course",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=toSAAgLUHuk",
    duration: "4h 1m",
    category: "Data Engineering",
    level: "intermediate",
    thumbnail: "toSAAgLUHuk",
  },
  // Cloud / DevOps
  {
    title: "Docker Tutorial for Beginners",
    channel: "TechWorld with Nana",
    url: "https://www.youtube.com/watch?v=3c-iBn73dDE",
    duration: "3h 18m",
    category: "Cloud / DevOps",
    level: "beginner",
    thumbnail: "3c-iBn73dDE",
  },
  {
    title: "Kubernetes Tutorial for Beginners",
    channel: "TechWorld with Nana",
    url: "https://www.youtube.com/watch?v=X48VuDVv0do",
    duration: "3h 34m",
    category: "Cloud / DevOps",
    level: "intermediate",
    thumbnail: "X48VuDVv0do",
  },
  {
    title: "AWS Full Course — Cloud Practitioner",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    duration: "13h 34m",
    category: "Cloud / DevOps",
    level: "beginner",
    thumbnail: "SOTamWNgDKc",
  },
  {
    title: "CI/CD Pipeline with GitHub Actions",
    channel: "TechWorld with Nana",
    url: "https://www.youtube.com/watch?v=R8_veQiYBjI",
    duration: "1h 56m",
    category: "Cloud / DevOps",
    level: "intermediate",
    thumbnail: "R8_veQiYBjI",
  },
  // Web / API
  {
    title: "React Full Course for Beginners",
    channel: "Dave Gray",
    url: "https://www.youtube.com/watch?v=RVFAyFWO4go",
    duration: "9h 49m",
    category: "Web / API",
    level: "beginner",
    thumbnail: "RVFAyFWO4go",
  },
  {
    title: "FastAPI Course for Beginners",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
    duration: "19h 5m",
    category: "Web / API",
    level: "beginner",
    thumbnail: "0sOvCWFmrtA",
  },
  {
    title: "Next.js 14 Full Course",
    channel: "Traversy Media",
    url: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
    duration: "2h 15m",
    category: "Web / API",
    level: "intermediate",
    thumbnail: "wm5gMKuwSYk",
  },
  // Databases
  {
    title: "SQL Full Course for Beginners",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    duration: "4h 20m",
    category: "Databases",
    level: "beginner",
    thumbnail: "HXV3zeQKqGY",
  },
  {
    title: "MongoDB Full Course",
    channel: "freeCodeCamp",
    url: "https://www.youtube.com/watch?v=ExcRbA7fy_A",
    duration: "7h 26m",
    category: "Databases",
    level: "beginner",
    thumbnail: "ExcRbA7fy_A",
  },
  {
    title: "Redis Crash Course",
    channel: "Traversy Media",
    url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
    duration: "1h 40m",
    category: "Databases",
    level: "beginner",
    thumbnail: "jgpVdJB2sKQ",
  },
];

// ─── Get relevant videos for gap skills ──────────────────────────────────────
export function getRelevantVideos(
  gapCategories: string[],
  maxPerCategory: number = 2
): VideoResource[] {
  if (gapCategories.length === 0) {
    // Return a sample of popular videos
    return VIDEO_RESOURCES.slice(0, 6);
  }

  const result: VideoResource[] = [];
  const seen = new Set<string>();

  for (const cat of gapCategories) {
    const matching = VIDEO_RESOURCES.filter(
      (v) => v.category === cat && !seen.has(v.url)
    ).slice(0, maxPerCategory);
    for (const v of matching) {
      seen.add(v.url);
      result.push(v);
    }
    if (result.length >= 8) break;
  }

  // Fill up to 6 if not enough category matches
  if (result.length < 4) {
    for (const v of VIDEO_RESOURCES) {
      if (!seen.has(v.url)) {
        seen.add(v.url);
        result.push(v);
        if (result.length >= 6) break;
      }
    }
  }

  return result.slice(0, 8);
}
