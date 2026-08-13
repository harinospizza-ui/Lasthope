import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MenuItem, OfferCard, Category, CartItem } from '../types';
import {
  getDiscountedUnitPrice,
  getOfferConditionLabel,
  getOfferMinimumScope,
  getMatchingDiscountOffer,
  isOfferUnlocked,
} from '../offerUtils';

interface MenuSectionProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, selectedSize?: string) => void;
  offers: OfferCard[];
  cartSubtotal: number;
  cart?: CartItem[];
  onUpdateQuantity?: (cartItemId: string, delta: number) => void;
}

interface MenuCardProps {
  item: MenuItem;
  offers: OfferCard[];
  cartSubtotal: number;
  onAdd: (selectedSize?: string) => void;
  cart?: CartItem[];
  onUpdateQuantity?: (cartItemId: string, delta: number) => void;
}

// ─── Item Detail Bottom Sheet ─────────────────────────────────────────────────
interface ItemDetailSheetProps {
  item: MenuItem;
  offers: OfferCard[];
  cartSubtotal: number;
  onAdd: (selectedSize?: string) => void;
  onClose: () => void;
}

const ItemDetailSheet: React.FC<ItemDetailSheetProps> = ({ item, offers, cartSubtotal, onAdd, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>(item.sizes?.[0]?.label ?? '');
  const [specialNote, setSpecialNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const baseSizePrice = item.sizes?.[0]?.price ?? item.price;
  const currentSizePrice = item.sizes?.find(s => s.label === selectedSize)?.price ?? item.price;

  const previewOffer = getMatchingDiscountOffer(offers, item);
  const previewAmount = cartSubtotal + currentSizePrice;
  const offerUnlocked = previewOffer ? isOfferUnlocked(previewOffer, currentSizePrice, previewAmount) : false;
  const activeOffer = offerUnlocked ? previewOffer : undefined;
  const discountedPrice = getDiscountedUnitPrice(currentSizePrice, activeOffer);
  const hasDiscount = discountedPrice < currentSizePrice;

  const handleAdd = () => {
    setIsAdding(true);
    onAdd(selectedSize || undefined);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Swipe-down to close
  const startY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - startY.current;
    if (dy > 60) onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg overflow-hidden rounded-t-[2rem] bg-white shadow-2xl animate-sheet-up"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ maxHeight: '90dvh', overflowY: 'auto' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-200" />
        </div>

        {/* Hero Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badges */}
          <div className="absolute left-3 bottom-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-green-700">
              🥗 Pure Veg
            </span>
            {item.popular && (
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-950">
                ⭐ Popular
              </span>
            )}
            {item.spicy && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                🌶️ Spicy
              </span>
            )}
          </div>

          {/* Price badge on image */}
          <div className="absolute right-3 bottom-3 text-right">
            {hasDiscount ? (
              <div>
                <div className="text-xs text-white/60 line-through font-bold">Rs {currentSizePrice}</div>
                <div className="text-xl font-display font-black text-white drop-shadow">Rs {discountedPrice}</div>
              </div>
            ) : (
              <div className="text-xl font-display font-black text-white drop-shadow">Rs {discountedPrice}</div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pb-safe">
          {/* Name & Description */}
          <h2 className="text-xl font-display font-bold text-slate-900 leading-tight">{item.name}</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{item.description}</p>

          {/* Size Picker — BUG FIX: Show actual price, never "Free" */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">SIZE</span>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-600 border border-red-100">
                  Required
                </span>
              </div>

              <div className="space-y-2">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize === size.label;
                  // BUG FIX: Always show the actual price for the size.
                  // Never compute a "diff from base" — that caused "Free" when diff = 0.
                  const priceDiff = size.price - baseSizePrice;
                  const priceLabel = priceDiff === 0
                    ? `Rs ${size.price}`
                    : `+Rs ${priceDiff}`;

                  return (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio dot */}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-red-500 bg-red-500' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-red-700' : 'text-slate-700'}`}>
                          {size.label}
                        </span>
                      </div>
                      {/* Price — actual price, not diff */}
                      <span className={`text-sm font-black transition-colors ${isSelected ? 'text-red-600' : 'text-slate-500'}`}>
                        {priceLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Offer Banner */}
          {previewOffer && (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-orange-700">
                🎉 {previewOffer.offerTitle}
              </div>
              <div className="mt-0.5 text-[10px] leading-relaxed text-slate-600">
                {getOfferConditionLabel(previewOffer)}
                {!offerUnlocked
                  ? getOfferMinimumScope(previewOffer) === 'cart'
                    ? ' Add more to unlock.'
                    : ' Upgrade size to unlock.'
                  : ' ✅ Offer applied!'}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="mt-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
              Special Instructions
            </span>
            <textarea
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. No onions, make it spicy, well-done crust..."
              rows={2}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-700 placeholder-slate-350 resize-none focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Price</div>
            <div className="text-lg font-display font-black text-red-600">Rs {discountedPrice}</div>
            {hasDiscount && (
              <div className="text-[9px] text-slate-400 line-through">Rs {currentSizePrice}</div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className={`flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.22em] transition-all shadow-lg active:scale-95 ${
              isAdding
                ? 'bg-green-500 text-white shadow-green-500/20'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/25'
            }`}
          >
            {isAdding ? '✓ Added!' : 'Add to Basket'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Menu Card ────────────────────────────────────────────────────────────────
const MenuCard: React.FC<MenuCardProps> = ({ item, offers, cartSubtotal, onAdd }) => {
  const [selectedSize, setSelectedSize] = useState<string>(item.sizes?.[0]?.label ?? '');
  const [isAdding, setIsAdding] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const currentBasePrice =
    item.sizes?.find((size) => size.label === selectedSize)?.price ?? item.price;
  const previewOffer = getMatchingDiscountOffer(offers, item);
  const previewAmount = cartSubtotal + currentBasePrice;
  const offerUnlocked = previewOffer ? isOfferUnlocked(previewOffer, currentBasePrice, previewAmount) : false;
  const activeOffer = offerUnlocked ? previewOffer : undefined;
  const discountedPrice = getDiscountedUnitPrice(currentBasePrice, activeOffer);
  const hasDiscount = discountedPrice < currentBasePrice;

  const handleAddClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (item.sizes && item.sizes.length > 1) {
      // Open detail sheet to pick size
      setShowDetail(true);
      return;
    }
    setIsAdding(true);
    onAdd(selectedSize || undefined);
    window.setTimeout(() => setIsAdding(false), 600);
  }, [item.sizes, onAdd, selectedSize]);

  const handleCardClick = useCallback(() => {
    if (!item.available) return;
    setShowDetail(true);
  }, [item.available]);

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border border-orange-100/80 bg-white shadow-sm transition-all duration-300 cursor-pointer ${
          item.available
            ? 'hover:-translate-y-1 hover:shadow-xl hover:border-orange-200'
            : 'pointer-events-none opacity-60 grayscale'
        }`}
      >
        {/* Image */}
        <div className="relative h-36 overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-green-700 shadow-sm">
              Veg
            </span>
            {item.popular && (
              <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-amber-950 shadow-sm">
                ⭐
              </span>
            )}
            {item.spicy && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-white shadow-sm">
                🌶️
              </span>
            )}
          </div>

          {/* Offer tag */}
          {previewOffer?.offerPercentage && (
            <div className="absolute right-2.5 top-2.5">
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-white shadow-sm">
                -{previewOffer.offerPercentage}%
              </span>
            </div>
          )}

          {/* Price on image */}
          <div className="absolute bottom-2.5 right-2.5 text-right">
            {hasDiscount && (
              <div className="text-[9px] text-white/60 line-through font-bold">Rs {currentBasePrice}</div>
            )}
            <div className="text-sm font-display font-black text-white drop-shadow-md">
              Rs {discountedPrice}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-3">
          <div className="flex-1">
            <h3 className="text-sm font-display font-bold leading-snug text-slate-900 line-clamp-1" title={item.name}>
              {item.name}
            </h3>
            <p className="mt-0.5 text-[9px] leading-relaxed text-slate-400 line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Size pills — just labels, no "Free" */}
          {item.sizes && item.sizes.length > 0 && (
            <div
              className="mt-2 flex rounded-xl border border-slate-100 bg-slate-50 p-0.5 gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {item.sizes.map((size) => (
                <button
                  key={size.label}
                  onClick={(e) => { e.stopPropagation(); setSelectedSize(size.label); }}
                  className={`flex-1 rounded-lg px-1.5 py-1 text-[7px] font-black uppercase tracking-[0.12em] transition-all ${
                    selectedSize === size.label
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-350">
              {item.category}
            </span>
            <button
              onClick={handleAddClick}
              className={`inline-flex h-7 items-center justify-center rounded-xl px-3 text-[8px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 ${
                isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isAdding ? '✓' : item.available ? 'Add' : 'N/A'}
            </button>
          </div>
        </div>
      </div>

      {/* Item Detail Bottom Sheet */}
      {showDetail && (
        <ItemDetailSheet
          item={item}
          offers={offers}
          cartSubtotal={cartSubtotal}
          onAdd={onAdd}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

// ─── Menu Row ─────────────────────────────────────────────────────────────────
const MenuRow: React.FC<{
  title: string;
  items: MenuItem[];
  offers: OfferCard[];
  cartSubtotal: number;
  onAddToCart: (item: MenuItem, selectedSize?: string) => void;
}> = ({ title, items, offers, cartSubtotal, onAddToCart }) => {
  if (items.length === 0) return null;
  return (
    <div className="menu-row mb-12 animate-slide-up scroll-mt-24">
      <div className="flex items-center justify-between mb-4 border-b border-orange-100 pb-2">
        <h3 className="font-display text-2xl font-bold text-slate-800">{title}</h3>
        <span className="text-xs font-semibold text-slate-400 bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">
          {items.length} Options
        </span>
      </div>
      <div className="menu-row-container flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar px-1">
        {items.map((item) => (
          <div key={item.id} className="w-[220px] md:w-[260px] shrink-0 snap-start">
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
};

// ─── Menu Section ─────────────────────────────────────────────────────────────
const MenuSection: React.FC<MenuSectionProps> = ({ items, onAddToCart, offers, cartSubtotal }) => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const verticalIndexRef = useRef(0);

  // Grouping and sorting (ascending by price) logic
  const sortByPrice = (a: MenuItem, b: MenuItem) => a.price - b.price;

  const pizzas = items.filter((item) => item.category === Category.PIZZA);

  // 1. Cheese Series (contains "Cheese" but not Makhni, Tandoori, or Masala)
  const cheesePizzas = pizzas.filter((item) =>
    (item.id.startsWith('cheese_') || item.name.toLowerCase().includes('cheese')) &&
    !item.name.toLowerCase().includes('makhni') &&
    !item.name.toLowerCase().includes('tandoori') &&
    !item.name.toLowerCase().includes('masala') &&
    !item.name.toLowerCase().includes('teekha') &&
    !item.name.toLowerCase().includes('ultimate') &&
    !item.name.toLowerCase().includes('twist')
  ).sort(sortByPrice);

  // 2. Masala Series (contains Masala keywords but not Makhni or Tandoori)
  const masalaPizzas = pizzas.filter((item) =>
    (item.id.startsWith('masala_') ||
     item.name.toLowerCase().includes('masala') ||
     item.name.toLowerCase().includes('teekha') ||
     item.name.toLowerCase().includes('ultimate') ||
     item.name.toLowerCase().includes('twist')) &&
    !item.name.toLowerCase().includes('makhni') &&
    !item.name.toLowerCase().includes('tandoori')
  ).sort(sortByPrice);

  // 3. Veg Special Series (Veg Lover, Veg Overloaded, Mighty Crunch, Chilli Shot)
  const vegSpecialPizzas = pizzas.filter((item) =>
    item.id !== 'p_hs' &&
    !item.id.startsWith('makhni_') && !item.name.toLowerCase().includes('makhni') &&
    !item.id.startsWith('tandoori_') && !item.name.toLowerCase().includes('tandoori') &&
    !item.id.startsWith('masala_') && !item.name.toLowerCase().includes('masala') && !item.name.toLowerCase().includes('teekha') && !item.name.toLowerCase().includes('ultimate') && !item.name.toLowerCase().includes('twist') &&
    !item.id.startsWith('cheese_') && !item.name.toLowerCase().includes('cheese')
  ).sort(sortByPrice);

  // 4. Makhni Series
  const makhniPizzas = pizzas.filter((item) =>
    item.id.startsWith('makhni_') || item.name.toLowerCase().includes('makhni')
  ).sort(sortByPrice);

  // 5. Tandoori Series
  const tandooriPizzas = pizzas.filter((item) =>
    (item.id.startsWith('tandoori_') || item.name.toLowerCase().includes('tandoori')) &&
    !item.name.toLowerCase().includes('makhni')
  ).sort(sortByPrice);

  // 6. Harino's Signature Series
  const signaturePizzas = pizzas.filter((item) => item.id === 'p_hs').sort(sortByPrice);

  const burgers = items.filter((item) => item.category === Category.BURGERS).sort(sortByPrice);
  const fries = items.filter((item) => item.category === Category.FRIES).sort(sortByPrice);

  // Momos: Veg vs Soya (All varieties, Full Plate only)
  const momos = items
    .filter((item) => item.category === Category.MOMOS)
    .map((item) => {
      const newItem = { ...item };
      if (newItem.sizes && newItem.sizes.length > 0) {
        const fullPlate = newItem.sizes.find((s) => s.label.toLowerCase().includes('full'));
        if (fullPlate) {
          newItem.price = fullPlate.price;
        } else {
          // If no size explicitly says "full", try to find a size that is not "half"
          const nonHalf = newItem.sizes.find((s) => !s.label.toLowerCase().includes('half'));
          if (nonHalf) {
            newItem.price = nonHalf.price;
          }
        }
        newItem.sizes = undefined;
      }
      return newItem;
    });

  const vegMomos = momos
    .filter((item) => {
      const nameLower = item.name.toLowerCase();
      return !nameLower.includes('soya');
    })
    .sort(sortByPrice);

  const soyaMomos = momos
    .filter((item) => {
      const nameLower = item.name.toLowerCase();
      return nameLower.includes('soya');
    })
    .sort(sortByPrice);

  // Sides constraints: Zingli Parcel (4 pieces only), Calzone (2 pieces only)
  const sides = items
    .filter((item) => item.category === Category.SIDES)
    .filter((item) => {
      const nameLower = item.name.toLowerCase();
      if (nameLower.includes('zingli') && nameLower.includes('parcel')) {
        if (nameLower.includes('2') || nameLower.includes('two') || nameLower.includes('single')) {
          return false;
        }
      }
      if (nameLower.includes('calzone')) {
        if (nameLower.includes('1') || nameLower.includes('one') || nameLower.includes('single')) {
          return false;
        }
      }
      return true;
    })
    .map((item) => {
      const newItem = { ...item };
      const nameLower = newItem.name.toLowerCase();
      if (nameLower.includes('zingli') && nameLower.includes('parcel')) {
        if (newItem.sizes && newItem.sizes.length > 0) {
          const size4 = newItem.sizes.find((s) => s.label.includes('4') || s.label.toLowerCase().includes('four'));
          if (size4) {
            newItem.price = size4.price;
          }
          newItem.sizes = undefined;
        }
      } else if (nameLower.includes('calzone')) {
        if (newItem.sizes && newItem.sizes.length > 0) {
          const size2 = newItem.sizes.find((s) => s.label.includes('2') || s.label.toLowerCase().includes('two'));
          if (size2) {
            newItem.price = size2.price;
          }
          newItem.sizes = undefined;
        }
      }
      return newItem;
    })
    .sort(sortByPrice);

  const beverages = items.filter((item) => item.category === Category.BEVERAGES).sort(sortByPrice);

  // Auto-scrolling Vertical + Horizontal Effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      const rows = document.querySelectorAll('.menu-row');
      const containers = document.querySelectorAll('.menu-row-container');
      if (rows.length === 0) return;

      // 1. Move vertically to the next row
      const nextIdx = (verticalIndexRef.current + 1) % rows.length;
      verticalIndexRef.current = nextIdx;
      rows[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 2. Scroll the horizontal container of the active row
      const activeContainer = containers[nextIdx] as HTMLDivElement;
      if (activeContainer) {
        const maxScroll = activeContainer.scrollWidth - activeContainer.clientWidth;
        if (activeContainer.scrollLeft >= maxScroll - 15) {
          activeContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          activeContainer.scrollBy({ left: 220, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const stopAutoScroll = () => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
  };

  return (
    <div
      className="space-y-4"
      onClick={stopAutoScroll}
      onTouchStart={stopAutoScroll}
      onWheel={stopAutoScroll}
    >
      {/* Pizzas: Cheese -> Masala -> Veg Special -> Makhni -> Tandoori -> Signature */}
      {pizzas.length > 0 && (
        <>
          <MenuRow title="Cheese Series" items={cheesePizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
          <MenuRow title="Masala Series" items={masalaPizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
          <MenuRow title="Veg Special Series" items={vegSpecialPizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
          <MenuRow title="Makhni Series" items={makhniPizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
          <MenuRow title="Tandoori Series" items={tandooriPizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
          <MenuRow title="Harino's Signature Series" items={signaturePizzas} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
        </>
      )}

      {/* Burgers */}
      {burgers.length > 0 && (
        <MenuRow title="Delicious Burgers" items={burgers} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}

      {/* Fries */}
      {fries.length > 0 && (
        <MenuRow title="Crispy French Fries" items={fries} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}

      {/* Momos: Veg vs Soya */}
      {vegMomos.length > 0 && (
        <MenuRow title="Veg Momos (Full Plate)" items={vegMomos} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}
      {soyaMomos.length > 0 && (
        <MenuRow title="Soya Momos (Full Plate)" items={soyaMomos} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}

      {/* Side Orders */}
      {sides.length > 0 && (
        <MenuRow title="Side Orders & Calzones" items={sides} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}

      {/* Beverages */}
      {beverages.length > 0 && (
        <MenuRow title="Refreshing Beverages" items={beverages} offers={offers} cartSubtotal={cartSubtotal} onAddToCart={onAddToCart} />
      )}

      {/* Sheet animation keyframe */}
      <style>{`
        @keyframes sheet-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-sheet-up {
          animation: sheet-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default MenuSection;
