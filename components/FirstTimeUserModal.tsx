import React, { useEffect, useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface FirstTimeUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectLocation: () => Promise<any>;
}

const FirstTimeUserModal: React.FC<FirstTimeUserModalProps> = ({
  isOpen,
  onClose,
  onDetectLocation,
}) => {
  const { canPromptInstall, needsIosInstructions, isInstalled, promptInstall } = useInstallPrompt();
  const [locationStatus, setLocationStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');
  const [storageStatus, setStorageStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as any }).then((result) => {
        setLocationStatus(result.state as any);
        result.onchange = () => {
          setLocationStatus(result.state as any);
        };
      });

      navigator.permissions.query({ name: 'notifications' as any }).then((result) => {
        // Query permissions query result state
        setNotificationStatus(result.state as any);
        result.onchange = () => {
          setNotificationStatus(result.state as any);
        };
      }).catch(() => {
        setNotificationStatus(Notification.permission);
      });
    } else {
      setNotificationStatus(Notification.permission);
    }

    if (navigator.storage && navigator.storage.persisted) {
      navigator.storage.persisted().then((persisted) => {
        setStorageStatus(persisted ? 'granted' : 'prompt');
      });
    } else {
      setStorageStatus('granted');
    }
  }, []);

  if (!isOpen) return null;

  const handleAllowLocation = async () => {
    try {
      const loc = await onDetectLocation();
      if (loc) {
        setLocationStatus('granted');
        alert('Location access granted successfully!');
      } else {
        setLocationStatus('denied');
      }
    } catch {
      setLocationStatus('denied');
    }
  };

  const handleAllowNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        alert('Notification access granted successfully!');
      } else {
        alert('Notification access was denied. Please enable it in browser settings.');
      }
    } catch {
      setNotificationStatus('denied');
    }
  };

  const handleAllowStorage = async () => {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const persisted = await navigator.storage.persist();
        if (persisted) {
          setStorageStatus('granted');
          alert('Persistent storage granted successfully!');
          return;
        }
      }
      // Fallback check
      localStorage.setItem('harinos_storage_test', 'ok');
      const val = localStorage.getItem('harinos_storage_test');
      localStorage.removeItem('harinos_storage_test');
      if (val === 'ok') {
        setStorageStatus('granted');
        alert('Storage is fully functional and verified!');
      } else {
        setStorageStatus('denied');
        alert('Storage access is restricted.');
      }
    } catch {
      setStorageStatus('denied');
    }
  };

  const handleInstallApp = async () => {
    if (canPromptInstall) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        alert('Thank you for installing Harino\'s App!');
      }
    }
  };

  const allPermissionsGranted = 
    locationStatus === 'granted' && 
    notificationStatus === 'granted' && 
    storageStatus === 'granted';

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-slide-up">
      <div className="w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-slate-950 text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] border border-white/10 sm:rounded-[2.5rem]">
        {/* Glow decoration */}
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_65%)] pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15 sm:hidden" />

          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white/5 ring-1 ring-white/10 shadow-lg mb-4">
              <img src="/icon-192.png" alt="Harino's" className="h-12 w-12 rounded-xl object-cover" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Welcome to Harino's</span>
            <h3 className="mt-1 font-display text-3xl font-bold leading-tight text-white">Get Started</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Please enable the following permissions to ensure order routing, real-time alerts, and offline support.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {/* Step 1: Location Access */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-red-400">Step 1</div>
                <div className="font-bold text-sm text-white">Enable Location</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Needed to find nearest outlet and calculate delivery.</p>
              </div>
              <button
                onClick={handleAllowLocation}
                disabled={locationStatus === 'granted'}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  locationStatus === 'granted'
                    ? 'bg-green-600/20 border border-green-500 text-green-300'
                    : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95'
                }`}
              >
                {locationStatus === 'granted' ? 'Allowed ✓' : 'Allow'}
              </button>
            </div>

            {/* Step 2: Push Notifications */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-red-400">Step 2</div>
                <div className="font-bold text-sm text-white">Push Notifications</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Needed to send real-time pizza status and updates.</p>
              </div>
              <button
                onClick={handleAllowNotifications}
                disabled={notificationStatus === 'granted'}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  notificationStatus === 'granted'
                    ? 'bg-green-600/20 border border-green-500 text-green-300'
                    : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95'
                }`}
              >
                {notificationStatus === 'granted' ? 'Allowed ✓' : 'Allow'}
              </button>
            </div>

            {/* Step 3: Storage Verification */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-red-400">Step 3</div>
                <div className="font-bold text-sm text-white">Secure Storage</div>
                <p className="text-[10px] text-slate-400 mt-0.5">Needed to save your login session and profile wallet.</p>
              </div>
              <button
                onClick={handleAllowStorage}
                disabled={storageStatus === 'granted'}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  storageStatus === 'granted'
                    ? 'bg-green-600/20 border border-green-500 text-green-300'
                    : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-95'
                }`}
              >
                {storageStatus === 'granted' ? 'Verified ✓' : 'Verify'}
              </button>
            </div>

            {/* Optional Step: Install App */}
            {!isInstalled && (canPromptInstall || needsIosInstructions) && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <div className="text-[9px] font-black uppercase tracking-widest text-red-400">App Install</div>
                    <div className="font-bold text-sm text-white">Add to Home Screen</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Experience full-screen fast pizza ordering.</p>
                  </div>
                  {canPromptInstall && (
                    <button
                      onClick={handleInstallApp}
                      className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all"
                    >
                      Install
                    </button>
                  )}
                </div>

                {needsIosInstructions && (
                  <div className="mt-3 pt-3 border-t border-white/5 text-[10px] leading-relaxed text-slate-400">
                    <span className="font-black text-amber-300 uppercase tracking-wider block mb-1">iPhone / iPad Users:</span>
                    Open this site in <span className="text-white font-bold">Safari</span>, tap the <span className="text-white font-bold">Share</span> button, and select <span className="text-white font-bold">Add to Home Screen</span>.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={!allPermissionsGranted}
            className={`mt-6 w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-premium text-center block ${
              allPermissionsGranted 
                ? 'bg-gradient-premium active:scale-98 cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            {allPermissionsGranted ? 'Start Ordering 🍕' : 'Please Grant Permissions to Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeUserModal;

