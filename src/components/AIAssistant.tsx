"use client";

import { useState } from "react";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
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
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      const text = Array.isArray(data?.result)
        ? (data.result[0]?.generated_text || JSON.stringify(data.result))
        : JSON.stringify(data.result || data);
      setMessages((m) => [...m, { role: "ai", text }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: "ai", text: "দুঃখিত, চেষ্টা ব্যর্থ হয়েছে।" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        aria-label="AI Assistant"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 9999,
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 50,
        }}
      >
        AI
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 80,
            width: 320,
            maxHeight: 420,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            ...bg,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <strong>AI সহকারী</strong>
          </div>
          <div style={{ padding: 12, flex: 1, overflowY: "auto" }}>
            {messages.length === 0 && (
              <p style={{ opacity: 0.7 }}>বাংলায় প্রশ্ন করুন। উদাহরণ: "বাংলা ব্যাকরণ ব্যাখ্যা করো"</p>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{m.role === "user" ? "আপনি" : "AI"}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="আপনার প্রশ্ন..."
              style={{ flex: 1, borderRadius: 8, padding: 8, color: "black" }}
            />
            <button onClick={askAI} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}


