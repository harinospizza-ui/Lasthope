import React, { useEffect, useState } from 'react';
import { FestivalCampaign } from '../config/festivalCampaigns';
import { getFestivalAssetPackage } from '../config/festivalAssets';
import {
  getFestivalLifecycleState,
  getFestivalCountdown,
  FestivalCountdown,
} from '../services/festivalEngine';

interface FestivalOfferCardProps {
  campaign: FestivalCampaign;
  onExploreMenu: () => void;
}

export const FestivalOfferCard: React.FC<FestivalOfferCardProps> = ({
  campaign,
  onExploreMenu,
}) => {
  const [countdown, setCountdown] = useState<FestivalCountdown | null>(() =>
    getFestivalCountdown(campaign),
  );

  useEffect(() => {
    // Live countdown timer update every second
    const interval = setInterval(() => {
      setCountdown(getFestivalCountdown(campaign));
    }, 1000);
    return () => clearInterval(interval);
  }, [campaign]);

  if (!campaign || !campaign.enabled) {
    return null;
  }

  const lifecycleState = getFestivalLifecycleState(campaign);

  // If festival has concluded, cleanly unmount and do not render
  if (lifecycleState === 'ENDED') {
    return null;
  }

  const isLive = lifecycleState === 'ACTIVE_OFFER';
  const isUpcoming = lifecycleState === 'PRE_FESTIVAL';

  // Resolve isolated asset package for THIS festival
  const assetPackage = getFestivalAssetPackage(campaign.baseId || campaign.id);

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-[2rem] border border-orange-200/80 bg-gradient-to-br from-white via-orange-50/40 to-emerald-50/30 shadow-[0_20px_50px_rgba(234,88,12,0.12)]">
        {/* Subtle decorative glow accents using festival theme colors */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: campaign.theme.primaryAccent }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: campaign.theme.secondaryAccent }}
        />

        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          {/* Media column - Dedicated Festival Artwork (Zero cross-festival bleed) */}
          <div className="relative h-64 overflow-hidden sm:h-80 lg:col-span-6 lg:h-full min-h-[280px]">
            {assetPackage ? (
              assetPackage.renderArtwork('w-full h-full')
            ) : (
              <div className="w-full h-full min-h-[280px] bg-slate-900 flex items-center justify-center text-white">
                <span className="font-bold">{campaign.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/90 pointer-events-none" />

            {/* Over-artwork badge */}
            <div className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1.5 backdrop-blur-md shadow-md">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                {campaign.theme.heroTag || `${campaign.name} Special`}
              </span>
            </div>
          </div>

          {/* Content details column */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 lg:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${campaign.theme.badgeBg} ${campaign.theme.badgeText}`}>
                  {campaign.offer.badge}
                </span>
                {isLive ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-800 animate-pulse">
                    ⚡ Auto Applied in Cart Today
                  </span>
                ) : (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-amber-800">
                    ⏳ Unlocks on {countdown?.targetDateStr}
                  </span>
                )}
              </div>

              <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-4xl leading-tight">
                {campaign.offer.title}
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
                {campaign.offer.description}
              </p>

              {/* State-Aware Countdown Timer */}
              {countdown && (isUpcoming || isLive) && (
                <div className={`mt-4 rounded-2xl border p-3.5 backdrop-blur-sm ${
                  isLive
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10'
                    : 'border-amber-200 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                      isLive ? 'text-emerald-900' : 'text-amber-900'
                    }`}>
                      {countdown.targetLabel}
                    </span>
                    <span className="text-[9px] font-bold text-slate-700 bg-white/85 px-2 py-0.5 rounded-md shadow-xs">
                      {isLive ? '🔥 Live Special' : '⏳ Festival Countdown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
                      <div className={`text-lg sm:text-2xl font-black ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {String(countdown.days).padStart(2, '0')}
                      </div>
                      <div className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400">Days</div>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
                      <div className={`text-lg sm:text-2xl font-black ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {String(countdown.hours).padStart(2, '0')}
                      </div>
                      <div className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400">Hours</div>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
                      <div className={`text-lg sm:text-2xl font-black ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {String(countdown.minutes).padStart(2, '0')}
                      </div>
                      <div className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400">Mins</div>
                    </div>
                    <div className="rounded-xl bg-slate-900 p-2 text-white shadow-sm">
                      <div className={`text-lg sm:text-2xl font-black animate-pulse ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {String(countdown.seconds).padStart(2, '0')}
                      </div>
                      <div className="text-[7px] sm:text-[8px] uppercase tracking-wider text-slate-400">Secs</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Discount Details Block */}
              <div className="mt-4 rounded-2xl border border-orange-100/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-black text-xs shadow-md shadow-orange-500/20 leading-tight">
                    {campaign.offer.pizzaDiscountValue && campaign.offer.otherDiscountValue ? (
                      <>
                        <span className="text-[11px] font-black">{campaign.offer.pizzaDiscountValue}%</span>
                        <span className="text-[7px] font-bold opacity-90">PIZZA</span>
                      </>
                    ) : (
                      <span>{campaign.offer.discountValue}%</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {isLive ? 'Instant Cart Discount' : 'Upcoming Festival Discount'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {campaign.offer.terms}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto flex-1 rounded-2xl bg-gradient-to-r from-red-650 via-red-600 to-orange-600 px-6 py-4 text-center text-xs font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-red-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                {isLive
                  ? `Order Now with ${campaign.offer.discountValue}% Off`
                  : 'Explore Menu Ahead of Festival'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
