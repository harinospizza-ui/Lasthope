import React, { useState, useMemo } from 'react';
import { MenuItem, AdminSession, Category, OutletConfig, OrderItem } from '../types';
import { saveFullOrderToServer } from '../services/orderApi';

interface AdminPOSProps {
  session: AdminSession;
  menuItems: MenuItem[];
  outlets: OutletConfig[];
  onRefresh?: () => void;
}

interface POSCartItem {
  id: string;
  name: string;
  category: Category;
  selectedSize?: string;
  price: number;
  quantity: number;
  image?: string;
}

export const AdminPOS: React.FC<AdminPOSProps> = ({
  session,
  menuItems,
  outlets,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [sizeSelections, setSizeSelections] = useState<Record<string, string>>({});

  // Customer & Payment Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'counter_takeaway' | 'counter_dine_in'>('counter_takeaway');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Counter UPI' | 'Card'>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOutlet = useMemo(() => {
    if (session.outletId) {
      return outlets.find((o) => o.id === session.outletId) || outlets[0];
    }
    return outlets[0];
  }, [outlets, session.outletId]);

  // Categories Filter
  const categories = ['All', Category.PIZZA, Category.BURGERS, Category.FRIES, Category.MOMOS, Category.BEVERAGES, Category.SIDES];

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.available) return false;
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const getItemCurrentPrice = (item: MenuItem, size?: string) => {
    if (item.sizes && item.sizes.length > 0) {
      const chosenSize = size || sizeSelections[item.id] || item.sizes[0].label;
      const found = item.sizes.find((s) => s.label === chosenSize);
      return found ? found.price : item.price;
    }
    return item.price;
  };

  const handleAddToCart = (item: MenuItem) => {
    const chosenSize = item.sizes && item.sizes.length > 0 ? (sizeSelections[item.id] || item.sizes[0].label) : undefined;
    const price = getItemCurrentPrice(item, chosenSize);
    const cartItemId = `${item.id}-${chosenSize || 'std'}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === cartItemId);
      if (existing) {
        return prev.map((i) => (i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: cartItemId,
          name: item.name,
          category: item.category,
          selectedSize: chosenSize,
          price,
          quantity: 1,
          image: item.image,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter((i): i is POSCartItem => i !== null)
    );
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const grandTotal = Math.round(subtotal);

  const normalizePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const handleGenerateBill = async (sendWhatsApp: boolean = true) => {
    const nameVal = customerName.trim();
    const phoneVal = customerPhone.replace(/\D/g, '');

    if (!nameVal) {
      alert('Please enter the customer name.');
      return;
    }
    if (phoneVal.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (cart.length === 0) {
      alert('POS cart is empty. Please add items to generate a bill.');
      return;
    }

    setIsSubmitting(true);
    const posId = `POS-${Date.now().toString().slice(-6)}`;
    const formattedDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const orderItems: OrderItem[] = cart.map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      price: i.price,
      totalPrice: i.price * i.quantity,
      image: i.image,
    }));

    const payload = {
      id: posId,
      items: orderItems,
      total: grandTotal,
      date: formattedDate,
      orderType: (orderType === 'counter_dine_in' ? 'dine_in' : 'takeaway') as any,
      status: 'done' as const,
      outletId: selectedOutlet?.id || 'outlet-main',
      outletName: selectedOutlet?.name || "Harino's Main Outlet",
      outletPhone: selectedOutlet?.phone || '7818958571',
      outletAddress: selectedOutlet?.address,
      customerName: nameVal,
      customerPhone: customerPhone.trim(),
      paymentMethod,
      isDeleted: false,
    };

    try {
      await saveFullOrderToServer(payload);

      // Synthesize WhatsApp Bill
      const waPhone = normalizePhone(phoneVal);
      const itemsListText = cart
        .map((i) => `• ${i.quantity}x ${i.name}${i.selectedSize ? ` [${i.selectedSize}]` : ''} - Rs ${i.price * i.quantity}`)
        .join('\n');

      const waText = 
`🍕 *HARINO'S PIZZA - COUNTER RECEIPT* 📄
------------------------------------
*Receipt No:* #${posId}
*Date:* ${formattedDate}
*Customer:* ${nameVal}
*Outlet:* ${selectedOutlet?.name || "Harino's"}

*Items Ordered:*
${itemsListText}
------------------------------------
*Total Amount:* Rs ${grandTotal}
*Payment Status:* Paid (${paymentMethod})

Thank you for dining with Harino's! 🍕`;

      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

      if (sendWhatsApp) {
        window.open(waUrl, '_blank');
      }

      // Reset Form & Cart
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      if (onRefresh) onRefresh();

      alert(`Counter Bill #${posId} generated successfully!${sendWhatsApp ? ' WhatsApp launched.' : ''}`);
    } catch (err: any) {
      alert(`Error generating POS bill: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }
    window.print();
  };

  return (
    <section className="relative mx-auto max-w-7xl p-4 text-white animate-fade-in space-y-6">
      {/* Printable Receipt styling for thermal printers */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #pos-print-area, #pos-print-area * { visibility: visible; }
          #pos-print-area { position: absolute; left: 0; top: 0; width: 100%; color: black; background: white; padding: 20px; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Counter Operations</p>
          <h3 className="font-display text-2xl font-black text-white">⚡ POS Billing & WhatsApp Counter</h3>
        </div>
        {selectedOutlet && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-300">
            Outlet: <span className="text-white font-black">{selectedOutlet.name}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Side: Fast Menu Items Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Bar */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="🔍 Quick search items (e.g. Farmhouse, Burger, Coke)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs font-bold text-white outline-none focus:border-red-500 shadow-xl"
            />

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-gradient-premium text-white border border-red-500/30 shadow-lg'
                      : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid gap-3 sm:grid-cols-2 max-h-[600px] overflow-y-auto pr-1 hide-scrollbar">
            {filteredMenuItems.map((item) => {
              const currentSize = sizeSelections[item.id] || (item.sizes?.[0]?.label ?? '');
              const currentPrice = getItemCurrentPrice(item, currentSize);

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 shadow-xl transition-all hover:border-red-500/40"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-black text-white truncate">{item.name}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</p>
                      <div className="mt-1 text-sm font-black text-red-400">Rs {currentPrice}</div>
                    </div>
                  </div>

                  {/* Pizza Size Selector Pills */}
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="mt-2.5 flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                      {item.sizes.map((s) => (
                        <button
                          key={s.label}
                          onClick={() => setSizeSelections((prev) => ({ ...prev, [item.id]: s.label }))}
                          className={`flex-1 py-1 text-[8px] font-black uppercase tracking-wider rounded-lg transition-all ${
                            currentSize === s.label
                              ? 'bg-red-650 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {s.label.slice(0, 3)} (Rs {s.price})
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="mt-3 w-full rounded-xl bg-gradient-premium py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-md transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-1"
                  >
                    <span>➕ Add to Cart</span>
                  </button>
                </div>
              );
            })}
            {filteredMenuItems.length === 0 && (
              <div className="col-span-2 text-center text-xs text-slate-500 py-12 font-bold">
                No active menu items match your query.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Counter Cart & WhatsApp Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between min-h-[550px]">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h4 className="font-display text-lg font-black text-white">🛍️ Counter Cart ({cart.length})</h4>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:underline"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="mt-4 space-y-3 max-h-56 overflow-y-auto pr-1 hide-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-2xl bg-white/[0.03] border border-white/5"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white truncate">
                        {item.name} {item.selectedSize ? <span className="text-red-400 text-[10px]">[{item.selectedSize}]</span> : ''}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">
                        Rs {item.price} x {item.quantity} = <span className="text-white">Rs {item.price * item.quantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="h-7 w-7 rounded-xl bg-white/10 text-white font-black hover:bg-white/20 active:scale-95 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-white w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="h-7 w-7 rounded-xl bg-white/10 text-white font-black hover:bg-white/20 active:scale-95 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                {cart.length === 0 && (
                  <div className="text-center text-xs text-slate-500 py-10 font-bold border border-dashed border-white/10 rounded-2xl">
                    No items in counter cart. Select items from the left menu.
                  </div>
                )}
              </div>

              {/* Customer Info & Payment Form */}
              <div className="mt-5 space-y-3 pt-4 border-t border-white/10">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Customer & Order Details</h5>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Mobile Number (10 Digits)</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Counter Order Mode</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-red-500"
                    >
                      <option value="counter_takeaway">Counter Takeaway 🛍️</option>
                      <option value="counter_dine_in">Counter Dine-In 🍽️</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-red-500"
                    >
                      <option value="Cash">Cash 💵</option>
                      <option value="Counter UPI">Counter UPI / QR 📲</option>
                      <option value="Card">Credit/Debit Card 💳</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Total & Action Buttons */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">Total Payable</span>
                <span className="text-2xl font-black text-white">Rs {grandTotal}</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  disabled={isSubmitting || cart.length === 0}
                  onClick={() => handleGenerateBill(true)}
                  className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-900/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📲 Generate & Send WhatsApp Bill</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isSubmitting || cart.length === 0}
                    onClick={() => handleGenerateBill(false)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all active:scale-95 cursor-pointer"
                  >
                    Save Bill Only
                  </button>
                  <button
                    disabled={cart.length === 0}
                    onClick={handlePrintReceipt}
                    className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all active:scale-95 cursor-pointer"
                  >
                    🖨️ Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Thermal Print Receipt Area */}
      <div id="pos-print-area" className="hidden">
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>HARINO'S PIZZA</h2>
          <p style={{ fontSize: '12px', margin: '4px 0' }}>{selectedOutlet?.name || "Main Outlet"}</p>
          <p style={{ fontSize: '11px', margin: 0 }}>Phone: {selectedOutlet?.phone || '7818958571'}</p>
        </div>
        <hr style={{ borderStyle: 'dashed' }} />
        <div style={{ fontSize: '12px', margin: '10px 0' }}>
          <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
          <div><strong>Customer:</strong> {customerName || 'Counter Customer'} ({customerPhone})</div>
          <div><strong>Type:</strong> {orderType.replace('_', ' ').toUpperCase()}</div>
          <div><strong>Payment:</strong> {paymentMethod}</div>
        </div>
        <hr style={{ borderStyle: 'dashed' }} />
        <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', margin: '10px 0' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th style={{ textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name} {item.selectedSize ? `[${item.selectedSize}]` : ''}</td>
                <td>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>Rs {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr style={{ borderStyle: 'dashed' }} />
        <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'right', marginTop: '10px' }}>
          TOTAL: Rs {grandTotal}
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px' }}>
          Thank you for visiting Harino's Pizza! 🍕
        </div>
      </div>
    </section>
  );
};
