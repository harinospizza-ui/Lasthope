import React from 'react';
import { Order, MenuItem } from '../../types';
import { HapticsService } from '../../services/hapticsService';

interface QuickReorderBarProps {
  pastOrders: Order[];
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const QuickReorderBar: React.FC<QuickReorderBarProps> = ({
  pastOrders,
  menuItems,
  onAddToCart
}) => {
  if (!pastOrders || pastOrders.length === 0) {
    return null;
  }

  // Extract recently ordered unique item names from past orders
  const recentItemNames = new Set<string>();
  for (const order of pastOrders) {
    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        if (item.name) recentItemNames.add(item.name.toLowerCase().trim());
      }
    }
    if (recentItemNames.size >= 4) break;
  }

  if (recentItemNames.size === 0) {
    return null;
  }

  // Match with current available menu items
  const matchedItems = menuItems.filter((m) =>
    recentItemNames.has(m.name.toLowerCase().trim()) && m.available
  ).slice(0, 4);

  if (matchedItems.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6 p-4 rounded-3xl bg-gradient-to-br from-red-50/70 via-orange-50/40 to-white border border-red-100/80 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔁</span>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 font-display">
              Order Again
            </h4>
            <span className="text-[10px] text-slate-500 font-medium">Your recent favorites</span>
          </div>
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-100/60 px-2 py-0.5 rounded-full">
          1-Tap Add
        </span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar py-1">
        {matchedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm shrink-0 min-w-[210px] max-w-[240px] hover:border-red-300 transition-colors"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
              onError={(e) => { e.currentTarget.src = '/icon-192.png'; }}
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-black text-slate-800 truncate">
                {item.name}
              </h5>
              <span className="text-xs font-black text-red-600 block mt-0.5">
                ₹{item.price}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                void HapticsService.medium();
                onAddToCart(item);
              }}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-red-600 active:scale-95 text-white flex items-center justify-center text-base font-bold shadow-md shadow-slate-900/15 transition-all shrink-0"
              title={`Add ${item.name} to cart`}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickReorderBar;
