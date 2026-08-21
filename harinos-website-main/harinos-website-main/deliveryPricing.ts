import { OutletConfig } from './types';

export interface DeliveryPricingSummary {
  fee: number;
  isServiceable: boolean;
  isFreeDelivery: boolean;
  requiredMinimumOrder: number | null;
  distanceBandKm: number | null;
  shortfall: number | null;
}

export const DELIVERY_CHARGE_PER_KM = 15;

export const getDistanceBandKm = (distanceKm: number, outlet?: OutletConfig | null): number => {
  const roundedDistanceKm = Math.ceil(Math.max(distanceKm, 0.1));
  const freeRadius = outlet?.freeDeliveryRadiusKm ?? 3;
  const maxRadius = outlet?.deliveryRadiusKm ?? 7;
  return Math.min(maxRadius, Math.max(freeRadius, roundedDistanceKm));
};

/**
 * Calculates the required minimum order amount for free delivery based on actual road travel distance:
 * - Up to 3 KM: Rs. 150
 * - Every additional KM (> 3 KM up to 7 KM): +Rs. 100 per additional KM
 */
export const getRequiredMinimumOrderForDistance = (
  outlet: OutletConfig | null,
  distanceKm: number,
): number => {
  const freeRadius = outlet?.freeDeliveryRadiusKm || 3;
  const freeMinOrder = outlet?.freeDeliveryMinimumOrder || 150;
  const incrementPerKm = outlet?.minimumOrderIncrementPerKm || 100;

  if (distanceKm <= freeRadius) {
    return freeMinOrder;
  }

  const additionalKm = Math.ceil(distanceKm - freeRadius);
  return freeMinOrder + additionalKm * incrementPerKm;
};

/**
 * Calculates delivery fee and eligibility using actual road driving distance.
 * If minimum free delivery criteria is not met: Rs. 15 per kilometer charged.
 */
export const getDeliveryPricingSummary = (
  outlet: OutletConfig | null,
  distanceKm: number | null,
  subtotal: number,
): DeliveryPricingSummary => {
  if (!outlet || distanceKm === null || Number.isNaN(distanceKm) || distanceKm <= 0) {
    return {
      fee: 0,
      isServiceable: true,
      isFreeDelivery: false,
      requiredMinimumOrder: null,
      distanceBandKm: null,
      shortfall: null,
    };
  }

  const maxRadiusKm = outlet.deliveryRadiusKm || 7.0;
  // Strict 7 KM road travel limit
  if (distanceKm > maxRadiusKm + 0.05) {
    return {
      fee: -1,
      isServiceable: false,
      isFreeDelivery: false,
      requiredMinimumOrder: null,
      distanceBandKm: null,
      shortfall: null,
    };
  }

  const distanceBandKm = Math.min(7, Math.max(1, Math.ceil(distanceKm)));
  const requiredMinimumOrder = getRequiredMinimumOrderForDistance(outlet, distanceKm);
  const isFreeDelivery = subtotal >= requiredMinimumOrder;

  if (isFreeDelivery) {
    return {
      fee: 0,
      isServiceable: true,
      isFreeDelivery: true,
      requiredMinimumOrder,
      distanceBandKm,
      shortfall: 0,
    };
  }

  // When minimum free delivery criteria is NOT met: Rs. 15 per kilometer
  const chargePerKm = outlet.deliveryChargePerKm || DELIVERY_CHARGE_PER_KM;
  const fee = distanceBandKm * chargePerKm;
  const shortfall = Math.max(0, requiredMinimumOrder - subtotal);

  return {
    fee,
    isServiceable: true,
    isFreeDelivery: false,
    requiredMinimumOrder,
    distanceBandKm,
    shortfall,
  };
};

export const calculateDeliveryPricing = getDeliveryPricingSummary;
