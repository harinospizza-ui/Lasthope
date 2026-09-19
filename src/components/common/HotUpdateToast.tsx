import React, { useState, useEffect } from 'react';
import { HapticsService } from '../../services/hapticsService';

export const HotUpdateToast: React.FC = () => {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const checkWaitingWorker = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        setHasUpdate(true);
      }
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setHasUpdate(true);
            }
          });
        }
      });
    };

    navigator.serviceWorker.ready.then((reg) => {
      checkWaitingWorker(reg);
    }).catch(() => {});
  }, []);

  if (!hasUpdate) {
    return null;
  }

  const handleUpdate = () => {
    void HapticsService.medium();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }).catch(() => {});
    }
    window.location.reload();
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] max-w-sm w-[92%] animate-bounce-in">
      <div className="bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-3 backdrop-blur-lg">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">⚡</span>
          <div className="min-w-0">
            <h5 className="text-xs font-black text-white leading-tight">
              Fresh Update Available!
            </h5>
            <p className="text-[10px] text-slate-400 truncate">
              New menu items, offers & speed updates ready
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="shrink-0 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-red-600/30 transition-all"
        >
          Update Now
        </button>
      </div>
    </div>
  );
};

export default HotUpdateToast;
