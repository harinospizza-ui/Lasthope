import React, { useState, useEffect } from 'react';
import { dynamicConfig, RemoteAnnouncement } from '../../services/dynamicConfigService';
import { HapticsService } from '../../services/hapticsService';

interface DynamicAnnouncementRibbonProps {
  onCopyPromo?: (code: string) => void;
  onExploreMenu?: () => void;
}

export const DynamicAnnouncementRibbon: React.FC<DynamicAnnouncementRibbonProps> = ({
  onCopyPromo,
  onExploreMenu
}) => {
  const [isOnline, setIsOnline] = useState(dynamicConfig.getIsOnline());
  const [announcement, setAnnouncement] = useState<RemoteAnnouncement | null>(dynamicConfig.getAnnouncement());
  const [isDismissed, setIsDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const unsubNet = dynamicConfig.onNetworkChange((online) => {
      setIsOnline(online);
    });
    const unsubAnn = dynamicConfig.onAnnouncementChange((ann) => {
      setAnnouncement(ann);
      setIsDismissed(false);
    });

    return () => {
      unsubNet();
      unsubAnn();
    };
  }, []);

  // 1. Offline Mode Banner (Highest Priority)
  if (!isOnline) {
    return (
      <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2 text-xs font-black shadow-md flex items-center justify-between animate-fade-in z-50">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <span className="text-base animate-pulse">📶</span>
          <span>You are currently offline. Your cart and past orders are safely preserved!</span>
        </div>
      </div>
    );
  }

  // 2. Remote Announcement Banner
  if (!announcement || !announcement.enabled || isDismissed) {
    return null;
  }

  const handleAction = () => {
    void HapticsService.light();
    if (announcement.promoCode) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(announcement.promoCode).catch(() => {});
      }
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
      onCopyPromo?.(announcement.promoCode);
    } else if (announcement.actionType === 'scroll_menu') {
      onExploreMenu?.();
    } else if (announcement.actionType === 'external_link' && announcement.actionTarget) {
      window.open(announcement.actionTarget, '_blank');
    }
  };

  const bgGradient = announcement.gradient || 'from-red-650 via-red-600 to-orange-600';

  return (
    <div className={`w-full bg-gradient-to-r ${bgGradient} text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs font-bold animate-slide-down relative z-40`}>
      <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center gap-3 text-center flex-wrap">
        {announcement.badge && (
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white uppercase text-[9px] font-black tracking-wider backdrop-blur-sm">
            {announcement.badge}
          </span>
        )}
        <span className="flex items-center gap-1.5 font-medium">
          {announcement.icon && <span>{announcement.icon}</span>}
          <span>{announcement.text}</span>
        </span>

        {announcement.promoCode && (
          <button
            type="button"
            onClick={handleAction}
            className="px-2.5 py-1 rounded-lg bg-white text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-amber-100 transition-all active:scale-95 flex items-center gap-1"
          >
            <span>{copiedCode ? '✓ COPIED!' : `CODE: ${announcement.promoCode}`}</span>
          </button>
        )}

        {announcement.linkText && !announcement.promoCode && (
          <button
            type="button"
            onClick={handleAction}
            className="underline text-[11px] font-black hover:text-amber-200 transition-colors"
          >
            {announcement.linkText} ➔
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="text-white/70 hover:text-white text-base font-bold ml-2 transition-colors px-1"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
};

export default DynamicAnnouncementRibbon;
