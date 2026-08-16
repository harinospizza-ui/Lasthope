import React, { useState } from 'react';
import { CustomerLocation, CustomerProfile } from '../types';
import { initCustomerLogin } from '../services/orderApi';
import { buildCustomerMapUrl } from '../outletUtils';

interface CustomerLoginModalProps {
  onSave: (profile: CustomerProfile, location?: CustomerLocation | null) => void;
}

const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'granted' | 'denied'>('idle');
  const [detectedLocation, setDetectedLocation] = useState<CustomerLocation | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: CustomerLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          mapUrl: buildCustomerMapUrl(position.coords.latitude, position.coords.longitude),
        };
        setDetectedLocation(loc);
        setLocationStatus('granted');
        localStorage.setItem('harinos_cached_location', JSON.stringify(loc));
      },
      (err) => {
        console.warn('Location access denied during login:', err);
        setLocationStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

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
      const result = await initCustomerLogin(cleanPhone, trimmedName, true, referralCode.trim());
      
      if (result.success && result.customer) {
        onSave(result.customer, detectedLocation);
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
      <div className="w-full max-w-md rounded-t-[2.5rem] bg-white p-8 shadow-2xl sm:rounded-[2.5rem] transition-all relative overflow-hidden border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl mt-2 select-none">
            <img 
              src="/icon-192.png" 
              alt="Harino's" 
              className="h-20 w-20 rounded-2xl shadow-xl hover:scale-105 transition-transform" 
            />
          </div>

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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all text-sm shadow-sm"
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
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all text-sm shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(event) => setReferralCode(event.target.value)}
              placeholder="Enter referral code"
              disabled={loading}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-bold text-slate-800 outline-none focus:border-red-500 focus:bg-white transition-all text-sm shadow-sm"
            />
          </div>

          {/* Location Permission Option at Login */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition-all">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                    Device Location
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    {locationStatus === 'granted'
                      ? 'Location captured for fast routing'
                      : locationStatus === 'detecting'
                      ? 'Detecting current coordinates...'
                      : 'Optional at login, mandatory for delivery'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={requestLocation}
                disabled={locationStatus === 'detecting' || locationStatus === 'granted'}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  locationStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : locationStatus === 'detecting'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-red-650 text-white hover:bg-red-750 shadow-sm'
                }`}
              >
                {locationStatus === 'granted'
                  ? '✓ Allowed'
                  : locationStatus === 'detecting'
                  ? 'Detecting...'
                  : 'Allow Location'}
              </button>
            </div>
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
