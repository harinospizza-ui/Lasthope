import React from 'react';

export interface FestivalAssetPackage {
  festivalId: string;
  festivalName: string;
  renderArtwork: (className?: string) => React.ReactNode;
  renderHeroVisual: (className?: string) => React.ReactNode;
}

/**
 * Isolated, culturally authentic SVG & CSS visual composition packages.
 * Strictly avoids plain ropes, washed-out gradients, and random stock decorations.
 * Combines authentic cultural elements with Harino's artisan pizza craft.
 */
export const FESTIVAL_ASSETS: Record<string, FestivalAssetPackage> = {
  'raksha-bandhan': {
    festivalId: 'raksha-bandhan',
    festivalName: 'Raksha Bandhan',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-rose-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        {/* Festive background texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-red-600/25 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-amber-500/25 blur-3xl" />

        {/* Detailed Authentic Rakhi & Pizza Illustration Composition */}
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          {/* Authentic Rakhi Visual (Zari Gold Medallion + Red Silk Thread + Pearls) */}
          <div className="relative flex items-center justify-center my-2">
            {/* Red & Gold Zari Thread extending horizontally */}
            <div className="absolute w-64 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-sm" />
            <div className="absolute w-56 h-0.5 bg-red-500 shadow-sm" />
            
            {/* Outer Golden Pearl Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1.5 shadow-2xl shadow-red-950/80">
              {/* Inner Petal Medallion */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-900 border-2 border-amber-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                {/* Golden Center Floral Jewel */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-100 flex items-center justify-center shadow-md">
                  <div className="w-5 h-5 rounded-full bg-red-600 border border-amber-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roli & Chawal Auspicious Accents */}
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/40 border border-amber-400/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-amber-300 shadow-sm">
              <span>🎀</span> Sibling Bond & Artisan Pizza
            </span>
          </div>

          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Raksha Bandhan Sibling Feast
          </h3>
          <p className="mt-1 text-xs text-rose-100/90 font-light leading-relaxed">
            Treat your beloved brother & sister to handcrafted gourmet pizzas, loaded garlic bread, and delicious sides.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        {/* Glow ambient background */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-red-600/30 via-amber-500/25 to-rose-600/30 blur-3xl" />
        
        {/* Composition Card */}
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-red-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_25px_60px_rgba(220,38,38,0.25)]">
          {/* Top Festive Badge */}
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎀</span>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                Friday, 28 August 2026
              </span>
            </div>
            <span className="text-[9px] font-bold text-white/80 bg-red-600/60 px-2 py-0.5 rounded-full">
              Festival Special
            </span>
          </div>

          {/* Central Authentic Rakhi Display */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 p-1 shadow-2xl animate-pulse">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-rose-900 border border-amber-300 flex items-center justify-center shadow-inner">
                  <div className="w-9 h-9 rounded-full bg-amber-400 border border-yellow-100 flex items-center justify-center shadow-sm">
                    <span className="text-xs font-black text-red-900">🪢</span>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="mt-4 text-center font-display text-lg font-black text-white">
              Rakhi Wali Khushiyan
            </h4>
            <p className="mt-1 text-center text-xs text-amber-200/80">
              Handcrafted with Love • 100% Pure Vegetarian
            </p>
          </div>

          {/* Offer Pill */}
          <div className="rounded-2xl border border-red-500/30 bg-red-950/60 p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300">
                Festival Day Offer
              </span>
              <div className="text-base font-black text-white">Flat 20% OFF</div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                Observance Date
              </span>
              <div className="text-xs font-black text-amber-200">28 Aug 2026</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  'diwali': {
    festivalId: 'diwali',
    festivalName: 'Diwali',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-slate-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 p-1.5 shadow-2xl shadow-amber-500/50 animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-3xl">🪔</span>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-yellow-300">
            <span>✨</span> Festival of Lights & Joy
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Diwali at Harino’s
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Celebrate with sparkling diyas, family gatherings, and golden artisan pizzas.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-amber-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
              🪔 Sunday, 8 November 2026
            </span>
            <span className="text-[9px] font-bold text-white/80 bg-amber-600 px-2 py-0.5 rounded-full">
              Mega Feast
            </span>
          </div>
          <div className="my-6 text-center">
            <span className="text-5xl">🪔</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Grand Diwali Celebration</h4>
            <p className="mt-1 text-xs text-amber-200/80">Illuminating Flavours with Harino's</p>
          </div>
        </div>
      </div>
    ),
  },

  'independence-day': {
    festivalId: 'independence-day',
    festivalName: 'Independence Day',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-white to-emerald-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-orange-400/40">
              <span className="text-3xl">🇮🇳</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/50 text-[10px] font-black uppercase tracking-widest text-orange-300">
            Celebrate India • Pride in Taste
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            80th Independence Day
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light">
            Pure vegetarian culinary excellence celebrating national freedom.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-400/40 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🇮🇳</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Celebrate Sovereignty</h4>
            <p className="mt-1 text-xs text-orange-200/80">Handcrafted Pizzas with Patriotic Passion</p>
          </div>
        </div>
      </div>
    ),
  },

  'holi': {
    festivalId: 'holi',
    festivalName: 'Holi',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-pink-950 via-purple-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-pink-400">
              <span className="text-3xl">🎨</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400/50 text-[10px] font-black uppercase tracking-widest text-pink-300">
            Rangon Ka Tyohaar
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Holi Celebration Feast
          </h3>
          <p className="mt-1 text-xs text-pink-100/90 font-light">
            Vibrant colors, rich melted cheese, and festive wood-fired pizzas.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-pink-400/40 bg-gradient-to-br from-slate-950/90 via-pink-950/80 to-purple-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🎨</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Splash of Flavours</h4>
            <p className="mt-1 text-xs text-pink-200/80">Rangon Ka Tyohaar, Harino’s Ke Saath</p>
          </div>
        </div>
      </div>
    ),
  },
};

/**
 * Strict Asset Package Resolver
 */
export const getFestivalAssetPackage = (festivalId: string): FestivalAssetPackage | null => {
  const baseId = festivalId.replace(/-\d{4}$/, '');
  return FESTIVAL_ASSETS[baseId] || FESTIVAL_ASSETS['raksha-bandhan'];
};
