"use client";

import { useEffect, useState } from "react";

export default function PWAInstall() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if running in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone ||
                              document.referrer.includes('android-app://');
    setIsStandalone(isStandaloneMode);
    
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Handle PWA install prompt
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    
    // Show iOS install instructions after a delay
    if (iOS && !isStandaloneMode) {
      setTimeout(() => setShow(true), 3000);
    }
    
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setShow(false);
    setDeferred(null);
  };

  const hidePrompt = () => {
    setShow(false);
  };

  if (!show || isStandalone) return null;

  return (
    <>
      {/* Android/Desktop Install */}
      {deferred && !isIOS && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📱</span>
                <h3 className="font-semibold text-sm">Install App</h3>
              </div>
              <button 
                onClick={hidePrompt}
                className="text-blue-200 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-blue-100 mb-3">
              Get quick access and use offline!
            </p>
            <div className="flex gap-2">
              <button 
                onClick={install}
                className="bg-white text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-50 flex-1"
              >
                Install
              </button>
              <button 
                onClick={hidePrompt}
                className="text-blue-200 hover:text-white px-2 text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* iOS Install Instructions */}
      {isIOS && !deferred && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
          <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🍎</span>
                <h3 className="font-semibold text-sm">Install on iOS</h3>
              </div>
              <button 
                onClick={hidePrompt}
                className="text-gray-400 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-gray-300 space-y-1 mb-3">
              <p>1. Tap the share button <span className="bg-gray-700 px-1 py-0.5 rounded">📄</span></p>
              <p>2. Select "Add to Home Screen"</p>
              <p>3. Tap "Add" to install</p>
            </div>
            <button 
              onClick={hidePrompt}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 w-full"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}


