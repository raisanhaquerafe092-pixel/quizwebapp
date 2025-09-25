"use client";

import { useEffect, useState } from "react";
import QuizCache from "@/utils/quizCache";

interface CacheStats {
  totalCached: number;
  cacheSize: string;
  oldestCache?: Date;
  newestCache?: Date;
}

export default function CacheManager() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadCacheStats = async () => {
    setLoading(true);
    try {
      const stats = await QuizCache.getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error("Failed to load cache stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllCache = async () => {
    if (confirm("সব ক্যাশেড ডেটা মুছে দিতে চান? এতে অফলাইন মোডে কোনো প্রশ্ন দেখা যাবে না।")) {
      setLoading(true);
      try {
        await QuizCache.clearAllCache();
        await loadCacheStats();
      } catch (error) {
        console.error("Failed to clear cache:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCacheStats();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        title="ক্যাশ ম্যানেজার"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">ক্যাশ ম্যানেজার</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Cache Statistics */}
        {!loading && cacheStats && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-200">{cacheStats.totalCached}</div>
                <div className="text-xs text-blue-300">ক্যাশেড আইটেম</div>
              </div>
              
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-200">{cacheStats.cacheSize}</div>
                <div className="text-xs text-purple-300">ব্যবহৃত স্থান</div>
              </div>
            </div>

            {/* Cache Details */}
            {cacheStats.totalCached > 0 && (
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white/90">ক্যাশ বিবরণ</h3>
                
                {cacheStats.newestCache && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">সর্বশেষ আপডেট:</span>
                    <span className="text-green-300">
                      {cacheStats.newestCache.toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                )}
                
                {cacheStats.oldestCache && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">পুরাতন ডেটা:</span>
                    <span className="text-orange-300">
                      {cacheStats.oldestCache.toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={loadCacheStats}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                রিফ্রেশ করুন
              </button>
              
              {cacheStats.totalCached > 0 && (
                <button
                  onClick={clearAllCache}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300"
                >
                  সব ক্যাশ মুছে দিন
                </button>
              )}
            </div>

            {/* Info */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-xs text-yellow-200 leading-relaxed">
                💡 ক্যাশেড ডেটা অফলাইন মোডে প্রশ্ন দেখতে সাহায্য করে। নতুন প্রশ্ন পেতে অনলাইনে থাকুন।
              </p>
            </div>
          </div>
        )}

        {/* No Cache Data */}
        {!loading && cacheStats && cacheStats.totalCached === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">কোনো ক্যাশ নেই</h3>
            <p className="text-white/70 text-sm">
              কিছু প্রশ্ন দেখুন যাতে অফলাইন মোডের জন্য ডেটা সংরক্ষিত হয়।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}