import React from 'react';

export interface FestivalAssetPackage {
  festivalId: string;
  festivalName: string;
  renderArtwork: (className?: string) => React.ReactNode;
  renderHeroVisual: (className?: string) => React.ReactNode;
}

/**
 * Isolated, culturally authentic visual composition packages.
 * Strictly avoids cross-festival bleed. Each festival has its own dedicated
 * icons, colors, background textures, and copy.
 */
export const FESTIVAL_ASSETS: Record<string, FestivalAssetPackage> = {
  'new-year': {
    festivalId: 'new-year',
    festivalName: 'New Year',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-4xl">🎆</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-amber-300">
            ✨ Welcome 2026 Celebration
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            New Year Slices of Joy
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Ring in the New Year with handcrafted gourmet pizzas and loaded cheesy sides.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-purple-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🎆</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Cheers to New Beginnings</h4>
            <p className="mt-1 text-xs text-amber-200/80">Celebrate with Harino’s Artisanal Crusts</p>
          </div>
        </div>
      </div>
    ),
  },

  'lohri': {
    festivalId: 'lohri',
    festivalName: 'Lohri',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-orange-400">
              <span className="text-4xl">🔥</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/50 text-[10px] font-black uppercase tracking-widest text-orange-300">
            Lohri Bonfire & Harvest Feast
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Warmth of Lohri
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light">
            Celebrate the bonfire harvest with hot wood-fired pizzas and golden garlic breads.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-500/40 bg-gradient-to-br from-slate-950/90 via-orange-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🔥</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Lohri Di Lakh Lakh Vadhaiyan</h4>
            <p className="mt-1 text-xs text-orange-200/80">Hot & Crispy Slices by Harino’s</p>
          </div>
        </div>
      </div>
    ),
  },

  'makar-sankranti': {
    festivalId: 'makar-sankranti',
    festivalName: 'Makar Sankranti',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-sky-950 via-amber-950 to-orange-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-400 via-amber-300 to-orange-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-sky-400">
              <span className="text-4xl">🪁</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-sky-500/30 border border-sky-400/50 text-[10px] font-black uppercase tracking-widest text-sky-300">
            Kai Po Che • Makar Sankranti
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Soaring Flavours of Uttarayan
          </h3>
          <p className="mt-1 text-xs text-sky-100/90 font-light">
            Fly high with artisan pizza feasts and crunchy bites under sunny skies.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-sky-400/40 bg-gradient-to-br from-slate-950/90 via-sky-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🪁</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Soaring Taste of Harvest</h4>
            <p className="mt-1 text-xs text-sky-200/80">Celebrate Makar Sankranti & Pongal</p>
          </div>
        </div>
      </div>
    ),
  },

  'vasant-panchami': {
    festivalId: 'vasant-panchami',
    festivalName: 'Vasant Panchami',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-yellow-950 via-amber-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-yellow-400">
              <span className="text-4xl">🌼</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-yellow-500/30 border border-yellow-400/50 text-[10px] font-black uppercase tracking-widest text-yellow-300">
            Saraswati Puja & Basant Ritu
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Golden Blooms & Warm Crusts
          </h3>
          <p className="mt-1 text-xs text-yellow-100/90 font-light">
            Welcome the vibrant spring with pure vegetarian gourmet delights.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-slate-950/90 via-yellow-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🌼</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Basant Ritu Blessings</h4>
            <p className="mt-1 text-xs text-yellow-200/80">Golden Flavours for Saraswati Puja</p>
          </div>
        </div>
      </div>
    ),
  },

  'republic-day': {
    festivalId: 'republic-day',
    festivalName: 'Republic Day',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-950 to-emerald-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-500 via-white to-emerald-600 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-orange-400/40">
              <span className="text-4xl">🇮🇳</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/50 text-[10px] font-black uppercase tracking-widest text-orange-300">
            Republic Day Pride
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Honouring Our Constitution
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light">
            Celebrate national pride with pure vegetarian artisan pizzas handcrafted with passion.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-400/40 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🇮🇳</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Saluting the Republic</h4>
            <p className="mt-1 text-xs text-orange-200/80">Pure Vegetarian Gourmet Feast</p>
          </div>
        </div>
      </div>
    ),
  },

  'mahashivratri': {
    festivalId: 'mahashivratri',
    festivalName: 'Maha Shivratri',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-400 via-sky-300 to-purple-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-indigo-400">
              <span className="text-4xl">🔱</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-[10px] font-black uppercase tracking-widest text-indigo-300">
            Har Har Mahadev • Shivratri Special
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Sacred Night of Blessings
          </h3>
          <p className="mt-1 text-xs text-indigo-100/90 font-light">
            Pure vegetarian delicacies crafted with pure ingredients for auspicious celebrations.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-indigo-400/40 bg-gradient-to-br from-slate-950/90 via-indigo-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🔱</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Maha Shivratri Blessings</h4>
            <p className="mt-1 text-xs text-indigo-200/80">Devotion & Pure Vegetarian Flavours</p>
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
              <span className="text-4xl">🎨</span>
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

  'ram-navami': {
    festivalId: 'ram-navami',
    festivalName: 'Ram Navami',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-yellow-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-4xl">🏹</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-amber-300">
            Jai Shri Ram • Ram Navami Special
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Maryada & Auspicious Celebration
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Celebrate Lord Rama’s birth with holy joy and pure vegetarian artisan treats.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-orange-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🏹</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Ram Navami Utsav</h4>
            <p className="mt-1 text-xs text-amber-200/80">Devotional Joy with Harino’s</p>
          </div>
        </div>
      </div>
    ),
  },

  'baisakhi': {
    festivalId: 'baisakhi',
    festivalName: 'Baisakhi',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-yellow-950 to-orange-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-orange-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-yellow-400">
              <span className="text-4xl">🌾</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-yellow-500/30 border border-yellow-400/50 text-[10px] font-black uppercase tracking-widest text-yellow-300">
            Jatta Aayi Baisakhi
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Golden Wheat Harvest Celebration
          </h3>
          <p className="mt-1 text-xs text-yellow-100/90 font-light">
            Celebrate the Punjabi harvest with crunchy crusts, fresh toppings, and full joy.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-slate-950/90 via-yellow-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🌾</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Baisakhi Di Vadhaiyan</h4>
            <p className="mt-1 text-xs text-yellow-200/80">Hearty Food for the Harvest Festival</p>
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
              <span className="text-4xl">🇮🇳</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/50 text-[10px] font-black uppercase tracking-widest text-orange-300">
            Celebrate India • Pride in Taste
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Independence Day Feast
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

  'raksha-bandhan': {
    festivalId: 'raksha-bandhan',
    festivalName: 'Raksha Bandhan',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-rose-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-64 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-sm" />
            <div className="absolute w-56 h-0.5 bg-red-500 shadow-sm" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1.5 shadow-2xl shadow-red-950/80">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-700 via-rose-800 to-red-900 border-2 border-amber-300 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-100 flex items-center justify-center shadow-md">
                  <div className="w-5 h-5 rounded-full bg-red-600 border border-amber-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/40 border border-amber-400/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-amber-300 shadow-sm">
              <span>🎀</span> Sibling Bond & Artisan Pizza
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Raksha Bandhan Sibling Feast
          </h3>
          <p className="mt-1 text-xs text-rose-100/90 font-light leading-relaxed">
            Treat your beloved brother & sister to handcrafted gourmet pizzas and sides.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-red-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🎀</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Rakhi Wali Khushiyan</h4>
            <p className="mt-1 text-xs text-amber-200/80">Handcrafted with Love • Pure Vegetarian</p>
          </div>
        </div>
      </div>
    ),
  },

  'janmashtami': {
    festivalId: 'janmashtami',
    festivalName: 'Janmashtami',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-teal-950 via-cyan-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-300 to-amber-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-teal-400">
              <span className="text-4xl">🪶</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-teal-500/30 border border-teal-400/50 text-[10px] font-black uppercase tracking-widest text-teal-300">
            Govinda Ala Re • Makhan & Masti
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Shri Krishna Janmashtami
          </h3>
          <p className="mt-1 text-xs text-teal-100/90 font-light">
            Celebrate Kanha’s birth with rich buttery crusts and pure vegetarian delights.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-teal-400/40 bg-gradient-to-br from-slate-950/90 via-teal-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🪶</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Natkhat Kanha Celebration</h4>
            <p className="mt-1 text-xs text-teal-200/80">Artisanal Pizzas for Janmashtami</p>
          </div>
        </div>
      </div>
    ),
  },

  'ganesh-chaturthi': {
    festivalId: 'ganesh-chaturthi',
    festivalName: 'Ganesh Chaturthi',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-orange-950 via-red-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-orange-400 via-amber-300 to-red-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-orange-400">
              <span className="text-4xl">🥟</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-orange-500/30 border border-orange-400/50 text-[10px] font-black uppercase tracking-widest text-orange-300">
            Ganpati Bappa Morya • Modak & Feast
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Ganesh Chaturthi Utsav
          </h3>
          <p className="mt-1 text-xs text-orange-100/90 font-light">
            Welcome the remover of obstacles with pure vegetarian handcrafted gourmet pizzas.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-orange-400/40 bg-gradient-to-br from-slate-950/90 via-orange-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🥟</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Ganpati Bappa Morya</h4>
            <p className="mt-1 text-xs text-orange-200/80">Auspicious Blessings & Festive Feast</p>
          </div>
        </div>
      </div>
    ),
  },

  'navratri': {
    festivalId: 'navratri',
    festivalName: 'Navratri',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-rose-950 via-purple-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-400 via-purple-400 to-amber-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-rose-400">
              <span className="text-4xl">🥢</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-400/50 text-[10px] font-black uppercase tracking-widest text-rose-300">
            Dandiya Raas & 9 Divine Nights
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Navratri Dandiya Celebrations
          </h3>
          <p className="mt-1 text-xs text-rose-100/90 font-light">
            Celebrate the 9 nights of Garba with pure vegetarian feasts that fuel your dance.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-rose-400/40 bg-gradient-to-br from-slate-950/90 via-rose-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🥢</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Navratri Garba Nights</h4>
            <p className="mt-1 text-xs text-rose-200/80">9 Nights of Auspicious Vegetarian Joy</p>
          </div>
        </div>
      </div>
    ),
  },

  'dussehra': {
    festivalId: 'dussehra',
    festivalName: 'Dussehra',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-red-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-4xl">🏹</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-amber-300">
            Vijayadashami • Victory of Dharma
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Triumph of Good Over Evil
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Celebrate Vijayadashami with family gatherings and grand artisan pizzas.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-orange-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🏹</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Vijayadashami Celebration</h4>
            <p className="mt-1 text-xs text-amber-200/80">Victory & Pure Vegetarian Feasting</p>
          </div>
        </div>
      </div>
    ),
  },

  'karwa-chauth': {
    festivalId: 'karwa-chauth',
    festivalName: 'Karwa Chauth',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-rose-950 via-red-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-400 via-amber-300 to-red-500 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-rose-400">
              <span className="text-4xl">🌕</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-400/50 text-[10px] font-black uppercase tracking-widest text-rose-300">
            Chanda Mama • Karwa Chauth
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Evening Moon & Love Feast
          </h3>
          <p className="mt-1 text-xs text-rose-100/90 font-light">
            Break the auspicious fast with comforting wood-fired pizzas and creamy shakes.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-rose-400/40 bg-gradient-to-br from-slate-950/90 via-rose-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🌕</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Karwa Chauth Feast</h4>
            <p className="mt-1 text-xs text-rose-200/80">Celebration of Love & Pure Flavours</p>
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
              <span className="text-4xl">🪔</span>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-yellow-300">
            <span>✨</span> Festival of Lights & Joy
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white drop-shadow-md">
            Grand Diwali at Harino’s
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
          <div className="text-center">
            <span className="text-5xl">🪔</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Grand Diwali Celebration</h4>
            <p className="mt-1 text-xs text-amber-200/80">Illuminating Flavours with Harino's</p>
          </div>
        </div>
      </div>
    ),
  },

  'bhai-dooj': {
    festivalId: 'bhai-dooj',
    festivalName: 'Bhai Dooj',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-rose-950 to-amber-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-red-500 via-rose-400 to-amber-400 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-red-400">
              <span className="text-4xl">🔴</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-red-500/30 border border-red-400/50 text-[10px] font-black uppercase tracking-widest text-red-300">
            Auspicious Tikka • Brother & Sister
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Bhai Dooj Sibling Love
          </h3>
          <p className="mt-1 text-xs text-red-100/90 font-light">
            Share the joy with piping hot cheesy pizza slices and garlic bread.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-red-400/40 bg-gradient-to-br from-slate-950/90 via-red-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🔴</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Bhai Dooj Celebrations</h4>
            <p className="mt-1 text-xs text-red-200/80">Sweet Sibling Bonding with Harino’s</p>
          </div>
        </div>
      </div>
    ),
  },

  'chhath-puja': {
    festivalId: 'chhath-puja',
    festivalName: 'Chhath Puja',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-950 to-yellow-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-4xl">🌅</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-amber-300">
            Chhathi Maiya & Surya Dev Arghya
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Sun Worship & Purity
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Celebrate the auspicious river sunset and sunrise with pure vegetarian delights.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-orange-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🌅</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Jai Chhathi Maiya</h4>
            <p className="mt-1 text-xs text-amber-200/80">Devotion & Pure Vegetarian Feasting</p>
          </div>
        </div>
      </div>
    ),
  },

  'christmas': {
    festivalId: 'christmas',
    festivalName: 'Christmas',
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-red-950 via-emerald-950 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-red-500 via-emerald-400 to-amber-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-emerald-400">
              <span className="text-4xl">🎄</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/50 text-[10px] font-black uppercase tracking-widest text-emerald-300">
            Merry Christmas & Joyous Winter
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            Holiday Season Feast
          </h3>
          <p className="mt-1 text-xs text-emerald-100/90 font-light">
            Celebrate warmth and laughter with loaded cheesy pizzas and winter delights.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-400/40 bg-gradient-to-br from-slate-950/90 via-emerald-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">🎄</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">Merry Christmas!</h4>
            <p className="mt-1 text-xs text-emerald-200/80">Warm Slices on Chilly Winter Nights</p>
          </div>
        </div>
      </div>
    ),
  },
};

