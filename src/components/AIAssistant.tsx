"use client";

import { useState } from "react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const bg = { backgroundColor: "rgb(18,18,22)", color: "white" } as const;

  const askAI = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: question }) });
      const data = await res.json();
      const text: string = typeof data?.text === 'string'
        ? data.text
        : Array.isArray(data?.result)
          ? (data.result[0]?.generated_text || JSON.stringify(data.result))
          : JSON.stringify(data.result || data);
      setMessages((m) => [...m, { role: "ai", text: text.trim() }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "ai", text: "দুঃখিত, চেষ্টা ব্যর্থ হয়েছে।" }]);
    } finally {
      setLoading(false);
    }
  };

  const speakBangla = (text: string) => {
    try {
      if (!text) return;
      // Stop any current speech before starting new
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utter = new SpeechSynthesisUtterance(text);
      // Try to pick a Bangla-capable voice if available
      const assignVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const bn = voices.find(v => /bn|bengali|bangla/i.test(v.lang) || /bangla/i.test(v.name));
        if (bn) utter.voice = bn;
        utter.lang = bn?.lang || 'bn-BD';
        // Natural pacing
        utter.rate = 0.9;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
      };
      // Some browsers load voices async
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = assignVoice;
      } else {
        assignVoice();
      }
    } catch {}
  };

  const onSelectSpeak = () => {
    const sel = window.getSelection?.()?.toString() || "";
    if (sel) speakBangla(sel);
  };

  // Removed file upload UI and logic per requirement

  return (
    <>
      <button
        aria-label="AI Assistant"
        onClick={() => {
          if (open && expanded) {
            setExpanded(false);
            setTimeout(() => setOpen(false), 200);
          } else {
            setOpen((v) => !v);
          }
        }}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 9999,
          backgroundColor: expanded ? "#ef4444" : "#10b981",
          color: "white",
          border: "none",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          cursor: "pointer",
          zIndex: 60,
          transition: "background-color 200ms ease, transform 200ms ease",
          transform: open ? "scale(1.05)" : "scale(1)",
        }}
      >
        {open && expanded ? "✕" : "AI"}
      </button>

      {open && (
        <>
          {expanded && (
            <div
              onClick={() => setExpanded(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}
            />
          )}
          <div
            style={{
              position: "fixed",
              right: expanded ? 0 : 16,
              bottom: expanded ? 0 : 80,
              width: expanded ? "100vw" : 360,
              height: expanded ? "100vh" : 520,
              maxHeight: expanded ? "100vh" : 520,
              borderRadius: expanded ? 0 : 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
              ...bg,
              zIndex: 55,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              transition: "all 250ms ease",
            }}
          >
            <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <strong>AI সহকারী</strong>
                <button onClick={onSelectSpeak} style={{ border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>🔊 নির্বাচিত টেক্সট পড়ো</button>
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "transparent",
                  color: "white",
                  borderRadius: 8,
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                {expanded ? "ছোট করো" : "বড় করো"}
              </button>
            </div>
            <div style={{ padding: 12, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {messages.length === 0 && (
                <p style={{ opacity: 0.7 }}>বাংলায় প্রশ্ন করুন। উদাহরণ: "বাংলা ব্যাকরণ ব্যাখ্যা করো"</p>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                  <div
                    style={{
                      maxWidth: expanded ? "70ch" : 280,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      background: m.role === "user" ? "#2563eb" : "#1f2937",
                      color: "white",
                      padding: "10px 12px",
                      borderRadius: 12,
                      borderTopRightRadius: m.role === "user" ? 4 : 12,
                      borderTopLeftRadius: m.role === "user" ? 12 : 4,
                    }}
                  >
                    {m.text}
                  </div>
                  {m.role === 'ai' && (
                    <button onClick={() => speakBangla(m.text)} style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>🔊</button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: 12, display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.15)", flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার প্রশ্ন..."
                style={{ flex: 1, borderRadius: 8, padding: 8, color: "white", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
              <button onClick={askAI} disabled={loading}>
                {loading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}


