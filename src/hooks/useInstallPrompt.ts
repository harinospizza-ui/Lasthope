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

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const isNative = Capacitor.isNative;

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
      setIsInstalled(isRunningStandalone());
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
    if (isInstalled || isNative) return false;
    return !!deferredPrompt;
  }, [deferredPrompt, isInstalled, isNative]);

  const needsIosInstructions = useMemo(
    () => !canPromptInstall && !isInstalled && isIosDevice(),
    [canPromptInstall, isInstalled],
  );

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (!deferredPrompt) {
      return 'unsupported';
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return 'accepted';
      }
      return 'dismissed';
    } catch (err) {
      console.error(err);
      return 'unsupported';
    }
  };

  return {
    canPromptInstall,
    needsIosInstructions,
    isInstalled,
    promptInstall,
  };
};
