import React, { useState, useEffect, useRef } from 'react';
import { MenuItem, OfferCard, Category } from '../types';
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
    onAdd(selectedSize || undefined);
    window.setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm transition-all duration-500 ${
        item.available ? 'hover:-translate-y-1.5 hover:shadow-2xl' : 'pointer-events-none opacity-60 grayscale'
      }`}
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-green-700 shadow-sm">
            Veg
          </span>
          {item.popular && (
            <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-amber-950 shadow-sm">
              Popular
            </span>
          )}
          {item.spicy && (
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
              Spicy
            </span>
          )}
          {previewOffer?.offerPercentage && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
              Save {previewOffer.offerPercentage}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-display font-bold leading-snug text-slate-900 truncate" title={item.name}>{item.name}</h3>
            <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500 line-clamp-1">{item.description}</p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-base font-display font-bold text-red-600 font-black">Rs {discountedPrice}</div>
            {hasDiscount && <div className="text-[10px] text-slate-400 line-through">Rs {currentBasePrice}</div>}
          </div>
        </div>

        {item.sizes && (
          <div className="mt-2 flex rounded-xl border border-orange-100 bg-orange-50/70 p-0.5">
            {item.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                className={`flex-1 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-[0.15em] transition-all ${
                  selectedSize === size.label
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        )}

        {previewOffer && (
          <div className="mt-2 rounded-xl border border-orange-100 bg-orange-50/60 px-2.5 py-1">
            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-orange-700">
              {previewOffer.offerTitle}
            </div>
            <div className="mt-0.5 text-[9px] leading-relaxed text-slate-600">
              {getOfferConditionLabel(previewOffer)}
              {!offerUnlocked
                ? getOfferMinimumScope(previewOffer) === 'cart'
                  ? ' Add more to unlock.'
                  : ' Upgrade size.'
                : ''}
            </div>
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 mt-auto">
          <span className="text-[8px] font-black uppercase tracking-[0.22em] text-slate-400">{item.category}</span>
          <button
            onClick={handleAddClick}
            className={`inline-flex h-8 min-w-[80px] items-center justify-center rounded-xl px-3 text-[8px] font-black uppercase tracking-[0.22em] btn-hover-scale ${
              isAdding ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20'
            }`}
          >
            {isAdding ? 'Added' : item.available ? 'Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <span className="text-xs font-semibold text-slate-400 bg-orange-50 px-3 py-1 rounded-full border border-orange-100/50">{items.length} Options</span>
      </div>
      <div className="menu-row-container flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar px-1">
        {items.map((item) => (
          <div key={item.id} className="w-[290px] md:w-[340px] shrink-0 snap-start">
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

  // Momos: Veg vs Soya (Allowed 5 items each, Full Plate only)
  const allowedVegMomos = [
    'veg steam momos',
    'veg fried momos',
    'veg tandoori momos',
    'veg cheese momos',
    'veg gravy momos'
  ];
  const allowedSoyaMomos = [
    'soya steam momos',
    'soya fried momos',
    'soya tandoori momos',
    'soya cheese momos',
    'soya gravy momos'
  ];

  const momos = items.filter((item) => item.category === Category.MOMOS);
  const vegMomos = momos.filter((item) => allowedVegMomos.includes(item.name.toLowerCase())).sort(sortByPrice);
  const soyaMomos = momos.filter((item) => allowedSoyaMomos.includes(item.name.toLowerCase())).sort(sortByPrice);

  // Sides constraints: Zingli Parcel (4 pieces only), Calzone (2 pieces only)
  const sides = items
    .filter((item) => item.category === Category.SIDES)
    .filter((item) => {
      const nameLower = item.name.toLowerCase();
      if (nameLower.includes('zingli parcel') && !nameLower.includes('4 pieces') && !nameLower.includes('4 pcs')) {
        return false;
      }
      if (nameLower.includes('calzone') && !nameLower.includes('2 pieces') && !nameLower.includes('2 pcs')) {
        return false;
      }
      return true;
    })
    .map((item) => {
      const nameLower = item.name.toLowerCase();
      if (nameLower.includes('zingli parcel') || nameLower.includes('calzone')) {
        return { ...item, sizes: undefined };
      }
      return item;
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
    </div>
  );
};

export default MenuSection;
