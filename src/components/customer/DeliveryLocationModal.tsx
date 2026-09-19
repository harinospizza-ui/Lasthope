import React, { useState } from 'react';
import { CustomerLocation, OutletConfig } from '../../types';
import OrganicDeliveryMap from '../common/OrganicDeliveryMap';
import { buildCustomerMapUrl, buildOrganicMapsAppUrl, openOrganicMapsNavigation } from '../../utils/outletUtils';
import { HapticsService } from '../../services/hapticsService';
import { OUTLET_LOCATIONS } from '../../config/constants';

interface DeliveryLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: CustomerLocation | null;
  onConfirmLocation: (location: CustomerLocation) => void;
  outlet?: OutletConfig;
}

export const DeliveryLocationModal: React.FC<DeliveryLocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onConfirmLocation,
  outlet = OUTLET_LOCATIONS[0],
}) => {
  const [selectedCoords, setSelectedCoords] = useState<{
    latitude: number;
    longitude: number;
    distanceKm: number;
    isWithin10Km: boolean;
  } | null>(() => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        distanceKm: 0,
        isWithin10Km: true,
      };
    }
    return null;
  });

  const [addressNote, setAddressNote] = useState(currentLocation?.address || '');

  if (!isOpen) return null;

  const handleMapSelect = (coords: {
    latitude: number;
    longitude: number;
    distanceKm: number;
    isWithin10Km: boolean;
  }) => {
    setSelectedCoords(coords);
  };

  const handleConfirm = () => {
    if (!selectedCoords) return;

    void HapticsService.success();
    const finalLocation: CustomerLocation = {
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      address: addressNote.trim() || `GPS: ${selectedCoords.latitude.toFixed(5)}, ${selectedCoords.longitude.toFixed(5)}`,
      mapUrl: buildCustomerMapUrl(selectedCoords.latitude, selectedCoords.longitude),
    };

    onConfirmLocation(finalLocation);
    onClose();
  };

  const maxRadiusKm = outlet?.deliveryRadiusKm ?? 10;
  const isEligible = selectedCoords ? selectedCoords.isWithin10Km : false;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 z-10 animate-slide-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold">
                Set Delivery Location
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Organic Maps 10 KM Active Delivery Zone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Map View */}
        <div className="p-3 sm:p-4 flex-1 overflow-y-auto space-y-3">
          <OrganicDeliveryMap
            initialLat={currentLocation?.latitude}
            initialLon={currentLocation?.longitude}
            outlet={outlet}
            onSelectLocation={handleMapSelect}
            height="290px"
          />

          {/* Address details input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
              House / Flat / Street / Landmark (Optional)
            </label>
            <input
              type="text"
              value={addressNote}
              onChange={(e) => setAddressNote(e.target.value)}
              placeholder="e.g. House 14, Near Radha Krishna Temple, Main Market"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* Delivery Status Card */}
          {selectedCoords && (
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
              isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{isEligible ? '✅' : '⚠️'}</span>
                <div>
                  <div className="font-black text-[11px] uppercase tracking-wider">
                    {isEligible ? 'Eligible for Delivery' : 'Outside 10 KM Delivery Zone'}
                  </div>
                  <div className="text-[11px] opacity-80">
                    Distance to {outlet.name}: <b>{selectedCoords.distanceKm} KM</b> (Max: {maxRadiusKm} KM)
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openOrganicMapsNavigation(selectedCoords.latitude, selectedCoords.longitude)}
                className="px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-[10px] font-black uppercase tracking-wider shadow-xs border border-black/10 shrink-0"
              >
                Organic Maps ➔
              </button>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedCoords || !isEligible}
            className="flex-2 py-3 rounded-2xl bg-red-650 hover:bg-red-750 active:scale-95 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEligible ? 'Confirm Delivery Location 🎯' : 'Selected Point Out of 10 KM'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocationModal;
