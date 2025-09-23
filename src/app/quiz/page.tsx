
"use client";

import { useEffect, useState } from "react";

// Minimal type for the PWA beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function QuizPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Detect already-installed (standalone) display mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (typeof navigator !== "undefined" &&
        (navigator as Navigator & { standalone?: boolean }).standalone === true);
    if (standalone) {
      setIsInstalled(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="p-4">
      {!isInstalled && isInstallable && isOnline && (
        <div className="w-full mb-4 flex items-center justify-between gap-4 border rounded px-4 py-3 bg-white/70 dark:bg-black/30">
          <div className="text-sm">
            Install this app for a better, full-screen experience.
          </div>
          <button
            onClick={handleInstallClick}
            className="rounded border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-sm h-9 px-4"
          >
            Install
          </button>
        </div>
      )}

      {!isOnline && (
        <div className="w-full mb-4 flex items-center justify-between gap-4 border rounded px-4 py-3 bg-white/70 dark:bg-black/30">
          <div className="text-sm">You are offline. Connect to the internet to install.</div>
        </div>
      )}

      <h1 className="text-4xl text-center text-blue-900 mt-[3%]">Hellow Welcome to bipul Quiz web app </h1>
    </div>
  )
}


