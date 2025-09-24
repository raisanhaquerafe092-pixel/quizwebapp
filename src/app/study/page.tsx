"use client";
import { useState } from "react";
import Link from "next/link";

const subjects = [
  { key: "bangla", label: "Bangla" },
  { key: "english", label: "English" },
  { key: "math", label: "Mathematics" },
  { key: "ict", label: "ICT" },
  { key: "physics", label: "Physics" },
  { key: "chemistry", label: "Chemistry" },
  { key: "biology", label: "Biology" },
  { key: "baobi", label: "BGS" },
  { key: "computer", label: "Computer" },
  { key: "electrical", label: "Electrical" },
  { key: "rac", label: "RAC" },
  { key: "automobile", label: "Automobile" },
  { key: "dhormo", label: "Religion" },
];

export default function page() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [chapter, setChapter] = useState("");
  const [subjectKey, setSubjectKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const requestPlan = async (subj: string) => {
    if (!chapter.trim()) return;
    setLoading(true);
    setPlan(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "study_plan", prompt: `class: nine, subject: ${subj}, chapter: ${chapter}` }),
      });
      const data = await res.json();
      setPlan(data?.plan || null);
    } catch {
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(18,18,22)", color: "white" }}>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Study Hub</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/vocational/nine" className="block">
            <div className="p-6 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h2 className="text-2xl font-semibold">Class Nine</h2>
              <p className="opacity-80">All subjects: MCQ, Short, Long practice.</p>
            </div>
          </Link>
          <Link href="/vocational/ten" className="block">
            <div className="p-6 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h2 className="text-2xl font-semibold">Class Ten</h2>
              <p className="opacity-80">All subjects: MCQ, Short, Long practice.</p>
            </div>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-3">Class Nine Subjects</h2>
        <div className="space-y-3">
          {subjects.map((s) => (
            <div key={s.key} className="rounded-xl border border-white/15">
              <button
                className="w-full text-left p-4"
                onClick={() => {
                  setExpanded(expanded === s.key ? null : s.key);
                  setSubjectKey(s.key);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{s.label}</span>
                  <span>{expanded === s.key ? "−" : "+"}</span>
                </div>
              </button>
              {expanded === s.key && (
                <div className="p-4 border-t border-white/10 space-y-3">
                  <div className="grid sm:grid-cols-3 gap-2">
                    <input
                      className="p-2 rounded bg-white/10 text-white placeholder:text-white/70"
                      placeholder="Chapter or topic"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                    />
                    <button onClick={() => requestPlan(s.key)}>Create Study Plan</button>
                    <Link href={`/vocational/nine/${s.key}/chapter`} className="text-center">
                      <button>Browse Chapters</button>
                    </Link>
                  </div>
                  {loading && <p>Generating plan...</p>}
                  {plan && (
                    <div className="rounded-lg border border-white/15 p-3">
                      <h3 className="text-xl font-semibold mb-2">AI Study Plan</h3>
                      {plan?.overview && <p className="opacity-90 mb-3">{plan.overview}</p>}
                      {Array.isArray(plan?.roadmap) && (
                        <div className="space-y-2">
                          {plan.roadmap.map((step: any, idx: number) => (
                            <div key={idx} className="p-2 rounded bg-white/5">
                              <div className="font-semibold">Step {idx + 1}: {step.title}</div>
                              {step.details && <div className="opacity-90 text-sm">{step.details}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      {Array.isArray(plan?.key_points) && (
                        <div className="mt-3">
                          <div className="font-semibold mb-1">Main Points</div>
                          <ul className="list-disc ml-6 opacity-90">
                            {plan.key_points.map((p: string, i: number) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}
                      {plan?.game && (
                        <div className="mt-3">
                          <div className="font-semibold mb-1">Learning Game</div>
                          <button onClick={() => alert('Launching learning game...')}>Play & Read</button>
                          <div className="opacity-90 text-sm mt-2">{plan.game.description}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
