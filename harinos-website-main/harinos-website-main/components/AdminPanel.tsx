import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OUTLET_LOCATIONS } from '../constants';
import {
  getServerCustomers,
  getServerOrders,
  isOrderApiConfigured,
  subscribeServerCustomers,
  subscribeServerOrders,
  updateServerOrderStatus,
  deleteOrderFromServer,
  verifyServerCustomer,
  authenticateAdminViaApi,
  getServerMenuItems,
  getServerOutlets,
  getServerOffers,
  changeStaffPassword,
  changeAdminPasswordWithVerification,
  changeAccountPassword,
  deleteOutletFromServer,
  saveOutletToServer,
  getServerWalletTransactions,
  subscribeServerWalletTransactions,
  getServerSettings,
  saveSettingsToServer,
  getBackupStatus,
  triggerDatabaseBackup,
  triggerDatabaseRestore,
  logoutAdmin,
} from '../services/orderApi';
import { StorageService } from '../services/storage';
import { notifyCustomerStatusChange } from '../services/notificationService';
import { useFCMNotifications } from '../hooks/useFCMNotifications';
import { getDisplayOrderId } from '../App';
import { AdminSession, CustomerProfile, Order, OrderStatus, MenuItem, OutletConfig, OfferCard, WalletTransaction } from '../types';
import { AdminOrders } from './AdminOrders';
import { AdminWallets } from './AdminWallets';
import { AdminMenu } from './AdminMenu';
import { AdminDashboard } from './AdminDashboard';
import { AdminOffers } from './AdminOffers';
import { AdminNotifications } from './AdminNotifications';
import { AdminMigration } from './AdminMigration';
import { AdminReferralManagement } from './AdminReferralManagement';

interface AdminPanelProps {
  session: AdminSession | null;
  onSessionChange: (session: AdminSession | null) => void;
  onClose: () => void;
}

const statusLabel = (status?: OrderStatus): string => (status ?? 'new').replace(/_/g, ' ').toUpperCase();

const receiptHtml = (order: Order): string => `
<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${order.id}</title>
<style>
  *{box-sizing:border-box}
  body{
    font-family:'Courier New',monospace;
    font-size:10px;
    line-height:1.2;
    color:#000;
    background:#fff;
    margin:0;
    padding:2mm;
    width: 54mm;
  }
  .center{text-align:center}
  .brand{font-size:14px;font-weight:900;letter-spacing:.05em}
  .dash{border-top:1px dashed #000;margin:4px 0}
  .row{display:flex;justify-content:space-between;gap:4px}
  .total{font-size:12px;font-weight:900}
  @media print{
    @page {
      size: 54mm auto;
      margin: 0;
    }
    body {
      width: 54mm;
      margin: 0;
      padding: 1mm;
    }
  }
</style></head><body>
<div class="center"><div class="brand">HARINO'S PIZZA</div><div>${order.outletName ?? ''}</div></div>
<div class="dash"></div>
<div class="center"><b>ORDER: #${getDisplayOrderId(order.id)}</b><br>${order.orderType.toUpperCase()}<br>${new Date(order.receivedAt ?? order.date).toLocaleString()}</div>
<div class="dash"></div>
<div>Cust: ${order.customerName ?? 'Customer'}</div>
<div>Ph: ${order.customerPhone ?? ''}</div>
<div>Payment: ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}</div>
<div class="dash"></div>
${order.items.map((item) => `<div class="row"><span>${item.quantity}x ${item.name}${item.selectedSize ? ` [${item.selectedSize}]` : ''}</span><b>Rs ${Math.round(item.totalPrice)}</b></div>`).join('')}
<div class="dash"></div>
<div class="row"><span>Subtotal</span><b>Rs ${Math.round(order.total - (order.deliveryFee ?? 0) + (order.walletAmountRedeemed ?? 0) + (order.rewardPointsRedeemed ?? 0))}</b></div>
${order.deliveryFee ? `<div class="row"><span>Delivery Fee</span><b>Rs ${Math.round(order.deliveryFee)}</b></div>` : ''}
${order.walletAmountRedeemed ? `<div class="row"><span>Wallet Paid</span><b>-Rs ${Math.round(order.walletAmountRedeemed)}</b></div>` : ''}
${order.rewardPointsRedeemed ? `<div class="row"><span>Points Paid</span><b>-Rs ${Math.round(order.rewardPointsRedeemed)}</b></div>` : ''}
<div class="dash"></div>
<div class="row total"><span>GRAND TOTAL</span><span>Rs ${Math.round(order.total)}</span></div>
<div class="dash"></div>
<div class="center">Thank you! Come again!<br>Because Hari Knows</div>
</body></html>`;

