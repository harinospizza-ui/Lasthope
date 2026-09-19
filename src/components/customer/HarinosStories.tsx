import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HapticsService } from '../../services/hapticsService';
import { CustomerProfile } from '../../types';

export interface StoryItem {
  id: string;
  tag: string;
  title: string;
  emoji: string;
  ringColor: string;
  slides: {
    image: string;
    badge: string;
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaAction: () => void;
  }[];
}

interface HarinosStoriesProps {
  customerProfile: CustomerProfile | null;
  onOpenWallet: () => void;
  onSelectMoodFilter: (filterId: string) => void;
  onScrollToMenu: () => void;
}

export const HarinosStories: React.FC<HarinosStoriesProps> = ({
  customerProfile,
  onOpenWallet,
  onSelectMoodFilter,
  onScrollToMenu
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  const stories: StoryItem[] = [
    {
      id: 'bestsellers',
      tag: 'Trending',
      title: 'Bestsellers',
      emoji: '🔥',
      ringColor: 'from-amber-500 via-red-500 to-rose-600',
      slides: [
        {
          image: '/images/slider1.jpg',
          badge: 'Most Loved in Town 🔥',
          headline: "Harino's Signature Special",
          subheadline: 'Loaded with premium mozzarella, crisp bell peppers, sweet corn, golden mushrooms & our secret tomato herb base.',
          ctaText: 'Explore Signature Pizzas',
          ctaAction: () => {
            setActiveStoryIndex(null);
            onSelectMoodFilter('trending');
            onScrollToMenu();
          }
        },
        {
          image: '/images/slider2.jpg',
          badge: 'Desi Fusion Favorite 🌶️',
          headline: 'Paneer Makhni Pizza',
          subheadline: 'Buttery, rich makhni gravy smothered over tender paneer cubes and melted cheese on hot hand-tossed dough.',
          ctaText: 'Order Makhni Series',
          ctaAction: () => {
            setActiveStoryIndex(null);
            onSelectMoodFilter('trending');
            onScrollToMenu();
          }
        }
      ]
    },
    {
      id: 'cheese_burst',
      tag: 'Cheesy',
      title: 'Cheese Pull',
      emoji: '🧀',
      ringColor: 'from-yellow-400 via-amber-500 to-orange-500',
      slides: [
        {
          image: '/images/slider3.jpg',
          badge: 'Extra Cheese Hack 🤤',
          headline: 'Double Mozzarella Overload',
          subheadline: 'Every single slice packed with molten stringy mozzarella that pulls to perfection. Pair it with our Cheese Dip!',
          ctaText: 'Order Extra Cheesy',
          ctaAction: () => {
            setActiveStoryIndex(null);
            onSelectMoodFilter('cheesy');
            onScrollToMenu();
          }
        }
      ]
    },
    {
      id: 'tandoori',
      tag: 'Smoky',
      title: 'Tandoori',
      emoji: '🌶️',
      ringColor: 'from-orange-500 via-red-600 to-red-800',
      slides: [
        {
          image: '/images/slider1.jpg',
          badge: 'Smoky Perfection ♨️',
          headline: 'Tandoori Series Special',
          subheadline: 'Infused with roasted tandoori aromatics and spiced onion crunch. Made fresh on order for true desi flavor lovers.',
          ctaText: 'Order Tandoori Pizza',
          ctaAction: () => {
            setActiveStoryIndex(null);
            onSelectMoodFilter('spicy');
            onScrollToMenu();
          }
        }
      ]
    },
    {
      id: 'coins_10',
      tag: 'Rewards',
      title: '10% Coins',
      emoji: '🪙',
      ringColor: 'from-amber-400 via-yellow-500 to-amber-600',
      slides: [
        {
          image: '/images/slider2.jpg',
          badge: 'Guaranteed Cashback 💰',
          headline: 'Earn 10% Coins On Every Order',
          subheadline: 'Order ₹500 food? Get 50 Harino coins (₹5 equivalent) added straight into your wallet to redeem on future orders!',
          ctaText: 'View My Coins Balance',
          ctaAction: () => {
            setActiveStoryIndex(null);
            onOpenWallet();
          }
        }
      ]
    },
    {
      id: 'referral_200',
      tag: 'Invite',
      title: 'Free ₹20',
      emoji: '🤝',
      ringColor: 'from-emerald-400 via-teal-500 to-cyan-600',
      slides: [
        {
          image: '/images/slider3.jpg',
          badge: 'Referral Jackpot 🎁',
          headline: 'Give Friends Food, Get 200 Coins',
          subheadline: 'Share your personal referral code. When your friend completes their first pizza order, you get 200 coins credited instantly!',
          ctaText: 'Share My Code on WhatsApp',
          ctaAction: () => {
            const code = customerProfile?.referralCode || 'HARINOS';
            const shareText = `Use my referral code "${code}" on Harino's Pizza to get 100 free welcome coins and 10% cashback on every pizza order! 🍕 https://harinos.store`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
          }
        }
      ]
    }
  ];

  const handleNextSlide = useCallback(() => {
    if (activeStoryIndex === null) return;
    const currentStory = stories[activeStoryIndex];
    if (activeSlideIndex < currentStory.slides.length - 1) {
      setActiveSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex((prev) => prev + 1);
      setActiveSlideIndex(0);
      setProgress(0);
    } else {
      setActiveStoryIndex(null);
      setActiveSlideIndex(0);
      setProgress(0);
    }
    void HapticsService.light();
  }, [activeStoryIndex, activeSlideIndex, stories]);

  const handlePrevSlide = useCallback(() => {
    if (activeStoryIndex === null) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else if (activeStoryIndex > 0) {
      const prevStoryIndex = activeStoryIndex - 1;
      setActiveStoryIndex(prevStoryIndex);
      setActiveSlideIndex(stories[prevStoryIndex].slides.length - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
    void HapticsService.light();
  }, [activeStoryIndex, activeSlideIndex, stories]);

  // Story Auto-Progress Timer
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = 50; // Update every 50ms
    const totalDuration = 4500; // 4.5s per slide
    const increment = (interval / totalDuration) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [activeStoryIndex, activeSlideIndex, isPaused, handleNextSlide]);

  const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentSlide = currentStory ? currentStory.slides[activeSlideIndex] : null;

  return (
    <div className="w-full py-2">
      {/* Horizontal Story Rings Previews */}
      <div className="flex items-center gap-3.5 overflow-x-auto hide-scrollbar px-4 py-1.5 scroll-smooth">
        {stories.map((story, idx) => (
          <button
            key={story.id}
            type="button"
            onClick={() => {
              void HapticsService.light();
              setActiveStoryIndex(idx);
              setActiveSlideIndex(0);
              setProgress(0);
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none select-none active:scale-95 transition-transform"
          >
            <div className={`w-[62px] h-[62px] sm:w-[68px] sm:h-[68px] rounded-full p-[2.5px] bg-gradient-to-tr ${story.ringColor} shadow-md group-hover:shadow-lg transition-all`}>
              <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-900/90 text-white flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                  <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                    {story.emoji}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-black tracking-tight text-slate-800 text-center max-w-[68px] truncate">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen Interactive Story Viewer */}
      {currentStory && currentSlide && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center animate-fade-in touch-none select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main Story Phone Card Container */}
          <div className="relative w-full h-full max-w-md bg-slate-950 sm:rounded-[2.5rem] overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Background Artwork */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.headline}
                className="w-full h-full object-cover opacity-65 scale-105 transition-transform duration-1000"
                onError={(e) => { e.currentTarget.src = '/icon-512.png'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
            </div>

            {/* Top Navigation & Progress Indicators */}
            <div className="relative z-20 p-4 pt-6 flex flex-col gap-3">
              {/* Progress bars for each slide in the story */}
              <div className="flex items-center gap-1.5">
                {currentStory.slides.map((_, sIdx) => {
                  const isFinished = sIdx < activeSlideIndex;
                  const isCurrent = sIdx === activeSlideIndex;
                  return (
                    <div key={sIdx} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-75"
                        style={{
                          width: isFinished ? '100%' : isCurrent ? `${progress}%` : '0%'
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentStory.emoji}</span>
                  <div>
                    <h4 className="text-sm font-black text-white leading-tight">
                      {currentStory.title}
                    </h4>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                      Harino's Bites
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void HapticsService.light();
                    setActiveStoryIndex(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold transition-colors"
                  aria-label="Close story"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tap areas for Left (Previous) and Right (Next) navigation */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="w-1/3 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevSlide();
                }}
              />
              <div
                className="w-2/3 h-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextSlide();
                }}
              />
            </div>

            {/* Story Content & Action Floating Pill */}
            <div className="relative z-20 p-6 pb-10 flex flex-col gap-4">
              <div className="inline-flex self-start items-center gap-1 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                {currentSlide.badge}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-display leading-tight drop-shadow-md">
                {currentSlide.headline}
              </h2>

              <p className="text-sm font-medium text-slate-200 leading-relaxed drop-shadow">
                {currentSlide.subheadline}
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void HapticsService.medium();
                  currentSlide.ctaAction();
                }}
                className="w-full mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/40 transition-all flex items-center justify-center gap-2"
              >
                <span>{currentSlide.ctaText}</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarinosStories;
