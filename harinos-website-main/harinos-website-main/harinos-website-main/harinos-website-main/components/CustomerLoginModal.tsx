import React, { useState, useRef } from 'react';
import { CustomerProfile } from '../types';
import { initCustomerLogin } from '../services/orderApi';

const checkBusinessHours = (): boolean => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5)); // IST is UTC+5.5
  const hours = ist.getHours();
  return hours >= 11 && hours < 21;
};

interface CustomerLoginModalProps {
  onSave: (profile: CustomerProfile) => void;
  onAdminTrigger?: () => void;
}

const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ onSave, onAdminTrigger }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Logo click counter for Admin Portal (9 rapid clicks)
  const [logoClicks, setLogoClicks] = useState(0);
  const lastLogoClickTime = useRef(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onAdminTrigger) return;
    const now = Date.now();
    if (now - lastLogoClickTime.current > 3000) {
      setLogoClicks(1);
    } else {
      const nextCount = logoClicks + 1;
      setLogoClicks(nextCount);
      if (nextCount >= 9) {
        setLogoClicks(0);
        navigator.vibrate?.(200);
        onAdminTrigger();
      }
    }
    lastLogoClickTime.current = now;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!checkBusinessHours()) {
      setError("Harino's online ordering is available between 11:00 AM and 9:00 PM.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const result = await initCustomerLogin(cleanPhone, trimmedName, true);
      
      if (result.success && result.customer) {
        onSave(result.customer);
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error logging in. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-slate-950/80 p-0 backdrop-blur-md sm:items-center sm:p-4 animate-slide-up">
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-white p-8 shadow-2xl sm:rounded-[2.5rem] transition-all relative overflow-hidden border border-slate-100">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLogoClick}
            onContextMenu={(event) => event.preventDefault()}
            className="select-none rounded-2xl cursor-pointer mt-2 focus:outline-none"
            aria-label="Harino's Logo"
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
          >
            <img 
              src="/icon-192.png" 
              alt="Harino's" 
              className="h-20 w-20 rounded-2xl shadow-xl hover:scale-105 transition-transform" 
            />
          </button>

          <h2 className="mt-5 text-center font-display text-3xl font-black tracking-tight text-slate-900">
            Welcome to Harino's Pizza
          </h2>
          
          <p className="mt-2 text-center text-xs leading-5 text-slate-500 font-medium px-4">
            Enjoy fresh, hot, custom-made pizzas delivered right to your door. Enter your name and phone number to start ordering.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-150 rounded-2xl text-xs font-bold text-red-700 text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all text-sm shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/[^\d]/g, ''))}
              placeholder="Enter 10-digit mobile number"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-bold text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all text-sm shadow-sm"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-2xl bg-red-650 hover:bg-red-500 text-white py-4 text-[11px] font-black uppercase tracking-widest transition-premium active:scale-95 shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {loading ? "Entering..." : "🍕 Let's Pizza"}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default CustomerLoginModal;
