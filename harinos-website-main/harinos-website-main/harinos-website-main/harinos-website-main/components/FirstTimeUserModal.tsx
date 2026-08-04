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
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as any }).then((result) => {
        setLocationStatus(result.state as any);
        result.onchange = () => {
          setLocationStatus(result.state as any);
        };
      });

      navigator.permissions.query({ name: 'notifications' as any }).then((result) => {
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
        alert("Thank you for installing Harino's App!");
      }
    }
  };

  const handleFinish = () => {
    localStorage.setItem('harinos_tutorial_completed', 'true');
    onClose();
  };

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 1:
        return (
          <div className="text-center animate-fade-in py-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white ring-1 ring-slate-200 shadow-md mb-4 mx-auto">
              <img src="/icon-192.png" alt="Harino's" className="h-12 w-12 rounded-xl object-cover" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-655">Onboarding Tour</span>
            <h3 className="mt-2 font-display text-3xl font-bold leading-tight text-slate-800">Welcome to Harino's</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 font-semibold px-2">
              Let's walk you through how Harino's Pizza works. Learn to order, manage your wallet balance, apply coupon codes, and customize your settings in under 1 minute!
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-xl mb-1">🍕</div>
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-700">Fresh Pies</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-xl mb-1">🎁</div>
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-700">Hot Deals</div>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-center">
                <div className="text-xl mb-1">💳</div>
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-700">UPI & COD</div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center animate-fade-in py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-655">Step 1 of 3</span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-slate-800">Choose Service Mode</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold mb-5">
              Select <span className="text-slate-800 font-bold">Delivery 🛵</span> or <span className="text-slate-800 font-bold">Dine-in 🍽️</span>. Location permissions help us calculate distances, delivery fees, and match you with the nearest kitchen.
            </p>
            
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 flex items-center justify-between text-left">
              <div className="flex-1 pr-4">
                <div className="font-bold text-sm text-slate-800">Location Services</div>
                <p className="text-[10px] text-slate-500 mt-0.5">Required for delivery pricing rules and automated outlet routing.</p>
              </div>
              <button
                onClick={handleAllowLocation}
                disabled={locationStatus === 'granted'}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  locationStatus === 'granted'
                    ? 'bg-green-50 border border-green-200 text-green-700 font-black'
                    : 'bg-red-650 hover:bg-red-750 text-white active:scale-95 shadow-md shadow-red-900/10'
                }`}
              >
                {locationStatus === 'granted' ? 'Allowed ✓' : 'Detect'}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center animate-fade-in py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-655">Step 2 of 3</span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-slate-800">Special Promos & Referrals</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold mb-5">
              Enter a referral code on login to earn Rs. 10 cash and +100 reward points upon your first successful order.
            </p>
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-4 flex flex-col gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-lg">🤝</span>
                <div>
                  <div className="text-xs font-bold text-slate-800">Referral Rewards</div>
                  <div className="text-[10px] text-slate-500">Enter a friend's code at login to earn cash and reward points.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t border-slate-200/40 pt-3">
                <span className="text-lg">🏷️</span>
                <div>
                  <div className="text-xs font-bold text-slate-800">Special Coupon Codes</div>
                  <div className="text-[10px] text-slate-500">Find active discount codes displayed live inside the storefront carousel.</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center animate-fade-in py-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-655">Step 3 of 3</span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-slate-800">Checkout & Notifications</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold mb-5">
              Secure checkout via UPI or Cash on Delivery. Turn on order status notifications so you get live updates when your order is accepted, prepared, or dispatched.
            </p>
            <div className="space-y-3 text-left">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="font-bold text-xs text-slate-800">Order Alerts</div>
                  <p className="text-[9px] text-slate-500">Enables updates when your order is accepted, prepared, or dispatched.</p>
                </div>
                <button
                  onClick={handleAllowNotifications}
                  disabled={notificationStatus === 'granted'}
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    notificationStatus === 'granted'
                      ? 'bg-green-50 border border-green-200 text-green-700 font-black'
                      : 'bg-red-650 hover:bg-red-750 text-white active:scale-95 shadow-md shadow-red-900/10'
                  }`}
                >
                  {notificationStatus === 'granted' ? 'Allowed ✓' : 'Allow'}
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="font-bold text-xs text-slate-800">Persistent Storage</div>
                  <p className="text-[9px] text-slate-500">Saves your profile settings, reward points, and checkout cart.</p>
                </div>
                <button
                  onClick={handleAllowStorage}
                  disabled={storageStatus === 'granted'}
                  className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    storageStatus === 'granted'
                      ? 'bg-green-50 border border-green-200 text-green-700 font-black'
                      : 'bg-red-650 hover:bg-red-750 text-white active:scale-95 shadow-md shadow-red-900/10'
                  }`}
                >
                  {storageStatus === 'granted' ? 'Verified ✓' : 'Verify'}
                </button>
              </div>

              {!isInstalled && (canPromptInstall || needsIosInstructions) && (
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <div className="font-bold text-xs text-slate-800">Install Mobile App</div>
                    <p className="text-[9px] text-slate-500">Run Harino's in full-screen standalone mode.</p>
                  </div>
                  {canPromptInstall && (
                    <button
                      onClick={handleInstallApp}
                      className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      Install
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-[#faf7f0] p-6 text-slate-800 shadow-[0_30px_120px_rgba(0,0,0,0.25)] border border-slate-200 sm:rounded-[2.5rem] sm:p-8 max-h-[90vh] overflow-y-auto hide-scrollbar">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(230,92,0,0.06),transparent_65%)] pointer-events-none" />

        <div className="relative">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
          
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 font-bold hover:text-red-650 cursor-pointer shadow-sm"
          >
            &times;
          </button>

          {renderSlideContent()}

          {/* Slider Indicators */}
          <div className="mt-8 flex justify-center items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentSlide(s)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  s === currentSlide ? 'w-6 bg-red-650' : 'w-2 bg-slate-300'
                }`}
                aria-label={`Slide ${s}`}
              />
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            {currentSlide > 1 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="flex-1 py-3.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-250 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                Back
              </button>
            )}
            
            {currentSlide < 4 ? (
              <button
                onClick={() => setCurrentSlide(currentSlide + 1)}
                className="flex-grow py-3.5 bg-red-650 hover:bg-red-750 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-900/10 cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-grow py-3.5 bg-red-650 hover:bg-red-750 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-900/10 cursor-pointer"
              >
                Start Ordering 🍕
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeUserModal;
