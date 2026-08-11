import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseClient';
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

  // State hooks for date range selection
  const [dateRange, setDateRange] = useState<string>('last_7_days');
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync dates when presets are clicked
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let start = todayStr;

    if (dateRange === 'today') {
      start = todayStr;
    } else if (dateRange === 'yesterday') {
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      start = yest.toISOString().slice(0, 10);
      setStartDate(start);
      setEndDate(start);
      return;
    } else if (dateRange === 'last_7_days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      start = d.toISOString().slice(0, 10);
    } else if (dateRange === 'last_30_days') {
      const d = new Date();
      d.setDate(d.getDate() - 29);
      start = d.toISOString().slice(0, 10);
    } else if (dateRange === 'this_month') {
      const d = new Date();
      d.setDate(1);
      start = d.toISOString().slice(0, 10);
    } else if (dateRange === 'custom') {
      return;
    }

    setStartDate(start);
    setEndDate(todayStr);
  }, [dateRange]);

  // Fetch daily stats from Firestore when dates change
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db(), 'dailySalesStats'),
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
        const snap = await getDocs(q);
        const docsList = snap.docs.map(docDoc => docDoc.data());
        setStats(docsList);
      } catch (err) {
        console.warn('Failed to fetch daily sales stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [startDate, endDate]);

  // Unified metrics computation
  const computedMetrics = useMemo(() => {
    // If stats are available in Firestore, compile from stats docs
    if (stats.length > 0) {
      let totalSales = 0;
      let netSales = 0;
      let orderCount = 0;
      let cancelledCount = 0;
      let cancelledValue = 0;
      let cashSales = 0;
      let onlineSales = 0;
      let deliveryCount = 0;
      let takeawayCount = 0;
      let dineinCount = 0;
      let discountsGiven = 0;
      let deliveryFeesCollected = 0;
      const productCounts: Record<string, { quantity: number; revenue: number }> = {};

      stats.forEach(s => {
        totalSales += s.totalSales ?? 0;
        netSales += s.netSales ?? 0;
        orderCount += s.orderCount ?? 0;
        cancelledCount += s.cancelledCount ?? 0;
        cancelledValue += s.cancelledValue ?? 0;
        cashSales += s.cashSales ?? 0;
        onlineSales += s.onlineSales ?? 0;
        deliveryCount += s.deliveryCount ?? 0;
        takeawayCount += s.takeawayCount ?? 0;
        dineinCount += s.dineinCount ?? 0;
        discountsGiven += s.discountsGiven ?? 0;
        deliveryFeesCollected += s.deliveryFeesCollected ?? 0;

        if (s.topProducts) {
          Object.entries(s.topProducts).forEach(([pid, qty]: [string, any]) => {
            if (!productCounts[pid]) {
              productCounts[pid] = { quantity: 0, revenue: 0 };
            }
            productCounts[pid].quantity += qty;
          });
        }
      });

      const topProductsList = Object.entries(productCounts)
        .map(([pid, data]) => {
          let name = pid;
          orders.forEach(o => {
            const item = o.items?.find(it => it.id === pid);
            if (item) name = item.name;
          });
          return { name, ...data };
        })
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return {
        totalRevenue: totalSales,
        netSales,
        averageOrderValue: orderCount > 0 ? totalSales / orderCount : 0,
        orderCount,
        cancelledCount,
        cancelledValue,
        cashSales,
        onlineSales,
        deliveryCount,
        takeawayCount,
        dineinCount,
        discountsGiven,
        deliveryFeesCollected,
        topProducts: topProductsList
      };
    }

    // FALLBACK: Compute dynamically from passed orders array
    const rangeOrders = orders.filter(o => {
      if (o.isDeleted) return false;
      const oDate = parseOrderDate(o).toISOString().slice(0, 10);
      return oDate >= startDate && oDate <= endDate;
    });

    const nonCancelled = rangeOrders.filter(o => o.status !== 'cancelled');
    const totalRev = nonCancelled.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgOrderVal = nonCancelled.length > 0 ? totalRev / nonCancelled.length : 0;

    const cashVal = nonCancelled.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.total || 0), 0);
    const onlineVal = totalRev - cashVal;

    const delCount = nonCancelled.filter(o => o.orderType === 'delivery').length;
    const takeCount = nonCancelled.filter(o => o.orderType === 'takeaway').length;
    const dineCount = nonCancelled.filter(o => o.orderType === 'dinein').length;

    const disVal = nonCancelled.reduce((sum, o) => sum + (o.discount ?? 0), 0);
    const feeVal = nonCancelled.reduce((sum, o) => sum + (o.deliveryFee ?? 0), 0);

    const cancelled = rangeOrders.filter(o => o.status === 'cancelled');
    const cancelVal = cancelled.reduce((sum, o) => sum + (o.total || 0), 0);

    const counts: Record<string, { quantity: number; revenue: number }> = {};
    nonCancelled.forEach(o => {
      o.items?.forEach(item => {
        if (!counts[item.name]) {
          counts[item.name] = { quantity: 0, revenue: 0 };
        }
        counts[item.name].quantity += item.quantity || 1;
        const lineTotal = item.totalPrice || (item.price || 0) * (item.quantity || 1);
        counts[item.name].revenue += lineTotal;
      });
    });

    const topProductsList = Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalRevenue: totalRev,
      netSales: totalRev - disVal,
      averageOrderValue: avgOrderVal,
      orderCount: nonCancelled.length,
      cancelledCount: cancelled.length,
      cancelledValue: cancelVal,
      cashSales: cashVal,
      onlineSales: onlineVal,
      deliveryCount: delCount,
      takeawayCount: takeCount,
      dineinCount: dineCount,
      discountsGiven: disVal,
      deliveryFeesCollected: feeVal,
      topProducts: topProductsList
    };
  }, [stats, orders, startDate, endDate]);

  // SVG Area Chart points builder for selected date range
  const dailyChartPoints = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysList: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      daysList.push(d.toISOString().slice(0, 10));
    }

    const salesByDay: Record<string, number> = {};
    daysList.forEach(day => {
      salesByDay[day] = 0;
    });

    if (stats.length > 0) {
      stats.forEach(s => {
        if (s.date && salesByDay[s.date] !== undefined) {
          salesByDay[s.date] = s.totalSales ?? 0;
        }
      });
    } else {
      orders.forEach(o => {
        if (o.status !== 'cancelled' && !o.isDeleted) {
          const oDate = parseOrderDate(o).toISOString().slice(0, 10);
          if (salesByDay[oDate] !== undefined) {
            salesByDay[oDate] += o.total || 0;
          }
        }
      });
    }

    const data = daysList.map(day => ({
      label: day.slice(5), // MM-DD
      value: salesByDay[day]
    }));

    const maxVal = Math.max(...data.map(d => d.value), 1);
    const width = 500;
    const height = 150;
    const padding = 20;

    const coords = data.map((d, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - (d.value / maxVal) * (height - padding * 2);
      return { x, y, value: d.value, label: d.label };
    });

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const areaPath = coords.length > 0 
      ? `${linePath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`
      : '';

    return { linePath, areaPath, coords, rawData: data };
  }, [stats, orders, startDate, endDate]);

  const maxProductQty = useMemo(() => {
    return Math.max(...computedMetrics.topProducts.map((p) => p.quantity), 1);
  }, [computedMetrics.topProducts]);

  const handleCompressDatabase = async () => {
    if (
      !window.confirm(
        'Are you sure you want to compress and archive all orders older than 1 year? This consolidated summary records and deletes individual old orders from Firestore to save storage. This cannot be undone.'
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
      {/* Header and filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-900/40 p-4 border border-white/5 rounded-3xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">Business Intelligence</p>
          <h3 className="font-display text-2xl font-bold font-black text-white">Dashboard & Growth Analytics</h3>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateRange === 'custom' && (
            <div className="flex gap-2 items-center">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl px-2 py-1 text-xs text-white outline-none focus:border-red-500"
              />
              <span className="text-slate-500 text-xs font-bold">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl px-2 py-1 text-xs text-white outline-none focus:border-red-500"
              />
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-xs font-semibold text-slate-400">
          Loading metrics from Firestore stats...
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Total Revenue</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(computedMetrics.totalRevenue)}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-between">
            <span>AOV:</span>
            <span className="text-slate-200 font-black">Rs {Math.round(computedMetrics.averageOrderValue)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-400">Completed Orders</div>
            <div className="mt-2 text-2xl font-black text-white">{computedMetrics.orderCount} Orders</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-between">
            <span>Net Sales:</span>
            <span className="text-slate-200 font-black">Rs {Math.round(computedMetrics.netSales)}</span>
          </div>
        </div>

        {/* Discounts & Promos */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-orange-400">Discounts Applied</div>
            <div className="mt-2 text-2xl font-black text-white">Rs {Math.round(computedMetrics.discountsGiven)}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-between">
            <span>Fees Collected:</span>
            <span className="text-slate-200 font-black">Rs {Math.round(computedMetrics.deliveryFeesCollected)}</span>
          </div>
        </div>

        {/* Cancellations */}
        <div className="rounded-[2rem] border border-red-500/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-red-400">Cancellations</div>
            <div className="mt-2 text-2xl font-black text-red-200">{computedMetrics.cancelledCount} Cancelled</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-2 flex items-center justify-between">
            <span>Lost Value:</span>
            <span className="text-red-450 font-black">Rs {Math.round(computedMetrics.cancelledValue)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SVG Area Trend Chart */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="font-display font-black text-base text-emerald-400 uppercase tracking-wider mb-2">📈 Sales Trend Over Range</h4>
            <p className="text-[10px] text-slate-400">Visualizing daily revenue statistics between selected dates.</p>
          </div>
          
          <div className="relative mt-4 w-full h-44 bg-slate-900/60 rounded-2xl border border-white/5 p-2 flex items-center justify-center">
            {dailyChartPoints.coords.length > 0 ? (
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="areaGradientDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="20" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <line x1="20" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {dailyChartPoints.areaPath && (
                  <path d={dailyChartPoints.areaPath} fill="url(#areaGradientDaily)" />
                )}

                {dailyChartPoints.linePath && (
                  <path d={dailyChartPoints.linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                )}

                {dailyChartPoints.coords.map((c, idx) => {
                  const showLabel = dailyChartPoints.coords.length <= 15 || idx === 0 || idx === dailyChartPoints.coords.length - 1 || idx % Math.round(dailyChartPoints.coords.length / 5) === 0;
                  return (
                    <g key={idx} className="group cursor-pointer">
                      <circle cx={c.x} cy={c.y} r="4" fill="#10b981" className="transition-all group-hover:r-6" />
                      <circle cx={c.x} cy={c.y} r="7" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" className="animate-ping opacity-0 group-hover:opacity-100" />
                      <text x={c.x} y={c.y - 10} textAnchor="middle" className="text-[9px] font-black fill-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        Rs {Math.round(c.value)}
                      </text>
                      {showLabel && (
                        <text x={c.x} y="145" textAnchor="middle" className="text-[8px] font-black fill-slate-500">
                          {c.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="text-xs text-slate-500">No transactions available to chart.</div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-black text-base text-red-500 uppercase tracking-wider mb-3">🔥 Top Selling Products</h4>
            <div className="space-y-3.5">
              {computedMetrics.topProducts.map((p, idx) => {
                const percentage = (p.quantity / maxProductQty) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-200 truncate pr-2 max-w-[200px]">{p.name}</span>
                      <span className="text-slate-400 text-[10px] whitespace-nowrap">{p.quantity} units</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="bg-gradient-to-r from-red-650 to-red-400 h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
              {computedMetrics.topProducts.length === 0 && <div className="text-xs text-slate-500 py-10 text-center">No sales logged yet.</div>}
            </div>
          </div>
          <div className="text-[9px] text-slate-500 font-bold mt-4">Growth rank determined by quantities sold</div>
        </div>

        {/* Payment & Order Type distribution */}
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-2xl backdrop-blur-md md:col-span-2 grid gap-6 sm:grid-cols-2">
          {/* Payment Method */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-sm text-purple-400 uppercase tracking-wider">💳 Payment Method Distribution</h4>
            <div className="space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Online (UPI/Card)</span>
                <span className="text-purple-300">Rs {Math.round(computedMetrics.onlineSales)}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${computedMetrics.totalRevenue > 0 ? (computedMetrics.onlineSales / computedMetrics.totalRevenue) * 100 : 0}%` }}
                  className="bg-purple-500 h-full rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span>Cash on Delivery</span>
                <span className="text-slate-450">Rs {Math.round(computedMetrics.cashSales)}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${computedMetrics.totalRevenue > 0 ? (computedMetrics.cashSales / computedMetrics.totalRevenue) * 100 : 0}%` }}
                  className="bg-slate-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Fulfillment distribution */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-sm text-blue-400 uppercase tracking-wider">📦 Fulfillment Performance</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-emerald-450 text-[10px] block">DELIVERY</span>
                <span className="text-lg font-black text-white">{computedMetrics.deliveryCount}</span>
              </div>
              <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-blue-450 text-[10px] block">TAKEAWAY</span>
                <span className="text-lg font-black text-white">{computedMetrics.takeawayCount}</span>
              </div>
              <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl">
                <span className="text-amber-450 text-[10px] block">DINE-IN</span>
                <span className="text-lg font-black text-white">{computedMetrics.dineinCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database cleanup utility (Admin only) */}
        {isAdmin && (
          <div className="rounded-[2rem] border border-red-500/20 bg-red-950/10 p-5 shadow-2xl backdrop-blur-md md:col-span-2 flex flex-wrap gap-4 items-center justify-between">
            <div className="max-w-md">
              <h4 className="font-display font-black text-base text-red-400 uppercase tracking-wider">⚙️ Database Maintenance & Archival</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Archival consolidating raw transaction documents older than 1 year into a single yearly summary document, then removing raw data from Firestore.
              </p>
            </div>
            
            <button
              onClick={handleCompressDatabase}
              className="px-6 py-3.5 bg-red-650 hover:bg-red-550 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/10 cursor-pointer whitespace-nowrap"
            >
              Run Database Cleanup
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
