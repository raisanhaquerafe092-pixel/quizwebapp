"use client";

import { useEffect, useState } from "react";

export default function PWAInstall() {
  const [deferred, setDeferred] = useState<any>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setShow(false);
    setDeferred(null);
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 90, zIndex: 70 }}>
      <button onClick={install} style={{
        borderRadius: 10,
        padding: '10px 14px',
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.06)',
        color: 'white',
      }}>Install App</button>
    </div>
  );
}


