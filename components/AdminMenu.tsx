import React, { useState } from 'react';
import { MenuItem, Category, AdminSession, OfferCard, Order } from '../types';
import { saveMenuItemToServer, saveOfferToServer, deleteOfferFromServer } from '../services/orderApi';
import { MENU_ITEMS } from '../constants';

interface AdminMenuProps {
  session: AdminSession;
  menuItems: MenuItem[];
  offers: OfferCard[];
  onRefresh: () => void;
  activeTab: 'menu' | 'offers';
  orders?: Order[];
}

export const AdminMenu: React.FC<AdminMenuProps> = ({
  session,
  menuItems,
  offers,
  onRefresh,
  activeTab,
  orders,
}) => {
  // Menu Item Form State
  const [isAddingItem, setIsAddingItem] = useState(false);

  // Offer Form State
  const [editingOffer, setEditingOffer] = useState<OfferCard | null>(null);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [offerId, setOfferId] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerImage, setOfferImage] = useState('');
  const [offerDisplayText, setOfferDisplayText] = useState('');
  const [offerPercentage, setOfferPercentage] = useState('');
  const [offerCondition, setOfferCondition] = useState('');
  const [offerAdditionalItem, setOfferAdditionalItem] = useState('');
  const [offerAdditionalItemImage, setOfferAdditionalItemImage] = useState('');
  const [offerNotifyCustomers, setOfferNotifyCustomers] = useState(false);

  const startEditOffer = (offer: OfferCard) => {
    setEditingOffer(offer);
    setIsAddingOffer(false);
    setOfferId(offer.id);
    setOfferTitle(offer.offerTitle);
    setOfferImage(offer.image);
    setOfferDisplayText(offer.displayText);
    setOfferPercentage(offer.offerPercentage !== undefined ? String(offer.offerPercentage) : '');
    setOfferCondition(offer.condition);
    setOfferAdditionalItem(offer.additionalItem || '');
    setOfferAdditionalItemImage(offer.additionalItemImage || '');
    setOfferNotifyCustomers(!!offer.notifyCustomers);
  };

  const startAddOffer = () => {
    setIsAddingOffer(true);
    setEditingOffer(null);
    setOfferId('');
    setOfferTitle('');
    setOfferImage('');
    setOfferDisplayText('');
    setOfferPercentage('');
    setOfferCondition('');
    setOfferAdditionalItem('');
    setOfferAdditionalItemImage('');
    setOfferNotifyCustomers(false);
  };

  const saveOffer = async () => {
    if (!offerId.trim() || !offerTitle.trim() || !offerCondition.trim()) {
      alert('Please fill out ID, Title and Condition.');
      return;
    }

    const percentageVal = offerPercentage.trim() !== '' ? parseFloat(offerPercentage) : undefined;

    const offer: OfferCard = {
      id: offerId.trim(),
      enabled: editingOffer ? editingOffer.enabled : true,
      image: offerImage.trim(),
      offerTitle: offerTitle.trim(),
      displayText: offerDisplayText.trim(),
      offerPercentage: percentageVal,
      condition: offerCondition.trim(),
      additionalItem: offerAdditionalItem.trim() || undefined,
      additionalItemImage: offerAdditionalItemImage.trim() || undefined,
      notifyCustomers: offerNotifyCustomers
    };

    try {
      await saveOfferToServer(offer);
      alert(editingOffer ? 'Offer updated successfully.' : 'Offer added successfully.');
      setEditingOffer(null);
      setIsAddingOffer(false);
      onRefresh();
    } catch (err) {
      alert('Failed to save offer.');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer card?')) return;
    try {
      await deleteOfferFromServer(id);
      alert('Offer deleted successfully.');
      onRefresh();
    } catch (err) {
      alert('Failed to delete offer.');
    }
  };

  const auditWarnings = React.useMemo(() => {
    const warnings: string[] = [];
    const dbItemMap = new Map<string, MenuItem>();
    const dbItemCounts = new Map<string, number>();

    menuItems.forEach((item) => {
      dbItemMap.set(item.id, item);
      dbItemCounts.set(item.id, (dbItemCounts.get(item.id) || 0) + 1);

      // Check database item fields
      if (!item.category) {
        warnings.push(`Database item "${item.name}" (ID: ${item.id}) is missing a category.`);
      }
      if (!item.image) {
        warnings.push(`Database item "${item.name}" (ID: ${item.id}) is missing an image path.`);
      }
    });

    // 1. Check for duplicates in db menuItems
    dbItemCounts.forEach((count, id) => {
      if (count > 1) {
        warnings.push(`Duplicate database entry found for item ID "${id}" (${count} times).`);
      }
    });

    // 2. Loop through static MENU_ITEMS to check status
    MENU_ITEMS.forEach((staticItem) => {
      const dbItem = dbItemMap.get(staticItem.id);
      if (!dbItem) {
        warnings.push(`Static item "${staticItem.name}" (ID: ${staticItem.id}) is missing from the database.`);
      } else {
        const validCategories = Object.values(Category);
        if (dbItem.available && !validCategories.includes(dbItem.category)) {
          warnings.push(`Item "${dbItem.name}" (ID: ${dbItem.id}) is marked available but has an invalid category "${dbItem.category}", hiding it from the customer menu.`);
        }
      }
    });

    return warnings;
  }, [menuItems]);


  const [newItemId, setNewItemId] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<Category>(Category.PIZZA);
  const [newItemImage, setNewItemImage] = useState('');
  const sundayDhamakaCount = React.useMemo(() => {
    if (!orders) return 0;
    return orders.filter((order) =>
      order.items.some((item) => item.appliedOfferId === 'offer-sunday-dhamaka' || item.sourceOfferId === 'offer-sunday-dhamaka')
    ).length;
  }, [orders]);
  const [newItemSpicy, setNewItemSpicy] = useState(false);
  const [newItemPopular, setNewItemPopular] = useState(false);

  // Sort menuItems: by Category order first, then by Price ascending
  const sortedMenuItems = React.useMemo(() => {
    const categoryOrder = [Category.PIZZA, Category.BURGERS, Category.FRIES, Category.MOMOS, Category.SIDES, Category.BEVERAGES];
    return [...menuItems].sort((a, b) => {
      const idxA = categoryOrder.indexOf(a.category);
      const idxB = categoryOrder.indexOf(b.category);
      if (idxA !== idxB) {
        return idxA - idxB;
      }
      return a.price - b.price;
    });
  }, [menuItems]);

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



  const toggleOfferEnabled = async (offer: OfferCard) => {
    const updated = { ...offer, enabled: !offer.enabled };
    await saveOfferToServer(updated);
    onRefresh();
  };

  if (activeTab === 'menu') {
    return (
      <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
        <h3 className="mb-4 font-display text-2xl font-bold">Dynamic Menu Management</h3>

        {auditWarnings.length > 0 && (
          <div className="mb-6 p-4 rounded-3xl border border-red-500/20 bg-red-950/20 text-red-200 text-xs font-bold space-y-1.5 shadow-lg shadow-red-950/30">
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-red-300">
              ⚠️ Menu Configuration Warnings ({auditWarnings.length})
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {auditWarnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}


        <div className="grid gap-4 md:grid-cols-2">
          {sortedMenuItems.map((item) => (
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
                              disabled={session.role !== 'admin'}
                              defaultValue={sz.price}
                              onBlur={(e) => updateSizePrice(item, idx, parseFloat(e.target.value))}
                              className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-white font-bold outline-none focus:border-red-500/80 transition-premium disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={session.role !== 'admin'}
                          defaultValue={item.price}
                          onBlur={(e) => updateItemPrice(item, parseFloat(e.target.value))}
                          className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-white font-bold outline-none focus:border-red-500/80 transition-premium disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <button
                    disabled={session.role !== 'admin'}
                    onClick={() => toggleItemAvailability(item)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-premium ${
                      session.role !== 'admin' ? 'opacity-65 cursor-not-allowed' : ''
                    } ${
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



  if (activeTab === 'offers') {
    return (
      <section className="relative mx-auto max-w-6xl p-4 animate-fade-in text-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl font-bold">Offers & Discount Rules</h3>
          {session.role === 'admin' && !isAddingOffer && !editingOffer && (
            <button
              onClick={startAddOffer}
              className="rounded-xl bg-red-650 hover:bg-red-700 text-white font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-premium active:scale-95 shadow-lg shadow-red-900/20"
            >
              ➕ Add Offer Card
            </button>
          )}
        </div>

        {/* Add/Edit Offer Form */}
        {(isAddingOffer || editingOffer) && (
          <div className="mb-8 p-6 border border-white/10 bg-white/[0.02] rounded-3xl space-y-4 animate-slide-up">
            <h4 className="text-lg font-display font-bold text-red-300">
              {editingOffer ? `Edit Offer: ${editingOffer.offerTitle}` : 'Create New Offer Card'}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Offer ID</label>
                <input
                  type="text"
                  disabled={!!editingOffer}
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  placeholder="e.g., offer-midweek-treat"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-555 mb-2">Offer Title</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="e.g., Buy 1 Get 1 Free on Burgers"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Image URL</label>
                <input
                  type="text"
                  value={offerImage}
                  onChange={(e) => setOfferImage(e.target.value)}
                  placeholder="e.g., /images/vegover.jpeg"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Display Text / Subtitle</label>
                <input
                  type="text"
                  value={offerDisplayText}
                  onChange={(e) => setOfferDisplayText(e.target.value)}
                  placeholder="e.g., Special limited time deals"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Condition (Rule text)</label>
                <input
                  type="text"
                  value={offerCondition}
                  onChange={(e) => setOfferCondition(e.target.value)}
                  placeholder="e.g., Apply on Burgers when cart total is Rs 249 or more."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Discount Percentage (optional)</label>
                <input
                  type="number"
                  value={offerPercentage}
                  onChange={(e) => setOfferPercentage(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-555 mb-2">Additional Item (optional bonus)</label>
                <input
                  type="text"
                  value={offerAdditionalItem}
                  onChange={(e) => setOfferAdditionalItem(e.target.value)}
                  placeholder="e.g., Tikka Burger"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-555 mb-2">Additional Item Image URL (optional)</label>
                <input
                  type="text"
                  value={offerAdditionalItemImage}
                  onChange={(e) => setOfferAdditionalItemImage(e.target.value)}
                  placeholder="e.g., /images/tikkaburgar.jpeg"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 py-2">
              <input
                type="checkbox"
                id="notifyCustomers"
                checked={offerNotifyCustomers}
                onChange={(e) => setOfferNotifyCustomers(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-red-600 focus:ring-0 bg-transparent border-white/20 cursor-pointer"
              />
              <label htmlFor="notifyCustomers" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
                🔔 Notify customers on browser when this offer is enabled
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={saveOffer}
                className="rounded-xl bg-red-650 hover:bg-red-700 text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider transition-premium active:scale-95"
              >
                {editingOffer ? 'Save Changes' : 'Create Offer'}
              </button>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setIsAddingOffer(false);
                }}
                className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold px-5 py-2.5 text-xs uppercase tracking-wider transition-premium active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`rounded-3xl border border-white/10 shadow-2xl glass-card transition-premium flex flex-col justify-between overflow-hidden ${
                !offer.enabled ? 'opacity-45 grayscale-[20%]' : ''
              }`}
            >
              {/* Image banner */}
              {offer.image && (
                <div className="h-36 w-full relative overflow-hidden bg-slate-900/50">
                  <img
                    src={offer.image}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-display font-extrabold text-white">{offer.offerTitle}</span>
                    <button
                      disabled={session.role !== 'admin'}
                      onClick={() => {
                        const updated = { ...offer, enabled: !offer.enabled };
                        saveOfferToServer(updated).then(() => onRefresh());
                      }}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-premium ${
                        session.role !== 'admin' ? 'opacity-65 cursor-not-allowed' : ''
                      } ${
                        offer.enabled
                          ? 'bg-green-600/20 border border-green-500 text-green-300 hover:bg-green-600/40'
                          : 'bg-red-600/20 border border-red-500 text-red-300 hover:bg-red-650/40'
                      }`}
                    >
                      {offer.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 font-semibold mb-4 italic">"{offer.displayText}"</p>

                  <div className="space-y-2 mb-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-red-400">⚡ Rule:</span>
                      <span className="text-white font-bold">{offer.condition}</span>
                    </div>

                    {offer.offerPercentage !== undefined && (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-emerald-400">🏷️ Discount:</span>
                        <span className="text-emerald-300 font-black">{offer.offerPercentage}% Off</span>
                      </div>
                    )}

                    {offer.additionalItem && (
                      <div className="flex items-center gap-2 mt-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                        {offer.additionalItemImage && (
                          <img
                            src={offer.additionalItemImage}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <div className="text-[9px] font-black text-amber-400 uppercase tracking-wider">Free Gift Item</div>
                          <div className="text-xs text-white font-bold">{offer.additionalItem}</div>
                        </div>
                      </div>
                    )}

                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                      {offer.notifyCustomers ? '🔔 Broadcast active on enable' : '🔕 No auto broadcast'}
                    </div>

                    {offer.id === 'offer-sunday-dhamaka' && (
                      <div className="mt-2 text-emerald-400 font-bold text-xs bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-2 inline-block">
                        🎉 Total Sunday Dhamaka Orders: {sundayDhamakaCount}
                      </div>
                    )}
                  </div>
                </div>

                {session.role === 'admin' && (
                  <div className="flex gap-2.5 pt-3 border-t border-white/5 mt-2">
                    <button
                      onClick={() => startEditOffer(offer)}
                      className="rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold px-3 py-1.5 text-[9px] uppercase tracking-wider transition-premium"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-red-300 font-bold px-3 py-1.5 text-[9px] uppercase tracking-wider transition-premium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
};
