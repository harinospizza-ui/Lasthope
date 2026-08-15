import { FESTIVAL_CAMPAIGNS, FestivalCampaign } from '../config/festivalCampaigns';
import { Category, PricedCartItem, CartItem } from '../types';

/**
 * Helper to get the current timestamp in India Standard Time (IST / UTC+05:30)
 * Allows optional date override for testing transitions.
 */
export const getNowTimestampIST = (overrideDate?: Date | string): number => {
  if (overrideDate) {
    return new Date(overrideDate).getTime();
  }
  return Date.now();
};

/**
 * Formats a Date/ISO string to human readable IST string
 */
export const formatISTDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return isoString;
  }
};

/**
 * Evaluates the centralized festival calendar and deterministically returns the active campaign.
 * Precedence Rule:
 * 1. Enabled status
 * 2. Active date window: startDate <= currentIST <= endDate (inclusive)
 * 3. Highest priority (e.g. 100 > 90)
 * 4. Latest startDate (tie-breaker)
 * 5. Alphabetical ID (guaranteed deterministic tie-breaker)
 */
export const getActiveFestivalCampaign = (overrideDate?: Date | string): FestivalCampaign | null => {
  const currentTs = getNowTimestampIST(overrideDate);

  const activeCampaigns = FESTIVAL_CAMPAIGNS.filter((campaign) => {
    if (!campaign.enabled) return false;

    const startTs = new Date(campaign.startDate).getTime();
    const endTs = new Date(campaign.endDate).getTime();

    return currentTs >= startTs && currentTs <= endTs;
  });

  if (activeCampaigns.length === 0) {
    return null;
  }

  // Deterministic sorting
  activeCampaigns.sort((a, b) => {
    // 1. Priority descending
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    // 2. Start date descending
    const bStart = new Date(b.startDate).getTime();
    const aStart = new Date(a.startDate).getTime();
    if (bStart !== aStart) {
      return bStart - aStart;
    }
    // 3. Alphabetical ID
    return a.id.localeCompare(b.id);
  });

  return activeCampaigns[0];
};

/**
 * Returns the next scheduled festival campaign after the current date.
 * Useful for debugging, Admin inspection, and asset preloading.
 */
export const getNextUpcomingFestivalCampaign = (overrideDate?: Date | string): FestivalCampaign | null => {
  const currentTs = getNowTimestampIST(overrideDate);

  const upcomingCampaigns = FESTIVAL_CAMPAIGNS.filter((campaign) => {
    if (!campaign.enabled) return false;
    const startTs = new Date(campaign.startDate).getTime();
    return startTs > currentTs;
  });

  if (upcomingCampaigns.length === 0) {
    return null;
  }

  upcomingCampaigns.sort((a, b) => {
    const aStart = new Date(a.startDate).getTime();
    const bStart = new Date(b.startDate).getTime();
    return aStart - bStart;
  });

  return upcomingCampaigns[0];
};

export interface FestivalDiscountResult {
  discountAmount: number;
  discountedSubtotal: number;
  discountPercentage: number;
  pizzaDiscountAmount: number;
  otherDiscountAmount: number;
  pizzaSubtotal: number;
  otherSubtotal: number;
}

/**
 * Calculates the exact festival promotional discount on the eligible food subtotal or items list.
 * Supports differential discounts: e.g. 20% on Pizzas & 10% on all other items.
 * Never applies discount to delivery fees, tips, or separate surcharges.
 */
export const calculateFestivalDiscount = (
  campaign: FestivalCampaign | null,
  itemsOrSubtotal: PricedCartItem[] | CartItem[] | any[] | number,
  fallbackSubtotal?: number,
): FestivalDiscountResult => {
  if (!campaign || !campaign.offer || !campaign.offer.enabled) {
    const rawSubtotal = typeof itemsOrSubtotal === 'number'
      ? itemsOrSubtotal
      : Array.isArray(itemsOrSubtotal)
        ? itemsOrSubtotal.reduce((sum, i) => sum + (i.totalPrice ?? (i.price || 0) * (i.quantity || 1)), 0)
        : fallbackSubtotal ?? 0;

    return {
      discountAmount: 0,
      discountedSubtotal: rawSubtotal,
      discountPercentage: 0,
      pizzaDiscountAmount: 0,
      otherDiscountAmount: 0,
      pizzaSubtotal: 0,
      otherSubtotal: rawSubtotal,
    };
  }

  const defaultDiscountRate = campaign.offer.discountValue || 0;
  const pizzaRate = campaign.offer.pizzaDiscountValue !== undefined ? campaign.offer.pizzaDiscountValue : defaultDiscountRate;
  const otherRate = campaign.offer.otherDiscountValue !== undefined ? campaign.offer.otherDiscountValue : defaultDiscountRate;

  // Case 1: Items array provided -> Exact per-item category calculation
  if (Array.isArray(itemsOrSubtotal)) {
    let pizzaSubtotal = 0;
    let otherSubtotal = 0;

    for (const item of itemsOrSubtotal) {
      if (item.isOfferBonus) continue;
      const linePrice = item.totalPrice ?? ((item.price || item.basePrice || 0) * (item.quantity || 1));
      const isPizza = item.category === Category.PIZZA || (typeof item.category === 'string' && item.category.toLowerCase() === 'pizza');

      if (isPizza) {
        pizzaSubtotal += linePrice;
      } else {
        otherSubtotal += linePrice;
      }
    }

    const totalRawSubtotal = pizzaSubtotal + otherSubtotal;
    const pizzaDiscount = (pizzaSubtotal * pizzaRate) / 100;
    const otherDiscount = (otherSubtotal * otherRate) / 100;
    const totalDiscount = Math.round(pizzaDiscount + otherDiscount);
    const discountedSubtotal = Math.max(0, totalRawSubtotal - totalDiscount);

    return {
      discountAmount: totalDiscount,
      discountedSubtotal,
      discountPercentage: defaultDiscountRate,
      pizzaDiscountAmount: Math.round(pizzaDiscount),
      otherDiscountAmount: Math.round(otherDiscount),
      pizzaSubtotal,
      otherSubtotal,
    };
  }

  // Case 2: Pure numeric subtotal provided
  const rawSubtotal = Number(itemsOrSubtotal) || 0;
  const rawDiscount = (rawSubtotal * defaultDiscountRate) / 100;
  const discountAmount = Math.round(rawDiscount);
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);

  return {
    discountAmount,
    discountedSubtotal,
    discountPercentage: defaultDiscountRate,
    pizzaDiscountAmount: 0,
    otherDiscountAmount: discountAmount,
    pizzaSubtotal: 0,
    otherSubtotal: rawSubtotal,
  };
};