/**
 * Strict Asset Package Resolver
 * ZERO cross-festival bleed: Under no circumstances does an unmapped festival
 * fall back to Raksha Bandhan.
 */
export const getFestivalAssetPackage = (festivalId: string): FestivalAssetPackage | null => {
  if (!festivalId) return null;
  const baseId = festivalId.replace(/-\d{4}$/, '').toLowerCase().trim();

  if (FESTIVAL_ASSETS[baseId]) {
    return FESTIVAL_ASSETS[baseId];
  }

  // Dynamic Generator for any unforeseen festival (strictly derived from its ID/name, NEVER Rakhi)
  const formattedName = baseId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    festivalId: baseId,
    festivalName: formattedName,
    renderArtwork: (className = 'w-full h-full min-h-[280px]') => (
      <div className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-amber-400">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest text-amber-300">
            ${formattedName} Special
          </div>
          <h3 className="mt-2 font-display text-xl sm:text-2xl font-black text-white">
            ${formattedName} Celebration
          </h3>
          <p className="mt-1 text-xs text-amber-100/90 font-light">
            Celebrate with handcrafted gourmet pizzas and 100% pure vegetarian goodness.
          </p>
        </div>
      </div>
    ),
    renderHeroVisual: (className = 'w-full h-full') => (
      <div className={`relative flex items-center justify-center p-4 ${className}`}>
        <div className="relative z-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950/90 via-amber-950/80 to-slate-950/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <span className="text-5xl">✨</span>
            <h4 className="mt-3 font-display text-xl font-black text-white">${formattedName} Utsav</h4>
            <p className="mt-1 text-xs text-amber-200/80">Handcrafted Pizzas • Because Hari Knows</p>
          </div>
        </div>
      </div>
    ),
  };
};
