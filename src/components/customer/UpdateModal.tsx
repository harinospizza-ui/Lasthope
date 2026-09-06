import React, { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { registerPlugin } from '@capacitor/core';

const ApkInstaller = registerPlugin<any>('ApkInstaller');

interface UpdateModalProps {
  latestVersion: string;
  releaseNotes: string;
  isForceUpdate: boolean;
  apkUrl: string;
  onLater: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  latestVersion,
  releaseNotes,
  isForceUpdate,
  apkUrl,
  onLater,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleUpdate = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setError('');

      // Fetch the file natively using web streams inside the native container
      const response = await fetch(apkUrl);
      if (!response.ok) throw new Error('Failed to fetch update APK');

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No body stream reader available');

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

      // Concatenate chunks
      const fileData = new Uint8Array(receivedLength);
      let offset = 0;
      for (const chunk of chunks) {
        fileData.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert binary Uint8Array to Base64 (Capacitor Filesystem requires base64/strings)
      let binary = '';
      const len = fileData.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(fileData[i]);
      }
      const base64Data = window.btoa(binary);

      const filename = 'Harinos_update.apk';

      // Write file to native cache
      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Cache
      });

      setDownloadProgress(100);

      // Trigger the native installer
      await ApkInstaller.installApk({ filePath: writeResult.uri });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred downloading package.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-slate-900 border border-white/5 p-8 shadow-2xl sm:rounded-[2.5rem] relative z-10 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.22),_transparent_55%)] pointer-events-none" />

        {/* Brand Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white ring-4 ring-white/10 shadow-xl relative overflow-hidden">
          <img src="/icon-192.png" alt="Harino's Pizza" className="h-16 w-16 rounded-2xl object-cover" />
        </div>

        <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
          New Version Available
        </h2>
        <div className="mt-1 inline-block rounded-full bg-red-500/10 border border-red-500/20 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500">
          Version {latestVersion}
        </div>

        {/* Release Notes */}
        <div className="mt-5 text-left bg-white/5 border border-white/5 rounded-2xl p-4 max-h-36 overflow-y-auto hide-scrollbar">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 mb-1.5">
            What&apos;s New
          </div>
          <p className="text-xs leading-relaxed text-white/70 whitespace-pre-line font-medium">
            {releaseNotes || 'Performance enhancements and bug fixes.'}
          </p>
        </div>

        {/* Error message */}
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
              Once downloaded, the Android Package Installer will open to complete the process.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleUpdate}
            disabled={isDownloading}
            className="w-full cta-glow rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-premium active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isDownloading ? `Downloading Update...` : 'Update Now'}
          </button>

          {!isForceUpdate && !isDownloading && (
            <button
              onClick={onLater}
              className="w-full rounded-2xl border border-white/5 bg-white/5 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Later
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
