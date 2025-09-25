"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface PDFViewerWithAIProps {
  pdfPath: string;
  subject: string;
  subjectLabel: string;
  onBack?: () => void;
}

export default function PDFViewerWithAI({ 
  pdfPath, 
  subject, 
  subjectLabel, 
  onBack 
}: PDFViewerWithAIProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `আসসালামু আলাইকুম! আমি ${subjectLabel} বিষয়ের AI সহায়ক। এই বইয়ের যেকোনো অংশ নিয়ে প্রশ্ন করতে পারেন। আমি আপনাকে বিস্তারিত ব্যাখ্যা, উদাহরণ এবং অতিরিক্ত তথ্য দিয়ে সাহায্য করব।`,
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAskAI = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "pdf_chat",
          subject: subject,
          subjectLabel: subjectLabel,
          currentPage: currentPage,
          question: userInput,
          context: `User is reading ${subjectLabel} textbook, currently on page ${currentPage}`
        })
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "দুঃখিত, আমি এই প্রশ্নের উত্তর দিতে পারছি না। অন্য প্রশ্ন করে দেখুন।",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      pdfContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const quickQuestions = [
    "এই অধ্যায়ের মূল বিষয়বস্তু কী?",
    "এই বিষয়ে আরো উদাহরণ দিন",
    "পরীক্ষায় গুরুত্বপূর্ণ কী কী?",
    "এই অংশটি সহজভাবে ব্যাখ্যা করুন"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white flex">
      {/* PDF Viewer Section */}
      <div className={`flex-1 flex flex-col ${isChatOpen ? 'lg:mr-96' : ''} transition-all duration-300`}>
        {/* PDF Header */}
        <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>ফিরে যান</span>
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold">{subjectLabel}</h1>
                <p className="text-sm text-blue-200">নবম শ্রেণির পাঠ্যবই</p>
              </div>
            </div>

            {/* PDF Controls */}
            <div className="flex items-center gap-2">
              {/* Page Navigation */}
              <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={false}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-2 py-2">
                <button onClick={zoomOut} className="p-1 hover:bg-white/20 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xs px-2 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn} className="p-1 hover:bg-white/20 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button onClick={resetZoom} className="p-1 hover:bg-white/20 rounded text-xs">
                  1:1
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg"
                title="Fullscreen"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* Chat Toggle */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isChatOpen ? 'bg-green-600 text-white' : 'hover:bg-white/20'
                }`}
                title="AI চ্যাট"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div
          ref={pdfContainerRef}
          className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center relative"
        >
          <div className="w-full h-full">
            <iframe
              title={`${subjectLabel} - Textbook PDF`}
              src={pdfPath}
              className="w-full h-[calc(100vh-140px)] sm:h-[calc(100vh-120px)] bg-white border-0"
            />
          </div>
        </div>

        {/* Mobile Page Navigation */}
        <div className="sm:hidden bg-black/20 backdrop-blur-lg border-t border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              পূর্ববর্তী
            </button>
            
            <span className="text-sm font-medium">
              Page {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={false}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50"
            >
              পরবর্তী
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-black/90 backdrop-blur-lg border-l border-white/10 flex flex-col lg:relative lg:inset-auto lg:w-96 z-50">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI সহায়ক</h3>
                  <p className="text-xs text-green-200">{subjectLabel} বিষয়ক</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-b border-white/10">
            <h4 className="text-sm font-medium text-white/80 mb-2">দ্রুত প্রশ্ন:</h4>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(question)}
                  className="w-full text-left text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-2 transition-all duration-200 text-blue-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/10 border border-white/20 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 text-white rounded-2xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">টাইপ করছি...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={2}
              />
              <button
                onClick={handleAskAI}
                disabled={!userInput.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 self-end"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}