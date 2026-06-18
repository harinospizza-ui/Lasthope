import React from 'react';
import { Order, CustomerProfile, AdminSession } from '../types';

interface AdminDashboardProps {
  session: AdminSession;
  orders: Order[];
  customers: CustomerProfile[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  orders,
  customers,
}) => {
  if (session.role === 'staff') {
    return <div className="p-4 text-slate-500 font-bold text-sm">Forbidden: Analytics restricted to managers and admins.</div>;
  }

  // Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled' && !o.isDeleted);
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  
  const today = new Date().toDateString();
  const todayOrders = nonCancelledOrders.filter(o => new Date(o.receivedAt || o.date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Top Products Count
  const productSalesCount: Record<string, number> = {};
  nonCancelledOrders.forEach((o) => {
    o.items?.forEach((item) => {
      productSalesCount[item.name] = (productSalesCount[item.name] || 0) + (item.quantity || 1);
    });
  });
  const topProducts = Object.entries(productSalesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Outlet Performance
  const outletSales: Record<string, { revenue: number; ordersCount: number }> = {};
  nonCancelledOrders.forEach((o) => {
    const oName = o.outletName || 'Main Outlet';
    if (!outletSales[oName]) outletSales[oName] = { revenue: 0, ordersCount: 0 };
    outletSales[oName].revenue += o.total || 0;
    outletSales[oName].ordersCount += 1;
  });

  return (
    <section className="relative mx-auto max-w-6xl p-4 animate-fade-in space-y-6">
      <h3 className="font-display text-2xl font-bold font-black text-white">Business Analytics & Performance</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Total Revenue</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(totalRevenue)}</div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-2">All outlets combined</div>
        </div>

        {/* Today's Sales */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-400">Today's Revenue</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(todayRevenue)}</div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-2">{todayOrders.length} orders today</div>
        </div>

        {/* Orders Count */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">Total Orders</div>
            <div className="mt-2 text-2xl font-black text-white">{nonCancelledOrders.length}</div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-2">Active orders only</div>
        </div>

        {/* Total Customers */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Total Customers</div>
            <div className="mt-2 text-2xl font-black text-white">{customers.length}</div>
          </div>
          <div className="text-[10px] text-slate-500 font-bold mt-2">Registered profiles</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl">
          <h4 className="font-display font-bold text-lg mb-4 text-red-300">🔥 Top Selling Dishes</h4>
          <div className="space-y-3">
            {topProducts.map(([name, qty], idx) => (
              <div key={idx} className="flex justify-between items-center text-sm font-semibold border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-200">{name}</span>
                <span className="bg-red-650/25 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-black">{qty} sold</span>
              </div>
            ))}
            {topProducts.length === 0 && <div className="text-sm text-slate-500">No sales data yet.</div>}
          </div>
        </div>

        {/* Outlet Performance */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl">
          <h4 className="font-display font-bold text-lg mb-4 text-amber-300">🏢 Outlet Sales Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(outletSales).map(([name, stats], idx) => (
              <div key={idx} className="flex flex-col border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-200">{name}</span>
                  <span className="text-emerald-400 font-black">Rs {Math.round(stats.revenue)}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">{stats.ordersCount} orders processed</div>
              </div>
            ))}
            {Object.keys(outletSales).length === 0 && <div className="text-sm text-slate-500">No outlet data.</div>}
          </div>
        </div>
      </div>
    </section>
  );
};
