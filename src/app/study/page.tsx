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

export default function StudyPage() {
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
    <div className="min-h-screen bg-[rgb(18,18,22)] text-white">
      {/* Header */}
      <header className="bg-gray-900 sticky top-0 z-10 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <span className="text-sm">← Back to Home</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">📚 Study Hub</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4">
        {/* Quick Access Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">
            Quick Access to Classes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/vocational/nine" className="group block">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 p-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">Class Nine</h2>
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-indigo-100 text-sm">All subjects: MCQ, Short, Long practice.</p>
                <div className="mt-3 text-xs text-indigo-200">
                  → Access all study materials
                </div>
              </div>
            </Link>
            <Link href="/vocational/ten" className="group block">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 p-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold">Class Ten</h2>
                  <span className="text-2xl">🎓</span>
                </div>
                <p className="text-emerald-100 text-sm">All subjects: MCQ, Short, Long practice.</p>
                <div className="mt-3 text-xs text-emerald-200">
                  → Access all study materials
                </div>
              </div>
            </Link>
          </div>
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
                    <button 
                      onClick={() => requestPlan(s.key)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Study Plan'}
                    </button>
                    <Link href={`/vocational/nine/${s.key}/chapter`} className="block">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm">
                        Browse Chapters
                      </button>
                    </Link>
                  </div>
                  {loading && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Generating personalized study plan...</span>
                    </div>
                  )}
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
                          <div className="font-semibold mb-2">🎮 Learning Game</div>
                          <button 
                            onClick={() => alert('Launching learning game...')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm mb-2"
                          >
                            🎮 Play & Read
                          </button>
                          <div className="text-gray-300 text-sm leading-relaxed">{plan.game.description}</div>
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
