import React, { useMemo } from 'react';
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
    return (
      <div className="p-4 text-slate-500 font-bold text-sm">
        Forbidden: Analytics restricted to managers and admins.
      </div>
    );
  }

  // Defensive date parsing helper
  const parseOrderDate = (o: Order): Date => {
    if (!o) return new Date();
    const d: any = o.receivedAt || o.date;
    if (!d) return new Date();
    if (typeof d.toDate === 'function') return d.toDate();
    if (d.seconds) return new Date(d.seconds * 1000);
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const nonCancelledOrders = useMemo(() => {
    return orders.filter((o) => o.status !== 'cancelled' && !o.isDeleted);
  }, [orders]);

  // Overall calculations
  const totalRevenue = useMemo(() => {
    return nonCancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [nonCancelledOrders]);

  const averageOrderValue = useMemo(() => {
    if (nonCancelledOrders.length === 0) return 0;
    return totalRevenue / nonCancelledOrders.length;
  }, [nonCancelledOrders, totalRevenue]);

  const today = new Date().toDateString();
  const todayOrders = useMemo(() => {
    return nonCancelledOrders.filter((o) => parseOrderDate(o).toDateString() === today);
  }, [nonCancelledOrders, today]);

  const todayRevenue = useMemo(() => {
    return todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [todayOrders]);

  // Monthly breakdown for the last 6 months
  const monthlyRevenueData = useMemo(() => {
    const revs: Record<string, { year: number; monthIndex: number; label: string; revenue: number }> = {};
    
    nonCancelledOrders.forEach((o) => {
      const orderDate = parseOrderDate(o);
      const year = orderDate.getFullYear();
      const monthIndex = orderDate.getMonth();
      const label = orderDate.toLocaleString('default', { month: 'short', year: '2-digit' });
      const key = `${year}-${monthIndex.toString().padStart(2, '0')}`;

      if (!revs[key]) {
        revs[key] = { year, monthIndex, label, revenue: 0 };
      }
      revs[key].revenue += o.total || 0;
    });

    const sortedData = Object.entries(revs)
      .map(([_, val]) => val)
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthIndex - b.monthIndex;
      })
      .slice(-6); // last 6 months

    return sortedData;
  }, [nonCancelledOrders]);

  // MoM growth calculation
  const growthMetrics = useMemo(() => {
    if (monthlyRevenueData.length < 2) {
      return { growthPercentage: 0, text: 'Insufficient historical data', isPositive: true };
    }
    const current = monthlyRevenueData[monthlyRevenueData.length - 1].revenue;
    const previous = monthlyRevenueData[monthlyRevenueData.length - 2].revenue;

    if (previous === 0) {
      return { growthPercentage: 100, text: 'New Sales Month', isPositive: true };
    }

    const growth = ((current - previous) / previous) * 100;
    return {
      growthPercentage: Math.abs(growth),
      text: `${growth >= 0 ? '+' : '-'}${Math.abs(growth).toFixed(1)}% compared to last month`,
      isPositive: growth >= 0,
    };
  }, [monthlyRevenueData]);

  // Top Products calculations
  const topProducts = useMemo(() => {
    const counts: Record<string, { quantity: number; revenue: number }> = {};
    nonCancelledOrders.forEach((o) => {
      o.items?.forEach((item) => {
        if (!counts[item.name]) {
          counts[item.name] = { quantity: 0, revenue: 0 };
        }
        counts[item.name].quantity += item.quantity || 1;
        // Estimate line revenue if unit price is missing, fallback to menu item price
        const lineTotal = item.totalPrice || (item.price || 0) * (item.quantity || 1);
        counts[item.name].revenue += lineTotal;
      });
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [nonCancelledOrders]);

  const maxProductQty = useMemo(() => {
    return Math.max(...topProducts.map((p) => p.quantity), 1);
  }, [topProducts]);

  // Outlet sales breakdown
  const outletSales = useMemo(() => {
    const sales: Record<string, { revenue: number; ordersCount: number }> = {};
    nonCancelledOrders.forEach((o) => {
      const oName = o.outletName || "Harino's Main Outlet";
      if (!sales[oName]) sales[oName] = { revenue: 0, ordersCount: 0 };
      sales[oName].revenue += o.total || 0;
      sales[oName].ordersCount += 1;
    });
    return Object.entries(sales).map(([name, data]) => ({ name, ...data }));
  }, [nonCancelledOrders]);

  // High demand per category
  const highDemandPerCategory = useMemo(() => {
    const categorySales: Record<string, Record<string, number>> = {};
    nonCancelledOrders.forEach((o) => {
      o.items?.forEach((item) => {
        const cat = item.category || 'Pizza';
        if (!categorySales[cat]) categorySales[cat] = {};
        categorySales[cat][item.name] = (categorySales[cat][item.name] || 0) + (item.quantity || 1);
      });
    });

    return Object.entries(categorySales).map(([category, itemSales]) => {
      const topItem = Object.entries(itemSales).sort((a, b) => b[1] - a[1])[0];
      return {
        category,
        itemName: topItem ? topItem[0] : 'None',
        quantity: topItem ? topItem[1] : 0,
      };
    });
  }, [nonCancelledOrders]);

  // SVG Area Chart points builder
  const chartPoints = useMemo(() => {
    if (monthlyRevenueData.length === 0) return { linePath: '', areaPath: '', coords: [] };
    const maxVal = Math.max(...monthlyRevenueData.map((d) => d.revenue), 1);

    const width = 500;
    const height = 160;
    const padding = 20;

    const coords = monthlyRevenueData.map((d, index) => {
      const x = padding + (index / Math.max(monthlyRevenueData.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (d.revenue / maxVal) * (height - padding * 2);
      return { x, y, revenue: d.revenue, label: d.label };
    });

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const areaPath = coords.length > 0 
      ? `${linePath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`
      : '';

    return { linePath, areaPath, coords };
  }, [monthlyRevenueData]);

  const handleCompressDatabase = async () => {
    if (
      !window.confirm(
        'Are you sure you want to compress and archive all orders older than 1 year? This action consolidation consolidated sales records and deletes individual old orders from Firestore to free up storage space. This cannot be undone.'
      )
    ) {
      return;
    }
    try {
      const res = await compressYearlySalesSummary();
      if (res.success) {
        alert(
          `Database archive completed successfully!\nconsolidated and deleted ${res.deletedCount} old orders.\nSummary ID: ${res.summaryId}`
        );
      } else {
        alert('Database clean finished, but no orders were older than 1 year.');
      }
    } catch (err: any) {
      alert(`Error running database cleanup: ${err.message || err}`);
    }
  };

  const isAdmin = session.role === 'admin';

  return (
    <section className="relative mx-auto max-w-6xl p-4 animate-fade-in space-y-6 text-white">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Business Intelligence</p>
        <h3 className="font-display text-2xl font-bold font-black text-white">Dashboard & Growth Analytics</h3>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Total Revenue</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(totalRevenue)}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-between">
            <span>Average Order Value:</span>
            <span className="text-slate-200 font-black">Rs {Math.round(averageOrderValue)}</span>
          </div>
        </div>

        {/* Growth MoM */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-purple-400">Growth Rate (MoM)</div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className={`text-2xl font-black ${growthMetrics.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {growthMetrics.isPositive ? '📈 +' : '📉 -'}
                {growthMetrics.growthPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 truncate">
            {growthMetrics.text}
          </div>
        </div>

        {/* Today's Sales */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-orange-400">Today's Revenue</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(todayRevenue)}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2">
            Processed {todayOrders.length} orders today
          </div>
        </div>

        {/* Registered customers */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">Firm Size</div>
            <div className="mt-2 text-2xl font-black text-white">{customers.length} Customers</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2">
            Across {orders.length} total orders
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Premium SVG Area Trend Chart */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="font-display font-black text-base text-emerald-400 uppercase tracking-wider mb-2">📈 Growth & Sales Trend</h4>
            <p className="text-[10px] text-slate-400">Visualizing monthly revenue trends over the last 6 months.</p>
          </div>
          
          <div className="relative mt-4 w-full h-44 bg-slate-900/60 rounded-2xl border border-white/5 p-2 flex items-center justify-center">
            {monthlyRevenueData.length > 0 ? (
              <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* Filled Gradient Area */}
                {chartPoints.areaPath && (
                  <path d={chartPoints.areaPath} fill="url(#areaGradient)" />
                )}

                {/* Main Trend Line */}
                {chartPoints.linePath && (
                  <path d={chartPoints.linePath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {/* Hotspot Markers */}
                {chartPoints.coords.map((c, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle cx={c.x} cy={c.y} r="5" fill="#10b981" className="transition-all group-hover:r-7" />
                    <circle cx={c.x} cy={c.y} r="8" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" className="animate-ping" />
                    <text x={c.x} y={c.y - 12} textAnchor="middle" className="text-[9px] font-black fill-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Rs {Math.round(c.revenue)}
                    </text>
                    <text x={c.x} y="156" textAnchor="middle" className="text-[8px] font-black fill-slate-500">
                      {c.label}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-xs text-slate-500">No sales transactions available to chart.</div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-black text-base text-red-500 uppercase tracking-wider mb-3">🔥 Top Selling Products</h4>
            <div className="space-y-3.5">
              {topProducts.map((p, idx) => {
                const percentage = (p.quantity / maxProductQty) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-200">{p.name}</span>
                      <span className="text-slate-400 text-[10px]">{p.quantity} units (Rs {Math.round(p.revenue)})</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
              {topProducts.length === 0 && <div className="text-xs text-slate-500 py-10 text-center">No sales logged yet.</div>}
            </div>
          </div>
          <div className="text-[9px] text-slate-500 font-bold mt-4">Growth rank determined by quantities sold</div>
        </div>

        {/* High Demand Per Category */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md md:col-span-2">
          <h4 className="font-display font-black text-base text-purple-400 uppercase tracking-wider mb-4">⭐ High Performance Items Per Category</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highDemandPerCategory.map(({ category, itemName, quantity }) => (
              <div key={category} className="p-4 rounded-2xl bg-slate-900/35 border border-white/5 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-purple-400">{category}</div>
                  <div className="mt-1 text-xs font-bold text-slate-200 truncate">{itemName}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-2">{quantity} units ordered</div>
              </div>
            ))}
            {highDemandPerCategory.length === 0 && (
              <div className="col-span-3 text-xs text-slate-500 py-8 text-center">No category metrics computed.</div>
            )}
          </div>
        </div>

        {/* Outlet Breakdown */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md md:col-span-2">
          <h4 className="font-display font-black text-base text-amber-500 uppercase tracking-wider mb-4">🏢 Outlet Performance Breakdown</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {outletSales.map((outlet, idx) => (
              <div key={idx} className="flex flex-col p-4 rounded-2xl bg-slate-900/35 border border-white/5 justify-between">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">{outlet.name}</span>
                  <span className="text-emerald-400 font-black">Rs {Math.round(outlet.revenue)}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-2">{outlet.ordersCount} orders processed</div>
              </div>
            ))}
            {outletSales.length === 0 && (
              <div className="col-span-2 text-xs text-slate-500 py-8 text-center font-bold">No outlet performance logged.</div>
            )}
          </div>
        </div>

        {/* Database cleanup utility (Admin only) */}
        {isAdmin && (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-950/10 p-5 shadow-2xl backdrop-blur-md md:col-span-2 space-y-3.5">
            <div>
              <h4 className="font-display font-black text-base text-red-400 uppercase tracking-wider">⚙️ Database Maintenance & Archival</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Archival consolidating raw transaction documents older than 1 year into a single yearly summary document, then removing raw data from Firestore to save cloud compute costs.
              </p>
            </div>
            
            <button
              onClick={handleCompressDatabase}
              className="px-6 py-3.5 bg-red-650 hover:bg-red-550 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/10 cursor-pointer"
            >
              Run Database Cleanup
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
