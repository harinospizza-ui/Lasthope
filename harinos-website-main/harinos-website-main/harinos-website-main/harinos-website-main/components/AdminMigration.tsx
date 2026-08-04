import React, { useState, useEffect } from 'react';
import { getLegacyCustomersFromServer, importLegacyCustomer, rejectLegacyCustomer } from '../services/orderApi';

interface LegacyCustomer {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  walletBalance: number;
  referralCode: string;
  ordersCount: number;
  source: string;
}

interface AdminMigrationProps {
  onRefreshData?: () => void;
}

export const AdminMigration: React.FC<AdminMigrationProps> = ({ onRefreshData }) => {
  const [legacyCustomers, setLegacyCustomers] = useState<LegacyCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLegacyCustomers = async () => {
    setLoading(true);
    try {
      const list = await getLegacyCustomersFromServer();
      setLegacyCustomers(list);
    } catch (err) {
      console.error('Failed to load legacy customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLegacyCustomers();
  }, []);

  const handleImport = async (c: LegacyCustomer) => {
    setActionLoading(c.id);
    try {
      await importLegacyCustomer(c);
      alert(`Customer ${c.name} imported successfully!`);
      await fetchLegacyCustomers();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Import failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyAndImport = async (c: LegacyCustomer) => {
    setActionLoading(c.id + '_verify');
    try {
      const verifiedCust = { ...c, verified: true };
      await importLegacyCustomer(verifiedCust);
      alert(`Customer ${c.name} verified and imported successfully!`);
      await fetchLegacyCustomers();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Verification & import failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (c: LegacyCustomer) => {
    if (!confirm(`Are you sure you want to REJECT and permanently delete legacy record for ${c.name} (${c.phone})?`)) {
      return;
    }
    setActionLoading(c.id + '_reject');
    try {
      await rejectLegacyCustomer(c);
      alert(`Legacy record for ${c.name} deleted.`);
      await fetchLegacyCustomers();
      if (onRefreshData) onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleImportAll = async () => {
    if (legacyCustomers.length === 0) return;
    if (!confirm(`Are you sure you want to import ALL ${legacyCustomers.length} legacy customers?`)) {
      return;
    }
    setLoading(true);
    let successCount = 0;
    for (const c of legacyCustomers) {
      try {
        await importLegacyCustomer(c);
        successCount++;
      } catch (err) {
        console.error(`Failed to import ${c.name}:`, err);
      }
    }
    alert(`Successfully imported ${successCount} out of ${legacyCustomers.length} legacy customers!`);
    await fetchLegacyCustomers();
    if (onRefreshData) onRefreshData();
    setLoading(false);
  };

  return (
    <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-glow text-white">Legacy Customer Migration</h3>
          <p className="text-xs text-slate-400 mt-1">
            Safely import and verify customer records from legacy systems into the new Firebase schema.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLegacyCustomers}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleImportAll}
            disabled={loading || legacyCustomers.length === 0}
            className="rounded-xl bg-gradient-premium border border-red-500/20 hover:brightness-110 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-red-500/10"
          >
            📥 Import All ({legacyCustomers.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-bold text-sm">
          <span className="inline-block animate-spin mr-2">⏳</span> Loading legacy customer list...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 font-black uppercase tracking-wider">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4">Wallet Balance</th>
                <th className="p-4">Referral Code</th>
                <th className="p-4">Orders Count</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-slate-200">
              {legacyCustomers.map((c) => {
                const isLoading = actionLoading === c.id || actionLoading === c.id + '_verify' || actionLoading === c.id + '_reject';
                return (
                  <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-white">{c.name}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Ph: {c.phone}</div>
                      <div className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full inline-block">
                        Source: {c.source}
                      </div>
                    </td>
                    <td className="p-4">
                      {c.verified ? (
                        <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wider">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-emerald-400 font-black text-sm">
                      Rs {c.walletBalance}
                    </td>
                    <td className="p-4">
                      {c.referralCode ? (
                        <span className="font-mono bg-white/5 px-2 py-1 rounded border border-white/10 text-white">
                          {c.referralCode}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 font-bold">
                      {c.ordersCount} Orders
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleImport(c)}
                        disabled={isLoading}
                        className="rounded-lg bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        Import
                      </button>
                      <button
                        onClick={() => handleVerifyAndImport(c)}
                        disabled={isLoading}
                        className="rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        Verify & Import
                      </button>
                      <button
                        onClick={() => handleReject(c)}
                        disabled={isLoading}
                        className="rounded-lg bg-red-700 hover:bg-red-650 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
              {legacyCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    🎉 No legacy customers pending migration! All caught up.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminMigration;
