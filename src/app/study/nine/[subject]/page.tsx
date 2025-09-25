"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PDFViewerWithAI from "@/components/PDFViewerWithAI";

// Subject mapping data
const subjectData: { [key: string]: { label: string; englishLabel: string; description: string; icon: string; color: string; pdfPath: string; hasBook: boolean } } = {
  "bangla": {
    label: "বাংলা",
    englishLabel: "Bangla",
    description: "বাংলা ভাষা ও সাহিত্য",
    icon: "📚",
    color: "from-green-500 to-emerald-600",
    pdfPath: "/pdfs/class-nine/bangla.html",
    hasBook: true
  },
  "english": {
    label: "ইংরেজি",
    englishLabel: "English",
    description: "English Language & Literature",
    icon: "📖",
    color: "from-blue-500 to-cyan-600",
    pdfPath: "/pdfs/class-nine/english.pdf",
    hasBook: true
  },
  "math": {
    label: "গণিত",
    englishLabel: "Mathematics",
    description: "সাধারণ গণিত",
    icon: "🔢",
    color: "from-purple-500 to-violet-600",
    pdfPath: "/pdfs/class-nine/math.pdf",
    hasBook: true
  },
  "science": {
    label: "বিজ্ঞান",
    englishLabel: "Science",
    description: "সাধারণ বিজ্ঞান",
    icon: "🧪",
    color: "from-orange-500 to-red-600",
    pdfPath: "/pdfs/class-nine/science.pdf",
    hasBook: true
  },
  "ict": {
    label: "তথ্য ও যোগাযোগ প্রযুক্তি",
    englishLabel: "ICT",
    description: "Information & Communication Technology",
    icon: "💻",
    color: "from-teal-500 to-green-600",
    pdfPath: "/pdfs/class-nine/ict.pdf",
    hasBook: true
  },
  "bangladesh-global-studies": {
    label: "বাংলাদেশ ও বিশ্বপরিচয়",
    englishLabel: "Bangladesh & Global Studies",
    description: "সামাজিক বিজ্ঞান",
    icon: "🌍",
    color: "from-indigo-500 to-blue-600",
    pdfPath: "/pdfs/class-nine/bangladesh-global-studies.pdf",
    hasBook: true
  },
  "islam": {
    label: "ইসলাম ধর্ম",
    englishLabel: "Islam Religion",
    description: "ধর্মীয় শিক্ষা",
    icon: "☪️",
    color: "from-emerald-500 to-teal-600",
    pdfPath: "/pdfs/class-nine/islam.pdf",
    hasBook: true
  },
  "physical-education": {
    label: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    englishLabel: "Physical Education",
    description: "স্বাস্থ্য শিক্ষা",
    icon: "⚽",
    color: "from-pink-500 to-rose-600",
    pdfPath: "/pdfs/class-nine/physical-education.pdf",
    hasBook: true
  },
  "arts-crafts": {
    label: "চারু ও কারুকলা",
    englishLabel: "Arts & Crafts",
    description: "শিল্পকলা",
    icon: "🎨",
    color: "from-yellow-500 to-orange-600",
    pdfPath: "/pdfs/class-nine/arts-crafts.pdf",
    hasBook: true
  },
  "agriculture": {
    label: "কৃষিশিক্ষা",
    englishLabel: "Agriculture",
    description: "কৃষি বিষয়ক শিক্ষা",
    icon: "🌾",
    color: "from-lime-500 to-green-600",
    pdfPath: "/pdfs/class-nine/agriculture.pdf",
    hasBook: true
  }
};

export default function SubjectStudyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subject = params.subject as string;
  const currentSubject = subjectData[subject];

  useEffect(() => {
    if (!subject) {
      setError("Subject parameter is missing");
      setLoading(false);
      return;
    }

    if (!currentSubject) {
      setError("Subject not found");
      setLoading(false);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [subject, currentSubject]);

  const handleBack = () => {
    router.push("/study/nine");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">বই লোড হচ্ছে...</h2>
          <p className="text-blue-200">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  if (error || !currentSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-red-500/30">
            <span className="text-red-400 text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">বিষয় পাওয়া যায়নি</h2>
          <p className="text-white/70 mb-6">
            {error || "এই বিষয়ের কোনো তথ্য পাওয়া যায়নি। অন্য বিষয় নির্বাচন করুন।"}
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            বিষয়ের তালিকায় ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <PDFViewerWithAI
        pdfPath={currentSubject.pdfPath}
        subject={subject}
        subjectLabel={currentSubject.label}
        onBack={handleBack}
      />
    </div>
  );
}