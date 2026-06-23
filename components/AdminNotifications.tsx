import React, { useEffect, useState } from 'react';
import { getNotificationDashboardData, NotificationDashboardData, NotificationStats } from '../services/orderApi';

export const AdminNotifications: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<NotificationDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? (Notification?.permission || 'default') : 'default'
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNotificationDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notification stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayStats: NotificationStats = dashboardData?.stats?.find(d => d.date === todayStr) || {
    date: todayStr,
    sent: 0,
    failed: 0,
    removedTokens: 0,
    updatedAt: ''
  };

  const totalDevices = dashboardData?.totalDevices || 0;
  const sentToday = todayStats.sent || 0;
  const failedToday = todayStats.failed || 0;
  const removedToday = todayStats.removedTokens || 0;

  // Firebase Quota Estimation Calculations
  const estimatedReads = sentToday + failedToday + totalDevices;
  const estimatedWrites = (sentToday > 0 || failedToday > 0) ? 1 : 0;
  const estimatedDeletes = removedToday;

  // Monthly projections based on historical logs
  const statsList = dashboardData?.stats || [];
  const avgSent = statsList.length ? statsList.reduce((acc, s) => acc + (s.sent || 0), 0) / statsList.length : sentToday;
  const avgFailed = statsList.length ? statsList.reduce((acc, s) => acc + (s.failed || 0), 0) / statsList.length : failedToday;
  const avgRemoved = statsList.length ? statsList.reduce((acc, s) => acc + (s.removedTokens || 0), 0) / statsList.length : removedToday;

  const projectedReads = (avgSent + avgFailed + totalDevices) * 30;
  const projectedWrites = 30;
  const projectedDeletes = avgRemoved * 30;

  // Cost estimates: Reads $0.06/100k, Writes $0.18/100k, Deletes $0.02/100k
  const readsCost = (projectedReads * 0.06) / 100000;
  const writesCost = (projectedWrites * 0.18) / 100000;
  const deletesCost = (projectedDeletes * 0.02) / 100000;
  const totalCost = readsCost + writesCost + deletesCost;

  return (
    <div className="mx-auto max-w-6xl px-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-glow text-white">FCM Delivery Center</h2>
          <p className="text-slate-400 text-xs font-medium mt-1">Real-time push delivery metrics, unregistered token pruning logs, and estimated database quota impact.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-xs font-black uppercase tracking-widest text-slate-200 transition-premium"
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Browser Notification Controls */}
      <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl mb-6 text-white text-left">
        <h3 className="font-display text-xl font-bold mb-2 text-white">Browser Push Notification Controls</h3>
        <p className="text-slate-400 text-xs font-medium mb-4">Request authorization and test desktop push alerts for Orders and Offers directly in this browser.</p>
        
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Browser Permission Status</div>
            <div className="mt-1 text-sm font-bold flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                notificationPermission === 'granted' ? 'bg-green-500' : notificationPermission === 'denied' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <span className="capitalize">{notificationPermission}</span>
            </div>
          </div>
          
          {notificationPermission !== 'granted' && (
            <button
              onClick={async () => {
                if ('Notification' in window) {
                  const res = await Notification.requestPermission();
                  setNotificationPermission(res);
                  alert(`Notification permission: ${res}`);
                } else {
                  alert('This browser does not support notifications.');
                }
              }}
              className="rounded-xl bg-gradient-premium py-2.5 px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/30 hover:scale-[1.01] transition-transform active:scale-95"
            >
              🔔 Request Permission
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-red-300 mb-2">🍕 Order Notifications</h4>
            <p className="text-[11px] text-slate-400 font-medium mb-3">Simulate a browser desktop alert when a customer places a new pizza order.</p>
            <button
              onClick={() => {
                if (Notification.permission !== 'granted') {
                  alert('Please grant notification permission first.');
                  return;
                }
                new Notification('🍕 New Order Received', {
                  body: 'Order #HRN-892 from Rahul Sharma - Rs 549 (Dine-In)',
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  tag: 'order-simulation-test',
                });
              }}
              className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 py-2.5 text-[10px] font-black uppercase tracking-widest transition-premium"
            >
              Simulate Order Alert
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-300 mb-2">🎉 Offer Notifications</h4>
            <p className="text-[11px] text-slate-400 font-medium mb-3">Simulate a browser desktop alert when a new discount code or offer goes live.</p>
            <button
              onClick={() => {
                if (Notification.permission !== 'granted') {
                  alert('Please grant notification permission first.');
                  return;
                }
                new Notification('🎉 New Offer Released', {
                  body: 'Midweek Dhamaka: Get 20% off on all Medium Pizzas! Use code: MIDWEEK20',
                  icon: '/icon-192.png',
                  badge: '/icon-192.png',
                  tag: 'offer-simulation-test',
                });
              }}
              className="w-full rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 py-2.5 text-[10px] font-black uppercase tracking-widest transition-premium"
            >
              Simulate Offer Alert
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400 font-bold">Loading dashboard data...</div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6 text-center text-red-300 font-bold mb-6">{error}</div>
      ) : (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Registered Devices */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-xl backdrop-blur-xl">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-blue-500" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registered Devices</div>
              <div className="mt-2 text-4xl font-extrabold text-white">{totalDevices}</div>
              <p className="text-[9px] text-slate-400 font-bold mt-2">Active push token channels</p>
            </div>

            {/* Sent Today */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-xl backdrop-blur-xl">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-emerald-500" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Delivered Today</div>
              <div className="mt-2 text-4xl font-extrabold text-white">{sentToday}</div>
              <p className="text-[9px] text-slate-400 font-bold mt-2">Successful FCM dispatches</p>
            </div>

            {/* Failed Today */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-xl backdrop-blur-xl">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-amber-500" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dispatch Failures</div>
              <div className="mt-2 text-4xl font-extrabold text-white">{failedToday}</div>
              <p className="text-[9px] text-slate-400 font-bold mt-2">Unsent payload attempts</p>
            </div>

            {/* Tokens Pruned */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 p-6 shadow-xl backdrop-blur-xl">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-red-500" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tokens Pruned</div>
              <div className="mt-2 text-4xl font-extrabold text-white">{removedToday}</div>
              <p className="text-[9px] text-slate-400 font-bold mt-2">Expired/unregistered deleted</p>
            </div>
          </div>

          {/* Quota & Cost Impact */}
          <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl text-left">
            <h3 className="font-display text-xl font-bold mb-4 text-white">Estimated Firestore Quota Impact (FCM Pipeline)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Est. Today's Reads</div>
                <div className="mt-1 text-xl font-bold text-white">{estimatedReads}</div>
                <div className="mt-2 text-[10px] text-slate-400">Tokens + stats queries</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Est. Today's Writes</div>
                <div className="mt-1 text-xl font-bold text-white">{estimatedWrites}</div>
                <div className="mt-2 text-[10px] text-slate-400">Stats logs increment</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Est. Today's Deletes</div>
                <div className="mt-1 text-xl font-bold text-white">{estimatedDeletes}</div>
                <div className="mt-2 text-[10px] text-slate-400">Pruned bad registration docs</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20">
                <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">Est. Blended monthly cost</div>
                <div className="mt-1 text-2xl font-black text-blue-400">${totalCost.toFixed(3)}</div>
                <div className="mt-2 text-[10px] text-slate-500">Free under Spark daily limit</div>
              </div>
            </div>
          </div>

          {/* Historical Logs List */}
          <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-xl backdrop-blur-xl text-left">
            <h3 className="font-display text-lg font-bold mb-4 text-white">FCM Delivery Log History</h3>
            <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
              {statsList.map((doc, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <span className="text-slate-400 font-bold">{doc.date}</span>
                  <span className="text-slate-200">
                    Delivered: <b className="text-emerald-400">{doc.sent}</b> | Failures: <b className="text-amber-400">{doc.failed}</b> | Pruned: <b className="text-red-400">{doc.removedTokens || 0}</b>
                  </span>
                </div>
              ))}
              {statsList.length === 0 && (
                <div className="text-slate-500 text-xs text-center py-8">No historical delivery logs yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
