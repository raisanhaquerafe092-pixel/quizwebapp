"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;
    const swUrl = "/sw.js";
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
      } catch {
        // ignore
      }
    };
    register();
  }, []);

  return null;
}


