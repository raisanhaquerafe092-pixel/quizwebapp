"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");

  async function askAI() {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    console.log(data);
    setAnswer(data || "No answer");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        className="w-full border p-2 rounded"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="বাংলায় প্রশ্ন লিখুন..."
      />
      <button
        onClick={askAI}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        জিজ্ঞাসা করুন
      </button>
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <strong>উত্তর:</strong>
        <p>{answer}</p>
      </div>
    </div>
  );
}
