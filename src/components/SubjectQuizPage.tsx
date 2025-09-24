"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type McqQuestion = {
  id: number;
  class_name: string;
  subject: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
};

type ShortLongQuestion = {
  id: number;
  class_name: string;
  subject: string;
  question: string;
  answer: string;
};

type QuizType = "mcq" | "short" | "long";

const API_BASE = "http://127.0.0.1:8000";

export default function SubjectQuizPage({ classNameValue = "nine" }: { classNameValue?: string }) {
  const pathname = usePathname();
  const [quizType, setQuizType] = useState<QuizType>("mcq");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mcqQuestions, setMcqQuestions] = useState<McqQuestion[]>([]);
  const [shortQuestions, setShortQuestions] = useState<ShortLongQuestion[]>([]);
  const [longQuestions, setLongQuestions] = useState<ShortLongQuestion[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const subject = useMemo(() => {
    // Support paths like /vocational/nine/<subject> or /vocational/nine/<subject>/<type>
    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("nine");
    const quizTypeSet = new Set(["mcq", "short", "long"]);
    if (idx !== -1) {
      // search forward for the first segment after 'nine' that is not a quiz type
      for (let i = idx + 1; i < parts.length; i++) {
        if (!quizTypeSet.has(parts[i])) return parts[i];
      }
    }
    // Fallback to last non-quizType segment
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!quizTypeSet.has(parts[i])) return parts[i] || "bangla";
    }
    return "bangla";
  }, [pathname]);

  // Sync quiz type from path when present, e.g., .../mcq, .../short, .../long
  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last === "mcq" || last === "short" || last === "long") {
      setQuizType(last as QuizType);
    }
  }, [pathname]);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setTextAnswer("");
    setShowCorrect(false);
    setIsCorrect(null);
  }, [quizType, subject]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (quizType === "mcq") {
          const res = await fetch(
            `${API_BASE}/mcq/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          );
          if (!res.ok) throw new Error("Failed to fetch MCQ questions");
          const data: McqQuestion[] = await res.json();
          setMcqQuestions(data);
        } else if (quizType === "short") {
          const res = await fetch(
            `${API_BASE}/short/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          );
          if (!res.ok) throw new Error("Failed to fetch short questions");
          const data: ShortLongQuestion[] = await res.json();
          setShortQuestions(data);
        } else {
          const res = await fetch(
            `${API_BASE}/long/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          );
          if (!res.ok) throw new Error("Failed to fetch long questions");
          const data: ShortLongQuestion[] = await res.json();
          setLongQuestions(data);
        }
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [quizType, subject, classNameValue]);

  const currentMcq = mcqQuestions[currentIndex];
  const currentShort = shortQuestions[currentIndex];
  const currentLong = longQuestions[currentIndex];

  const hasQuestions = (list: unknown[]) => Array.isArray(list) && list.length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizType === "mcq" && currentMcq) {
      if (selectedOption == null) return;
      const correct = selectedOption === currentMcq.correct_option;
      setIsCorrect(correct);
      if (correct) {
        setShowCorrect(false);
        setSelectedOption(null);
        setCurrentIndex((v) => v + 1);
      } else {
        setShowCorrect(true);
      }
    } else if (quizType === "short" && currentShort) {
      const correct = textAnswer.trim().toLowerCase() === currentShort.answer.trim().toLowerCase();
      setIsCorrect(correct);
      if (correct) {
        setShowCorrect(false);
        setTextAnswer("");
        setCurrentIndex((v) => v + 1);
      } else {
        setShowCorrect(true);
      }
    } else if (quizType === "long" && currentLong) {
      const correct = textAnswer.trim().length > 0 && textAnswer.trim().toLowerCase() === currentLong.answer.trim().toLowerCase();
      setIsCorrect(correct);
      if (correct) {
        setShowCorrect(false);
        setTextAnswer("");
        setCurrentIndex((v) => v + 1);
      } else {
        setShowCorrect(true);
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "rgb(18,18,22)",
    color: "white",
    minHeight: "100vh",
    padding: "16px",
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>{subject.toUpperCase()} - Class {classNameValue.toUpperCase()}</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button className="button" onClick={() => setQuizType("mcq")}>MCQ</button>
        <button className="button" onClick={() => setQuizType("short")}>Short</button>
        <button className="button" onClick={() => setQuizType("long")}>Long</button>
      </div>

      {loading && <p>লোড হচ্ছে...</p>}
      {error && <p style={{ color: "#ff7070" }}>{error}</p>}

      {!loading && !error && (
        <div style={cardStyle}>
          {quizType === "mcq" && (
            hasQuestions(mcqQuestions) ? (
              currentMcq ? (
                <div>
                  <p style={{ fontWeight: 600 }}>{currentMcq.question}</p>
                  <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                    {[1, 2, 3, 4].map((n) => {
                      const label = (currentMcq as any)?.[`option${n}`] ?? "";
                      return (
                        <label key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="radio"
                            name="mcq"
                            checked={selectedOption === n}
                            onChange={() => setSelectedOption(n)}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
                    <button type="submit">Submit</button>
                  </form>
                  {showCorrect && (
                    <p style={{ marginTop: 8 }}>
                      সঠিক উত্তর: {(currentMcq as any)?.[`option${currentMcq.correct_option}`] ?? ""}
                    </p>
                  )}
                </div>
              ) : (
                <p>সব প্রশ্ন শেষ হয়েছে।</p>
              )
            ) : (
              <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
            )
          )}

          {quizType === "short" && (
            hasQuestions(shortQuestions) ? (
              <div>
                <p style={{ fontWeight: 600 }}>{currentShort?.question}</p>
                <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
                  <input
                    style={{ color: "black", padding: 8, borderRadius: 8 }}
                    type="text"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="উত্তর লিখুন"
                  />
                  <div style={{ height: 8 }} />
                  <button type="submit">Submit</button>
                </form>
                {showCorrect && <p style={{ marginTop: 8 }}>সঠিক উত্তর: {currentShort?.answer}</p>}
                {!currentShort && <p>সব প্রশ্ন শেষ হয়েছে।</p>}
              </div>
            ) : (
              <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
            )
          )}

          {quizType === "long" && (
            hasQuestions(longQuestions) ? (
              <div>
                <p style={{ fontWeight: 600 }}>{currentLong?.question}</p>
                <form onSubmit={onSubmit} style={{ marginTop: 12 }}>
                  <textarea
                    style={{ color: "black", padding: 8, borderRadius: 8, width: "100%", minHeight: 120 }}
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="বর্ণনা লিখুন"
                  />
                  <div style={{ height: 8 }} />
                  <button type="submit">Submit</button>
                </form>
                {showCorrect && <p style={{ marginTop: 8 }}>রেফারেন্স উত্তর: {currentLong?.answer}</p>}
                {!currentLong && <p>সব প্রশ্ন শেষ হয়েছে।</p>}
              </div>
            ) : (
              <p>কোনো প্রশ্ন পাওয়া যায়নি।</p>
            )
          )}
        </div>
      )}
    </div>
  );
}


