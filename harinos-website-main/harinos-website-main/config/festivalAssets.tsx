import React from 'react';

export interface FestivalAssetPackage {
  festivalId: string;
  festivalName: string;
  renderArtwork: (className?: string) => React.ReactNode;
  fallbackImageUrl: string;
}

/**
 * Isolated, dedicated SVG & CSS Artwork Packages for each festival.
 * Guarantees that no festival ever shares or falls back to another festival's imagery.
 */
export const FESTIVAL_ASSETS: Record<string, FestivalAssetPackage> = {
  'raksha-bandhan': {
    festivalId: 'raksha-bandhan',
    festivalName: 'Raksha Bandhan',
    fallbackImageUrl: '/festivals/raksha-bandhan/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-rose-900 via-red-900 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        {/* Festive background patterns */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />

        {/* Central Rakhi Graphic */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-300 p-1 shadow-2xl shadow-rose-950/60 animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-300/60">
              <span className="text-3xl sm:text-4xl">🪢</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-rose-500/30 border border-rose-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Sibling Love & Pure Slices
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Raksha Bandhan Special
          </h3>
          <p className="mt-1 text-xs text-rose-200/90 font-light max-w-xs">
            Handcrafted with brotherly affection & sisterly care. 100% Pure Vegetarian.
          </p>
        </div>
      </div>
    ),
  },

  'independence-day': {
    festivalId: 'independence-day',
    festivalName: 'Independence Day',
    fallbackImageUrl: '/festivals/independence-day/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-white to-emerald-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-orange-300/40">
              <span className="text-3xl sm:text-4xl">🇮🇳</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-orange-500/30 border border-orange-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-300">
              Celebrate India • Pride in Taste
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Independence Day Special
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light max-w-xs">
            Handcrafted with patriotic passion. 100% Pure Vegetarian Pizzeria.
          </p>
        </div>
      </div>
    ),
  },

  'janmashtami': {
    festivalId: 'janmashtami',
    festivalName: 'Janmashtami',
    fallbackImageUrl: '/festivals/janmashtami/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-sky-950 via-blue-950 to-indigo-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-400 via-amber-300 to-blue-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-sky-300/50">
              <span className="text-3xl sm:text-4xl">🦚</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-sky-500/30 border border-sky-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
              Makhan & Cheesy Crusts
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Shri Krishna Janmashtami
          </h3>
          <p className="mt-1 text-xs text-sky-100/90 font-light max-w-xs">
            Divine joy in every handcrafted slice.
          </p>
        </div>
      </div>
    ),
  },

  'ganesh-chaturthi': {
    festivalId: 'ganesh-chaturthi',
    festivalName: 'Ganesh Chaturthi',
    fallbackImageUrl: '/festivals/ganesh-chaturthi/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-amber-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-yellow-400 to-red-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-400/50">
              <span className="text-3xl sm:text-4xl">🐘</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-orange-500/30 border border-orange-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Ganpati Bappa Morya
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Ganeshotsav Feast
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light max-w-xs">
            Auspicious beginnings with pure vegetarian delicacies.
          </p>
        </div>
      </div>
    ),
  },

  'navratri': {
    festivalId: 'navratri',
    festivalName: 'Navratri',
    fallbackImageUrl: '/festivals/navratri/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-rose-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-red-500 via-amber-400 to-rose-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-red-400/50">
              <span className="text-3xl sm:text-4xl">🔱</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-red-500/30 border border-red-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Jai Mata Di • Nine Divine Nights
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Navratri Festival Feast
          </h3>
          <p className="mt-1 text-xs text-rose-100/90 font-light max-w-xs">
            100% Pure Vegetarian kitchen crafted with reverence.
          </p>
        </div>
      </div>
    ),
  },

  'dussehra': {
    festivalId: 'dussehra',
    festivalName: 'Dussehra',
    fallbackImageUrl: '/festivals/dussehra/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-fuchsia-950 via-purple-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-amber-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-fuchsia-400/50">
              <span className="text-3xl sm:text-4xl">🏹</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-fuchsia-500/30 border border-fuchsia-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Victory of Goodness
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Vijayadashami Celebration
          </h3>
          <p className="mt-1 text-xs text-fuchsia-100/90 font-light max-w-xs">
            Celebrate triumph with hot, fresh, cheesy crusts.
          </p>
        </div>
      </div>
    ),
  },

  'karwa-chauth': {
    festivalId: 'karwa-chauth',
    festivalName: 'Karwa Chauth',
    fallbackImageUrl: '/festivals/karwa-chauth/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-rose-950 via-pink-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-pink-400/50">
              <span className="text-3xl sm:text-4xl">🌕</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-rose-500/30 border border-rose-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-300">
              Moonlit Auspicious Feast
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Karwa Chauth Special
          </h3>
          <p className="mt-1 text-xs text-pink-100/90 font-light max-w-xs">
            Break the sacred fast together with love & pizza.
          </p>
        </div>
      </div>
    ),
  },

  'diwali': {
    festivalId: 'diwali',
    festivalName: 'Diwali',
    fallbackImageUrl: '/festivals/diwali/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-yellow-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-red-500 p-1 shadow-2xl shadow-amber-500/50 animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-300/60">
              <span className="text-3xl sm:text-4xl">🪔</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-amber-500/30 border border-amber-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-300">
              Festival of Lights & Joy
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Grand Diwali Celebration
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light max-w-xs">
            Light up your celebrations with golden artisan pizzas.
          </p>
        </div>
      </div>
    ),
  },

  'christmas-newyear': {
    festivalId: 'christmas-newyear',
    festivalName: 'Christmas & New Year',
    fallbackImageUrl: '/festivals/christmas/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-white to-red-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-emerald-400/50">
              <span className="text-3xl sm:text-4xl">🎄</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">
              Holiday Season Festivities
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Christmas & New Year Special
          </h3>
          <p className="mt-1 text-xs text-emerald-100/90 font-light max-w-xs">
            Warm gourmet slices for the cozy winter holidays.
          </p>
        </div>
      </div>
    ),
  },

  'makar-sankranti': {
    festivalId: 'makar-sankranti',
    festivalName: 'Makar Sankranti',
    fallbackImageUrl: '/festivals/makar-sankranti/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-sky-950 via-amber-950 to-orange-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-400 via-amber-400 to-orange-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-sky-400/50">
              <span className="text-3xl sm:text-4xl">🪁</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-sky-500/30 border border-sky-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Uttarayan & Pongal Celebrations
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Makar Sankranti Special
          </h3>
          <p className="mt-1 text-xs text-sky-100/90 font-light max-w-xs">
            Soar high with crispy, cheesy artisan delicacies.
          </p>
        </div>
      </div>
    ),
  },

  'republic-day': {
    festivalId: 'republic-day',
    festivalName: 'Republic Day',
    fallbackImageUrl: '/festivals/republic-day/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-white to-emerald-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-orange-300/40">
              <span className="text-3xl sm:text-4xl">🇮🇳</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-orange-500/30 border border-orange-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-300">
              77th Republic Day
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Republic Day Pride Feast
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light max-w-xs">
            Constitution of Pure Vegetarian Taste.
          </p>
        </div>
      </div>
    ),
  },

  'mahashivratri': {
    festivalId: 'mahashivratri',
    festivalName: 'Maha Shivratri',
    fallbackImageUrl: '/festivals/mahashivratri/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-400 to-amber-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-blue-400/50">
              <span className="text-3xl sm:text-4xl">🔱</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">
              Har Har Mahadev
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Maha Shivratri Divine Feast
          </h3>
          <p className="mt-1 text-xs text-blue-100/90 font-light max-w-xs">
            Sattvic-inspired vegetarian recipes crafted with devotion.
          </p>
        </div>
      </div>
    ),
  },

  'holi': {
    festivalId: 'holi',
    festivalName: 'Holi',
    fallbackImageUrl: '/festivals/holi/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-pink-950 via-purple-950 to-yellow-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-pink-400/50">
              <span className="text-3xl sm:text-4xl">🎨</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-pink-500/30 border border-pink-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-300">
              Splash of Cheesy Joy
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Holi Celebration Feast
          </h3>
          <p className="mt-1 text-xs text-pink-100/90 font-light max-w-xs">
            Colorful toppings & rich melted cheese for your gatherings.
          </p>
        </div>
      </div>
    ),
  },

  'baisakhi': {
    festivalId: 'baisakhi',
    festivalName: 'Baisakhi',
    fallbackImageUrl: '/festivals/baisakhi/offer.webp',
    renderArtwork: (className = 'w-full h-full min-h-[260px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-yellow-950 via-amber-950 to-orange-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-500 to-orange-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-400/50">
              <span className="text-3xl sm:text-4xl">🌾</span>
            </div>
          </div>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-yellow-500/30 border border-yellow-400/40 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Happy Baisakhi • Golden Harvest
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Baisakhi Harvest Feast
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light max-w-xs">
            Handcrafted with freshly harvested ingredients.
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * Strict Asset Ownership Resolver:
 * Ensures that if festivalId matches 'raksha-bandhan', it will ONLY return raksha-bandhan assets.
 * Never allows cross-festival fallback.
 */
export const getFestivalAssetPackage = (festivalId: string): FestivalAssetPackage | null => {
  const baseId = festivalId.replace(/-\d{4}$/, ''); // normalize e.g. 'raksha-bandhan-2026' -> 'raksha-bandhan'
  return FESTIVAL_ASSETS[baseId] || null;
};
