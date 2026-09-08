import React, { useState, useEffect } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import { NotificationService } from '../../services/notification';
import { getNotificationPermission } from '../../services/browserSupport';

interface UpdateModalProps {
  latestVersion?: string;
  releaseNotes?: string;
  isForceUpdate?: boolean;
  apkUrl?: string;
  onLater: () => void;
  isConversionPrompt?: boolean;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  onLater,
}) => {
  const { canPromptInstall, promptInstall, markAsInstalled, platform } = useInstallPrompt();
  const [notifGranted, setNotifGranted] = useState<boolean>(() => getNotificationPermission() === 'granted');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    const perm = getNotificationPermission();
    if (perm === 'granted') {
      setNotifGranted(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifGranted(granted);
    if (granted) {
      await NotificationService.show(
        "🍕 Notifications Enabled!",
        "You'll receive live order tracking (kitchen, ready, out for delivery) and wallet balance alerts.",
        undefined,
        'success'
      );
    }
  };

  const handleInstallClick = async () => {
    try {
      setIsInstalling(true);

      // Also request notification permission in tandem so notifications work outside the app
      if (!notifGranted) {
        NotificationService.requestPermission().then((granted) => {
          setNotifGranted(granted);
        }).catch(() => {});
      }

      // If browser native PWA prompt is ready, launch it directly
      if (canPromptInstall) {
        const outcome = await promptInstall();
        if (outcome === 'accepted') {
          markAsInstalled();
          setInstallSuccess(true);
          setTimeout(() => {
            onLater();
          }, 1500);
          return;
        }
      }

      // If cannot programmatically prompt (e.g. iOS Safari, or Chrome engagement requirement):
      // The visual step-by-step guide is rendered below for user to complete
    } catch (err) {
      console.warn('Install flow notice:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleManualDone = () => {
    markAsInstalled();
    setInstallSuccess(true);
    setTimeout(() => {
      onLater();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl sm:rounded-[2.5rem] relative z-10 text-center text-white overflow-hidden max-h-[92vh] overflow-y-auto hide-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.25),_transparent_55%)] pointer-events-none" />

        {/* Brand Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white ring-4 ring-white/10 shadow-xl relative overflow-hidden">
          <img src="/icon-192.png" alt="Harino's Pizza" className="h-16 w-16 rounded-2xl object-cover" />
        </div>

        <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-white">
          {installSuccess
            ? "Harino's Installed!"
            : "Install Harino's Pizza App"}
        </h2>

        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/25 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-400">
          <span>⚡</span>
          <span>Official Progressive Web App</span>
        </div>

        {installSuccess ? (
          <div className="mt-5 text-left bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <span>✅</span>
              <span>Successfully Added to Home Screen</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Harino&apos;s is now installed on your device. You can launch it directly from your apps list with 100% pure veg deliciousness!
            </p>
            <p className="text-[10px] text-emerald-300 font-semibold">
              🔔 Independent live order &amp; wallet notifications are activated.
            </p>
          </div>
        ) : (
          <>
            {/* Feature Highlights */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                <div className="text-base">🚀</div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-white">Fast Launch</div>
                <div className="text-[8px] text-white/50">1-Tap App</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                <div className="text-base">🔔</div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-amber-300">Live Alerts</div>
                <div className="text-[8px] text-white/50">Outside App</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                <div className="text-base">🪙</div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">Harino Coins</div>
                <div className="text-[8px] text-white/50">Instant Cashback</div>
              </div>
            </div>

            {/* Notification Permission Card */}
            <div className="mt-4 text-left bg-slate-950/70 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 text-lg">
                  {notifGranted ? '🔔' : '🔕'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    {notifGranted ? 'Live Alerts Active' : 'Enable External Alerts'}
                  </div>
                  <div className="text-[10px] text-white/60">
                    {notifGranted
                      ? 'You will receive order & wallet popups'
                      : 'Get order status notifications outside the app'}
                  </div>
                </div>
              </div>
              {!notifGranted && (
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Enable
                </button>
              )}
            </div>

            {/* Install Action Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="w-full cta-glow rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4 text-xs font-black uppercase tracking-[0.2em] transition-premium active:scale-[0.98] cursor-pointer shadow-xl shadow-red-950/40"
              >
                {isInstalling
                  ? 'Opening Install Dialog...'
                  : canPromptInstall
                  ? '📥 Install Harino\'s App'
                  : '📥 Follow Steps Below to Install'}
              </button>
            </div>

            {/* Step-by-Step Guided Instructions for Browsers / iOS / Android */}
            <div className="mt-4 text-left bg-slate-950/60 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
                <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-black">
                  <span>{platform.isIOS ? '🍎' : '📱'}</span>
                  <span>{platform.isIOS ? 'iPhone Safari Setup' : platform.isAndroid ? 'Android Chrome Setup' : 'Browser Installation Guide'}</span>
                </div>
                <span className="text-[9px] text-white/40 uppercase">3 Easy Steps</span>
              </div>

              {platform.isIOS ? (
                <div className="space-y-2.5 text-xs text-white/80 font-medium">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">1</span>
                    <span>Tap the <b>Share icon</b> (<span className="text-sm">⎋</span> or square with arrow pointing up) at the bottom of Safari.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">2</span>
                    <span>Scroll down the share sheet and tap <b>&quot;Add to Home Screen&quot;</b> (<span className="text-sm font-bold">＋</span>).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">3</span>
                    <span>Tap <b>&quot;Add&quot;</b> at top right. Harino&apos;s will now appear as an app on your Home Screen!</span>
                  </div>
                </div>
              ) : platform.isAndroid ? (
                <div className="space-y-2.5 text-xs text-white/80 font-medium">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">1</span>
                    <span>Tap your browser&apos;s menu (<b>⋮ three dots</b>) in the top-right corner.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">2</span>
                    <span>Select <b>&quot;Install app&quot;</b> or <b>&quot;Add to Home screen&quot;</b>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">3</span>
                    <span>Confirm by tapping <b>&quot;Install&quot;</b> or <b>&quot;Add&quot;</b>. Harino&apos;s will be placed directly on your phone!</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs text-white/80 font-medium">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">1</span>
                    <span>Look for the <b>Install icon</b> (computer monitor with arrow or ⊕) in your browser address bar.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">2</span>
                    <span>Or click your browser menu (<b>⋮</b>) and select <b>&quot;Install Harino&apos;s Pizza&quot;</b>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">3</span>
                    <span>Click <b>Install</b> to launch Harino&apos;s in full-screen desktop app mode.</span>
                  </div>
                </div>
              )}

              {/* Added confirmation button */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleManualDone}
                  className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span>✓</span>
                  <span>I Have Added It to My Home Screen</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Footer Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onLater}
            className="w-full rounded-2xl border border-white/5 bg-white/5 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            {installSuccess ? 'Close' : 'Later'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;