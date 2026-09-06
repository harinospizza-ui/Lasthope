import React, { useState, useMemo } from 'react';
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
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 ${
        item.available ? 'hover:-translate-y-1' : 'opacity-60 grayscale pointer-events-none'
      }`}
    >
      {/* Food Photo Container */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 z-10">
          {/* 100% Pure Veg Emblem */}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 shadow-sm border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Pure Veg
          </span>

          {item.popular && (
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-950 shadow-sm">
              ⭐ Bestseller
            </span>
          )}

          {item.spicy && (
            <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm">
              🌶️ Spicy
            </span>
          )}
        </div>

        {/* Offer Tag */}
        {previewOffer?.offerPercentage && (
          <div className="absolute right-3 bottom-3 z-10">
            <span className="rounded-full bg-red-650/90 backdrop-blur-md text-white px-2.5 py-1 text-[9px] font-black tracking-wider uppercase shadow-md">
              Save {previewOffer.offerPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-bold text-slate-900 line-clamp-1 group-hover:text-red-650 transition-colors">
              {item.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Inline Size Selector */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-3 flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            {item.sizes.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size.label);
                }}
                className={`flex-1 rounded-lg py-1 text-[9px] font-black uppercase tracking-wider transition-all ${
                  selectedSize === size.label
                    ? 'bg-white text-red-650 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer: Price + Add Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 font-display">
                ₹{discountedPrice}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{currentBasePrice}
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

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
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

  return (
    <section className="space-y-6">
      {/* Category Navigation Pills */}
      <div className="sticky top-16 z-30 bg-slate-900/90 backdrop-blur-md -mx-4 px-4 py-3 border-b border-white/10 shadow-lg">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
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
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all ${
              quickFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Filters
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('popular')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all ${
              quickFilter === 'popular' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Bestsellers
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('spicy')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all ${
              quickFilter === 'spicy' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌶️ Spicy
          </button>
          <button
            type="button"
            onClick={() => setQuickFilter('under199')}
            className={`px-3 py-1 rounded-xl font-bold uppercase tracking-wider transition-all ${
              quickFilter === 'under199' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            💰 Under ₹199
          </button>
        </div>
      </div>

      {/* Grid of Dishes */}
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
            className="mt-4 px-4 py-2 rounded-xl bg-red-650 text-white text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              offers={offers}
              cartSubtotal={cartSubtotal}
              onAdd={(selectedSize) => onAddToCart(item, selectedSize)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MenuSection;