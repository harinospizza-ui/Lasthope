import React, { useState } from 'react';
import { Order, OrderStatus, AdminSession } from '../types';

interface AdminOrdersProps {
  session: AdminSession;
  orders: Order[];
  onUpdateStatus: (order: Order, status: OrderStatus, reason?: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onPrint: (order: Order) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  session,
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onPrint,
}) => {
  const [expandedDates, setExpandedDates] = useState<{ [dateStr: string]: boolean }>({});
  const [cancelReasonText, setCancelReasonText] = useState<{ [orderId: string]: string }>({});
  const [showCancelPrompt, setShowCancelPrompt] = useState<{ [orderId: string]: boolean }>({});
  const [showAuditLogs, setShowAuditLogs] = useState<{ [orderId: string]: boolean }>({});

  const parseOrderDate = (order: Order): Date => {
    if (order.receivedAt) {
      const d = new Date(order.receivedAt);
      if (!isNaN(d.getTime())) return d;
    }
    if (order.date) {
      const d = new Date(order.date);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
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

  const normalizePhoneForWhatsApp = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const visibleOrders = React.useMemo(() => {
    let filtered = orders;
    if (session.role !== 'admin') {
      filtered = session.outletId ? filtered.filter((order) => order.outletId === session.outletId) : filtered;
    }
    return [...filtered].sort((a, b) => parseOrderDate(b).getTime() - parseOrderDate(a).getTime());
  }, [orders, session]);

  const ordersByDate = React.useMemo(() => {
    const groups: { [dateStr: string]: Order[] } = {};
    visibleOrders.forEach((order) => {
      try {
        const dateStr = parseOrderDate(order).toDateString();
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(order);
      } catch (err) {
        console.error('Failed to parse date:', err);
      }
    });
    return groups;
  }, [visibleOrders]);

  const todayStr = new Date().toDateString();

  React.useEffect(() => {
    setExpandedDates((prev) => ({
      ...prev,
      [todayStr]: prev[todayStr] ?? true,
    }));
  }, [todayStr]);

  const handleCancelClick = (orderId: string) => {
    setShowCancelPrompt((prev) => ({ ...prev, [orderId]: true }));
  };

  const handleCancelSubmit = (order: Order) => {
    const reason = cancelReasonText[order.id]?.trim();
    if (!reason) {
      alert('Cancellation reason is required.');
      return;
    }
    onUpdateStatus(order, 'cancelled', reason);
    setShowCancelPrompt((prev) => ({ ...prev, [order.id]: false }));
  };

  return (
    <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
      <h3 className="mb-4 font-display text-2xl font-bold">Orders Console</h3>
      <div className="grid gap-4">
        {Object.keys(ordersByDate).map((dateStr) => {
          const dateOrders = ordersByDate[dateStr];
          const isExpanded = expandedDates[dateStr] ?? false;

          return (
            <div key={dateStr} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
              <button
                onClick={() => setExpandedDates((prev) => ({ ...prev, [dateStr]: !isExpanded }))}
                className="w-full flex justify-between items-center px-5 py-4 bg-white/[0.04] hover:bg-white/[0.07] transition-all text-left outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg">{dateStr === todayStr ? 'Today' : dateStr}</span>
                  <span className="text-xs bg-red-650/40 border border-red-500/20 text-red-200 px-2.5 py-0.5 rounded-full font-black">
                    {dateOrders.length} {dateOrders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>
                <span className="text-slate-400 font-bold">{isExpanded ? '▼' : '▲'}</span>
              </button>

              {isExpanded && (
                <div className="p-4 grid gap-4">
                  {dateOrders.map((order) => (
                    <div key={order.id} className="rounded-3xl p-5 border border-white/10 bg-slate-900/30 shadow-xl relative animate-slide-up">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <b className="text-base font-display">#{order.id.split('-')[2] || order.id.slice(-5)}</b>
                            <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest ${statusClass(order.status)}`}>
                              {statusLabel(order.status)}
                            </span>
                            {order.isDeleted && (
                              <span className="rounded-full bg-red-500/20 border border-red-500/30 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-red-300">
                                Soft-Deleted
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-xs text-slate-400 font-bold">
                            {order.outletName} • {order.orderType.toUpperCase()} • {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}
                          </div>

                          <div className="mt-1 text-[10px] text-slate-500 font-medium">
                            🕒 {new Date(order.receivedAt ?? order.date).toLocaleDateString()} {new Date(order.receivedAt ?? order.date).toLocaleTimeString()}
                          </div>
                        </div>
                        {session.role !== 'staff' && typeof order.total === 'number' && (
                          <div className="text-xl font-black text-red-400">Rs {Math.round(order.total)}</div>
                        )}
                      </div>

                      {/* Wallet adjustments logs */}
                      {session.role !== 'staff' && (order.walletAmountRedeemed || order.rewardPointsRedeemed) ? (
                        <div className="mt-2 text-xs font-semibold text-green-400 space-x-3">
                          {order.walletAmountRedeemed ? <span>👛 Wallet Redeem: -Rs {order.walletAmountRedeemed}</span> : null}
                          {order.rewardPointsRedeemed ? <span>⭐ Points Redeem: -Rs {order.rewardPointsRedeemed}</span> : null}
                        </div>
                      ) : null}

                      {order.cancellationReason && (
                        <div className="mt-2 p-2 bg-red-950/20 border border-red-900/30 rounded-xl text-xs text-red-300">
                          ❌ Cancelled By {order.cancelledBy || 'system'}: <span className="font-bold">{order.cancellationReason}</span>
                        </div>
                      )}

                      <div className="mt-3 text-sm font-semibold text-slate-200">
                        {order.customerName} (📞 {order.customerPhone})
                      </div>

                      {order.orderType === 'delivery' && (
                        <div className="mt-2 text-xs font-semibold text-slate-350">
                          📍 Delivery Address: {order.customerLocation?.address || 'Saved Location'}
                          {((order.customerLocation?.latitude && order.customerLocation?.longitude) || order.customerLocationUrl) && (
                            <a
                              href={order.customerLocationUrl || `https://maps.google.com/?q=${order.customerLocation?.latitude},${order.customerLocation?.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="ml-2 text-red-400 hover:text-red-300 font-bold underline"
                            >
                              (View Map Location 🗺️)
                            </a>
                          )}
                        </div>
                      )}

                      <div className="mt-2 pl-3 border-l-2 border-slate-700 space-y-1 text-xs text-slate-350">
                        {order.items.map((item, i) => (
                          <div key={i}>{item.quantity}x {item.name}{item.selectedSize ? ` [${item.selectedSize}]` : ''}</div>
                        ))}
                      </div>

                      {/* Cancellation prompt */}
                      {showCancelPrompt[order.id] && (
                        <div className="mt-3 p-3 bg-slate-900/60 border border-white/5 rounded-2xl">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Cancellation Reason</label>
                          <input
                            type="text"
                            placeholder="e.g. Out of stock, Customer request"
                            value={cancelReasonText[order.id] || ''}
                            onChange={(e) => setCancelReasonText((prev) => ({ ...prev, [order.id]: e.target.value }))}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500 mb-2"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setShowCancelPrompt((prev) => ({ ...prev, [order.id]: false }))}
                              className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 hover:bg-white/10"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleCancelSubmit(order)}
                              className="px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white"
                            >
                              Confirm Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Audit Log Collapse */}
                      <div className="mt-3">
                        <button
                          onClick={() => setShowAuditLogs((prev) => ({ ...prev, [order.id]: !prev[order.id] }))}
                          className="text-[10px] text-slate-500 font-black uppercase tracking-widest hover:text-white flex items-center gap-1"
                        >
                          📋 {showAuditLogs[order.id] ? 'Hide Audit Log' : 'View Audit Log'}
                        </button>
                        {showAuditLogs[order.id] && (
                          <div className="mt-2 p-3 bg-slate-950/40 border border-white/5 rounded-xl text-[10px] font-bold text-slate-400 space-y-1">
                            {order.auditTrail && order.auditTrail.length > 0 ? (
                              order.auditTrail.map((log: any, idx: number) => (
                                <div key={idx} className="border-b border-white/5 pb-1 last:border-0 last:pb-0">
                                  [{new Date(log.timestamp).toLocaleTimeString()}] {log.action} by <span className="text-white">{log.updatedBy}</span>
                                  {log.reason ? <span className="text-red-300"> (Reason: {log.reason})</span> : ''}
                                </div>
                              ))
                            ) : (
                              <div>No audit entries recorded.</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {session.role !== 'staff' && (() => {
                          const isCancelled = order.status === 'cancelled';
                          return (
                            <>
                              <button
                                onClick={() => onUpdateStatus(order, 'preparing')}
                                disabled={isCancelled}
                                className={`rounded-xl bg-amber-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-premium ${isCancelled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-500'}`}
                              >
                                Preparing
                              </button>
                              <button
                                onClick={() => onUpdateStatus(order, order.orderType === 'delivery' ? 'out_for_delivery' : 'ready')}
                                disabled={isCancelled}
                                className={`rounded-xl bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-premium ${isCancelled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-blue-500'}`}
                              >
                                Ready/Out
                              </button>
                              <button
                                onClick={() => onUpdateStatus(order, 'done')}
                                disabled={isCancelled}
                                className={`rounded-xl bg-green-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-premium ${isCancelled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-green-600'}`}
                              >
                                Done
                              </button>
                              <button
                                onClick={() => handleCancelClick(order.id)}
                                disabled={isCancelled}
                                className={`rounded-xl bg-red-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-premium ${isCancelled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-red-650'}`}
                              >
                                Cancel
                              </button>
                            </>
                          );
                        })()}
                        <button onClick={() => onPrint(order)} className="rounded-xl border border-slate-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-premium">Print</button>
                        {order.customerPhone && (
                          <a
                            href={`https://wa.me/${normalizePhoneForWhatsApp(order.customerPhone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl bg-green-700 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-green-600 transition-premium flex items-center justify-center font-bold"
                          >
                            WhatsApp Customer
                          </a>
                        )}
                        {(session.role === 'admin' || session.role === 'manager') && !order.isDeleted && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this order? (Soft delete)')) {
                                onDeleteOrder(order.id);
                              }
                            }}
                            className="rounded-xl bg-red-900/50 hover:bg-red-800 border border-red-500/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-premium"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {!visibleOrders.length && <div className="text-sm text-slate-500 mt-2">No active orders assigned.</div>}
      </div>
    </section>
  );
};