const printOrder = (order: Order) => {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(receiptHtml(order));
  win.document.close();
  win.focus();
  window.setTimeout(() => {
    win.print();
    win.close();
  }, 250);
};

const combineCustomers = (remoteCustomers: CustomerProfile[]): CustomerProfile[] => {
  return remoteCustomers.filter(
    (customer, index, list) => list.findIndex((item) => item.id === customer.id) === index,
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ session, onSessionChange, onClose }) => {
  useFCMNotifications({
    userId: session?.username,
    role: session?.role,
    outletId: session?.outletId || undefined,
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'wallets' | 'menu' | 'outlets' | 'offers' | 'dashboard' | 'legacyMigration' | 'referrals' | 'notifications'>('orders');


  // Dynamic config items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [outlets, setOutlets] = useState<OutletConfig[]>([]);
  const [offers, setOffers] = useState<OfferCard[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Change Password Form State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Settings Change Password Form State
  const [prevPasswordInput, setPrevPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // SYSTEM SETTINGS Password State
  const [selectedTargetRole, setSelectedTargetRole] = useState<'Admin_Harinos' | 'Manager_Harinos' | 'Staff_Harinos'>('Admin_Harinos');
  const [targetCurrentPassword, setTargetCurrentPassword] = useState('');
  const [targetNewPassword, setTargetNewPassword] = useState('');
  const [targetConfirmPassword, setTargetConfirmPassword] = useState('');
  const [systemPasswordSuccessMsg, setSystemPasswordSuccessMsg] = useState('');
  const [systemPasswordErrorMsg, setSystemPasswordErrorMsg] = useState('');

  // Settings Outlets Add Form State
  const [isAddingSettingsOutlet, setIsAddingSettingsOutlet] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<OutletConfig | null>(null);
  const [settingsOutletName, setSettingsOutletName] = useState('');
  const [settingsOutletAddress, setSettingsOutletAddress] = useState('');
  const [settingsOutletPhone, setSettingsOutletPhone] = useState('');
  const [settingsOutletLat, setSettingsOutletLat] = useState('26.85');
  const [settingsOutletLng, setSettingsOutletLng] = useState('75.80');
  const [settingsOutletRadius, setSettingsOutletRadius] = useState('7');
  const [settingsOutletFreeRadius, setSettingsOutletFreeRadius] = useState('3');
  const [settingsOutletMinOrder, setSettingsOutletMinOrder] = useState('150');
  const [settingsOutletIncrementPerKm, setSettingsOutletIncrementPerKm] = useState('0');
  const [settingsOutletChargePerKm, setSettingsOutletChargePerKm] = useState('15');
  const [settingsOutletManager, setSettingsOutletManager] = useState('');

  const notifiedOrderIds = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (frequency: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, startTime);
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      playNote(587.33, now, 0.4); // D5
      playNote(880.00, now + 0.15, 0.6); // A5
    } catch (err) {
      console.warn('Audio chime failed:', err);
    }
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      void Notification.requestPermission();
    }
  }, []);

  const refresh = useCallback((forceAll = false) => {
    if (!session) return;

    if (forceAll || activeTab === 'orders' || activeTab === 'dashboard') {
      void getServerOrders().then((serverOrders) => setOrders(serverOrders)).catch(() => setOrders([]));
    }
    if (forceAll || activeTab === 'wallets' || activeTab === 'dashboard') {
      void getServerCustomers().then((remoteCustomers) => setCustomers(combineCustomers(remoteCustomers))).catch(() => setCustomers([]));
    }

    if (session.role !== 'staff') {
      if (forceAll || activeTab === 'wallets') {
        void getServerWalletTransactions().then((txs) => setTransactions(txs)).catch(() => {});
      }
      if (forceAll || activeTab === 'menu') {
        void getServerMenuItems().then((items) => setMenuItems(items)).catch(() => {});
      }
      if (forceAll || activeTab === 'outlets') {
        void getServerOutlets().then((list) => setOutlets(list)).catch(() => {});
      }
      if (forceAll || activeTab === 'offers') {
        void getServerOffers().then((list) => setOffers(list)).catch(() => {});
      }
    }
  }, [session, activeTab]);

  useEffect(() => {
    if (!session) return;
    const unsubscribeOrders = subscribeServerOrders(
      (serverOrders) => {
        let hasNewOrder = false;

        serverOrders.forEach((o) => {
          if (o.id && !notifiedOrderIds.current.has(o.id)) {
            // Keep track of all orders we have seen
            notifiedOrderIds.current.add(o.id);

            // Only trigger notifications if this is NOT the initial load
            // and the order is a new status order.
            if (initialLoadDone.current && o.status === 'new') {
              hasNewOrder = true;
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('🍕 New Order Received', { 
                  body: `Order #${o.id.replace('HRN-', '')} from ${o.customerName || 'Customer'} - Rs ${Math.round(o.total)}` 
                });
              }
            }
          }
        });

        if (hasNewOrder) {
          playChime();
          navigator.vibrate?.([300, 200, 300]);
        }

        initialLoadDone.current = true;
        setOrders(serverOrders);
      },
      () => refresh(),
    );
    const unsubscribeCustomers = subscribeServerCustomers(
      (remoteCustomers) => setCustomers(combineCustomers(remoteCustomers)),
      () => refresh(),
    );
    const unsubscribeTransactions = subscribeServerWalletTransactions(
      (txs) => setTransactions(txs),
      () => refresh(),
    );

    refresh();
    const timer = window.setInterval(refresh, session.role === 'staff' ? 6000 : 8000);
    return () => {
      unsubscribeOrders?.();
      unsubscribeCustomers?.();
      unsubscribeTransactions?.();
      window.clearInterval(timer);
    };
  }, [refresh, session]);

  const login = async () => {
    try {
      setError('');
      const user = await authenticateAdminViaApi(username, password);
      const nextSession: AdminSession = {
        role: user.role,
        username: user.username,
        outletId: user.outletId ?? OUTLET_LOCATIONS[0]?.id ?? null,
        token: user.token,
        firebaseToken: user.firebaseToken,
        sessionId: user.sessionId,
        loginTime: new Date().toISOString(),
        lastActivityTime: new Date().toISOString(),
      };
      StorageService.saveAdminSession(nextSession);
      onSessionChange(nextSession);
    } catch (err: any) {
      setError(err.message || 'Invalid login.');
    }
  };

  const setStatus = (order: Order, status: OrderStatus, reason?: string) => {
    updateServerOrderStatus(order.id, status, reason)
      .then(() => {
        if (status !== 'new') {
          void notifyCustomerStatusChange(order, status);
        }
        refresh();
      })
      .catch((err: any) => alert(err.message || 'Failed to update status.'));
  };

  const verifyCustomer = async (customer: CustomerProfile) => {
    if (!confirm(`Are you sure you want to verify customer "${customer.name}" manually?`)) {
      return;
    }
    try {
      const result = await verifyServerCustomer(customer.id);
      if (result) {
        StorageService.markCustomerVerified(customer.id);
        setCustomers((current) => current.map((item) => (item.id === customer.id ? result : item)));
        alert(`Customer ${customer.name} verified successfully!`);
      }
      refresh();
    } catch (err: any) {
      alert(err.message || 'Verification failed.');
      refresh();
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to permanently delete this order?')) {
      return;
    }
    try {
      await deleteOrderFromServer(orderId);
      alert('Order deleted successfully (permanently deleted).');
      refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete order.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) {
      setPasswordError('New password cannot be empty.');
      return;
    }
    try {
      setPasswordMessage('');
      setPasswordError('');
      await changeStaffPassword(session?.username ?? '', newPassword);
      setPasswordMessage('Password updated successfully.');
      setNewPassword('');
      setTimeout(() => setIsChangePasswordOpen(false), 1500);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const displayedOrders = useMemo(() => {
    if (session?.role === 'staff') {
      const todayStr = new Date().toDateString();
      return orders.filter((o) => {
        const orderDateStr = new Date(o.receivedAt || o.date).toDateString();
        const isToday = orderDateStr === todayStr;
        const isActive = ['new', 'preparing', 'ready', 'out_for_delivery'].includes(o.status || 'new');
        return isToday && isActive;
      });
    }
    return orders;
  }, [orders, session]);

  if (!session) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#07070b] p-4 text-white animate-slide-up">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.35),transparent_62%)]" />
        <button onClick={onClose} className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-200 shadow-2xl backdrop-blur-xl transition hover:bg-white/20">Close</button>
        <div className="relative w-full max-w-sm rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl animate-slide-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-white/20 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_40px_rgba(220,38,38,0.18)]">
            <img src="/icon-192.png" className="h-16 w-16 rounded-2xl" />
          </div>
          <div className="mt-5 text-center text-[10px] font-black uppercase tracking-[0.35em] text-red-300 text-glow">Harino&apos;s Control</div>
          <h2 className="mt-2 text-center font-display text-4xl font-bold text-white">Admin Panel</h2>
          <p className="mt-2 text-center text-xs font-medium leading-5 text-slate-400">Username and password access only.</p>
          <label className="mt-6 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Username</label>
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Admin_Harinos" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-bold text-white outline-none focus:border-red-500" />
          <label className="mt-4 block text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">Password</label>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-bold text-white outline-none focus:border-red-500" />
          <div className="mt-3 min-h-5 text-xs font-bold text-red-300">{error}</div>
          <button onClick={login} className="mt-2 w-full rounded-2xl bg-gradient-premium py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-[0_18px_35px_rgba(220,38,38,0.3)] hover:scale-[1.02] transition-transform">Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#08080d] text-white animate-fade-in">
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
            <button
              onClick={() => {
                setPasswordMessage('');
                setPasswordError('');
                setIsChangePasswordOpen(true);
              }}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition hover:bg-white/20 active:scale-95"
            >
              Password
            </button>
            <button 
              onClick={async () => {
                await logoutAdmin().catch(() => {});
                onSessionChange(null); 
              }} 
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition hover:bg-white/20 active:scale-95"
            >
              Sign Out
            </button>
            <button onClick={onClose} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-slate-200 transition active:scale-95">Close</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4 mt-6 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setActiveTab('orders')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'orders' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
          Orders
        </button>
        {session.role !== 'staff' && (
          <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'dashboard' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
            Dashboard
          </button>
        )}
        {session.role !== 'staff' && (
          <button onClick={() => setActiveTab('wallets')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'wallets' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
            Wallets & Customers
          </button>
        )}
        {session.role !== 'staff' && (
          <>
            <button onClick={() => setActiveTab('menu')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'menu' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Menu
            </button>
            <button onClick={() => setActiveTab('outlets')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'outlets' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Outlets
            </button>
            <button onClick={() => setActiveTab('offers')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'offers' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Offers
            </button>
          </>
        )}
        {session.role === 'admin' && (
          <>
            <button onClick={() => setActiveTab('legacyMigration')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'legacyMigration' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Legacy Migration
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'notifications' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Push Notifications
            </button>
            <button onClick={() => setActiveTab('referrals')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'referrals' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Referral Management
            </button>
          </>
        )}

      </div>

      <div className="pb-12">
        {activeTab === 'orders' && (
          <AdminOrders
            session={session}
            orders={displayedOrders}
            onUpdateStatus={setStatus}
            onDeleteOrder={handleDeleteOrder}
            onPrint={printOrder}
          />
        )}
        {activeTab === 'wallets' && session.role !== 'staff' && (
          <AdminWallets
            session={session}
            customers={customers}
            transactions={transactions}
            onRefresh={refresh}
            onVerifyCustomer={verifyCustomer}
          />
        )}
        {(activeTab === 'menu' || activeTab === 'outlets') && session.role !== 'staff' && (
          <AdminMenu
            session={session}
            menuItems={menuItems}
            outlets={outlets}
            onRefresh={refresh}
            activeTab={activeTab}
            orders={orders}
          />
        )}
        {activeTab === 'offers' && session.role !== 'staff' && (
          <AdminOffers
            session={session}
            offers={offers}
            menuItems={menuItems}
            onRefresh={refresh}
          />
        )}
        {activeTab === 'dashboard' && session.role !== 'staff' && (
          <AdminDashboard
            session={session}
            orders={orders}
            customers={customers}
          />
        )}
        {activeTab === 'notifications' && session.role === 'admin' && (
          <AdminNotifications />
        )}
        {activeTab === 'legacyMigration' && session.role === 'admin' && (
          <div className="mx-auto max-w-4xl px-4 mt-6">
            <AdminMigration onRefreshData={refresh} />
          </div>
        )}
        {activeTab === 'referrals' && session.role === 'admin' && (
          <div className="mx-auto max-w-4xl px-4 mt-6">
            <AdminReferralManagement />
          </div>
        )}

      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-display font-bold mb-4">Change Password</h3>
            <div className="text-xs text-slate-400 mb-4 font-bold bg-white/5 border border-white/5 p-4 rounded-2xl">
              🔒 Password changes are restricted to the primary Administrator account. Neither Manager nor Staff can change credentials.
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
