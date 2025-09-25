"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import QuizCache from "@/utils/quizCache";
import CacheManager from "./CacheManager";

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
  const [isOffline, setIsOffline] = useState(false);
  const [usingCachedData, setUsingCachedData] = useState(false);

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

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!QuizCache.isOnline());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setTextAnswer("");
    setShowCorrect(false);
    setIsCorrect(null);
    setUsingCachedData(false);
  }, [quizType, subject]);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUsingCachedData(false);
      
      try {
        // First try to get cached data
        const cachedData = await QuizCache.getQuizData(classNameValue, subject);
        
        if (cachedData && (isOffline || !QuizCache.isOnline())) {
          // Use cached data when offline or no internet
          setMcqQuestions(cachedData.mcqQuestions);
          setShortQuestions(cachedData.shortQuestions);
          setLongQuestions(cachedData.longQuestions);
          setUsingCachedData(true);
          return;
        }

        // Try to fetch fresh data when online
        if (QuizCache.isOnline()) {
          const mcqPromise = fetch(
            `${API_BASE}/mcq/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          ).then(res => res.ok ? res.json() : []).catch(() => []);

          const shortPromise = fetch(
            `${API_BASE}/short/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          ).then(res => res.ok ? res.json() : []).catch(() => []);

          const longPromise = fetch(
            `${API_BASE}/long/question/?class_name=${encodeURIComponent(classNameValue)}&subject=${encodeURIComponent(subject)}`,
            { cache: "no-store", signal: controller.signal }
          ).then(res => res.ok ? res.json() : []).catch(() => []);

          const [mcqData, shortData, longData] = await Promise.all([
            mcqPromise,
            shortPromise,
            longPromise
          ]);

          // Update state with fresh data
          setMcqQuestions(mcqData);
          setShortQuestions(shortData);
          setLongQuestions(longData);

          // Cache the fresh data for offline use
          await QuizCache.setQuizData(classNameValue, subject, mcqData, shortData, longData);
        } else if (cachedData) {
          // Fallback to cached data if available
          setMcqQuestions(cachedData.mcqQuestions);
          setShortQuestions(cachedData.shortQuestions);
          setLongQuestions(cachedData.longQuestions);
          setUsingCachedData(true);
        } else {
          throw new Error("ইন্টারনেট সংযোগ নেই এবং কোনো ক্যাশেড ডেটা পাওয়া যায়নি৴");
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          setError(e.message || "অজানা সমস্যা হয়েছে");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    return () => controller.abort();
  }, [quizType, subject, classNameValue, isOffline]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            {subject.toUpperCase()} - ক্লাস {classNameValue.toUpperCase()}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
          
          {/* Connection Status */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              isOffline 
                ? 'bg-red-500/20 text-red-200 border border-red-500/30'
                : 'bg-green-500/20 text-green-200 border border-green-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-red-400' : 'bg-green-400 animate-pulse'
              }`}></div>
              <span>{isOffline ? 'অফলাইন' : 'অনলাইন'}</span>
            </div>
            
            {usingCachedData && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-500/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>ক্যাশেড ডেটা</span>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Type Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { type: "mcq", label: "বহুনির্বাচনি", icon: "MCQ", color: "from-green-400 to-blue-500" },
            { type: "short", label: "সংক্ষিপ্ত", icon: "সংক্ষিপ্ত", color: "from-purple-400 to-pink-500" },
            { type: "long", label: "বর্ণনামূলক", icon: "বর্ণনা", color: "from-orange-400 to-red-500" }
          ].map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => setQuizType(type as QuizType)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                quizType === type
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 text-white'
              }`}
            >
              <span className="block text-sm">{icon}</span>
              <span className="block text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
            <p className="text-blue-200 text-lg animate-pulse">লোড হচ্ছে...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        {!loading && !error && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-blue-200">প্রশ্ন</span>
                <span className="text-sm text-blue-200">
                  {quizType === "mcq" && hasQuestions(mcqQuestions) && `${currentIndex + 1} / ${mcqQuestions.length}`}
                  {quizType === "short" && hasQuestions(shortQuestions) && `${currentIndex + 1} / ${shortQuestions.length}`}
                  {quizType === "long" && hasQuestions(longQuestions) && `${currentIndex + 1} / ${longQuestions.length}`}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${quizType === "mcq" && hasQuestions(mcqQuestions) 
                      ? ((currentIndex + 1) / mcqQuestions.length) * 100
                      : quizType === "short" && hasQuestions(shortQuestions)
                      ? ((currentIndex + 1) / shortQuestions.length) * 100
                      : quizType === "long" && hasQuestions(longQuestions)
                      ? ((currentIndex + 1) / longQuestions.length) * 100
                      : 0}%`
                  }}
                ></div>
              </div>
            </div>

            {/* MCQ Questions */}
            {quizType === "mcq" && (
              hasQuestions(mcqQuestions) ? (
                currentMcq ? (
                  <div className="space-y-6">
                    {/* Question */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
                      <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                        {currentMcq.question}
                      </h2>
                    </div>

                    {/* Options */}
                    <div className="grid gap-3">
                      {[1, 2, 3, 4].map((n) => {
                        const label = (currentMcq as any)?.[`option${n}`] ?? "";
                        const isSelected = selectedOption === n;
                        const isCorrect = showCorrect && n === currentMcq.correct_option;
                        const isWrong = showCorrect && isSelected && n !== currentMcq.correct_option;
                        
                        return (
                          <label 
                            key={n} 
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                              isCorrect 
                                ? 'bg-green-500/20 border-green-400 text-green-100'
                                : isWrong
                                ? 'bg-red-500/20 border-red-400 text-red-100'
                                : isSelected
                                ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                                : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="mcq"
                              checked={isSelected}
                              onChange={() => !showCorrect && setSelectedOption(n)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              disabled={showCorrect}
                            />
                            <span className="flex-1 font-medium">{label}</span>
                            {isCorrect && (
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                            )}
                            {isWrong && (
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✗</span>
                              </div>
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    <form onSubmit={onSubmit}>
                      <button 
                        type="submit" 
                        disabled={selectedOption === null || showCorrect}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                      >
                        {showCorrect ? 'পরবর্তী প্রশ্ন' : 'উত্তর জমা দিন'}
                      </button>
                    </form>

                    {/* Correct Answer Display */}
                    {showCorrect && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-green-200 font-semibold">সঠিক উত্তর:</span>
                        </div>
                        <p className="text-green-100 ml-7">
                          {(currentMcq as any)?.[`option${currentMcq.correct_option}`] ?? ""}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-3xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">সমাপ্ত!</h3>
                    <p className="text-blue-200">সব প্রশ্ন শেষ হয়েছে৴</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-500/30">
                    <span className="text-yellow-400 text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                  <p className="text-blue-200">এই বিষয়ের জন্য কোনো প্রশ্ন খুঁজে পাওয়া যায়নি৴</p>
                </div>
              )
            )}

            {/* Short Questions */}
            {quizType === "short" && (
              hasQuestions(shortQuestions) ? (
                currentShort ? (
                  <div className="space-y-6">
                    {/* Question */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                      <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                        {currentShort.question}
                      </h2>
                    </div>

                    {/* Answer Input */}
                    <form onSubmit={onSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          placeholder="উত্তর লিখুন..."
                          disabled={showCorrect}
                          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            textAnswer.trim() ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={!textAnswer.trim() || showCorrect}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                      >
                        {showCorrect ? 'পরবর্তী প্রশ্ন' : 'উত্তর পরীক্ষা করুন'}
                      </button>
                    </form>

                    {/* Answer Feedback */}
                    {showCorrect && (
                      <div className={`rounded-2xl p-4 border ${
                        isCorrect 
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white text-xs">{isCorrect ? '✓' : '✗'}</span>
                          </div>
                          <span className={`font-semibold ${
                            isCorrect ? 'text-green-200' : 'text-red-200'
                          }`}>
                            {isCorrect ? 'সঠিক!' : 'ভুল উত্তর'}
                          </span>
                        </div>
                        <div className="ml-7">
                          <p className={isCorrect ? 'text-green-100' : 'text-red-100'}>
                            <strong>সঠিক উত্তর:</strong> {currentShort.answer}
                          </p>
                          {!isCorrect && (
                            <p className="text-red-100/80 mt-1">
                              <strong>আপনার উত্তর:</strong> {textAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-3xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">সমাপ্ত!</h3>
                    <p className="text-purple-200">সব প্রশ্ন শেষ হয়েছে৴</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-500/30">
                    <span className="text-yellow-400 text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                  <p className="text-purple-200">এই বিষয়ের জন্য কোনো প্রশ্ন খুঁজে পাওয়া যায়নি৴</p>
                </div>
              )
            )}

            {/* Long Questions */}
            {quizType === "long" && (
              hasQuestions(longQuestions) ? (
                currentLong ? (
                  <div className="space-y-6">
                    {/* Question */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
                      <h2 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                        {currentLong.question}
                      </h2>
                    </div>

                    {/* Answer Textarea */}
                    <form onSubmit={onSubmit} className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={textAnswer}
                          onChange={(e) => setTextAnswer(e.target.value)}
                          placeholder="বিস্তারিত উত্তর লিখুন..."
                          disabled={showCorrect}
                          rows={6}
                          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none disabled:opacity-50"
                        />
                        <div className="absolute right-4 bottom-4">
                          <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            textAnswer.trim().length > 10 ? 'bg-green-500' : textAnswer.trim() ? 'bg-yellow-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        <div className="absolute left-4 bottom-2 text-xs text-blue-200/70">
                          {textAnswer.length} অক্ষর
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        disabled={!textAnswer.trim() || showCorrect}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
                      >
                        {showCorrect ? 'পরবর্তী প্রশ্ন' : 'উত্তর পরীক্ষা করুন'}
                      </button>
                    </form>

                    {/* Answer Feedback */}
                    {showCorrect && (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">📚</span>
                          </div>
                          <span className="text-orange-200 font-semibold">রেফারেন্স উত্তর:</span>
                        </div>
                        <div className="ml-7 space-y-2">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-orange-100 leading-relaxed">{currentLong.answer}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-orange-100/80 text-sm">
                              <strong>আপনার উত্তর:</strong>
                            </p>
                            <p className="text-white/90 leading-relaxed mt-1">{textAnswer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-3xl">🎉</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">সমাপ্ত!</h3>
                    <p className="text-orange-200">সব প্রশ্ন শেষ হয়েছে৴</p>
                  </div>
                )
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-500/30">
                    <span className="text-yellow-400 text-3xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">কোনো প্রশ্ন পাওয়া যায়নি</h3>
                  <p className="text-orange-200">এই বিষয়ের জন্য কোনো প্রশ্ন খুঁজে পাওয়া যায়নি৴</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      {/* Cache Manager */}
      <CacheManager />
    </div>
  );
}
