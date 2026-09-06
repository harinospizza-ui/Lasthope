import React, { useState, useEffect } from 'react';

const DownloadPage: React.FC = () => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const currentVersion = "1.0.0";
  const fileSize = "15.4 MB";
  const minAndroid = "Android 7.0 (Nougat) or higher";
  const apkUrl = "https://harinos.store/downloads/Harinos.apk";

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setShowInstructions(true);

      const response = await fetch(apkUrl);
      if (!response.ok) throw new Error('Download failed');

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No body stream');

      let receivedLength = 0;
      const chunks = [];

      while(true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (total > 0) {
          setDownloadProgress(Math.round((receivedLength / total) * 100));
        }
      }

      const blob = new Blob(chunks, { type: 'application/vnd.android.package-archive' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Harinos.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadProgress(100);
      localStorage.setItem('harinos_apk_installed', 'true');
    } catch (err) {
      console.error(err);
      // Fallback: direct anchor link
      window.location.href = apkUrl;
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
              <span>Downloading APK ({downloadProgress}%)</span>
            ) : (
              <>
                📥 <span>Download APK</span>
              </>
            )}
          </button>
        </div>

        {/* Live Progress Bar */}
        {isDownloading && downloadProgress !== null && (
          <div className="mt-4 w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <div 
              className="h-full bg-red-600 rounded-full transition-all duration-300" 
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}

        {/* Step-by-step Installation Instructions */}
        {showInstructions && (
          <div className="mt-8 border-t border-white/10 pt-6 text-left animate-fade-in">
            <h3 className="text-sm font-black uppercase tracking-[0.15em] text-amber-300 mb-4">
              How to Install (Android guide)
            </h3>
            
            <div className="space-y-4 text-xs text-white/80 leading-relaxed">
              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">1</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Allow browser downloads</p>
                  <p className="text-white/60">If Chrome prompts you to download the file, click <b>OK</b> or <b>Download Anyway</b>.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">2</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Open the APK file</p>
                  <p className="text-white/60">Once the download is complete, click <b>Open</b> from your browser or find <b>Harinos.apk</b> in your device&apos;s Downloads folder.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">3</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Enable Unknown Sources</p>
                  <p className="text-white/60">If prompted, click <b>Settings</b> and toggle on <b>&quot;Allow from this source&quot;</b>.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-white/10 text-white font-bold shrink-0">4</span>
                <div>
                  <p className="font-bold text-white mb-0.5">Complete installation</p>
                  <p className="text-white/60">Tap <b>Install</b>, then click <b>Open</b> to launch the native Harino&apos;s Pizza App!</p>
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
