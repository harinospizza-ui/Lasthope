import React, { useState, useEffect } from 'react';
import { CustomerProfile, WalletTransaction } from '../../types';
import { StorageService } from '../../services/storage';
import { getServerCustomers, verifyServerCustomer, saveWalletTransactionToServer, saveCustomerToServer, subscribeServerWalletTransactions } from '../../services/orderApi';
import { copyTextToClipboard } from '../../services/browserSupport';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerProfile: CustomerProfile;
  onProfileChange: (profile: CustomerProfile) => void;
  showNotification: (msg: string | { title: string; message: string; type?: 'success' | 'info' | 'warning' | 'error' }) => void;
  onProceedToPayment: (amount: number) => void;
  instagramUrl?: string;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  customerProfile,
  onProfileChange,
  showNotification,
  onProceedToPayment,
  instagramUrl = '',
}) => {
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('200');
  const [latestTopup, setLatestTopup] = useState<WalletTransaction | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(customerProfile.name || '');
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  useEffect(() => {
    if (customerProfile?.name) {
      setTempName(customerProfile.name);
    }
  }, [customerProfile?.name]);

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      alert('Name cannot be empty.');
      return;
    }
    const updated = {
      ...customerProfile,
      name: tempName.trim(),
      fullName: tempName.trim()
    };
    try {
      await saveCustomerToServer(updated);
      StorageService.saveCustomerProfile(updated);
      onProfileChange(updated);
      setIsEditingName(false);
      showNotification({ title: 'Success', message: 'Name updated successfully!', type: 'success' });
    } catch (err: any) {
      alert(err.message || 'Failed to save name.');
    }
  };

  useEffect(() => {
    if (!isOpen || !customerProfile?.id) return;
    
    const unsub = subscribeServerWalletTransactions(
      (txs) => {
        const userTopups = txs.filter(
          (t) => t.customerId === customerProfile.id && t.type === 'topup'
        );
        if (userTopups.length > 0) {
          setLatestTopup(userTopups[0]);
        }
      },
      (err) => console.warn('Transaction subscription error:', err)
    );
    return () => unsub();
  }, [isOpen, customerProfile?.id]);

  useEffect(() => {
    if (!isOpen || !customerProfile?.id) return;
    const isVerified = customerProfile.verified === true || String(customerProfile.verified) === 'true';
    if (isVerified) {
      const code = customerProfile.referralCode || '';
      const isFiveCharHex = /^[0-9A-F]{5}$/.test(code);
      if (!code || !isFiveCharHex) {
        void (async () => {
          try {
            const result = await verifyServerCustomer(customerProfile.id);
            if (result && result.referralCode) {
              const updated = {
                ...customerProfile,
                referralCode: result.referralCode
              };
              StorageService.saveCustomerProfile(updated);
              onProfileChange(updated);
            }
          } catch (e) {
            console.warn('Failed to auto-generate referral code:', e);
          }
        })();
      }
    }
  }, [isOpen, customerProfile, onProfileChange]);

  if (!isOpen) return null;

  const isVerified = customerProfile.verified === true || String(customerProfile.verified) === 'true';
  const balance = customerProfile.walletBalance ?? 0;
  const coins = customerProfile.rewardPoints ?? 0;
  const coinsValue = (coins * 0.1).toFixed(2);

  const handleShareReferral = async () => {
    const shareText = isVerified && customerProfile.referralCode
      ? `Hey! Order delicious 100% veg pizzas from Harino's and use my referral code ${customerProfile.referralCode} to get free reward points: https://harinos.store`
      : `Check out Harino's Pizza at https://harinos.store`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Harino's Pizza",
          text: shareText,
          url: 'https://harinos.store',
        });
        return;
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }

    try {
      const didCopy = await copyTextToClipboard(shareText);
      if (didCopy) {
        showNotification({ title: 'Link Copied', message: 'Referral message copied to clipboard.', type: 'success' });
        return;
      }
      alert('Visit us at harinos.store.');
    } catch {
      alert('Visit us at harinos.store.');
    }
  };

  const handleApplyReferral = async () => {
    const code = inputReferralCode.trim().toUpperCase();
    if (!code) return;
    if (code === customerProfile.referralCode) {
      alert('You cannot use your own referral code.');
      return;
    }

    const attemptsRemaining = customerProfile.referralAttemptsRemaining !== undefined 
      ? customerProfile.referralAttemptsRemaining 
      : (3 - (customerProfile.referralAttempts ?? 0));

    setIsApplyingCode(true);
    try {
      const allCustomers = await getServerCustomers();
      const referrer = allCustomers.find((c) => c.referralCode === code && c.verified);

      if (referrer) {
        const updatedReferrer = { ...referrer, rewardPoints: (referrer.rewardPoints ?? 0) + 100 };
        const tx: WalletTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          customerId: referrer.id,
          customerName: referrer.name,
          customerPhone: referrer.phone,
          amount: 10,
          type: 'reward',
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        await saveWalletTransactionToServer(tx);
        await saveCustomerToServer(updatedReferrer);

        const updatedSelf: CustomerProfile = {
          ...customerProfile,
          referralApplied: true,
          referralCodeUsed: true,
          referralLocked: true,
          referredBy: code,
          referralAppliedAt: new Date().toISOString()
        };
        await saveCustomerToServer(updatedSelf);
        StorageService.saveCustomerProfile(updatedSelf);
        onProfileChange(updatedSelf);
        setInputReferralCode('');
        showNotification({
          title: 'Referral Applied',
          message: 'Referral code applied! Reward sent to referrer.',
          type: 'success'
        });
      } else {
        const nextAttemptsRemaining = attemptsRemaining - 1;
        const updatedSelf: CustomerProfile = {
          ...customerProfile,
          referralAttempts: (customerProfile.referralAttempts ?? 0) + 1,
          referralAttemptsRemaining: nextAttemptsRemaining,
          referralLocked: nextAttemptsRemaining <= 0,
          referralApplied: nextAttemptsRemaining <= 0 ? true : undefined
        };
        await saveCustomerToServer(updatedSelf);
        StorageService.saveCustomerProfile(updatedSelf);
        onProfileChange(updatedSelf);
        showNotification({
          title: 'Invalid Code',
          message: `Invalid referral code. Remaining attempts: ${nextAttemptsRemaining}`,
          type: 'warning'
        });
      }
    } catch (err: any) {
      showNotification({ title: 'Error', message: err.message || 'Failed to apply referral.', type: 'error' });
    } finally {
      setIsApplyingCode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-t-[2.5rem] bg-white p-6 text-slate-900 shadow-2xl sm:rounded-[2.5rem] animate-slide-up max-h-[92vh] overflow-y-auto hide-scrollbar">
        {/* Mobile drag handle indicator */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />

        {/* Modal Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-black uppercase tracking-wider text-amber-800">
              <span>👑</span>
              <span>Harino's Club</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-display">Profile & Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition-colors text-lg"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Customer Profile Identity Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
              {customerProfile.avatar ? (
                <img src={customerProfile.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <label 
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-red-600 transition-colors text-[10px]"
              title="Change Profile Photo"
            >
              📷
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (uploadEvent) => {
                      const base64 = uploadEvent.target?.result as string;
                      const updated = { ...customerProfile, avatar: base64 };
                      StorageService.saveCustomerProfile(updated);
                      onProfileChange(updated);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 w-full"
                  placeholder="Enter name"
                  maxLength={30}
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    setTempName(customerProfile.name || '');
                    setIsEditingName(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-slate-900 truncate">{customerProfile.name}</span>
                {isVerified && (
                  <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full w-4 h-4 text-[9px] font-black shrink-0" title="Verified Member">
                    ✓
                  </span>
                )}
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-red-500 text-xs ml-1 focus:outline-none transition-colors"
                  title="Edit Name"
                >
                  ✏️
                </button>
              </div>
            )}
            <div className="text-xs text-slate-500 font-semibold mt-0.5">
              📞 {customerProfile.phone?.split('-')[0]}
            </div>
            {isVerified && customerProfile.referralCode && (
              <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                Code: {customerProfile.referralCode}
              </div>
            )}
          </div>
        </div>

        {/* Digital Wallet Card (Harino's Obsidian/Gold VIP Card) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-xl mb-5 border border-slate-800">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[9px] font-black tracking-[0.25em] uppercase text-amber-400/90">Harino's Pass</span>
              <div className="text-xs font-bold text-slate-400">Pure Veg Pizza Rewards</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-xl">
              <span>🪙</span>
              <span>{coins} Coins</span>
            </div>
          </div>

          <div className="my-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Wallet Balance</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">₹{balance.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
            <span>HariCoins Value: <strong className="text-amber-400">₹{coinsValue}</strong></span>
            {isVerified && (
              <span className="text-emerald-400 font-bold">Earned: ₹{(customerProfile.referralEarnings ?? 0).toFixed(0)}</span>
            )}
          </div>
        </div>

        {/* Verification Alert if not verified */}
        {!isVerified && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">⏳</span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">Pending Verification</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your profile is pending admin approval. Once verified, you will unlock personal referral codes and reward bonuses!
            </p>
          </div>
        )}

        {/* Quick Top-up Wallet Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>💳</span>
              <span>Add Money to Wallet</span>
            </label>
            <span className="text-[10px] text-slate-500 font-semibold">Instant via GPay QR</span>
          </div>

          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">₹</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 text-base outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 shadow-sm"
              min="1"
            />
          </div>

          {/* Quick Amount Chips */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {['100', '200', '500', '1000'].map((amt) => {
              const isSelected = topUpAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-black transition-all active:scale-95 border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  +₹{amt}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              const amount = parseFloat(topUpAmount);
              if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid amount.');
                return;
              }
              onProceedToPayment(amount);
            }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Proceed with Google Pay QR</span>
            <span>➔</span>
          </button>
        </div>

        {/* Latest Top-up Status Tracker */}
        {latestTopup && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-5 text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Recent Top-up Status</span>
              <span className="text-xs font-black text-slate-800">₹{latestTopup.amount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              {/* Step 1: Requested */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">1. Top-up Request Submitted</div>
                  <div className="text-[10px] text-slate-500">{new Date(latestTopup.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              {/* Step 2: Verification */}
              <div className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 text-white ${
                  latestTopup.status === 'completed'
                    ? 'bg-emerald-500'
                    : latestTopup.status === 'failed'
                    ? 'bg-red-500'
                    : 'bg-amber-500 animate-pulse'
                }`}>
                  {latestTopup.status === 'completed' ? '✓' : latestTopup.status === 'failed' ? '✗' : '••'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    2. Admin Verification
                    {latestTopup.status === 'pending' && <span className="text-amber-600 font-semibold text-[10px] ml-1">(Processing)</span>}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {latestTopup.status === 'completed'
                      ? 'Approved by Store Admin'
                      : latestTopup.status === 'failed'
                      ? 'Declined by Admin'
                      : 'Usually verified within 2 to 4 hours'}
                  </div>
                </div>
              </div>

              {/* Step 3: Result */}
              <div className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                  latestTopup.status === 'completed'
                    ? 'bg-emerald-500 text-white'
                    : latestTopup.status === 'failed'
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {latestTopup.status === 'completed' ? '✓' : latestTopup.status === 'failed' ? '✕' : '3'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">3. Wallet Update</div>
                  <div className="text-[10px]">
                    {latestTopup.status === 'completed' && (
                      <span className="text-emerald-600 font-bold">Balance added to your wallet!</span>
                    )}
                    {latestTopup.status === 'failed' && (
                      <span className="text-red-500 font-bold">Request rejected. Contact support for help.</span>
                    )}
                    {latestTopup.status === 'pending' && (
                      <span className="text-slate-500">Awaiting store confirmation...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Have a referral code input */}
        {isVerified && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
            {(() => {
              const attemptsRemaining = customerProfile.referralAttemptsRemaining !== undefined 
                ? customerProfile.referralAttemptsRemaining 
                : (3 - (customerProfile.referralAttempts ?? 0));
              const isUsed = !!(customerProfile.referralCodeUsed || customerProfile.referralApplied);
              const isLocked = !!(customerProfile.referralLocked || attemptsRemaining <= 0 || isUsed);

              if (isUsed) {
                return (
                  <div className="text-xs font-bold text-emerald-600 text-center py-1 flex items-center justify-center gap-1.5">
                    <span>✓</span>
                    <span>Referral reward applied to your account.</span>
                  </div>
                );
              }

              if (isLocked || attemptsRemaining <= 0) {
                return (
                  <div className="text-xs font-bold text-slate-500 text-center py-1">
                    Referral code entry is locked for this account.
                  </div>
                );
              }

              return (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                      Have a Friend's Referral Code?
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">{attemptsRemaining} attempts left</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="5-digit code"
                      value={inputReferralCode}
                      onChange={(e) => setInputReferralCode(e.target.value.toUpperCase().slice(0, 5))}
                      className="flex-1 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl border border-slate-200 bg-white text-slate-900 outline-none focus:border-red-500"
                    />
                    <button
                      type="button"
                      disabled={isApplyingCode}
                      onClick={handleApplyReferral}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                    >
                      {isApplyingCode ? '...' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Share My Referral Code */}
        {isVerified && customerProfile.referralCode && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 mb-5 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-800 block mb-1">Your Referral Code</span>
            <div className="text-2xl font-black font-display text-slate-900 tracking-wider mb-3">
              {customerProfile.referralCode}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={async () => {
                  const didCopy = await copyTextToClipboard(customerProfile.referralCode || '');
                  if (didCopy) {
                    showNotification({ title: 'Code Copied', message: 'Referral code copied to clipboard!', type: 'success' });
                  }
                }}
                className="py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider text-slate-800 transition-all active:scale-95 shadow-sm"
              >
                Copy Code
              </button>
              <button
                type="button"
                onClick={handleShareReferral}
                className="py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-red-600/20"
              >
                Share Code
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-red-200/50">
              <button
                type="button"
                onClick={() => {
                  const shareText = `Use my referral code ${customerProfile.referralCode} while ordering from Harino's Pizza and earn rewards! https://harinos.store`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#25D366] hover:bg-green-50 transition-colors"
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  const shareText = `Use my referral code ${customerProfile.referralCode} while ordering from Harino's Pizza! https://harinos.store`;
                  window.open(`https://t.me/share/url?url=https://harinos.store&text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#0088cc] hover:bg-sky-50 transition-colors"
              >
                Telegram
              </button>
              <button
                type="button"
                onClick={() => {
                  if (instagramUrl) {
                    window.open(instagramUrl, '_blank');
                  } else {
                    window.open('https://instagram.com', '_blank');
                  }
                }}
                className="py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-[#E1306C] hover:bg-pink-50 transition-colors"
              >
                Instagram
              </button>
            </div>
          </div>
        )}

        {/* Customer Support Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Need assistance?</span>
          <a
            href="https://wa.me/917818958571?text=Hello%20Harinos%20Support"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors"
          >
            <span>💬</span>
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
