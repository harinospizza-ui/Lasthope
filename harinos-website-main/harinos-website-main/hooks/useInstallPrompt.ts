import { useEffect, useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isRunningStandalone = (): boolean =>
  window.matchMedia('(display-mode: standalone)').matches ||
  Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

const isIosDevice = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
  const isTouchMac = window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  return isAppleMobile || isTouchMac;
};

const isAndroidDevice = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/i.test(userAgent);
};

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);

  const isNative = Capacitor.isNative;
  const isAndroid = isAndroidDevice();

  useEffect(() => {
    if (isNative) {
      setIsInstalled(true);
      return;
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)');

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    const refreshInstallState = () => {
      const isStandalone = isRunningStandalone();
      const hasLocalFlag = localStorage.getItem('harinos_apk_installed') === 'true';
      setIsInstalled(isStandalone || hasLocalFlag);
    };

    refreshInstallState();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleInstalled);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', refreshInstallState);
    } else {
      mediaQuery.addListener(refreshInstallState);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleInstalled);

      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', refreshInstallState);
      } else {
        mediaQuery.removeListener(refreshInstallState);
      }
    };
  }, [isNative]);

  const canPromptInstall = useMemo(() => {
    if (isInstalled) return false;
    if (isNative) return false;
    if (isAndroid) return true;
    return !!deferredPrompt;
  }, [deferredPrompt, isInstalled, isAndroid, isNative]);

  const needsIosInstructions = useMemo(
    () => !canPromptInstall && !isInstalled && isIosDevice(),
    [canPromptInstall, isInstalled],
  );

  const downloadApk = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setShowApkGuide(true);

      const apkUrl = 'https://harinos.store/downloads/Harinos.apk';
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
      return 'accepted';
    } catch (err) {
      console.error(err);
      window.location.href = 'https://harinos.store/downloads/Harinos.apk';
      return 'accepted';
    } finally {
      setIsDownloading(false);
    }
  };

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (isAndroid && !isNative) {
      return await downloadApk();
    }

    if (!deferredPrompt) {
      return 'unsupported';
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }

    return outcome;
  };

  return {
    canPromptInstall,
    needsIosInstructions,
    isInstalled,
    promptInstall,
    downloadProgress,
    isDownloading,
    showApkGuide,
    setShowApkGuide,
    downloadApk
  };
};
