"use client";

import Link from "next/link";
import { useState } from "react";

// Class Nine subject books information
const nineSubjects = [
  {
    key: "bangla",
    label: "বাংলা",
    englishLabel: "Bangla",
    description: "বাংলা ভাষা ও সাহিত্য",
    icon: "📚",
    color: "from-green-500 to-emerald-600",
    pdfPath: "/pdfs/class-nine/bangla.html",
    hasBook: true
  },
  {
    key: "english",
    label: "ইংরেজি",
    englishLabel: "English",
    description: "English Language & Literature",
    icon: "📖",
    color: "from-blue-500 to-cyan-600",
    pdfPath: "/pdfs/class-nine/english.pdf",
    hasBook: true
  },
  {
    key: "math",
    label: "গণিত",
    englishLabel: "Mathematics",
    description: "সাধারণ গণিত",
    icon: "🔢",
    color: "from-purple-500 to-violet-600",
    pdfPath: "/pdfs/class-nine/math.pdf",
    hasBook: true
  },
  {
    key: "science",
    label: "বিজ্ঞান",
    englishLabel: "Science",
    description: "সাধারণ বিজ্ঞান",
    icon: "🧪",
    color: "from-orange-500 to-red-600",
    pdfPath: "/pdfs/class-nine/science.pdf",
    hasBook: true
  },
  {
    key: "ict",
    label: "তথ্য ও যোগাযোগ প্রযুক্তি",
    englishLabel: "ICT",
    description: "Information & Communication Technology",
    icon: "💻",
    color: "from-teal-500 to-green-600",
    pdfPath: "/pdfs/class-nine/ict.pdf",
    hasBook: true
  },
  {
    key: "bangladesh-global-studies",
    label: "বাংলাদেশ ও বিশ্বপরিচয়",
    englishLabel: "Bangladesh & Global Studies",
    description: "সামাজিক বিজ্ঞান",
    icon: "🌍",
    color: "from-indigo-500 to-blue-600",
    pdfPath: "/pdfs/class-nine/bangladesh-global-studies.pdf",
    hasBook: true
  },
  {
    key: "islam",
    label: "ইসলাম ধর্ম",
    englishLabel: "Islam Religion",
    description: "ধর্মীয় শিক্ষা",
    icon: "☪️",
    color: "from-emerald-500 to-teal-600",
    pdfPath: "/pdfs/class-nine/islam.pdf",
    hasBook: true
  },
  {
    key: "physical-education",
    label: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    englishLabel: "Physical Education",
    description: "স্বাস্থ্য শিক্ষা",
    icon: "⚽",
    color: "from-pink-500 to-rose-600",
    pdfPath: "/pdfs/class-nine/physical-education.pdf",
    hasBook: true
  },
  {
    key: "arts-crafts",
    label: "চারু ও কারুকলা",
    englishLabel: "Arts & Crafts",
    description: "শিল্পকলা",
    icon: "🎨",
    color: "from-yellow-500 to-orange-600",
    pdfPath: "/pdfs/class-nine/arts-crafts.pdf",
    hasBook: true
  },
  {
    key: "agriculture",
    label: "কৃষিশিক্ষা",
    englishLabel: "Agriculture",
    description: "কৃষি বিষয়ক শিক্ষা",
    icon: "🌾",
    color: "from-lime-500 to-green-600",
    pdfPath: "/pdfs/class-nine/agriculture.pdf",
    hasBook: true
  }
];

export default function ClassNineStudyPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = nineSubjects.filter(subject =>
    subject.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.englishLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Link 
              href="/study"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">স্টাডি হাবে ফিরে যান</span>
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            নবম শ্রেণির পাঠ্যবই
          </h1>
          <p className="text-lg md:text-xl text-blue-100 opacity-90 mb-6">
            সকল বিষয়ের পূর্ণাঙ্গ পাঠ্যবই এবং AI সহায়তা
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="বিষয় খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-3 pl-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <svg className="w-5 h-5 text-blue-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{nineSubjects.length}</div>
              <div className="text-sm text-green-200">মোট বিষয়</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{nineSubjects.filter(s => s.hasBook).length}</div>
              <div className="text-sm text-blue-200">উপলব্ধ বই</div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">AI</div>
              <div className="text-sm text-purple-200">সহায়তা</div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div key={subject.key} className="group">
              <Link href={`/study/nine/${subject.key}`}>
                <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer h-full`}>
                  {/* Subject Icon & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${subject.color} rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform duration-300`}>
                      <span>{subject.icon}</span>
                    </div>
                    {subject.hasBook && (
                      <div className="flex items-center gap-1 bg-green-500/20 text-green-200 px-2 py-1 rounded-full text-xs border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>উপলব্ধ</span>
                      </div>
                    )}
                  </div>

                  {/* Subject Info */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                      {subject.label}
                    </h3>
                    <p className="text-sm font-medium text-blue-200/80">
                      {subject.englishLabel}
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <div className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-3 border border-blue-500/30 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-xs font-medium text-blue-200">পড়ুন</span>
                      </div>
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl p-3 border border-green-500/30 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium text-green-200">AI চ্যাট</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-yellow-500/30">
              <span className="text-yellow-400 text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">কোনো বিষয় পাওয়া যায়নি</h3>
            <p className="text-white/70">অন্য কীওয়ার্ড দিয়ে খুঁজে দেখুন</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-200 mb-4 flex items-center gap-2">
            <span>💡</span>
            ব্যবহারের নির্দেশনা
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-100/90 leading-relaxed">
            <div>
              <h4 className="font-medium text-blue-200 mb-2">📚 PDF পড়া:</h4>
              <p>যেকোনো বিষয়ে ক্লিক করে সম্পূর্ণ পাঠ্যবই পড়ুন। জুম, পেজ নেভিগেশন এবং সার্চ সুবিধা রয়েছে।</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-200 mb-2">🤖 AI সহায়তা:</h4>
              <p>বইয়ের যেকোনো অংশ নিয়ে প্রশ্ন করুন। AI আপনাকে বিস্তারিত ব্যাখ্যা এবং অতিরিক্ত তথ্য দেবে।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}