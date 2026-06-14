import React, { useRef, useState } from 'react';
import { CustomerProfile } from '../types';

interface CustomerLoginModalProps {
  onSave: (profile: CustomerProfile) => void;
  onAdminTrigger?: () => void;
}

const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ onSave, onAdminTrigger }) => {
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const logoHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your name and mobile number.');
      return;
    }

    onSave({
      id: `${phone.replace(/\D/g, '') || Date.now()}-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      loginMethod: mode,
      verified: false,
      createdAt: new Date().toISOString(),
    });
  };

  const startAdminHold = () => {
    if (!onAdminTrigger) return;
    if (logoHoldTimer.current) clearTimeout(logoHoldTimer.current);
    logoHoldTimer.current = setTimeout(() => {
      navigator.vibrate?.(200);
      onAdminTrigger();
    }, 7000);
  };

  const cancelAdminHold = () => {
    if (!logoHoldTimer.current) return;
    clearTimeout(logoHoldTimer.current);
    logoHoldTimer.current = null;
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-md sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem]">
        <button
          onPointerDown={startAdminHold}
          onPointerUp={cancelAdminHold}
          onPointerCancel={cancelAdminHold}
          onPointerLeave={cancelAdminHold}
          onContextMenu={(event) => event.preventDefault()}
          className="mx-auto block select-none rounded-2xl"
          aria-label="Harino's"
          style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
        >
          <img src="/icon-192.png" alt="Harino's" className="h-16 w-16 rounded-2xl shadow-xl" />
        </button>
        <h2 className="mt-4 text-center font-display text-3xl font-bold text-slate-900">Welcome to Harino&apos;s</h2>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">
          Sign in once. We save your details on this device for future orders.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button onClick={() => setMode('phone')} className={`rounded-xl py-3 text-[10px] font-black uppercase tracking-widest ${mode === 'phone' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>
            Mobile
          </button>
          <button onClick={() => setMode('email')} className={`rounded-xl py-3 text-[10px] font-black uppercase tracking-widest ${mode === 'email' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>
            Email
          </button>
        </div>

        {mode === 'email' && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Email providers do not share phone numbers with websites. Please enter the mobile number you want verified.
          </p>
        )}

        <div className="mt-5 space-y-3">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-red-500" />
          {mode === 'email' && (
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-red-500" />
          )}
          <input value={phone} onChange={(event) => setPhone(event.target.value.replace(/[^\d+ ]/g, ''))} type="tel" inputMode="tel" placeholder="Mobile number" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold outline-none focus:border-red-500" />
        </div>

        <button onClick={submit} className="mt-5 w-full rounded-2xl bg-red-600 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-white">
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default CustomerLoginModal;
