import React, { useEffect, useMemo, useState } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { safeStorage } from '../../services/browserSupport';

interface InstallPopupProps {
  blocked?: boolean;
}

const POPUP_DISMISS_KEY = 'harinos-install-popup-dismissed-at';
const POPUP_DELAY_MS = 2000;
const POPUP_COOLDOWN_MS = 1000 * 60 * 60 * 8; // 8 hours snooze if explicitly dismissed

const InstallPopup: React.FC<InstallPopupProps> = ({ blocked = false }) => {
  const { canPromptInstall, needsIosInstructions, isInstalled, promptInstall, markAsInstalled } = useInstallPrompt();
  const [isVisible, setIsVisible] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isIos = typeof navigator !== 'undefined' && (/iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  useEffect(() => {
    if (blocked || isInstalled) {
      setIsVisible(false);
      return;
    }

    const lastDismissedAt = Number(safeStorage.getItem(window.localStorage, POPUP_DISMISS_KEY) ?? '0');
    if (lastDismissedAt && Date.now() - lastDismissedAt < POPUP_COOLDOWN_MS) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsVisible(true);
      setShowIosSteps(isIos || needsIosInstructions);
    }, POPUP_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [blocked, isInstalled, isIos, needsIosInstructions]);

  const popupTitle = useMemo(() => {
    if (isIos || needsIosInstructions) {
      return "Install Harino's on your iPhone";
    }
    return "Install Harino's Official App";
  }, [isIos, needsIosInstructions]);

  const dismissPopup = () => {
    safeStorage.setItem(window.localStorage, POPUP_DISMISS_KEY, Date.now().toString());
    setIsVisible(false);
  };

  const handlePrimaryAction = async () => {
    if (canPromptInstall) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        markAsInstalled();
        dismissPopup();
        return;
      }
    }

    if (isIos || needsIosInstructions) {
      setShowIosSteps(true);
      return;
    }

    markAsInstalled();
    dismissPopup();
  };

  const handleDownloadIosProfile = () => {
    markAsInstalled();
    window.location.href = '/Harinos.mobileconfig';
    dismissPopup();
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center p-0 sm:items-center sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={dismissPopup} />

      <div className="install-popup-card relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] border border-white/10 bg-slate-900 text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:rounded-[2.5rem] max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.32),_transparent_48%),linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0))]" />

        <div className="relative p-6 sm:p-7">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" />

          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white ring-2 ring-white/20 shadow-xl overflow-hidden shrink-0">
                <img src="/icon-192.png" alt="Harino's App" className="h-12 w-12 rounded-xl object-cover" />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.24em] text-amber-300">
                  Official Mobile App
                </div>
                <h3 className="mt-1 font-display text-xl font-bold leading-tight text-white">
                  {popupTitle}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={dismissPopup}
              aria-label="Close install popup"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:text-white shrink-0 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <p className="text-xs leading-relaxed text-white/75 font-medium">
            Install Harino&apos;s for instant 1-tap food ordering, live kitchen notifications (preparing, ready, out for delivery), and wallet cashback alerts.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-amber-300">PIZZA</div>
              <div className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-white/60">Live Updates</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-emerald-300">WALLET</div>
              <div className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-white/60">Instant Pay</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-red-400">FAST</div>
              <div className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-white/60">Home Screen</div>
            </div>
          </div>

          {(isIos || showIosSteps) && (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 mb-2.5 flex items-center gap-1.5">
                <span>🍎</span>
                <span>Quick iPhone Setup</span>
              </div>
              <div className="space-y-2 text-xs leading-relaxed text-white/80 font-medium">
                <p>1. In Safari, tap the <b>Share icon</b> (<span className="text-sm">⎋</span>) at the bottom.</p>
                <p>2. Scroll and choose <b>&quot;Add to Home Screen&quot;</b> (<span className="text-sm font-bold">＋</span>).</p>
                <p>3. Tap <b>&quot;Add&quot;</b> at top right to place Harino&apos;s on your screen.</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleDownloadIosProfile}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-[11px] font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>📥</span>
                  <span>Download iOS Profile (.mobileconfig)</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="cta-glow w-full rounded-2xl bg-red-650 hover:bg-red-500 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-950/30 transition-transform active:scale-[0.98] cursor-pointer"
            >
              Install updates
            </button>
            <button
              type="button"
              onClick={dismissPopup}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPopup;
