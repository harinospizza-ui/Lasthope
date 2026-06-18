import React, { useState } from 'react';
import { MenuItem, Category, AdminSession, OutletConfig, OfferCard } from '../types';
import { saveMenuItemToServer, saveOutletToServer, saveOfferToServer } from '../services/orderApi';

interface AdminMenuProps {
  session: AdminSession;
  menuItems: MenuItem[];
  outlets: OutletConfig[];
  offers: OfferCard[];
  onRefresh: () => void;
  activeTab: 'menu' | 'outlets' | 'offers';
}

export const AdminMenu: React.FC<AdminMenuProps> = ({
  session,
  menuItems,
  outlets,
  offers,
  onRefresh,
  activeTab,
}) => {
  // Menu Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemId, setNewItemId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>(Category.PIZZA);
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemSpicy, setNewItemSpicy] = useState(false);
  const [newItemPopular, setNewItemPopular] = useState(false);

  // Operations
  const toggleItemAvailability = async (item: MenuItem) => {
    const updated = { ...item, available: !item.available };
    await saveMenuItemToServer(updated);
    onRefresh();
  };

  const updateItemPrice = async (item: MenuItem, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = { ...item, price: newPrice };
    await saveMenuItemToServer(updated);
    onRefresh();
  };

  const updateSizePrice = async (item: MenuItem, sizeIndex: number, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0 || !item.sizes) return;
    const nextSizes = [...item.sizes];
    nextSizes[sizeIndex] = { ...nextSizes[sizeIndex], price: newPrice };
    const updated = { ...item, sizes: nextSizes };
    if (sizeIndex === 0) {
      updated.price = newPrice;
    }
    await saveMenuItemToServer(updated);
    onRefresh();
  };

  const toggleOutletEnabled = async (outlet: OutletConfig) => {
    const updated = { ...outlet, enabled: !outlet.enabled };
    await saveOutletToServer(updated);
    onRefresh();
  };

  const toggleOfferEnabled = async (offer: OfferCard) => {
    const updated = { ...offer, enabled: !offer.enabled };
    await saveOfferToServer(updated);
    onRefresh();
  };

  if (activeTab === 'menu') {
    return (
      <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
        <h3 className="mb-4 font-display text-2xl font-bold">Dynamic Menu Management</h3>
        
        {/* Add Menu Item Panel */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg">
          <button
            onClick={() => setIsAddingItem(!isAddingItem)}
            className="w-full text-left font-display font-bold text-lg flex justify-between items-center outline-none"
          >
            <span>➕ Add New Menu Item</span>
            <span className="text-slate-400">{isAddingItem ? 'Close' : 'Expand'}</span>
          </button>
          
          {isAddingItem && (
            <div className="mt-5 space-y-4 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Item ID (must start with p1_ for pizzas)</label>
                  <input value={newItemId} onChange={e => setNewItemId(e.target.value)} placeholder="p1_onion" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Item Name</label>
                  <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Double Cheese Margherita" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                <textarea value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Double loaded cheese with herbs" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500 h-20" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                  <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value as any)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500">
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Base Price (Rs)</label>
                  <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="199" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
                  <input value={newItemImage} onChange={e => setNewItemImage(e.target.value)} placeholder="/icon-192.png" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-red-500" />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={newItemSpicy} onChange={e => setNewItemSpicy(e.target.checked)} className="w-4 h-4 rounded text-red-600 focus:ring-0 bg-transparent border-white/20" />
                  <span>Spicy</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" checked={newItemPopular} onChange={e => setNewItemPopular(e.target.checked)} className="w-4 h-4 rounded text-red-600 focus:ring-0 bg-transparent border-white/20" />
                  <span>Popular / Bestseller</span>
                </label>
              </div>

              <button
                type="button"
                onClick={async () => {
                  if (!newItemId.trim() || !newItemName.trim() || !newItemPrice.trim()) {
                    alert('Please fill out Name, ID and Base Price.');
                    return;
                  }
                  
                  const priceNum = parseFloat(newItemPrice);
                  const sizes = newItemCategory === Category.PIZZA ? [
                    { label: 'Regular', price: priceNum },
                    { label: 'Medium', price: priceNum + 100 },
                    { label: 'Large', price: priceNum + 200 }
                  ] : undefined;

                  const item: MenuItem = {
                    id: newItemId,
                    name: newItemName,
                    description: newItemDesc,
                    price: priceNum,
                    category: newItemCategory,
                    image: newItemImage || '/icon-192.png',
                    vegetarian: true,
                    spicy: newItemSpicy,
                    popular: newItemPopular,
                    available: true,
                    sizes
                  };

                  try {
                    await saveMenuItemToServer(item);
                    alert('Menu item added successfully.');
                    setNewItemId('');
                    setNewItemName('');
                    setNewItemDesc('');
                    setNewItemPrice('');
                    setNewItemImage('');
                    setIsAddingItem(false);
                    onRefresh();
                  } catch (err) {
                    alert('Failed to save menu item.');
                  }
                }}
                className="bg-red-650 hover:bg-red-500 text-white rounded-2xl px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-premium"
              >
                Save Item
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {menuItems.map((item) => (
            <div key={item.id} className={`rounded-2xl p-4 flex gap-4 shadow-2xl glass-card transition-premium ${!item.available ? 'opacity-50 grayscale-[30%] border border-red-500/20' : ''}`}>
              <img src={item.image} className="w-20 h-20 rounded-xl object-cover" onError={(e) => { e.currentTarget.src = '/icon-192.png'; }} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {item.name}
                    {item.vegetarian && <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" title="Vegetarian"></span>}
                  </div>
                  <div className="text-xs text-slate-400 capitalize">{item.category}</div>
                  
                  {item.sizes && item.sizes.length > 0 ? (
                    <div className="mt-2 space-y-1.5">
                      {item.sizes.map((sz, idx) => (
                        <div key={sz.label} className="flex items-center justify-between gap-2 text-xs text-slate-300">
                          <span>{sz.label}:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 font-bold">Rs</span>
                            <input
                              type="number"
                              defaultValue={sz.price}
                              onBlur={(e) => updateSizePrice(item, idx, parseFloat(e.target.value))}
                              className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-white font-bold outline-none focus:border-red-500/80 transition-premium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                      <span>Price:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-bold">Rs</span>
                        <input
                          type="number"
                          defaultValue={item.price}
                          onBlur={(e) => updateItemPrice(item, parseFloat(e.target.value))}
                          className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-white font-bold outline-none focus:border-red-500/80 transition-premium"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    onClick={() => toggleItemAvailability(item)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-premium ${
                      item.available ? 'bg-green-600/20 border border-green-500 text-green-300 hover:bg-green-600/35' : 'bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-650/35'
                    }`}
                  >
                    {item.available ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (activeTab === 'outlets') {
    return (
      <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
        <h3 className="mb-4 font-display text-2xl font-bold">Outlets Configuration</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {outlets.map((outlet) => (
            <div key={outlet.id} className={`rounded-3xl p-5 border border-white/10 shadow-2xl glass-card transition-premium ${!outlet.enabled ? 'opacity-40 grayscale-[20%]' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-display font-bold">{outlet.name}</span>
                <button
                  onClick={() => toggleOutletEnabled(outlet)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-premium ${
                    outlet.enabled ? 'bg-green-600/20 border border-green-500 text-green-300' : 'bg-red-600/20 border border-red-500 text-red-300'
                  }`}
                >
                  {outlet.enabled ? 'Live' : 'Inactive'}
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-3">📍 Address: {outlet.address || 'Not specified'}</p>
              <div className="text-xs text-slate-300 space-y-1 font-semibold">
                <div>Radius: <span className="text-red-400 font-bold">{outlet.deliveryRadiusKm} Km</span></div>
                <div>Min Order Free Delivery: <span className="text-green-400 font-bold">Rs {outlet.freeDeliveryMinimumOrder}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (activeTab === 'offers') {
    return (
      <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
        <h3 className="mb-4 font-display text-2xl font-bold">Offers & Disount Rules</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <div key={offer.id} className={`rounded-3xl p-5 border border-white/10 shadow-2xl glass-card transition-premium ${!offer.enabled ? 'opacity-40 grayscale-[20%]' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-display font-bold">{offer.offerTitle}</span>
                <button
                  onClick={() => toggleOfferEnabled(offer)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-premium ${
                    offer.enabled ? 'bg-green-600/20 border border-green-500 text-green-300' : 'bg-red-600/20 border border-red-500 text-red-300'
                  }`}
                >
                  {offer.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-3">💬 Display: {offer.displayText}</p>
              <div className="text-xs text-slate-300 space-y-1 font-semibold">
                <div>Condition: <span className="text-red-400 font-bold">{offer.condition}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
};
