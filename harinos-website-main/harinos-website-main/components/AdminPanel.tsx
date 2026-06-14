import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authenticateAdmin } from '../adminConfig';
import { OUTLET_LOCATIONS } from '../constants';
import {
  getServerCustomers,
  getServerOrders,
  isOrderApiConfigured,
  subscribeServerCustomers,
  subscribeServerOrders,
  updateServerOrderStatus,
  verifyServerCustomer,
} from '../services/orderApi';
import { StorageService } from '../services/storage';
import { AdminSession, CustomerProfile, Order, OrderStatus } from '../types';

interface AdminPanelProps {
  session: AdminSession | null;
  onSessionChange: (session: AdminSession | null) => void;
  onClose: () => void;
}

const normalizePhoneForWhatsApp = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

const statusLabel = (status?: OrderStatus): string => (status ?? 'new').replace(/_/g, ' ').toUpperCase();

const statusClass = (status?: OrderStatus): string => {
  switch (status ?? 'new') {
    case 'new':
      return 'border-red-500/40 bg-red-500/15 text-red-100';
    case 'preparing':
      return 'border-amber-400/40 bg-amber-400/15 text-amber-100';
    case 'ready':
      return 'border-blue-400/40 bg-blue-400/15 text-blue-100';
    case 'out_for_delivery':
      return 'border-violet-400/40 bg-violet-400/15 text-violet-100';
    case 'done':
      return 'border-emerald-400/40 bg-emerald-400/15 text-emerald-100';
    case 'cancelled':
      return 'border-slate-500/50 bg-slate-600/20 text-slate-300';
    default:
      return 'border-slate-500/50 bg-slate-700/30 text-slate-200';
  }
};

const receiptHtml = (order: Order): string => `
<!doctype html><html><head><meta charset="utf-8"><title>${order.id}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:'Courier New',monospace;font-size:12px;line-height:1.35;color:#000;background:#fff;margin:0;padding:4mm;width:100%}
  .center{text-align:center}.brand{font-size:18px;font-weight:900;letter-spacing:.12em}.dash{border-top:1px dashed #000;margin:5px 0}.row{display:flex;justify-content:space-between;gap:8px}.total{font-size:16px;font-weight:900}
  @media print{@page{size:auto;margin:0} body{width:auto;max-width:none}}
</style></head><body>
<div class="center"><img src="/icon-192.png" style="width:32mm;filter:grayscale(1) contrast(1.5)"><div class="brand">HARINO'S</div><div>${order.outletName ?? ''}</div></div>
<div class="dash"></div><div class="center"><b>#${order.id}</b><br>${order.orderType.toUpperCase()}</div>
<div class="dash"></div>${order.customerName ? `<div>Name: ${order.customerName}</div>` : ''}${order.customerPhone ? `<div>Phone: ${order.customerPhone}</div>` : ''}
<div class="dash"></div>${order.items.map((item) => `<div class="row"><span>${item.quantity}x ${item.name}${item.selectedSize ? ` [${item.selectedSize}]` : ''}</span><b>Rs ${Math.round(item.totalPrice)}</b></div>`).join('')}
<div class="dash"></div><div class="row"><span>Delivery</span><b>Rs ${Math.round(order.deliveryFee ?? 0)}</b></div><div class="row total"><span>TOTAL</span><span>Rs ${Math.round(order.total)}</span></div>
<div class="dash"></div><div class="center">Thank you!<br>harinos.store</div>
</body></html>`;

const printOrder = (order: Order) => {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(receiptHtml(order));
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 250);
};

