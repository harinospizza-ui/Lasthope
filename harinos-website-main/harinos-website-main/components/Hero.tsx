import React from 'react';
import { FestivalCampaign } from '../config/festivalCampaigns';
import { isCampaignOfferActive } from '../services/festivalEngine';
import { getFestivalAssetPackage } from '../config/festivalAssets';

interface HeroProps {
  onShare: () => void;
  onExploreMenu: () => void;
  campaign?: FestivalCampaign | null;
}

export const Hero: React.FC<HeroProps> = ({ onShare, onExploreMenu, campaign }) => {
  const isFestival = !!campaign;
  const isOfferActive = isCampaignOfferActive(campaign);

  // Dedicated asset package for active festival
  const assetPackage = campaign ? getFestivalAssetPackage(campaign.baseId || campaign.id) : null;

  const defaultHeroBg =
    'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1920&q=80';

  const badgeText = isFestival && campaign.theme.heroTag
    ? campaign.theme.heroTag
    : 'Voted Best Pizza 2025';

  const headline = isFestival && campaign.theme.heroHeadline
    ? campaign.theme.heroHeadline
    : 'The Art of';

  const headlineHighlight = isFestival && campaign.theme.heroHeadlineHighlight
    ? campaign.theme.heroHeadlineHighlight
    : 'Perfect Dough.';

  const subheadline = isFestival && campaign.theme.heroSubheadline
    ? campaign.theme.heroSubheadline
    : "Indulge in Harino's handcrafted recipes. BECAUSE HARI KNOWS exactly how to bake the perfect pizza.";

  return (
    <div className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-slate-950">
      {/* Background with subtle decorative gradients */}
      {!isFestival && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10000ms] hover:scale-105 opacity-40"
          style={{ backgroundImage: `url(${defaultHeroBg})` }}
        />
      )}

      {/* Atmospheric Theme Gradient */}
      <div
        className={`absolute inset-0 z-0 bg-gradient-to-r ${
          isFestival && campaign.theme.heroGradient
            ? campaign.theme.heroGradient
            : 'from-slate-950 via-slate-900/90 to-red-950/40'
        }`}
      />

      {/* Decorative ambient lighting spheres */}
      {isFestival && (
        <>
          <div
            className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: campaign.theme.primaryAccent }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: campaign.theme.secondaryAccent }}
          />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Festival Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <span
                className={`inline-flex items-center gap-1.5 py-1.5 px-4 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-md ${
                  isFestival && campaign.theme.badgeBg
                    ? campaign.theme.badgeBg
                    : 'bg-red-600 animate-pulse'
                } ${isFestival ? campaign.theme.badgeText : 'text-white'}`}
              >
                {badgeText}
              </span>
              {isFestival && (
                <span className="inline-flex items-center py-1 px-3 rounded-full bg-white/10 border border-white/20 text-[9px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                  {isOfferActive ? '⚡ 20% OFF Live Today' : '⏳ Special Celebration'}
                </span>
              )}
            </div>

            {/* Headline with Clean Typography */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-[1.15] drop-shadow-md">
              {headline} <br />
              <span
                className={
                  isFestival ? 'text-amber-400 drop-shadow-sm' : 'text-red-500'
                }
              >
                {headlineHighlight}
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-xl drop-shadow">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreMenu}
                className={`px-8 py-4 text-white rounded-2xl font-black transition-all transform hover:scale-[1.03] active:scale-95 shadow-xl uppercase tracking-widest text-xs sm:text-sm cursor-pointer ${
                  isFestival
                    ? 'bg-gradient-to-r from-red-650 via-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-red-950/40'
                    : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                }`}
              >
                {isFestival
                  ? isOfferActive
                    ? `Order Now • Flat ${campaign.offer.discountValue}% OFF`
                    : `Explore Menu • ${campaign.name} Special`
                  : 'Explore Menu'}
              </button>

              <button
                onClick={onShare}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md rounded-2xl font-bold transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-2.5 cursor-pointer active:scale-95 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100 6 3 3 0 000-6z"
                  />
                </svg>
                <span>Share The Love</span>
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Festival Composition & Visual Artwork */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            {isFestival && assetPackage ? (
              assetPackage.renderHeroVisual('w-full')
            ) : (
              <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md text-white shadow-2xl">
                <div className="text-xl font-black font-display">Harino’s Handcrafted Pizzeria</div>
                <p className="text-xs text-white/80 mt-1">Because Hari Knows exactly how to bake the perfect crust.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
