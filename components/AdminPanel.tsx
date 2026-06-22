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
import { AdminUsage } from './AdminUsage';
import { AdminBackup } from './AdminBackup';
import { AdminNotifications } from './AdminNotifications';
import { AdminVerificationRequests } from './AdminVerificationRequests';
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
  const [activeTab, setActiveTab] = useState<'orders' | 'wallets' | 'menu' | 'outlets' | 'offers' | 'dashboard' | 'settings' | 'usage' | 'backup' | 'notifications' | 'verificationRequests' | 'legacyMigration' | 'systemSettings' | 'referrals'>('orders');
  const [instagramUrlInput, setInstagramUrlInput] = useState('');


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

  const previousOrderCount = useRef(0);

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
      if (forceAll || activeTab === 'outlets' || activeTab === 'systemSettings') {
        void getServerOutlets().then((list) => setOutlets(list)).catch(() => {});
      }
      if (forceAll || activeTab === 'offers') {
        void getServerOffers().then((list) => setOffers(list)).catch(() => {});
      }
      if (forceAll || activeTab === 'settings' || activeTab === 'systemSettings') {
        void getServerSettings().then((settings) => setInstagramUrlInput(settings.instagramUrl || '')).catch(() => {});
      }
    }
  }, [session, activeTab]);

  useEffect(() => {
    if (!session) return;
    const unsubscribeOrders = subscribeServerOrders(
      (serverOrders) => {
        if (previousOrderCount.current > 0 && serverOrders.length > previousOrderCount.current) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🍕 New Order Received', { body: `Total Orders: ${serverOrders.length}` });
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
          <button onClick={() => setActiveTab('verificationRequests')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'verificationRequests' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
            Verification Requests
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
            <button onClick={() => setActiveTab('settings')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'settings' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Settings
            </button>
          </>
        )}
        {session.role === 'admin' && (
          <>
            <button onClick={() => setActiveTab('legacyMigration')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'legacyMigration' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Legacy Migration
            </button>
            <button onClick={() => setActiveTab('systemSettings')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'systemSettings' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              SYSTEM SETTINGS
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'notifications' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Push Notifications
            </button>
            <button onClick={() => setActiveTab('usage')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'usage' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Cost Usage
            </button>
            <button onClick={() => setActiveTab('backup')} className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-premium ${activeTab === 'backup' ? 'bg-gradient-premium border-red-500/30 text-white' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
              Backup & Restore
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
        {activeTab === 'verificationRequests' && session.role !== 'staff' && (
          <AdminVerificationRequests session={session} />
        )}
        {(activeTab === 'menu' || activeTab === 'outlets' || activeTab === 'offers') && session.role !== 'staff' && (
          <AdminMenu
            session={session}
            menuItems={menuItems}
            outlets={outlets}
            offers={offers}
            onRefresh={refresh}
            activeTab={activeTab}
            orders={orders}
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
        {activeTab === 'usage' && session.role === 'admin' && (
          <AdminUsage />
        )}
        {activeTab === 'backup' && session.role === 'admin' && (
          <AdminBackup session={session} />
        )}
        {activeTab === 'settings' && session.role !== 'staff' && (
          <div className="mx-auto max-w-4xl px-4 mt-6 space-y-6">
            {/* Instagram Configuration */}
            <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl">
              <h3 className="font-display text-2xl font-bold mb-4 text-glow text-white">Application Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Instagram Page URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/harinospizza"
                    value={instagramUrlInput}
                    onChange={(e) => setInstagramUrlInput(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 font-bold text-white outline-none focus:border-red-500"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">Provide the Instagram page URL. If empty, the Instagram social icons will be hidden.</p>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await saveSettingsToServer({ instagramUrl: instagramUrlInput.trim() });
                      alert('Settings saved successfully!');
                      refresh();
                    } catch (err: any) {
                      alert(err.message || 'Failed to save settings.');
                    }
                  }}
                  className="w-full rounded-2xl bg-gradient-premium py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/30 hover:scale-[1.01] transition-transform active:scale-95"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
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

        {activeTab === 'systemSettings' && session.role === 'admin' && (
          <div className="mx-auto max-w-4xl px-4 mt-6 space-y-6">
            {/* Password Changer Section (Admin Only) */}
            <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl">
              <h3 className="font-display text-2xl font-bold mb-4 text-glow text-white">Change Account Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Target Account</label>
                  <select
                    value={selectedTargetRole}
                    onChange={(e) => setSelectedTargetRole(e.target.value as any)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-500 font-bold"
                  >
                    <option value="Admin_Harinos">Admin (Admin_Harinos)</option>
                    <option value="Manager_Harinos">Manager (Manager_Harinos)</option>
                    <option value="Staff_Harinos">Staff (Staff_Harinos)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Current Password of Target Account</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={targetCurrentPassword}
                    onChange={(e) => setTargetCurrentPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-500 font-bold"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={targetNewPassword}
                    onChange={(e) => setTargetNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-500 font-bold"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={targetConfirmPassword}
                    onChange={(e) => setTargetConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-red-500 font-bold"
                  />
                </div>

                {systemPasswordSuccessMsg && (
                  <div className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/25 px-4 py-2.5 rounded-xl">
                    {systemPasswordSuccessMsg}
                  </div>
                )}
                {systemPasswordErrorMsg && (
                  <div className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/25 px-4 py-2.5 rounded-xl">
                    {systemPasswordErrorMsg}
                  </div>
                )}

                <button
                  onClick={async () => {
                    setSystemPasswordSuccessMsg('');
                    setSystemPasswordErrorMsg('');
                    const currentVal = targetCurrentPassword.trim();
                    const newVal = targetNewPassword.trim();
                    const confirmVal = targetConfirmPassword.trim();
                    
                    if (!currentVal || !newVal || !confirmVal) {
                      setSystemPasswordErrorMsg('All password fields are required.');
                      return;
                    }
                    if (newVal !== confirmVal) {
                      setSystemPasswordErrorMsg('New passwords do not match.');
                      return;
                    }
                    if (newVal.length < 6) {
                      setSystemPasswordErrorMsg('New password must be at least 6 characters.');
                      return;
                    }

                    try {
                      await changeAccountPassword(session.username, selectedTargetRole, currentVal, newVal);
                      setSystemPasswordSuccessMsg(`Password for ${selectedTargetRole} updated successfully!`);
                      setTargetCurrentPassword('');
                      setTargetNewPassword('');
                      setTargetConfirmPassword('');
                    } catch (err: any) {
                      setSystemPasswordErrorMsg(err.message || 'Failed to update password.');
                    }
                  }}
                  className="w-full rounded-2xl bg-red-600 hover:bg-red-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-premium"
                >
                  Update password for {selectedTargetRole}
                </button>
              </div>
            </div>

            {/* Outlets Control Section */}
            <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display text-2xl font-bold text-glow text-white">Outlets Management</h3>
                <button
                  onClick={() => {
                    setEditingOutlet(null);
                    setIsAddingSettingsOutlet(!isAddingSettingsOutlet);
                    // Reset fields
                    setSettingsOutletName('');
                    setSettingsOutletAddress('');
                    setSettingsOutletPhone('');
                    setSettingsOutletRadius('7');
                    setSettingsOutletFreeRadius('3');
                    setSettingsOutletMinOrder('150');
                    setSettingsOutletIncrementPerKm('0');
                    setSettingsOutletChargePerKm('15');
                    setSettingsOutletManager('');
                  }}
                  className="rounded-xl bg-red-650 hover:bg-red-600 text-white font-bold px-3 py-1.5 text-[10px] uppercase tracking-wider transition-premium active:scale-95"
                >
                  {isAddingSettingsOutlet || editingOutlet ? 'Cancel' : '➕ Add Outlet'}
                </button>
              </div>

              {/* Add/Edit Outlet Form */}
              {(isAddingSettingsOutlet || editingOutlet) && (
                <div className="mb-6 p-5 border border-white/10 bg-white/[0.04] rounded-3xl space-y-4 animate-slide-up text-xs">
                  <h4 className="text-sm font-bold text-red-300 uppercase tracking-widest">
                    {editingOutlet ? `Edit Outlet: ${editingOutlet.name}` : 'Create New Outlet Configuration'}
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Outlet Name</label>
                      <input type="text" placeholder="e.g. Malviya Nagar" value={settingsOutletName} onChange={e => setSettingsOutletName(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Phone Number</label>
                      <input type="text" placeholder="e.g. 9876543210" value={settingsOutletPhone} onChange={e => setSettingsOutletPhone(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Manager Name</label>
                      <input type="text" placeholder="e.g. Raj Sharma" value={settingsOutletManager} onChange={e => setSettingsOutletManager(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Address</label>
                    <input type="text" placeholder="e.g. Plot 15, Sector 3, Jaipur" value={settingsOutletAddress} onChange={e => setSettingsOutletAddress(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-5">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Latitude</label>
                      <input type="number" step="0.0001" value={settingsOutletLat} onChange={e => setSettingsOutletLat(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Longitude</label>
                      <input type="number" step="0.0001" value={settingsOutletLng} onChange={e => setSettingsOutletLng(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Del. Radius (km)</label>
                      <input type="number" value={settingsOutletRadius} onChange={e => setSettingsOutletRadius(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Free Radius (km)</label>
                      <input type="number" value={settingsOutletFreeRadius} onChange={e => setSettingsOutletFreeRadius(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Free Del. Min Order (Rs)</label>
                      <input type="number" value={settingsOutletMinOrder} onChange={e => setSettingsOutletMinOrder(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Delivery Charge Per Km (Rs)</label>
                      <input type="number" value={settingsOutletChargePerKm} onChange={e => setSettingsOutletChargePerKm(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Min Order Increment Per Km (Rs)</label>
                      <input type="number" value={settingsOutletIncrementPerKm} onChange={e => setSettingsOutletIncrementPerKm(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setIsAddingSettingsOutlet(false);
                        setEditingOutlet(null);
                      }}
                      className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-white/5 text-slate-400 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        const nameVal = settingsOutletName.trim();
                        const phoneVal = settingsOutletPhone.trim();
                        if (!nameVal || !phoneVal) {
                          alert('Name and Phone are required.');
                          return;
                        }
                        const newOutlet: OutletConfig = {
                          id: editingOutlet ? editingOutlet.id : `outlet_${Date.now()}`,
                          enabled: editingOutlet ? editingOutlet.enabled : true,
                          name: nameVal,
                          address: settingsOutletAddress.trim() || undefined,
                          phone: phoneVal,
                          latitude: parseFloat(settingsOutletLat) || 26.85,
                          longitude: parseFloat(settingsOutletLng) || 75.80,
                          deliveryRadiusKm: parseFloat(settingsOutletRadius) || 7,
                          freeDeliveryRadiusKm: parseFloat(settingsOutletFreeRadius) || 3,
                          freeDeliveryMinimumOrder: parseFloat(settingsOutletMinOrder) || 150,
                          minimumOrderIncrementPerKm: parseFloat(settingsOutletIncrementPerKm) || 0,
                          deliveryChargePerKm: parseFloat(settingsOutletChargePerKm) || 15,
                          managerName: settingsOutletManager.trim() || undefined,
                        };
                        try {
                          await saveOutletToServer(newOutlet);
                          alert(editingOutlet ? 'Outlet updated successfully.' : 'Outlet created successfully.');
                          setIsAddingSettingsOutlet(false);
                          setEditingOutlet(null);
                          refresh();
                        } catch {
                          alert('Failed to save outlet.');
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase bg-green-700 hover:bg-green-600 text-white"
                    >
                      {editingOutlet ? 'Update Outlet' : 'Create Outlet'}
                    </button>
                  </div>
                </div>
              )}

              {/* Outlets Listing & Open/Close Toggle, Edit, and Remove */}
              <div className="space-y-3">
                {outlets.map((outlet) => {
                  return (
                    <div key={outlet.id} className="flex justify-between items-center p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
                      <div>
                        <span className="text-sm font-bold text-white block">{outlet.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{outlet.phone} {outlet.address ? `• ${outlet.address}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest mr-2 ${outlet.enabled ? 'text-green-400' : 'text-red-400'}`}>
                          {outlet.enabled ? '🟢 OPEN' : '🔴 CLOSED'}
                        </span>
                        <button
                          onClick={async () => {
                            const updated = { ...outlet, enabled: !outlet.enabled };
                            try {
                              await saveOutletToServer(updated);
                              refresh();
                            } catch {
                              alert('Failed to update outlet status.');
                            }
                          }}
                          className={`rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-premium ${
                            outlet.enabled
                              ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/25'
                              : 'bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/25'
                          }`}
                        >
                          {outlet.enabled ? 'Close' : 'Open'}
                        </button>
                        <button
                          onClick={() => {
                            setEditingOutlet(outlet);
                            setIsAddingSettingsOutlet(false);
                            setSettingsOutletName(outlet.name);
                            setSettingsOutletAddress(outlet.address || '');
                            setSettingsOutletPhone(outlet.phone);
                            setSettingsOutletLat(String(outlet.latitude));
                            setSettingsOutletLng(String(outlet.longitude));
                            setSettingsOutletRadius(String(outlet.deliveryRadiusKm));
                            setSettingsOutletFreeRadius(String(outlet.freeDeliveryRadiusKm));
                            setSettingsOutletMinOrder(String(outlet.freeDeliveryMinimumOrder));
                            setSettingsOutletIncrementPerKm(String(outlet.minimumOrderIncrementPerKm || 0));
                            setSettingsOutletChargePerKm(String(outlet.deliveryChargePerKm));
                            setSettingsOutletManager(outlet.managerName || '');
                          }}
                          className="rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-blue-500/30 text-blue-300 hover:bg-blue-500/25 bg-blue-500/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to remove outlet "${outlet.name}"? This cannot be undone.`)) {
                              return;
                            }
                            try {
                              await deleteOutletFromServer(outlet.id);
                              alert('Outlet deleted successfully.');
                              refresh();
                            } catch {
                              alert('Failed to delete outlet.');
                            }
                          }}
                          className="rounded-xl px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-red-650/40 text-red-400 hover:bg-red-650/25 bg-red-650/10"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
                {outlets.length === 0 && (
                  <div className="text-xs text-slate-550 bg-white/5 border border-white/5 p-4 rounded-2xl font-bold text-center">
                    No outlets configured yet.
                  </div>
                )}
              </div>
            </div>
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
