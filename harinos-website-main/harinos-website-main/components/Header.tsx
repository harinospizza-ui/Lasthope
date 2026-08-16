import React, { useEffect, useRef, useState } from 'react';
import { NotificationService } from '../services/notification';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { getNotificationPermission } from '../services/browserSupport';

import { FestivalCampaign } from '../config/festivalCampaigns';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onViewOrders: () => void;
  onViewMenu: () => void;
  activeView: 'menu' | 'orders';
  onShare: () => void;
  onNotificationsEnabled: () => void;
  customerProfile?: any;
  onWalletClick?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  campaign?: FestivalCampaign | null;
  isCartOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  onViewOrders,
  onViewMenu,
  activeView,
  onShare,
  onNotificationsEnabled,
  customerProfile,
  onWalletClick,
  searchQuery,
  setSearchQuery,
  campaign,
  isCartOpen = false,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [notifStatus, setNotifStatus] = useState<NotificationPermission>('default');
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const { isInstalled, canPromptInstall, promptInstall } = useInstallPrompt();
  const logoUrl = '/icon-192.png';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const permission = getNotificationPermission();
    if (permission !== 'unsupported') {
      setNotifStatus(permission);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRequestNotifs = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifStatus(granted ? 'granted' : 'denied');

    if (granted) {
      NotificationService.show('Alerts Enabled', 'You will now receive order updates and special offers.');
      onNotificationsEnabled();
    }
  };

  const handleInstall = async () => {
    if (canPromptInstall) {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setShowInstallHelp(false);
      }
      return;
    }

    setShowInstallHelp((current) => !current);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewMenu();
  };

  const isScrolledOrLight = scrolled || activeView === 'orders';

  const [animateCart, setAnimateCart] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setAnimateCart(true);
      setAnimateBadge(true);
      const timer = setTimeout(() => {
        setAnimateCart(false);
        setAnimateBadge(false);
      }, 600);
      return () => clearTimeout(timer);
    } else if (cartCount !== prevCount.current) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 450);
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolledOrLight ? 'bg-white shadow-xl py-2' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 cursor-pointer group outline-none"
            title="Harino's Pizza Menu"
          >
            <div
              className={`transition-all duration-500 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-white/10 ${
                isScrolledOrLight ? 'w-10 h-10' : 'w-14 h-14'
              } relative`}
            >
              <img
                src={logoUrl}
                alt="Harino's"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="text-left">
              <span
                className={`block transition-all duration-500 font-display font-bold tracking-tight leading-none ${
                  isScrolledOrLight ? 'text-slate-900 text-xl' : 'text-white text-2xl'
                }`}
              >
                Harino&apos;s
              </span>
              <span
                className={`transition-all duration-500 text-[8px] md:text-[9px] uppercase tracking-[0.25em] font-bold ${
                  isScrolledOrLight ? 'text-red-600' : 'text-red-400'
                }`}
              >
                Because Hari Knows
              </span>
              {campaign && (
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-500 text-white shadow-sm animate-pulse">
                  {campaign.offer.discountValue}% OFF ACTIVE
                </span>
              )}
            </div>
          </button>

          <div className="flex items-center space-x-2.5 xs:space-x-3">
            {!isInstalled && (
              <button
                onClick={handleInstall}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium btn-hover-scale ${
                  isScrolledOrLight
                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100/50 shadow-sm'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                }`}
                title="Install Harino's App"
              >
                📥 <span className="hidden xs:inline">Install App</span>
              </button>
            )}

            {/* Orders History Button */}
            <button
              onClick={onViewOrders}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium btn-hover-scale cursor-pointer ${
                activeView === 'orders'
                  ? 'bg-red-600 border-red-600 text-white shadow-md'
                  : isScrolledOrLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-sm'
                  : 'bg-white/10 border-white/10 text-white hover:bg-white/20 backdrop-blur-md'
              }`}
              title="Order History (Last 3 Orders)"
            >
              <span>📜</span>
              <span className="hidden xs:inline">Orders</span>
            </button>

            {customerProfile && onWalletClick && (
              <button
                onClick={onWalletClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-premium btn-hover-scale mr-1 ${
                  isScrolledOrLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                    : 'bg-white/10 border-white/10 text-white backdrop-blur-md'
                }`}
                title="View Profile"
              >
                {customerProfile.avatar ? (
                  <img src={customerProfile.avatar} className="w-5 h-5 rounded-full object-cover" alt="Profile" />
                ) : (
                  <span>👤</span>
                )}
                <span className="font-black">{customerProfile.name.split(' ')[0]}</span>
                {customerProfile.verified && (
                  <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full w-3.5 h-3.5 text-[8px] font-black" title="Verified Customer">✓</span>
                )}
              </button>
            )}

            <div className="relative flex items-center space-x-2">
              <button
                onClick={onCartClick}
                className={`relative p-3 md:p-4 rounded-2xl transition-all duration-305 ${
                  isScrolledOrLight ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/10 text-white backdrop-blur-md'
                } ${animateCart ? 'animate-cart-bounce' : 'active:scale-90 hover:scale-105'}`}
                aria-label="View Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 text-[10px] font-black px-2 py-0.5 rounded-full ring-2 transition-all ${
                      isScrolledOrLight ? 'bg-white text-red-600 ring-red-600' : 'bg-red-600 text-white ring-white'
                    } ${animateBadge ? 'animate-badge-bounce' : ''}`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeView === 'menu' && !isCartOpen && (
          <div className="mt-4 pb-1 animate-fade-in">
            <div className="relative w-full max-w-lg mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search delicious pizzas, momos, sides..."
                className={`w-full pl-11 pr-10 py-2.5 rounded-2.5xl text-xs font-semibold outline-none transition-all duration-300 border shadow-sm ${
                  isScrolledOrLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : 'bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/30 focus:ring-2 focus:ring-white/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 font-bold text-sm"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {showInstallHelp && (
        <div className="bg-slate-900 text-white text-center py-2 px-4 text-xs border-t border-white/10 animate-fade-in">
          {needsIosInstructions ? (
            <>iPhone / iPad Users: Open this site in <span className="font-bold">Safari</span>, tap <span className="font-bold">Share</span> and select <span className="font-bold">Add to Home Screen</span>.</>
          ) : (
            <>To install Harino's: Click your browser's menu/share button and select <span className="font-bold">Add to Home Screen</span> or <span className="font-bold">Install</span>.</>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
