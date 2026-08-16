import React, { useState } from 'react';
import { FestivalCampaign } from '../config/festivalCampaigns';
import { isCampaignOfferActive } from '../services/festivalEngine';

interface FestivalOfferCardProps {
  campaign: FestivalCampaign;
  onExploreMenu: () => void;
}

export const FestivalOfferCard: React.FC<FestivalOfferCardProps> = ({
  campaign,
  onExploreMenu,
}) => {
  const [videoError, setVideoError] = useState(false);

  if (!isCampaignOfferActive(campaign)) {
    return null;
  }

  const hasVideo = !!campaign.media.video && !videoError;

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-[2rem] border border-orange-200/80 bg-gradient-to-br from-white via-orange-50/40 to-emerald-50/30 shadow-[0_20px_50px_rgba(234,88,12,0.12)]">
        {/* Subtle decorative glow accents */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          {/* Media column (Video or Image) */}
          <div className="relative h-64 overflow-hidden sm:h-80 lg:col-span-6 lg:h-full min-h-[280px]">
            {hasVideo ? (
              <video
                src={campaign.media.video}
                poster={campaign.media.videoPoster || campaign.media.promotionalImage}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={campaign.media.promotionalImage}
                alt={campaign.name}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  // Graceful fallback to default image if specific webp fails
                  e.currentTarget.src = '/images/vegover.jpeg';
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/90" />

            {/* Over-image badge on mobile */}
            <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 backdrop-blur-md">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                {campaign.theme.heroTag || 'Festival Special'}
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
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-800">
                  ⚡ Auto Applied in Cart
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-slate-900 sm:text-4xl leading-tight">
                {campaign.offer.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base font-normal">
                {campaign.offer.description}
              </p>

              <div className="mt-5 rounded-2xl border border-orange-100/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
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
                      Instant Cart Discount
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
                Order Now with {campaign.offer.discountValue}% Off
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
