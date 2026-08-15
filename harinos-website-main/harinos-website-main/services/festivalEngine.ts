import { FESTIVAL_CAMPAIGNS, FestivalCampaign } from '../config/festivalCampaigns';

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

/**
 * Calculates the exact festival promotional discount on the eligible food subtotal.
 * Never applies discount to delivery fees, tip, or separate surcharges.
 */
export const calculateFestivalDiscount = (
  campaign: FestivalCampaign | null,
  eligibleFoodSubtotal: number,
): {
  discountAmount: number;
  discountedSubtotal: number;
  discountPercentage: number;
} => {
  if (!campaign || !campaign.offer || !campaign.offer.enabled || eligibleFoodSubtotal <= 0) {
    return {
      discountAmount: 0,
      discountedSubtotal: eligibleFoodSubtotal,
      discountPercentage: 0,
    };
  }

  const discountPercentage = campaign.offer.discountValue || 0;
  const rawDiscount = (eligibleFoodSubtotal * discountPercentage) / 100;
  const discountAmount = Math.round(rawDiscount);
  const discountedSubtotal = Math.max(0, eligibleFoodSubtotal - discountAmount);

  return {
    discountAmount,
    discountedSubtotal,
    discountPercentage,
  };
};
