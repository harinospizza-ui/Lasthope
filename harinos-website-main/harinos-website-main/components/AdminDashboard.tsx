import React from 'react';
import { Order, CustomerProfile, AdminSession } from '../types';
import { compressYearlySalesSummary } from '../services/orderApi';

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

  // Monthly Sales Revenue
  const monthlyRevenue = React.useMemo(() => {
    const revs: Record<string, number> = {};
    nonCancelledOrders.forEach((o) => {
      const orderDate = o.receivedAt ? new Date(o.receivedAt) : new Date(o.date);
      if (isNaN(orderDate.getTime())) return;
      const key = orderDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      revs[key] = (revs[key] || 0) + (o.total || 0);
    });
    
    return Object.entries(revs)
      .map(([month, rev]) => ({ month, rev }))
      .sort((a, b) => Date.parse(`1 ${a.month}`) - Date.parse(`1 ${b.month}`))
      .slice(-6); // last 6 months
  }, [nonCancelledOrders]);

  const maxRevenue = React.useMemo(() => {
    return Math.max(...monthlyRevenue.map((m) => m.rev), 1);
  }, [monthlyRevenue]);

  // High demand per category
  const highDemandPerCategory = React.useMemo(() => {
    const categorySales: Record<string, Record<string, number>> = {};
    nonCancelledOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.category || 'Pizza';
        if (!categorySales[cat]) categorySales[cat] = {};
        categorySales[cat][item.name] = (categorySales[cat][item.name] || 0) + (item.quantity || 1);
      });
    });

    return Object.entries(categorySales).map(([category, itemSales]) => {
      const topItem = Object.entries(itemSales)
        .sort((a, b) => b[1] - a[1])[0];
      return {
        category,
        itemName: topItem ? topItem[0] : 'None',
        quantity: topItem ? topItem[1] : 0
      };
    });
  }, [nonCancelledOrders]);

  const handleCompressDatabase = async () => {
    if (!window.confirm("Are you sure you want to compress and archive all orders older than 1 year? This action will permanently delete raw orders older than 1 year from Firestore to save storage space and cannot be undone.")) {
      return;
    }
    try {
      const res = await compressYearlySalesSummary();
      if (res.success) {
        alert(`Database archive & cleanup completed successfully!\nConsolidated and permanently deleted ${res.deletedCount} old orders.\nSummary ID: ${res.summaryId}`);
      } else {
        alert('Database clean utility finished, but no orders were older than 1 year.');
      }
    } catch (err: any) {
      alert(`Error running cleanup: ${err.message || err}`);
    }
  };

  const isAdmin = session.role === 'admin';

  return (
    <section className="relative mx-auto max-w-6xl p-4 animate-fade-in space-y-6 text-white">
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
        {/* Monthly Sales CSS Bar Chart */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl flex flex-col justify-between min-h-[300px]">
          <h4 className="font-display font-bold text-lg text-emerald-300">📊 Monthly Sales Comparison</h4>
          <div className="flex items-end justify-between h-48 pt-6 px-4 bg-slate-950/30 rounded-2xl border border-white/5 mt-3">
            {monthlyRevenue.map(({ month, rev }) => {
              const pct = (rev / maxRevenue) * 100;
              return (
                <div key={month} className="flex flex-col items-center flex-1 group">
                  <div className="text-[9px] font-black text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    Rs {Math.round(rev)}
                  </div>
                  <div 
                    style={{ height: `${Math.max(pct, 5)}%` }} 
                    className="w-8 sm:w-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:brightness-110 relative cursor-pointer"
                  />
                  <div className="text-[10px] text-slate-400 font-bold mt-2">
                    {month}
                  </div>
                </div>
              );
            })}
            {monthlyRevenue.length === 0 && <div className="text-sm text-slate-500 w-full text-center pb-16">No monthly sales data yet.</div>}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl flex flex-col justify-between">
          <div>
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
          <div className="text-[10px] text-slate-500 font-bold mt-4">Calculated from completed and active orders</div>
        </div>

        {/* High Demand Per Category */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl md:col-span-2">
          <h4 className="font-display font-bold text-lg mb-4 text-purple-300">⭐ High Demand Items Per Category</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highDemandPerCategory.map(({ category, itemName, quantity }) => (
              <div key={category} className="p-4 rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">{category}</div>
                  <div className="mt-1 text-sm font-bold text-slate-200">{itemName}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-2">{quantity} units ordered</div>
              </div>
            ))}
            {highDemandPerCategory.length === 0 && <div className="text-sm text-slate-500">No category performance data yet.</div>}
          </div>
        </div>

        {/* Outlet Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-xl md:col-span-2">
          <h4 className="font-display font-bold text-lg mb-4 text-amber-300">🏢 Outlet Sales Breakdown</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(outletSales).map(([name, stats], idx) => (
              <div key={idx} className="flex flex-col p-4 rounded-2xl bg-slate-900/30 border border-white/5 justify-between">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-200">{name}</span>
                  <span className="text-emerald-400 font-black">Rs {Math.round(stats.revenue)}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-2">{stats.ordersCount} orders processed</div>
              </div>
            ))}
            {Object.keys(outletSales).length === 0 && <div className="text-sm text-slate-500">No outlet data.</div>}
          </div>
        </div>

        {/* Database cleanup utility (Admin only) */}
        {isAdmin && (
          <div className="rounded-3xl border border-red-500/20 bg-red-950/10 p-5 shadow-xl md:col-span-2 space-y-4">
            <div>
              <h4 className="font-display font-bold text-lg text-red-400">⚙️ Database Maintenance & Compression</h4>
              <p className="text-xs text-slate-400 mt-1">
                Compress yearly data: consolidation of orders older than 1 year into a yearly summary document, and permanent deletion of individual raw orders to optimize database storage.
              </p>
            </div>
            
            <button
              onClick={handleCompressDatabase}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-premium active:scale-95 shadow-lg shadow-red-500/10 cursor-pointer"
            >
              Archive & Clean Database
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
