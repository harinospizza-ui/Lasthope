import { useEffect, useMemo, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

// Keep a module-level reference so any early beforeinstallprompt event is never lost across re-renders
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent('harinos_prompt_available'));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    localStorage.setItem('harinos_app_installed', 'true');
    window.dispatchEvent(new CustomEvent('harinos_app_installed_event'));
  });
}

export const isRunningStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone) ||
    localStorage.getItem('harinos_app_installed') === 'true'
  );
};

export const getDevicePlatform = (): {
  isIOS: boolean;
  isAndroid: boolean;
  isChrome: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isSamsung: boolean;
  isDesktop: boolean;
} => {
  if (typeof navigator === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isChrome: false,
      isSafari: false,
      isEdge: false,
      isSamsung: false,
      isDesktop: true,
    };
  }

  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(ua);
  const isSamsung = /samsungbrowser/.test(ua);
  const isEdge = /edg/.test(ua);
  const isChrome = /chrome|crios/.test(ua) && !isEdge && !isSamsung;
  const isSafari = /safari/.test(ua) && !isChrome && !isEdge && !isSamsung;
  const isDesktop = !isIOS && !isAndroid;

  return { isIOS, isAndroid, isChrome, isSafari, isEdge, isSamsung, isDesktop };
};

export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => isRunningStandalone());

  const isNative = Capacitor.isNativePlatform();
  const platform = useMemo(() => getDevicePlatform(), []);

  useEffect(() => {
    if (isNative) {
      setIsInstalled(true);
      return;
    }

    const refreshInstallState = () => {
      const installed = isRunningStandalone();
      setIsInstalled(installed);
      if (installed) {
        localStorage.setItem('harinos_app_installed', 'true');
      }
    };

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handlePromptAvailable = () => {
      if (globalDeferredPrompt) {
        setDeferredPrompt(globalDeferredPrompt);
      }
    };

    const handleInstalled = () => {
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      setIsInstalled(true);
      localStorage.setItem('harinos_app_installed', 'true');
    };

    refreshInstallState();
    window.addEventListener('beforeinstallprompt', handlePrompt as EventListener);
    window.addEventListener('harinos_prompt_available', handlePromptAvailable);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('harinos_app_installed_event', handleInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', refreshInstallState);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(refreshInstallState);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt as EventListener);
      window.removeEventListener('harinos_prompt_available', handlePromptAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('harinos_app_installed_event', handleInstalled);
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', refreshInstallState);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(refreshInstallState);
      }
    };
  }, [isNative]);

  const canPromptInstall = useMemo(() => {
    if (isInstalled || isNative) return false;
    return !!deferredPrompt || !!globalDeferredPrompt;
  }, [deferredPrompt, isInstalled, isNative]);

  const needsIosInstructions = useMemo(
    () => !canPromptInstall && !isInstalled && platform.isIOS,
    [canPromptInstall, isInstalled, platform.isIOS],
  );

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    const promptEvent = deferredPrompt || globalDeferredPrompt;
    if (!promptEvent) {
      return 'unsupported';
    }

    try {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
        localStorage.setItem('harinos_app_installed', 'true');
        return 'accepted';
      }
      return 'dismissed';
    } catch (err) {
      console.error('Install prompt error:', err);
      return 'unsupported';
    }
  };

  const markAsInstalled = () => {
    setIsInstalled(true);
    setDeferredPrompt(null);
    globalDeferredPrompt = null;
    localStorage.setItem('harinos_app_installed', 'true');
    window.dispatchEvent(new CustomEvent('harinos_app_installed_event'));
  };

  return {
    canPromptInstall,
    needsIosInstructions,
    isInstalled,
    promptInstall,
    markAsInstalled,
    platform,
  };
};
