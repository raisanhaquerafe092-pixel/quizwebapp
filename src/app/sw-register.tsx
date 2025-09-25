"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    
    const swUrl = "/sw.js";
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
        console.log('[PWA] Service Worker registered successfully:', reg.scope);
        
        // Listen for updates
        reg.addEventListener('updatefound', () => {
          console.log('[PWA] New service worker available');
        });
      } catch (error) {
        console.log('[PWA] Service Worker registration failed:', error);
      }
    };
    
    register();
  }, []);

  return null;
}


