import React, { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const ApkInstaller = registerPlugin<any>('ApkInstaller');

interface UpdateModalProps {
  latestVersion: string;
  releaseNotes: string;
  isForceUpdate: boolean;
  apkUrl: string;
  onLater: () => void;
  isConversionPrompt?: boolean;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  latestVersion,
  releaseNotes,
  isForceUpdate,
  apkUrl,
  onLater,
  isConversionPrompt = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [installReady, setInstallReady] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  const isNative = Capacitor.isNativePlatform();
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const { canPromptInstall, promptInstall } = useInstallPrompt();

  const cleanupPwaAndMigrate = async () => {
    try {
      localStorage.setItem('harinos_migrated_to_native', 'true');

      // Unregister PWA service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // Flush old PWA cache storage
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
    } catch (e) {
      console.warn('PWA cleanup notice:', e);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setError('');

      if (isIOS) {
        // iOS: Show guided home screen installation & profile download
        await cleanupPwaAndMigrate();
        setIsDownloading(false);
        setShowIosGuide(true);
        setInstallReady(true);
        return;
      }

      if (isNative && isAndroid) {
        // Running inside native Android Capacitor app
        const response = await fetch(apkUrl);
        if (!response.ok) throw new Error('Failed to fetch update package');

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No stream reader available');

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          if (total > 0) {
            setDownloadProgress(Math.round((receivedLength / total) * 100));
          }
        }

        const fileData = new Uint8Array(receivedLength);
        let offset = 0;
        for (const chunk of chunks) {
          fileData.set(chunk, offset);
          offset += chunk.length;
        }

        let binary = '';
        const len = fileData.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(fileData[i]);
        }
        const base64Data = window.btoa(binary);
        const filename = 'Harinos_update.apk';

        const writeResult = await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Cache
        });

        setDownloadProgress(100);
        await ApkInstaller.installApk({ filePath: writeResult.uri });
      } else if (isAndroid) {
        // Android WebApp / PWA
        if (canPromptInstall) {
          const outcome = await promptInstall();
          if (outcome === 'accepted') {
            await cleanupPwaAndMigrate();
            setInstallReady(true);
            return;
          }
        }

        // If prompt not available or dismissed, direct to Google Play Store
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.harinos.app';
        window.open(playStoreUrl, '_blank');
        setInstallReady(true);
      } else {
        // Desktop / Other browser: clean caches and trigger browser install
        if (canPromptInstall) {
          await promptInstall();
        }
        await cleanupPwaAndMigrate();
        setInstallReady(true);
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Error occurred during installation.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadIosProfile = () => {
    window.location.href = '/Harinos.mobileconfig';
  };

  const handleOpenInstalledApp = () => {
    window.location.href = 'harinos://open';
    setTimeout(() => {
      window.location.href = 'https://harinos.store/?source=installed';
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/85 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-slate-900 border border-white/10 p-8 shadow-2xl sm:rounded-[2.5rem] relative z-10 text-center text-white overflow-hidden max-h-[92vh] overflow-y-auto hide-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.25),_transparent_55%)] pointer-events-none" />

        {/* Brand Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white ring-4 ring-white/10 shadow-xl relative overflow-hidden">
          <img src="/icon-192.png" alt="Harino's Pizza" className="h-16 w-16 rounded-2xl object-cover" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
          {installReady
            ? isIOS
              ? "Install Harino's on your iPhone"
              : "App Downloaded Successfully!"
            : isConversionPrompt
            ? "Install Harino's Official App"
            : "New Version Available"}
        </h2>

        <div className="mt-1.5 inline-block rounded-full bg-red-500/10 border border-red-500/25 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500">
          {isIOS ? 'iOS Official' : `Version ${latestVersion || 'Latest'}`}
        </div>

        {/* iOS Guided Installation View */}
        {isIOS && (showIosGuide || installReady) ? (
          <div className="mt-5 text-left bg-slate-950/60 border border-white/10 rounded-2xl p-4.5 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <span>🍎</span>
              <span>iOS Quick Setup</span>
            </div>

            <div className="space-y-2.5 text-xs text-white/80 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">1</span>
                <span>In Safari, tap the <b>Share button</b> (<span className="text-sm">⎋</span> or square with arrow pointing up) at the bottom toolbar.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">2</span>
                <span>Scroll down and tap <b>&quot;Add to Home Screen&quot;</b> (<span className="text-sm font-bold">＋</span>).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-[10px] font-bold text-red-400">3</span>
                <span>Tap <b>&quot;Add&quot;</b> in the top-right corner. Harino&apos;s will appear as an app on your Home Screen!</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-[10px] text-white/50 mb-2">Or install Harino&apos;s verified iOS Configuration Profile directly:</p>
              <button
                type="button"
                onClick={handleDownloadIosProfile}
                className="w-full py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>📥</span>
                <span>Download iOS Profile (.mobileconfig)</span>
              </button>
            </div>
          </div>
        ) : installReady ? (
          <div className="mt-5 text-left bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>✅</span>
              <span>Installation Ready</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              1. Tap &quot;Add&quot; or &quot;Install&quot; on your device prompt to add Harino&apos;s Pizza to your home screen.
            </p>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              2. You can now launch Harino&apos;s directly from your apps list with 100% pure veg deliciousness!
            </p>
            <p className="text-[10px] text-white/50 leading-relaxed">
              🛡️ Harino&apos;s is 100% verified & safe.
            </p>
          </div>
        ) : (
          /* Release notes & info */
          <div className="mt-5 text-left bg-white/5 border border-white/5 rounded-2xl p-4 max-h-36 overflow-y-auto hide-scrollbar">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 mb-1.5">
              {isConversionPrompt ? "Official App Features" : "What's New"}
            </div>
            <p className="text-xs leading-relaxed text-white/70 whitespace-pre-line font-medium">
              {isConversionPrompt
                ? "Get the official Harino's App for instant launch, live kitchen order notifications (preparing, ready, out for delivery), wallet cashback alerts, and smooth checkout."
                : (releaseNotes || 'Performance enhancements, security updates, and bug fixes.')}
            </p>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400">
            ⚠️ {error}
          </div>
        )}

        {/* Live download progress */}
        {isDownloading && downloadProgress !== null && (
          <div className="mt-5 text-left">
            <div className="flex justify-between text-[10px] font-bold text-white/50 mb-1.5">
              <span>Downloading update package...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <p className="mt-2 text-[9px] text-white/40 leading-normal">
              Harino&apos;s verified installer will open automatically once downloaded.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          {installReady && !isIOS ? (
            <button
              type="button"
              onClick={handleOpenInstalledApp}
              className="w-full cta-glow rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-premium active:scale-[0.98] cursor-pointer"
            >
              Open Harino&apos;s App
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isDownloading}
              className="w-full cta-glow rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-premium active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xl shadow-red-950/30"
            >
              {isDownloading
                ? `Downloading Update (${downloadProgress ?? 0}%)...`
                : 'Install updates'}
            </button>
          )}

          {!isForceUpdate && !isDownloading && (
            <button
              type="button"
              onClick={onLater}
              className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {installReady ? 'Close' : 'Later'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;