import React, { useState, useEffect } from 'react';
import { useSwipeDismiss } from '../../hooks/useSwipeDismiss';
import { CustomerProfile } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentComplete: (paymentMethod?: string) => void;
  outletName?: string | null;
  outletPhone?: string | null;
  showCOD?: boolean;
  customerProfile?: CustomerProfile | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onPaymentComplete,
  outletName,
  outletPhone,
  showCOD = false,
  customerProfile = null,
}) => {
  const swipeDismiss = useSwipeDismiss({ direction: 'down', onDismiss: onClose });
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [isCopied, setIsCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean up body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsCopied(false);
      setUtrNumber('');
      setIsSubmitting(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const upiId = '7818958571@okbizaxis';
  const recipientName = 'HARINOS';
  const isVerified = customerProfile?.verified === true || String(customerProfile?.verified) === 'true';

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Harinos Pizza Order')}`;

  const handleCopyUpi = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(upiId);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = upiId;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleOpenUpiApp = (appScheme?: string) => {
    const targetUrl = appScheme ? `${appScheme}?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${total.toFixed(2)}&cu=INR` : upiUrl;
    window.location.href = targetUrl;
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);
    if (utrNumber.trim()) {
      try {
        sessionStorage.setItem('harinos_last_payment_utr', utrNumber.trim());
      } catch {}
    }
    // Complete payment immediately so order is placed in Firestore
    setTimeout(() => {
      setIsSubmitting(false);
      onPaymentComplete(paymentMethod);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-end justify-center p-0 sm:items-center sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div
        className="relative w-full max-h-[92vh] overflow-y-auto rounded-t-[2.5rem] bg-white shadow-2xl sm:max-w-md sm:rounded-[2.5rem] hide-scrollbar"
        style={swipeDismiss.style}
        {...swipeDismiss.bind}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-slate-900 px-6 py-4 text-white text-center shadow-md">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🍕</span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">Harino&apos;s Checkout</span>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all text-sm font-bold"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-white">
            Pay ₹{total.toFixed(2)}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
            Instant UPI Payment • Zero Gateway Failures
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Method Tabs (Online UPI vs COD) */}
          {showCOD && (
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ UPI / QR Scan
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isVerified) {
                    alert('Cash on Delivery is available for verified customers. You can verify your phone in Profile, or pay easily online via UPI!');
                    return;
                  }
                  setPaymentMethod('COD');
                }}
                className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                  !isVerified ? 'opacity-50 cursor-not-allowed text-slate-400' : ''
                } ${
                  paymentMethod === 'COD'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💵 Cash on Delivery
              </button>
            </div>
          )}

          {paymentMethod === 'UPI' ? (
            <>
              {/* Official Google Pay Merchant QR Card */}
              <div className="rounded-3xl border-2 border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm text-center">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Official Merchant QR (Scan to Pay)
                  </span>
                </div>

                <div className="relative mx-auto w-56 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-inner">
                  <img
                    src="/images/harinos_gpay_qr.jpg"
                    alt="Harino's Google Pay QR Code"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>

                {/* Amount Highlight */}
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-black">
                  <span>Exact Amount:</span>
                  <span className="text-sm font-bold">₹{total.toFixed(2)}</span>
                </div>

                {/* UPI ID with One-Click Copy */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-mono font-bold text-slate-800 select-all shadow-sm">
                    {upiId}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCopied ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* 1-Tap UPI Apps (for mobile devices) */}
              <div>
                <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5">
                  Or tap to open your UPI app
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp('tez://upi/pay')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/40 transition-all shadow-sm group active:scale-95"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🟢</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp('phonepe://pay')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/40 transition-all shadow-sm group active:scale-95"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🟣</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp('paytmmp://pay')}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all shadow-sm group active:scale-95"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔵</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenUpiApp()}
                    className="flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200 bg-white hover:border-red-400 hover:bg-red-50/40 transition-all shadow-sm group active:scale-95"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📱</span>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">Any UPI</span>
                  </button>
                </div>
              </div>

              {/* Optional UTR / Reference Number */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600">
                  UTR / UPI Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12-digit Ref / UTR number"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-800 outline-none focus:border-red-500 transition-colors shadow-inner"
                />
                <p className="text-[9px] text-slate-500">
                  Entered UTR will be attached to your order for speedy verification.
                </p>
              </div>
            </>
          ) : (
            /* Cash On Delivery View */
            <div className="py-2 space-y-3">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 text-center">
                <span className="text-4xl mb-2 block">🛵</span>
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Verified Cash On Delivery
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  You can pay in cash or via UPI to the delivery rider when your steaming hot food arrives!
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-emerald-800 text-xs font-bold shadow-sm">
                  <span>Amount to pay on arrival:</span>
                  <span className="font-black text-sm">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Routed Outlet Info */}
          {outletName && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                  Cooking at Outlet
                </span>
                <span className="font-bold text-slate-800">{outletName}</span>
              </div>
              {outletPhone && (
                <a
                  href={`tel:${outletPhone}`}
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-white border border-slate-200 rounded-lg px-2 py-1"
                >
                  📞 Call Store
                </a>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-red-650 to-red-600 hover:from-red-600 hover:to-red-655 active:scale-[0.98] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-650/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Confirming Order...</span>
            ) : paymentMethod === 'COD' ? (
              <>
                <span>Confirm Cash on Delivery Order</span>
                <span className="text-base">✓</span>
              </>
            ) : (
              <>
                <span>I Have Paid • Confirm Order</span>
                <span className="text-base">🚀</span>
              </>
            )}
          </button>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="text-emerald-500">🔒</span> 100% Secure UPI
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-red-500">🍕</span> Harino&apos;s Fresh Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;