const combineCustomers = (remoteCustomers: CustomerProfile[]): CustomerProfile[] => {
  const localCustomer = StorageService.getCustomerProfile();
  const allCustomers = localCustomer ? [localCustomer, ...remoteCustomers] : remoteCustomers;
  return allCustomers.filter(
    (customer, index, list) => list.findIndex((item) => item.id === customer.id) === index,
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ session, onSessionChange, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [error, setError] = useState('');

  const previousOrderCount = useRef(0);
  
  useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);

  const refresh = useCallback(() => {
    void getServerOrders()
      .then((serverOrders) => setOrders(serverOrders))
      .catch(() => setOrders([]));
    void getServerCustomers()
      .then((remoteCustomers) => setCustomers(combineCustomers(remoteCustomers)))
      .catch(() => setCustomers(combineCustomers([])));
  }, []);

  useEffect(() => {
    if (!session) return;
    const unsubscribeOrders = subscribeServerOrders(
  (serverOrders) => {

    if (
      previousOrderCount.current > 0 &&
      serverOrders.length > previousOrderCount.current
    ) {

      if (Notification.permission === 'granted') {
        new Notification('🍕 New Order Received', {
          body: `Total Orders: ${serverOrders.length}`,
        });
      }

      navigator.vibrate?.([300, 200, 300]);
    }

    previousOrderCount.current = serverOrders.length;
    setOrders(serverOrders);
  },
  () => refresh(),
);
    const unsubscribeCustomers = subscribeServerCustomers(
      (remoteCustomers) => setCustomers(combineCustomers(remoteCustomers)),
      () => refresh(),
    );

    refresh();
    const timer = window.setInterval(refresh, session.role === 'staff' ? 3000 : 5000);
    return () => {
      unsubscribeOrders?.();
      unsubscribeCustomers?.();
      window.clearInterval(timer);
    };
  }, [refresh, session]);

  const visibleOrders = useMemo(() => {
    if (!session || session.role === 'admin') return orders;
    return session.outletId ? orders.filter((order) => order.outletId === session.outletId) : orders;
  }, [orders, session]);

  const pendingOrders = visibleOrders.filter((order) => !['done', 'cancelled'].includes(order.status ?? 'new'));
  const today = new Date().toDateString();
  const todayOrders = visibleOrders.filter((order) => new Date(order.receivedAt ?? order.date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  const login = () => {
    const user = authenticateAdmin(username, password);
    if (!user) {
      setError('Invalid login.');
      return;
    }
    const nextSession: AdminSession = {
      role: user.role,
      username: user.username,
      outletId: user.outletId ?? OUTLET_LOCATIONS[0]?.id ?? null,
      loginTime: new Date().toISOString(),
      lastActivityTime: new Date().toISOString(),
    };
    StorageService.saveAdminSession(nextSession);
    onSessionChange(nextSession);
  };

  const setStatus = (order: Order, status: OrderStatus) => {
    void updateServerOrderStatus(order.id, status).finally(refresh);
  };

  const verifyCustomer = (customer: CustomerProfile) => {
    StorageService.markCustomerVerified(customer.id);
    setCustomers((current) => current.map((item) => (item.id === customer.id ? { ...item, verified: true } : item)));
    void verifyServerCustomer(customer.id).finally(refresh);
  };

  if (!session) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#07070b] p-4 text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_62%)]" />
        <button onClick={onClose} className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-200 shadow-2xl backdrop-blur-xl">Close</button>
        <div className="relative w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950/85 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-white/20 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_40px_rgba(220,38,38,0.18)]">
            <img src="/icon-192.png" className="h-16 w-16 rounded-2xl" />
          </div>
          <div className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.35em] text-red-300">Harino&apos;s Control</div>
          <h2 className="mt-2 text-center font-display text-4xl font-bold text-white">Admin Panel</h2>
          <p className="mt-2 text-center text-xs font-medium leading-5 text-slate-400">Username and password access only. No phone or email login here.</p>
          <label className="mt-6 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Username</label>
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Admin_Harinos" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-bold text-white outline-none transition focus:border-red-500" />
          <label className="mt-4 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-bold text-white outline-none transition focus:border-red-500" />
          <div className="mt-3 min-h-5 text-xs font-bold text-red-300">{error}</div>
          <button onClick={login} className="mt-2 w-full rounded-2xl bg-red-600 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-[0_18px_35px_rgba(220,38,38,0.35)] transition active:scale-95">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#08080d] text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.22),transparent_48%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.13),transparent_42%)]" />
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/icon-192.png" className="h-10 w-10 rounded-2xl shadow-lg" />
            <div className="min-w-0">
              <div className="truncate font-display text-xl font-bold">Harino&apos;s Admin</div>
              <div className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{session.username}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">{session.role}</span>
            {session.role !== 'staff' && (
              <button onClick={() => { StorageService.clearAdminSession(); onSessionChange(null); }} className="hidden rounded-xl px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 sm:block">Sign Out</button>
            )}
            {session.role === 'staff' && <span className="hidden text-[10px] font-black uppercase tracking-widest text-emerald-300 sm:inline">Session Locked</span>}
            <button onClick={onClose} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-slate-200 transition active:scale-95">Close</button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl grid-cols-3 gap-3 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">Pending</div>
          <div className="mt-2 text-3xl font-black text-red-300">{pendingOrders.length}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">Today</div>
          <div className="mt-2 text-3xl font-black text-white">{todayOrders.length}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">Revenue</div>
          <div className="mt-2 text-2xl font-black text-emerald-300">Rs {Math.round(todayRevenue)}</div>
        </div>
      </section>

      {!isOrderApiConfigured() && (
        <div className="m-4 rounded-2xl border border-amber-500 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
          Central Firebase order sync is not configured. Add the VITE_FIREBASE_* variables in Vercel so all devices read and write the same Firestore orders collection.
        </div>
      )}

      {(session.role === 'admin' || session.role === 'manager') && (
        <section className="relative mx-auto max-w-6xl p-4">
          <h3 className="mb-3 font-display text-2xl font-bold">Customer Verification</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {customers.map((customer) => {
              const verified = StorageService.getVerifiedCustomers()[customer.id] || customer.verified;
              const message = encodeURIComponent(`Thank you for joining our family, ${customer.name}. Your Harino's account is verified.`);
              return (
                <div key={customer.id} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20">
                  <div className="font-bold">{customer.name} {verified ? '(Verified)' : '(Pending)'}</div>
                  <div className="text-sm text-slate-400">{customer.phone} {customer.email ? `- ${customer.email}` : ''}</div>
                  {!verified && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={`https://wa.me/${normalizePhoneForWhatsApp(customer.phone)}?text=${message}`} target="_blank" rel="noreferrer" className="rounded-xl bg-green-700 px-4 py-2 text-xs font-black uppercase tracking-widest">Send Thanks</a>
                      <button
                        onClick={() => verifyCustomer(customer)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-widest"
                      >
                        Verified
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {!customers.length && <div className="text-sm text-slate-500">No online customer profiles found yet.</div>}
          </div>
        </section>
      )}

      <section className="relative mx-auto max-w-6xl p-4">
        <h3 className="mb-3 font-display text-2xl font-bold">Orders</h3>
        <div className="grid gap-3">
          {visibleOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <b>#{order.id}</b>
                    <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${statusClass(order.status)}`}>{statusLabel(order.status)}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{order.outletName} - {order.orderType}</div>
                </div>
                <div className="text-2xl font-black text-red-400">Rs {Math.round(order.total)}</div>
              </div>
              <div className="mt-3 text-sm text-slate-300">{order.customerName ?? 'Customer'} - {order.customerPhone ?? 'No phone'}</div>
              <div className="mt-3 space-y-1 text-sm">
                {order.items.map((item) => <div key={`${item.id}-${item.selectedSize}`}>{item.quantity}x {item.name}{item.selectedSize ? ` [${item.selectedSize}]` : ''}</div>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setStatus(order, 'preparing')} className="rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold">Preparing</button>
                <button onClick={() => setStatus(order, order.orderType === 'delivery' ? 'out_for_delivery' : 'ready')} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold">Ready/Out</button>
                <button onClick={() => setStatus(order, 'done')} className="rounded-xl bg-green-700 px-3 py-2 text-xs font-bold">Done</button>
                {(session.role === 'admin' || session.role === 'manager') && <button onClick={() => printOrder(order)} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold">Print Full Size</button>}
                {order.customerPhone && <a href={`https://wa.me/${normalizePhoneForWhatsApp(order.customerPhone)}`} target="_blank" rel="noreferrer" className="rounded-xl bg-green-700 px-3 py-2 text-xs font-bold">WhatsApp Customer</a>}
              </div>
            </div>
          ))}
          {!visibleOrders.length && <div className="text-sm text-slate-500">No central Firestore orders found yet.</div>}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
