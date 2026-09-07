import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MenuItem, OfferCard, Category } from '../../types';
import {
  getDiscountedUnitPrice,
  getMatchingDiscountOffer,
  isOfferUnlocked,
} from '../../utils/offerUtils';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, selectedSize?: string) => void;
  offers: OfferCard[];
  cartSubtotal: number;
  cart?: any[];
  onUpdateQuantity?: (cartItemId: string, delta: number) => void;
}

interface MenuCardProps {
  item: MenuItem;
  offers: OfferCard[];
  cartSubtotal: number;
  onAdd: (selectedSize?: string) => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, offers, cartSubtotal, onAdd }) => {
  const [selectedSize, setSelectedSize] = useState<string>(item.sizes?.[0]?.label ?? '');
  const [isAdding, setIsAdding] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const currentBasePrice =
    item.sizes?.find((size) => size.label === selectedSize)?.price ?? item.price;
  const previewOffer = getMatchingDiscountOffer(offers, item);
  const previewAmount = cartSubtotal + currentBasePrice;
  const offerUnlocked = previewOffer ? isOfferUnlocked(previewOffer, currentBasePrice, previewAmount) : false;
  const activeOffer = offerUnlocked ? previewOffer : undefined;
  const discountedPrice = getDiscountedUnitPrice(currentBasePrice, activeOffer);
  const hasDiscount = discountedPrice < currentBasePrice;

  const handleAddClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAdding(true);
    setAddedCount((prev) => prev + 1);
    onAdd(selectedSize || undefined);
    window.setTimeout(() => setIsAdding(false), 450);
  };

  return (
    <div
      className={`group relative flex flex-col h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${
        item.available ? 'hover:-translate-y-1' : 'opacity-60 grayscale pointer-events-none'
      }`}
    >
      {/* Food Image Container */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Pure Veg Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-md shadow-sm">
          <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-emerald-600 p-0.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800">100% Veg</span>
        </div>

        {/* Badges: Popular / Spicy */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {item.popular && (
            <span className="rounded-full bg-amber-500/95 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
              ⭐ Bestseller
            </span>
          )}
          {item.spicy && (
            <span className="rounded-full bg-red-600/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-sm">
              🌶️ Spicy
            </span>
          )}
        </div>

        {/* Promotional Discount Badge */}
        {hasDiscount && (
          <div className="absolute bottom-2 left-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md">
            🔥 {activeOffer?.title || 'Offer Applied'}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
            {item.description}
          </p>
        </div>

        {/* Sizes Selector (if available) */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-3 flex gap-1 rounded-xl bg-slate-50 p-1 border border-slate-100">
            {item.sizes.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelectedSize(size.label)}
                className={`flex-1 rounded-lg py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                  selectedSize === size.label
                    ? 'bg-white text-slate-900 shadow-sm font-black'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {size.label.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Pricing & Add Button Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-black text-slate-900">
                ₹{discountedPrice.toFixed(0)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-semibold">
                  ₹{currentBasePrice.toFixed(0)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            disabled={!item.available}
            className={`flex items-center justify-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md ${
              isAdding
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-red-650 hover:bg-red-600 text-white shadow-red-650/20'
            }`}
          >
            {isAdding ? (
              <span>Added ✓</span>
            ) : (
              <>
                <span>Add</span>
                <span className="text-sm font-bold leading-none">+</span>
                {addedCount > 0 && (
                  <span className="ml-1 rounded-full bg-white/25 px-1.5 py-0.2 text-[9px]">
                    {addedCount}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart, offers, cartSubtotal }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [quickFilter, setQuickFilter] = useState<'all' | 'popular' | 'spicy' | 'under199'>('all');

  const categories = useMemo(() => [
    { id: 'all', name: 'All Dishes', icon: '🍽️' },
    { id: Category.PIZZA, name: 'Pizzas', icon: '🍕' },
    { id: Category.MOMOS, name: 'Momos', icon: '🥟' },
    { id: Category.BURGERS, name: 'Burgers', icon: '🍔' },
    { id: Category.FRIES, name: 'Fries', icon: '🍟' },
    { id: Category.SIDES, name: 'Sides & Calzones', icon: '🥟' },
    { id: Category.BEVERAGES, name: 'Beverages', icon: '🥤' },
  ], []);

  // Filter items based on activeCategory, quickFilter, and searchFilter
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter (if not 'all')
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Quick filter
      if (quickFilter === 'popular' && !item.popular) return false;
      if (quickFilter === 'spicy' && !item.spicy) return false;
      if (quickFilter === 'under199' && item.price > 199) return false;

      // Text search
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    });
  }, [items, activeCategory, quickFilter, searchFilter]);

  // Track refs for horizontal carousels
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(false);

  // Helper to scroll a track manually via arrow buttons
  const scrollTrack = (catId: string, amount: number) => {
    const track = trackRefs.current[catId];
    if (track) {
      track.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // 9-Second Idle Auto-Scroll implementation
  useEffect(() => {
    const handleUserActivity = () => {
      // Instantly cancel any active auto-scroll when user touches/interacts
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      isAutoScrollingRef.current = false;

      // Reset the 9-second idle countdown
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = setTimeout(() => {
        startIdleAutoScroll();
      }, 9000);
    };

    const startIdleAutoScroll = () => {
      isAutoScrollingRef.current = true;

      const stepScroll = () => {
        if (!isAutoScrollingRef.current) return;

        const validTracks = Object.values(trackRefs.current).filter(
          (track): track is HTMLDivElement => track !== null && track.offsetParent !== null
        );

        if (validTracks.length === 0) return;

        // Advance the track currently in the viewport
        for (const track of validTracks) {
          const rect = track.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 20) {
              track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              track.scrollBy({ left: 290, behavior: 'smooth' });
            }
            break;
          }
        }
      };

      stepScroll();
      autoScrollIntervalRef.current = setInterval(stepScroll, 9000);
    };

    const events = ['touchstart', 'touchmove', 'touchend', 'mousemove', 'mousedown', 'keydown', 'wheel', 'scroll', 'pointerdown'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Start 9s timer
    idleTimerRef.current = setTimeout(startIdleAutoScroll, 9000);

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
    };
  }, []);

  return (
    <section className="space-y-8">
      {/* Unified Single Category & Filter Bar */}
      <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md -mx-4 px-4 py-3 border-b border-white/10 shadow-lg">
        {/* Category Navigation Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-red-650 text-white shadow-lg shadow-red-650/30 scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto hide-scrollbar text-[10px]">
          <button
            type="button"
            onClick={() => setQuickFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              quickFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Filters
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('popular')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              quickFilter === 'popular' ? 'bg-amber-400 text-amber-950 shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Bestsellers
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('spicy')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              quickFilter === 'spicy' ? 'bg-red-600 text-white shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌶️ Spicy
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('under199')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer ${
              quickFilter === 'under199' ? 'bg-emerald-500 text-white shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            💰 Under ₹199
          </button>
        </div>
      </div>

      {/* Dishes Display Area */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <span className="text-5xl block mb-3">🔍</span>
          <h4 className="text-lg font-bold text-slate-800 font-display">No items match your search</h4>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category or clearing filters.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setQuickFilter('all');
              setSearchFilter('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-red-650 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : activeCategory === 'all' ? (
        /* Horizontal scrolling rows grouped by category to eliminate long vertical scrolling */
        <div className="space-y-8">
          {categories
            .filter((cat) => cat.id !== 'all')
            .map((cat) => {
              const catItems = filteredItems.filter((item) => item.category === cat.id);
              if (catItems.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-3">
                  {/* Category Header with Scroll Buttons */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <h3 className="font-display text-lg font-black text-slate-900">{cat.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {catItems.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => scrollTrack(cat.id, -300)}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-90"
                        aria-label={`Scroll ${cat.name} left`}
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollTrack(cat.id, 300)}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-90"
                        aria-label={`Scroll ${cat.name} right`}
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Scroll Row */}
                  <div
                    ref={(el) => {
                      trackRefs.current[cat.id] = el;
                    }}
                    className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory hide-scrollbar"
                  >
                    {catItems.map((item) => (
                      <div key={item.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col">
                        <MenuCard
                          item={item}
                          offers={offers}
                          cartSubtotal={cartSubtotal}
                          onAdd={(selectedSize) => onAddToCart(item, selectedSize)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        /* Selected Category View: Horizontal carousel with manual scroll arrows */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {categories.find((c) => c.id === activeCategory)?.icon || '🍕'}
              </span>
              <h3 className="font-display text-lg font-black text-slate-900">
                {categories.find((c) => c.id === activeCategory)?.name || 'Dishes'}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredItems.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollTrack(activeCategory, -300)}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-90"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(activeCategory, 300)}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-90"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={(el) => {
              trackRefs.current[activeCategory] = el;
            }}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory hide-scrollbar"
          >
            {filteredItems.map((item) => (
              <div key={item.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start flex flex-col">
                <MenuCard
                  item={item}
                  offers={offers}
                  cartSubtotal={cartSubtotal}
                  onAdd={(selectedSize) => onAddToCart(item, selectedSize)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuSection;
