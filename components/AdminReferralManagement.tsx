import React, { useState, useEffect } from 'react';
import { CustomerProfile } from '../types';
import { getServerCustomers, getReferredCustomers, regenerateReferralCodeForCustomer, disableReferralCodeForCustomer } from '../services/orderApi';

export const AdminReferralManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Modal for viewing referred users
  const [referredUsers, setReferredUsers] = useState<CustomerProfile[]>([]);
  const [viewingReferrer, setViewingReferrer] = useState<CustomerProfile | null>(null);
  const [loadingReferred, setLoadingReferred] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const list = await getServerCustomers();
      // Filter out bootstrap place holders
      const filteredList = list.filter(c => c.id !== '_init_placeholder');
      setCustomers(filteredList);
    } catch (err) {
      console.error('Failed to load customers for referral management:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCustomers();
  }, []);

  const handleRegenerate = async (c: CustomerProfile) => {
    if (!confirm(`Are you sure you want to REGENERATE the referral code for ${c.name || 'this customer'}?`)) {
      return;
    }
    setActionLoading(c.id + '_regen');
    try {
      const newCode = await regenerateReferralCodeForCustomer(c.id);
      alert(`Success! New code: ${newCode}`);
      await fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Regeneration failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisable = async (c: CustomerProfile) => {
    if (!confirm(`Are you sure you want to DISABLE the referral code for ${c.name || 'this customer'}?`)) {
      return;
    }
    setActionLoading(c.id + '_disable');
    try {
      await disableReferralCodeForCustomer(c.id);
      alert('Referral code disabled successfully.');
      await fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Disable failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewReferred = async (c: CustomerProfile) => {
    if (!c.referralCode) {
      alert('This customer does not have a referral code.');
      return;
    }
    setViewingReferrer(c);
    setLoadingReferred(true);
    try {
      const list = await getReferredCustomers(c.referralCode);
      setReferredUsers(list);
    } catch (err) {
      console.error('Failed to fetch referred customers:', err);
      alert('Failed to load referred customers.');
    } finally {
      setLoadingReferred(false);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = (c.name || '').toLowerCase().includes(query) || (c.fullName || '').toLowerCase().includes(query);
    const phoneMatch = (c.phone || '').includes(query) || (c.mobileNumber || '').includes(query);
    const codeMatch = (c.referralCode || '').toLowerCase().includes(query);
    return nameMatch || phoneMatch || codeMatch;
  });

  return (
    <div className="rounded-[2.25rem] border border-white/10 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl text-white">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-glow text-white">Referral Management</h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer referral codes, regenerate codes, disable access, and view referral trees.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by Name, Phone or Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-bold text-sm">
          <span className="inline-block animate-spin mr-2">⏳</span> Loading customer referral records...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-slate-400 font-black uppercase tracking-wider">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Referral Code</th>
                <th className="p-4">Referral Count</th>
                <th className="p-4">Referral Earnings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-semibold text-slate-200">
              {filteredCustomers.map((c) => {
                const isLoading = actionLoading === c.id + '_regen' || actionLoading === c.id + '_disable';
                return (
                  <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-white">{c.name}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Ph: {c.phone}</div>
                    </td>
                    <td className="p-4">
                      {c.referralCode ? (
                        <span className="font-mono bg-red-950/40 border border-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-bold">
                          {c.referralCode}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">None (Disabled)</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 font-bold text-sm">
                      {c.referralCount ?? 0} Count
                    </td>
                    <td className="p-4 text-emerald-400 font-black text-sm">
                      Rs {(c.referralEarnings ?? 0).toFixed(0)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewReferred(c)}
                        disabled={isLoading || !c.referralCode}
                        className="rounded-lg bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        View Referrals
                      </button>
                      <button
                        onClick={() => handleRegenerate(c)}
                        disabled={isLoading}
                        className="rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => handleDisable(c)}
                        disabled={isLoading || !c.referralCode}
                        className="rounded-lg bg-red-700 hover:bg-red-655 disabled:opacity-50 text-white font-bold px-2.5 py-1.5 text-[9px] uppercase tracking-wider transition-all"
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-550 font-bold">
                    No customers found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Referrals Tree Modal */}
      {viewingReferrer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setViewingReferrer(null)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Referrals Tree</span>
                <h4 className="text-lg font-display font-bold text-white mt-0.5">Referred by {viewingReferrer.name}</h4>
              </div>
              <button
                onClick={() => setViewingReferrer(null)}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:text-red-500 font-bold"
              >
                &times;
              </button>
            </div>

            {loadingReferred ? (
              <div className="py-8 text-center text-slate-400 font-bold text-sm">
                ⏳ Loading referred users...
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                {referredUsers.map((u) => (
                  <div key={u.id} className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                    <div>
                      <div className="font-bold text-xs text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">Ph: {u.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-550 font-bold">Joined</div>
                      <div className="text-[9px] text-slate-450">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                ))}
                {referredUsers.length === 0 && (
                  <div className="py-8 text-center text-slate-550 text-xs italic">
                    This user hasn't successfully referred any customers yet.
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setViewingReferrer(null)}
              className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
