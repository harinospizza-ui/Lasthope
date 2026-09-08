import React, { useState, useEffect } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const DownloadPage: React.FC = () => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentVersion = "1.0.0";
  const fileSize = "Fast & Lightweight (< 5 MB)";
  const minAndroid = "Android 7.0 (Nougat) or higher / iOS 14+";
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.harinos.app";

  const { canPromptInstall, promptInstall, isInstalled } = useInstallPrompt();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsDownloading(true);
      setShowInstructions(true);

      if (canPromptInstall) {
        const outcome = await promptInstall();
        if (outcome === 'accepted') {
          setDownloadProgress(100);
          return;
        }
      }

      // Redirect to official Google Play Store or PWA
      window.open(playStoreUrl, '_blank');
      setDownloadProgress(100);
    } catch (err) {
      console.error(err);
      window.location.href = playStoreUrl;
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.15),_transparent_60%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-xl relative z-10 shadow-2xl mt-4 sm:mt-12 text-center">
        {/* App Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white ring-4 ring-white/10 shadow-2xl relative overflow-hidden group">
          <img src="/icon-192.png" alt="Harino's Pizza Logo" className="h-20 w-20 rounded-3xl object-cover transition-transform group-hover:scale-105 duration-300" />
        </div>

        <h1 className="mt-6 text-3xl font-display font-black tracking-tight text-white">
          Harino&apos;s Pizza
        </h1>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-red-500">
          Native Android Application
        </p>

        <p className="mt-4 text-sm leading-6 text-white/70 px-2 sm:px-6">
          Experience faster ordering, native push notifications, precise live GPS tracking, and our voice-activated AI Assistant (OMYA).
        </p>

        {/* App metadata panel */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">Version</div>
            <div className="mt-1.5 text-sm font-black text-white">{currentVersion}</div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">File Size</div>
            <div className="mt-1.5 text-sm font-black text-white">{fileSize}</div>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300">Compatibility</div>
            <div className="mt-1.5 text-xs font-bold text-white/90">{minAndroid}</div>
          </div>
        </div>

        {/* Download Action */}
        <div className="mt-8">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full cta-glow rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4.5 text-[11px] font-black uppercase tracking-[0.25em] transition-premium active:scale-[0.98] shadow-xl shadow-red-950/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDownloading ? (
              <span>Opening Harino&apos;s App...</span>
            ) : (
              <>
                📥 <span>Install Harino&apos;s App</span>
              </>
            )}
          </button>
        </div>

        {/* Step-by-step Installation Instructions */}
        {showInstructions && (
          <div className="mt-8 border-t border-white/10 pt-6 text-left animate-fade-in">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-amber-300 mb-4">
              Instant Setup Guide
            </h3>
            
            <div className="space-y-4 text-xs text-white/80 leading-relaxed">
              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">1</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Click &quot;Install Harino&apos;s App&quot;</p>
                  <p className="text-white/60">When your browser asks to install or add to Home screen, tap <b>Install</b> or <b>Add</b>.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">2</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Instant App Access</p>
                  <p className="text-white/60">Harino&apos;s Pizza will be added straight to your phone&apos;s home screen and app launcher with pure veg branding.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">3</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Google Play Store</p>
                  <p className="text-white/60">You can also install directly from the official Google Play Store listing.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Version History section */}
        <div className="mt-8 border-t border-white/5 pt-6 text-left">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-white/50 mb-3">
            Recent Changes (v{currentVersion})
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-white/60 font-medium pl-1">
            <li>Transitioned from PWA to Native Android App container.</li>
            <li>Optimized offline caching for faster layout loads.</li>
            <li>Integrated local push messaging for order status alerts.</li>
            <li>Enabled native haptic feedback support for interactions.</li>
          </ul>
        </div>
      </div>

      {/* Footer support details */}
      <div className="mt-8 text-center text-[10px] text-white/35 font-semibold leading-relaxed tracking-wider uppercase">
        Harino&apos;s Pizza Inc. • Designed for high-fidelity devices
      </div>
    </div>
  );
};

export default DownloadPage;
