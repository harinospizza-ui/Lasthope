import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OUTLET_LOCATIONS } from '../../config/constants';
import { calculateHaversineDistanceKm, openOrganicMapsNavigation, buildOrganicMapsAppUrl, buildOpenStreetMapUrl } from '../../utils/outletUtils';
import { HapticsService } from '../../services/hapticsService';
import { OutletConfig } from '../../types';

interface OrganicDeliveryMapProps {
  initialLat?: number;
  initialLon?: number;
  outlet?: OutletConfig;
  readOnly?: boolean;
  onSelectLocation?: (coords: { latitude: number; longitude: number; distanceKm: number; isWithin10Km: boolean }) => void;
  height?: string;
  className?: string;
  showControls?: boolean;
}

export const OrganicDeliveryMap: React.FC<OrganicDeliveryMapProps> = ({
  initialLat,
  initialLon,
  outlet = OUTLET_LOCATIONS[0],
  readOnly = false,
  onSelectLocation,
  height = '360px',
  className = '',
  showControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const radius10KmCircleRef = useRef<L.Circle | null>(null);
  const radius3KmCircleRef = useRef<L.Circle | null>(null);

  const outletLat = outlet?.latitude ?? 28.011897;
  const outletLon = outlet?.longitude ?? 77.675534;
  const maxRadiusKm = outlet?.deliveryRadiusKm ?? 10;

  const [customerCoords, setCustomerCoords] = useState<{ latitude: number; longitude: number } | null>(() => {
    if (initialLat && initialLon) {
      return { latitude: initialLat, longitude: initialLon };
    }
    return null;
  });

  const [distanceKm, setDistanceKm] = useState<number | null>(() => {
    if (initialLat && initialLon) {
      return Math.round(calculateHaversineDistanceKm(initialLat, initialLon, outletLat, outletLon) * 1.22 * 10) / 10;
    }
    return null;
  });

  const [isLocating, setIsLocating] = useState(false);

  const isWithin10Km = distanceKm !== null ? distanceKm <= maxRadiusKm + 0.1 : true;

  // Custom marker icons using SVG for crisp rendering across all screen densities
  const createOutletIcon = () => {
    return L.divIcon({
      className: 'harinos-outlet-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: linear-gradient(135deg, #e11d48, #c026d3); color: white; padding: 4px 8px; border-radius: 9999px; font-weight: 900; font-size: 10px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(225,29,72,0.4); border: 2px solid white; white-space: nowrap; margin-bottom: 2px;">
            🍕 Harino's Outlet
          </div>
          <div style="width: 32px; height: 32px; background: #e11d48; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            <span style="transform: rotate(45deg); font-size: 14px;">🏠</span>
          </div>
          <div style="width: 10px; height: 10px; background: rgba(0,0,0,0.25); border-radius: 50%; filter: blur(2px); margin-top: -3px;"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const createCustomerIcon = (isWithinZone: boolean) => {
    const bgColor = isWithinZone ? '#10b981' : '#ef4444';
    const ringColor = isWithinZone ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
    return L.divIcon({
      className: 'harinos-customer-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: ${bgColor}; color: white; padding: 3px 8px; border-radius: 9999px; font-weight: 800; font-size: 10px; box-shadow: 0 4px 12px ${ringColor}; border: 2px solid white; white-space: nowrap; margin-bottom: 2px;">
            ${isWithinZone ? '📍 Delivery Point' : '⚠️ Outside 10km Zone'}
          </div>
          <div style="width: 30px; height: 30px; background: ${bgColor}; border: 3px solid white; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
            <span style="transform: rotate(45deg); font-size: 13px;">🎯</span>
          </div>
          <div style="width: 12px; height: 12px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(2px); margin-top: -4px;"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  const updatePosition = useCallback((lat: number, lon: number) => {
    const estimatedDistance = Math.round(calculateHaversineDistanceKm(lat, lon, outletLat, outletLon) * 1.22 * 10) / 10;
    const withinZone = estimatedDistance <= maxRadiusKm + 0.1;

    setCustomerCoords({ latitude: lat, longitude: lon });
    setDistanceKm(estimatedDistance);

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([lat, lon]);
      customerMarkerRef.current.setIcon(createCustomerIcon(withinZone));
    }

    if (onSelectLocation) {
      onSelectLocation({
        latitude: lat,
        longitude: lon,
        distanceKm: estimatedDistance,
        isWithin10Km: withinZone,
      });
    }
  }, [outletLat, outletLon, maxRadiusKm, onSelectLocation]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center between outlet and customer location, or on outlet
    const initialCenterLat = customerCoords?.latitude ?? outletLat;
    const initialCenterLon = customerCoords?.longitude ?? outletLon;

    const map = L.map(mapContainerRef.current, {
      center: [initialCenterLat, initialCenterLon],
      zoom: customerCoords ? 13 : 12,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality OpenStreetMap tiles (underlying map dataset for Organic Maps)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    // Zoom control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Outlet Marker
    const outletMarker = L.marker([outletLat, outletLon], {
      icon: createOutletIcon(),
      interactive: true,
      zIndexOffset: 100,
    }).addTo(map);

    outletMarker.bindPopup(`
      <div style="font-family: system-ui; text-align: center; padding: 4px;">
        <b style="color: #e11d48; font-size: 13px;">${outlet.name}</b><br/>
        <span style="font-size: 11px; color: #64748b;">Central Delivery Kitchen</span><br/>
        <div style="margin-top: 6px; font-size: 10px; font-weight: 700; color: #10b981; background: #ecfdf5; padding: 2px 6px; border-radius: 6px;">
          10 KM Active Delivery Zone
        </div>
      </div>
    `);

    // 10 KM Delivery Zone Perimeter Circle
    const radius10KmCircle = L.circle([outletLat, outletLon], {
      radius: maxRadiusKm * 1000,
      color: '#e11d48',
      fillColor: '#10b981',
      fillOpacity: 0.1,
      weight: 2.5,
      dashArray: '6, 8',
    }).addTo(map);
    radius10KmCircleRef.current = radius10KmCircle;

    radius10KmCircle.bindPopup(`
      <div style="font-family: system-ui; text-align: center;">
        <b style="color: #e11d48;">10 KM Delivery Boundary</b><br/>
        <span style="font-size: 11px; color: #475569;">All addresses inside this zone are eligible for door delivery.</span>
      </div>
    `);

    // 3 KM Free Delivery Inner Circle
    const radius3KmCircle = L.circle([outletLat, outletLon], {
      radius: 3000,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.15,
      weight: 1.5,
    }).addTo(map);
    radius3KmCircleRef.current = radius3KmCircle;

    // Customer Location Marker
    if (customerCoords) {
      const withinZone = (distanceKm ?? 0) <= maxRadiusKm + 0.1;
      const custMarker = L.marker([customerCoords.latitude, customerCoords.longitude], {
        icon: createCustomerIcon(withinZone),
        draggable: !readOnly,
        zIndexOffset: 200,
      }).addTo(map);

      custMarker.on('dragend', (e) => {
        void HapticsService.light();
        const marker = e.target as L.Marker;
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });

      customerMarkerRef.current = custMarker;
    }

    // Map click to place/move marker
    if (!readOnly) {
      map.on('click', (e) => {
        void HapticsService.light();
        const { lat, lng } = e.latlng;
        if (!customerMarkerRef.current) {
          const withinZone = calculateHaversineDistanceKm(lat, lng, outletLat, outletLon) * 1.22 <= maxRadiusKm + 0.1;
          const custMarker = L.marker([lat, lng], {
            icon: createCustomerIcon(withinZone),
            draggable: true,
            zIndexOffset: 200,
          }).addTo(map);

          custMarker.on('dragend', (ev) => {
            void HapticsService.light();
            const marker = ev.target as L.Marker;
            const pos = marker.getLatLng();
            updatePosition(pos.lat, pos.lng);
          });
          customerMarkerRef.current = custMarker;
        }
        updatePosition(lat, lng);
      });
    }

    mapInstanceRef.current = map;

    // Timeout to ensure map container sizes correctly
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run once on mount

  // Locate user GPS
  const handleLocateMe = useCallback(() => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    void HapticsService.medium();
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        updatePosition(lat, lon);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lon], 15, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS location fetch failed:', err);
        alert('Could not access current location. Please tap directly on the map to set your delivery spot.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [updatePosition]);

  // Fit 10 KM Zone
  const handleFitZone = useCallback(() => {
    if (!mapInstanceRef.current || !radius10KmCircleRef.current) return;
    void HapticsService.light();
    mapInstanceRef.current.fitBounds(radius10KmCircleRef.current.getBounds(), { padding: [30, 30] });
  }, []);

  // Open Organic Maps app
  const handleOpenOrganicMaps = useCallback(() => {
    void HapticsService.medium();
    const lat = customerCoords?.latitude ?? outletLat;
    const lon = customerCoords?.longitude ?? outletLon;
    openOrganicMapsNavigation(lat, lon, `Harino's Delivery (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
  }, [customerCoords, outletLat, outletLon]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md flex flex-col ${className}`}>
      {/* Delivery Zone Information Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">🗺️</span>
          <div className="truncate">
            <span className="font-black text-amber-400 uppercase tracking-wider text-[10px]">
              Organic Maps 10 KM Coverage
            </span>
            <div className="text-[11px] text-slate-300 truncate">
              {customerCoords ? (
                <span>
                  Distance: <b className="text-white">{distanceKm} KM</b>
                  {isWithin10Km ? (
                    <span className="ml-1.5 text-emerald-400 font-bold">✓ Within 10 KM Zone</span>
                  ) : (
                    <span className="ml-1.5 text-red-400 font-bold">⚠️ Outside 10 KM Zone</span>
                  )}
                </span>
              ) : (
                <span>Tap map or &quot;My GPS&quot; to set delivery point</span>
              )}
            </div>
          </div>
        </div>

        {distanceKm !== null && (
          <div className="shrink-0 text-right">
            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isWithin10Km ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}>
              {isWithin10Km ? 'Eligible' : 'Out of Reach'}
            </span>
          </div>
        )}
      </div>

      {/* Map Leaflet Canvas */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />

      {/* Map Interactive Quick Actions Bar */}
      {showControls && (
        <div className="bg-slate-50 border-t border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
          <div className="flex items-center gap-2">
            {!readOnly && (
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
              >
                <span>{isLocating ? '⏳' : '📍'}</span>
                <span>{isLocating ? 'Locating...' : 'My GPS'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFitZone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 active:scale-95 text-slate-700 text-[11px] font-bold transition-all shadow-xs"
              title="Fit entire 10 KM delivery radius"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">10 KM Zone</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenOrganicMaps}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-[11px] font-black uppercase tracking-wider shadow-sm transition-all ml-auto"
            title="Open in Organic Maps / OpenStreetMap for turn-by-turn navigation"
          >
            <span>📱</span>
            <span>Open in Organic Maps</span>
          </button>
        </div>
      )}

      {/* Instructions footer */}
      {!readOnly && (
        <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-100/80 text-[10px] text-amber-800 flex items-center justify-between">
          <span>💡 <b>Tip:</b> Tap or drag marker directly to your doorstep/gate.</span>
          <span className="font-bold text-slate-600">Green ring = 3km Free | Red ring = 10km Max</span>
        </div>
      )}
    </div>
  );
};

export default OrganicDeliveryMap;
