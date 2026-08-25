/**
 * Centralized Festival Campaign Model & Dynamic Multi-Year Resolver
 * 
 * Rules:
 * 1. Timezone: IST (UTC+05:30)
 * 2. Precedence: Sorted deterministically by highest priority first, then latest start date.
 * 3. Commercial non-Muslim Indian national occasions & cultural festivals only.
 * 4. Strict Asset Isolation: Every campaign owns its own isolated visual identity.
 */

import { MULTI_YEAR_FESTIVALS, FestivalCategory } from './festivalCalendar';

export interface FestivalOffer {
  enabled: boolean;
  discountType: 'percentage';
  discountValue: number;
  pizzaDiscountValue?: number;
  otherDiscountValue?: number;
  title: string;
  badge: string;
  description: string;
  terms: string;
  offerStartDate?: string;
  offerEndDate?: string;
}

export interface FestivalTheme {
  primaryAccent: string;
  secondaryAccent: string;
  badgeBg: string;
  badgeText: string;
  heroTag: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroGradient: string;
  accentBorder: string;
  themeGlow: string;
}

export interface FestivalMedia {
  heroImage?: string;
  promotionalImage?: string;
  video?: string;
  videoPoster?: string;
}

export interface FestivalCampaign {
  id: string;
  baseId: string;
  name: string;
  category: FestivalCategory;
  eventType: 'national' | 'festival';
  financialYear: string;
  startDate: string; // ISO 8601 with +05:30 offset (Theme Week start: 7 days before festival day)
  endDate: string; // ISO 8601 with +05:30 offset (Theme Week end: ends when festival concludes)
  offerStartDate: string; // ISO 8601 (Festival day 00:00:00+05:30)
  offerEndDate: string; // ISO 8601 (Festival day 23:59:59+05:30)
  priority: number;
  enabled: boolean;
  theme: FestivalTheme;
  media: FestivalMedia;
  offer: FestivalOffer;
}

/**
 * Calculates a dynamic ISO timestamp string in IST (+05:30) offset.
 */
const toISTString = (dateStr: string, timeStr: string): string => {
  return `${dateStr}T${timeStr}+05:30`;
};

/**
 * Computes a date that is `daysOffset` days before a given date string (YYYY-MM-DD).
 */
const subtractDays = (dateStr: string, days: number): string => {
  const d = new Date(`${dateStr}T00:00:00+05:30`);
  d.setDate(d.getDate() - days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Generates the full list of campaigns for a specific calendar year from the master multi-year calendar.
 */
export const getCampaignsForYear = (year: number): FestivalCampaign[] => {
  const campaigns: FestivalCampaign[] = [];

  for (const def of MULTI_YEAR_FESTIVALS) {
    const yearConfig = def.datesByYear[year];
    if (!yearConfig || !yearConfig.festivalDay) continue;

    const festivalDay = yearConfig.festivalDay;
    const festivalDayEnd = yearConfig.festivalDayEnd || festivalDay;
    const themeDurationDays = yearConfig.themeDurationDays || 7;

    // Theme starts exactly `themeDurationDays` (default 7 days) before the festival day
    const themeStartDateStr = subtractDays(festivalDay, themeDurationDays);
    const themeEndDateStr = festivalDayEnd;

    const startDate = toISTString(themeStartDateStr, '00:00:00');
    const endDate = toISTString(themeEndDateStr, '23:59:59');
    const offerStartDate = toISTString(festivalDay, '00:00:00');
    const offerEndDate = toISTString(festivalDayEnd, '23:59:59');

    // Determine financial year (e.g. 2026-27)
    const month = parseInt(festivalDay.split('-')[1], 10);
    const fyStart = month >= 4 ? year : year - 1;
    const financialYear = `${fyStart}-${String(fyStart + 1).slice(-2)}`;

    campaigns.push({
      id: `${def.id}-${year}`,
      baseId: def.id,
      name: def.name,
      category: def.category,
      eventType: def.category === 'national' ? 'national' : 'festival',
      financialYear,
      startDate,
      endDate,
      offerStartDate,
      offerEndDate,
      priority: def.priority,
      enabled: def.offer.enabled,
      theme: def.theme,
      media: {
        heroImage: `/festivals/${def.id}/hero.webp`,
        promotionalImage: `/festivals/${def.id}/offer.webp`,
        videoPoster: `/festivals/${def.id}/hero.webp`,
      },
      offer: {
        ...def.offer,
        offerStartDate,
        offerEndDate,
      },
    });
  }

  return campaigns;
};

/**
 * Dynamically generated active campaigns spanning current, previous, and next year
 * to seamlessly cover transitions across New Year boundaries.
 */
export const getAllGeneratedFestivalCampaigns = (currentYear?: number): FestivalCampaign[] => {
  const year = currentYear || new Date().getFullYear();
  return [
    ...getCampaignsForYear(year - 1),
    ...getCampaignsForYear(year),
    ...getCampaignsForYear(year + 1),
  ];
};

/**
 * Exported constant for backward compatibility
 */
export const FESTIVAL_CAMPAIGNS: FestivalCampaign[] = getAllGeneratedFestivalCampaigns(2026);
