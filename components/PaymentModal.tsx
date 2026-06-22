import React, { useState } from 'react';
import { useSwipeDismiss } from '../hooks/useSwipeDismiss';
import { CustomerProfile } from '../types';

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

  if (!isOpen) return null;

  const upiId = '7818958571@okbizaxis';
  const recipientName = "Harino's";
  const isVerified = customerProfile?.verified === true || String(customerProfile?.verified) === 'true';

  const getUpiUrl = () =>
    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(recipientName)}&am=${total.toFixed(2)}&cu=INR`;

  const paymentApps = [
    { name: 'PhonePe', icon: '/images/phonepe.png' },
    { name: 'GPay', icon: '/images/gpay.png' },
    { name: 'Paytm', icon: '/images/paytm.png' },
  ];

  return (
    <div className="fixed inset-0 z-[210] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={onClose} />

      <div
        className="relative w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-md sm:rounded-[2.5rem]"
        style={swipeDismiss.style}
        {...swipeDismiss.bind}
      >
        <div className="bg-slate-900 px-5 pb-5 pt-4 text-center text-white sm:px-8 sm:pb-7 sm:pt-6">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/25 sm:hidden" />
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">Secure Payment</div>
          <h2 className="text-2xl font-display font-bold sm:text-3xl">Pay Rs {total.toFixed(2)}</h2>
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Swipe down to close</p>
        </div>

        <div className="p-5 sm:p-8">
          {showCOD && (
            <div className="mb-6 flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Online Pay
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isVerified) {
                    alert("Cash on Delivery is available only for verified customers. Please verify your phone number in the Wallet/Profile section first.");
                    return;
                  }
                  setPaymentMethod('COD');
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  !isVerified ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  paymentMethod === 'COD'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Cash on Delivery
              </button>
            </div>
          )}

          {paymentMethod === 'UPI' ? (
            <>
              <div className="mb-6 flex justify-center sm:mb-8">
                <div className="relative rounded-[1.75rem] border-2 border-dashed border-orange-200 bg-orange-50 p-3 sm:p-4">
                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-inner sm:h-48 sm:w-48">
                    <img
                      src="/images/PaymentQR.jpeg"
                      alt="Payment QR"
                      className="h-32 w-32 opacity-90 sm:h-40 sm:w-40"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-100 bg-white px-4 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400 shadow-sm">
                    Scan to Pay
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Or select your app
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {paymentApps.map((app) => (
                    <a
                      key={app.name}
                      href={getUpiUrl()}
                      className="group flex flex-col items-center rounded-2xl border border-slate-100 p-3 transition-all hover:border-red-100 hover:bg-red-50/50"
                    >
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="mb-2 h-9 w-9 rounded-lg bg-white p-1 object-contain shadow-sm transition-transform group-hover:scale-110 sm:h-10 sm:w-10"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{app.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-4">
              {isVerified ? (
                <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/50 p-5 text-center">
                  <span className="text-3xl mb-3 block">🛵</span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Verified Customer COD</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    You can pay in cash or via UPI to the delivery executive when your order arrives.
                  </p>
                </div>
              ) : (
                <div className="rounded-[1.75rem] border border-red-100 bg-red-50 p-5 text-center">
                  <span className="text-3xl mb-3 block">🔒</span>
                  <h4 className="text-sm font-bold text-red-800 uppercase tracking-wider">COD Unavailable</h4>
                  <p className="text-xs font-bold text-red-700 mt-2 leading-relaxed">
                    Cash On Delivery is available only for verified customers.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    Please verify your phone number in the Wallet/Profile section to unlock COD.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-slate-50 pt-5 sm:mt-8 sm:pt-6">
            {outletName && (
              <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left">
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-700">
                  Routed Outlet
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900">{outletName}</div>
                {outletPhone && (
                  <div className="mt-1 text-[10px] font-medium text-slate-600">Outlet phone: {outletPhone}</div>
                )}
              </div>
            )}

            {paymentMethod === 'COD' && isVerified ? (
              <button
                onClick={() => onPaymentComplete('COD')}
                className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-emerald-600 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 hover:bg-emerald-700"
              >
                <span>Confirm COD Order</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : paymentMethod === 'COD' && !isVerified ? (
              <div className="w-full rounded-2xl bg-slate-100 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-200">
                COD Locked
              </div>
            ) : (
              <button
                onClick={() => onPaymentComplete('UPI')}
                className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-red-600 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95"
              >
                <span>{outletName ? `Place order with ${outletName}` : 'Place your order'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-50 px-5 py-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 sm:px-8">
          {paymentMethod === 'UPI' ? (
            <>
              <span>UPI ID: {upiId}</span>
              <span className="flex items-center text-green-500">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Verified Merchant
              </span>
            </>
          ) : (
            <>
              <span>Harino's Pizza COD</span>
              <span className="flex items-center text-emerald-500">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Pay On Delivery
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
