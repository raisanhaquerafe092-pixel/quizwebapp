"use client";

import dynamic from "next/dynamic";

// Load the assistant on client only
const AIAssistant = dynamic(() => import("@/components/AIAssistant"), {
  ssr: false,
});

export default function ClientAIAssistant() {
  return <AIAssistant />;
}


