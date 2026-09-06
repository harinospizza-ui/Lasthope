import { FestivalCampaign, getAllGeneratedFestivalCampaigns } from '../config/festivalCampaigns';
import { Category, PricedCartItem, CartItem } from '../types';

export type FestivalLifecycleState = 'PRE_FESTIVAL' | 'ACTIVE_OFFER' | 'ENDED';

export interface FestivalCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  state: FestivalLifecycleState;
  isLive: boolean;
  isUpcoming: boolean;
  isEnded: boolean;
  targetLabel: string;
  targetDateStr: string;
}

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
 * Helper to get the current timestamp in India Standard Time (IST / UTC+05:30)
 */
export const getNowTimestampIST = (overrideDate?: Date | string): number => {
  if (overrideDate) {
    return new Date(overrideDate).getTime();
  }
  return Date.now();
};

/**
 * Gets the current 4-digit calendar year in Asia/Kolkata timezone.
 */
export const getCurrentYearIST = (overrideDate?: Date | string): number => {
  const d = overrideDate ? new Date(overrideDate) : new Date();
  const yearStr = d.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' });
  return parseInt(yearStr, 10) || d.getFullYear();
};

/**
 * Formats an ISO string to human readable IST string (e.g. "27 Aug")
 */
export const formatISTDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return isoString;
  }
};

/**
 * Returns the exact lifecycle state of a festival campaign at a given time:
 * - 'PRE_FESTIVAL': During the 7-day theme week before the discount offer unlocks.
 * - 'ACTIVE_OFFER': During the festival day when the discount is live.
 * - 'ENDED': When the festival has concluded.
 */
export const getFestivalLifecycleState = (
  campaign: FestivalCampaign | null,
  overrideDate?: Date | string,
): FestivalLifecycleState => {
  if (!campaign || !campaign.enabled) {
    return 'ENDED';
  }

  const currentTs = getNowTimestampIST(overrideDate);
  const startTs = new Date(campaign.startDate).getTime();
  const offerStartTs = new Date(campaign.offerStartDate).getTime();
  const offerEndTs = new Date(campaign.offerEndDate).getTime();

  if (currentTs >= offerStartTs && currentTs <= offerEndTs) {
    return 'ACTIVE_OFFER';
  }

  if (currentTs >= startTs && currentTs < offerStartTs) {
    return 'PRE_FESTIVAL';
  }

  return 'ENDED';
};

/**
 * Checks if the promotional offer discount is live today.
 */
export const isCampaignOfferActive = (
  campaign: FestivalCampaign | null,
  overrideDate?: Date | string,
): boolean => {
  return getFestivalLifecycleState(campaign, overrideDate) === 'ACTIVE_OFFER';
};

/**
 * Checks if the campaign is in the pre-festival countdown week.
 */
export const isCampaignUpcomingOffer = (
  campaign: FestivalCampaign | null,
  overrideDate?: Date | string,
): boolean => {
  return getFestivalLifecycleState(campaign, overrideDate) === 'PRE_FESTIVAL';
};

/**
 * Evaluates the centralized festival calendar and deterministically returns ONE authoritative active campaign.
 * Precedence Rule:
 * 1. Active offer discount campaign takes highest precedence
 * 2. Pre-festival theme campaign with highest priority score
 * 3. Latest start date (tie-breaker)
 * 4. Deterministic alphabetical ID
 */
export const getActiveFestivalCampaign = (overrideDate?: Date | string): FestivalCampaign | null => {
  const currentTs = getNowTimestampIST(overrideDate);
  const currentYear = getCurrentYearIST(overrideDate);
  const allCampaigns = getAllGeneratedFestivalCampaigns(currentYear);

  const activeCampaigns = allCampaigns.filter((campaign) => {
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
    const stateA = getFestivalLifecycleState(a, overrideDate);
    const stateB = getFestivalLifecycleState(b, overrideDate);

    // 1. Live discount offer ('ACTIVE_OFFER') wins over pre-festival theme ('PRE_FESTIVAL')
    if (stateA === 'ACTIVE_OFFER' && stateB !== 'ACTIVE_OFFER') return -1;
    if (stateB === 'ACTIVE_OFFER' && stateA !== 'ACTIVE_OFFER') return 1;

    // 2. Highest priority score
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    // 3. Latest start date
    const bStart = new Date(b.startDate).getTime();
    const aStart = new Date(a.startDate).getTime();
    if (bStart !== aStart) {
      return bStart - aStart;
    }

    // 4. Deterministic alphabetical ID
    return a.id.localeCompare(b.id);
  });

  return activeCampaigns[0];
};

/**
 * Computes state-aware countdown:
 * - Before festival: Counts down until festival offer starts.
 * - On festival day: Counts down until festival offer ends.
 * - After festival: Returns isEnded: true.
 */
export const getFestivalCountdown = (
  campaign: FestivalCampaign | null,
  overrideDate?: Date | string,
): FestivalCountdown | null => {
  if (!campaign || !campaign.offer) return null;

  const currentTs = getNowTimestampIST(overrideDate);
  const state = getFestivalLifecycleState(campaign, overrideDate);
  const offerStartTs = new Date(campaign.offerStartDate).getTime();
  const offerEndTs = new Date(campaign.offerEndDate).getTime();

  if (state === 'PRE_FESTIVAL') {
    const diffMs = Math.max(0, offerStartTs - currentTs);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: diffMs,
      state: 'PRE_FESTIVAL',
      isLive: false,
      isUpcoming: true,
      isEnded: false,
      targetLabel: 'Offer Starts In:',
      targetDateStr: formatISTDate(campaign.offerStartDate),
    };
  }

  if (state === 'ACTIVE_OFFER') {
    const diffMs = Math.max(0, offerEndTs - currentTs);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMs: diffMs,
      state: 'ACTIVE_OFFER',
      isLive: true,
      isUpcoming: false,
      isEnded: false,
      targetLabel: 'Offer Ends In:',
      targetDateStr: 'Today',
    };
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
    state: 'ENDED',
    isLive: false,
    isUpcoming: false,
    isEnded: true,
    targetLabel: 'Offer Ended',
    targetDateStr: 'Ended',
  };
};

/**
 * Calculates festival discount.
 * Strictly returns 0 if lifecycle is PRE_FESTIVAL or ENDED.
 */
export const calculateFestivalDiscount = (
  campaign: FestivalCampaign | null,
  itemsOrSubtotal: PricedCartItem[] | CartItem[] | any[] | number,
  fallbackSubtotal?: number,
  overrideDate?: Date | string,
): FestivalDiscountResult => {
  if (!isCampaignOfferActive(campaign, overrideDate)) {
    const rawSubtotal =
      typeof itemsOrSubtotal === 'number'
        ? itemsOrSubtotal
        : Array.isArray(itemsOrSubtotal)
        ? itemsOrSubtotal.reduce(
            (sum, i) => sum + (i.totalPrice ?? (i.price || 0) * (i.quantity || 1)),
            0,
          )
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
