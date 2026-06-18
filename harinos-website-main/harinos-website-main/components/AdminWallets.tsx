import React, { useState } from 'react';
import { CustomerProfile, WalletTransaction, AdminSession } from '../types';
import { StorageService } from '../services/storage';
import { saveCustomerToServer, saveWalletTransactionToServer, getServerCustomers } from '../services/orderApi';

interface AdminWalletsProps {
  session: AdminSession;
  customers: CustomerProfile[];
  transactions: WalletTransaction[];
  onRefresh: () => void;
  onVerifyCustomer: (customer: CustomerProfile) => void;
}

export const AdminWallets: React.FC<AdminWalletsProps> = ({
  session,
  customers,
  transactions,
  onRefresh,
  onVerifyCustomer,
}) => {
  const [walletSearchQuery, setWalletSearchQuery] = useState('');

  const normalizePhoneForWhatsApp = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const filteredCustomers = customers.filter((cust) => {
    const query = walletSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return cust.name.toLowerCase().includes(query) || cust.phone.includes(query);
  });

  const pendingTransactions = transactions.filter((tx) => {
    if (tx.status !== 'pending') return false;
    const query = walletSearchQuery.toLowerCase().trim();
    if (!query) return true;
    return tx.customerName.toLowerCase().includes(query) || tx.customerPhone.includes(query);
  });

  return (
    <section className="relative mx-auto max-w-6xl p-4 animate-fade-in">
      <h3 className="mb-4 font-display text-2xl font-bold font-black">Wallets & Customers Control</h3>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Search Customers</label>
        <input
          type="text"
          placeholder="Enter customer name or phone number..."
          value={walletSearchQuery}
          onChange={(e) => setWalletSearchQuery(e.target.value)}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none focus:border-red-500 font-bold transition focus:bg-white/10"
        />
      </div>

      {/* Customer Verification Section */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 mb-6">
        <h4 className="font-display font-bold text-lg mb-4 text-red-300">Customer Verification Management</h4>
        <div className="grid gap-3 md:grid-cols-2">
          {filteredCustomers.map((customer) => {
            const verified = StorageService.getVerifiedCustomers()[customer.id] || customer.verified;
            return (
              <div key={customer.id} className="rounded-2xl border border-white/5 bg-white/[0.05] p-4 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span className="text-white text-base">{customer.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${verified ? 'bg-green-500/20 text-green-300 border border-green-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>
                      {verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-semibold">Ph: {customer.phone} {customer.email ? `• ${customer.email}` : ''}</div>
                  {customer.referralCode && (
                    <div className="text-[10px] text-red-400 mt-1 font-bold">Referral Code: {customer.referralCode}</div>
                  )}
                </div>
                {!verified && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        const otp = Math.floor(100000 + Math.random() * 900000).toString();
                        try {
                          const updatedCustomer = { ...customer, otp };
                          await saveCustomerToServer(updatedCustomer);
                          alert(`OTP Generated: ${otp}`);
                          const messageText = `Your Harino's verification OTP is ${otp}. Please enter this OTP in your Profile section to verify your account.`;
                          const whatsappUrl = `https://wa.me/${normalizePhoneForWhatsApp(customer.phone)}?text=${encodeURIComponent(messageText)}`;
                          window.open(whatsappUrl, '_blank');
                          onRefresh();
                        } catch (err) {
                          alert('Failed to generate OTP.');
                        }
                      }}
                      className="rounded-xl bg-green-700 hover:bg-green-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition-premium active:scale-95 cursor-pointer"
                    >
                      Send OTP
                    </button>
                    <button
                      onClick={() => onVerifyCustomer(customer)}
                      className="rounded-xl bg-red-600 hover:bg-red-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition-premium active:scale-95 cursor-pointer"
                    >
                      Verify Manually
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {filteredCustomers.length === 0 && (
            <div className="text-sm text-slate-500">No matching customers found.</div>
          )}
        </div>
      </div>

      {/* Pending Top-ups Approval Section */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 mb-6">
        <h4 className="font-display font-bold text-lg mb-4 text-amber-300">Pending Wallet Top-up Approvals</h4>
        <div className="grid gap-3">
          {pendingTransactions.map((tx) => (
            <div key={tx.id} className="rounded-2xl bg-white/[0.05] p-4 flex flex-wrap items-center justify-between gap-4 border border-white/5 shadow-2xl">
              <div>
                <div className="font-bold text-base text-white">{tx.customerName}</div>
                <div className="text-xs text-slate-400 font-semibold">Ph: {tx.customerPhone}</div>
                <div className="text-[10px] text-slate-500 mt-1">Requested: {new Date(tx.createdAt).toLocaleString()}</div>
                <div className="mt-1.5 text-xs font-black text-amber-300">Amount: Rs {tx.amount}</div>
              </div>
              <div>
                <button
                  onClick={async () => {
                    try {
                      const freshCustomers = await getServerCustomers();
                      const customer = freshCustomers.find((c) => c.id === tx.customerId);
                      if (!customer) {
                        alert('Customer profile not found on server.');
                        return;
                      }
                      const updatedTx: WalletTransaction = { ...tx, status: 'completed' };
                      const updatedCustomer = { ...customer, walletBalance: (customer.walletBalance ?? 0) + tx.amount };
                      await saveWalletTransactionToServer(updatedTx);
                      await saveCustomerToServer(updatedCustomer);
                      alert(`Approved top-up of Rs ${tx.amount} for ${tx.customerName}`);
                      onRefresh();
                    } catch (err: any) {
                      alert(err.message || 'Failed to approve transaction.');
                    }
                  }}
                  className="rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold px-4 py-2 text-xs uppercase tracking-wider transition-premium active:scale-95"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
          {pendingTransactions.length === 0 && (
            <div className="text-sm text-slate-500">No pending wallet top-up requests.</div>
          )}
        </div>
      </div>

      {/* Adjust Ledger */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
        <h4 className="font-display font-bold text-lg mb-4">Adjust Balance Ledger</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCustomers.map((cust) => (
            <div key={cust.id} className="rounded-2xl bg-white/[0.05] p-4 flex flex-col justify-between border border-white/5 shadow-2xl">
              <div>
                <div className="font-bold text-lg text-white">{cust.name}</div>
                <div className="text-xs text-slate-400 font-semibold">Ph: {cust.phone}</div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-2.5 text-center text-orange-200 font-bold">
                    👛 Rs {(cust.walletBalance ?? 0).toFixed(0)}
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-center text-amber-200 font-bold">
                    ⭐ {cust.rewardPoints ?? 0} pts
                  </div>
                </div>
              </div>

              {session.role === 'admin' && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Adjust Balances</div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount (+/-)"
                      id={`adj-wallet-${cust.id}`}
                      className="w-1/2 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={async () => {
                        const val = parseFloat((document.getElementById(`adj-wallet-${cust.id}`) as HTMLInputElement)?.value);
                        if (isNaN(val) || val === 0) return;
                        const updated = { ...cust, walletBalance: Math.max(0, (cust.walletBalance ?? 0) + val) };
                        const tx: WalletTransaction = {
                          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                          customerId: cust.id,
                          customerName: cust.name,
                          customerPhone: cust.phone,
                          amount: val,
                          type: 'admin_adjustment',
                          status: 'completed',
                          createdAt: new Date().toISOString()
                        };
                        try {
                          await saveWalletTransactionToServer(tx);
                          await saveCustomerToServer(updated);
                          (document.getElementById(`adj-wallet-${cust.id}`) as HTMLInputElement).value = '';
                          alert('Wallet adjusted.');
                          onRefresh();
                        } catch {
                          alert('Failed.');
                        }
                      }}
                      className="w-1/2 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-premium active:scale-95"
                    >
                      Update Wallet
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Points (+/-)"
                      id={`adj-points-${cust.id}`}
                      className="w-1/2 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={async () => {
                        const val = parseInt((document.getElementById(`adj-points-${cust.id}`) as HTMLInputElement)?.value, 10);
                        if (isNaN(val) || val === 0) return;
                        const updated = { ...cust, rewardPoints: Math.max(0, (cust.rewardPoints ?? 0) + val) };
                        const tx: WalletTransaction = {
                          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                          customerId: cust.id,
                          customerName: cust.name,
                          customerPhone: cust.phone,
                          amount: val * 0.1,
                          type: 'admin_adjustment',
                          status: 'completed',
                          createdAt: new Date().toISOString()
                        };
                        try {
                          await saveWalletTransactionToServer(tx);
                          await saveCustomerToServer(updated);
                          (document.getElementById(`adj-points-${cust.id}`) as HTMLInputElement).value = '';
                          alert('Points adjusted.');
                          onRefresh();
                        } catch {
                          alert('Failed.');
                        }
                      }}
                      className="w-1/2 bg-red-650 hover:bg-red-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider transition-premium active:scale-95"
                    >
                      Update Points
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
