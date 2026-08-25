/**
 * Master Multi-Year Indian Festival Calendar
 * 
 * Rules:
 * 1. Timezone: India Standard Time (IST / Asia/Kolkata / UTC+05:30)
 * 2. Accurate Celebration Dates: Exact cultural observance dates (e.g. Raksha Bandhan 2026 is Friday, 28 August 2026).
 * 3. Cultural Authenticity: Each festival has its own dedicated visual motifs, themes, colors, and copy.
 * 4. Multi-Year Support: Gregorian & Lunar date mappings for 2026-2030+ with manual override capability.
 * 5. Islamic/Lunar Date Safety: Configurable with lunar observation flags and manual date overrides.
 */

export type FestivalCategory = 'national' | 'hindu' | 'sikh' | 'jain' | 'christian' | 'islamic' | 'commercial';

export interface MultiYearFestivalDefinition {
  id: string;
  name: string;
  hindiName?: string;
  category: FestivalCategory;
  priority: number; // Higher number = higher precedence during overlap
  dateSource?: 'solar' | 'lunar' | 'fixed' | 'observation';
  manualDateOverride?: string; // Admin override if moon sighting changes
  datesByYear: Record<number, {
    festivalDay: string; // YYYY-MM-DD (Exact celebration date)
    festivalDayEnd?: string; // YYYY-MM-DD (for multi-day events)
    campaignStartDays?: number; // Days before festival date when campaign/theme begins (default 5-7 days)
    offerDurationDays?: number; // Duration of discount offer in days (default 1 day)
    themeDurationDays?: number; // Duration of visual theme in days (default 7 days)
  }>;
  theme: {
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
    icon: string; // Emoji or icon identifier
  };
  offer: {
    enabled: boolean;
    discountType: 'percentage';
    discountValue: number;
    pizzaDiscountValue?: number;
    otherDiscountValue?: number;
    title: string;
    badge: string;
    description: string;
    terms: string;
  };
}

/**
 * Authoritative Master Festival Registry (2026 - 2030+)
 */
export const MULTI_YEAR_FESTIVALS: MultiYearFestivalDefinition[] = [
  // 🎆 1. New Year (1 January)
  {
    id: 'new-year',
    name: 'New Year',
    hindiName: 'नया साल',
    category: 'commercial',
    priority: 85,
    dateSource: 'fixed',
    datesByYear: {
      2026: { festivalDay: '2026-01-01', campaignStartDays: 4, themeDurationDays: 5 },
      2027: { festivalDay: '2027-01-01', campaignStartDays: 4, themeDurationDays: 5 },
      2028: { festivalDay: '2028-01-01', campaignStartDays: 4, themeDurationDays: 5 },
      2029: { festivalDay: '2029-01-01', campaignStartDays: 4, themeDurationDays: 5 },
      2030: { festivalDay: '2030-01-01', campaignStartDays: 4, themeDurationDays: 5 },
    },
    theme: {
      primaryAccent: '#f59e0b',
      secondaryAccent: '#e11d48',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-red-600',
      badgeText: 'text-slate-950 font-black',
      heroTag: '✨ Welcome 2026 Celebration',
      heroHeadline: 'Start 2026 with a',
      heroHeadlineHighlight: 'Slice of Happiness.',
      heroSubheadline: 'Ring in the New Year with Harino’s handcrafted hot gourmet pizzas and artisan garlic bread. Flat 20% OFF on New Year’s Day!',
      heroGradient: 'from-slate-950/95 via-slate-900/80 to-amber-950/40',
      accentBorder: 'border-amber-400/50',
      themeGlow: 'rgba(245, 158, 11, 0.35)',
      icon: '✨',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'New Year Celebration Feast',
      badge: '✨ 20% OFF NEW YEAR FEAST',
      description: 'Flat 20% OFF on all gourmet pizzas, burgers & sides.',
      terms: 'Automatically applied on food subtotal.',
    },
  },

  // 🔥 2. Lohri (13 January)
  {
    id: 'lohri',
    name: 'Lohri',
    hindiName: 'लोहड़ी',
    category: 'sikh',
    priority: 80,
    dateSource: 'solar',
    datesByYear: {
      2026: { festivalDay: '2026-01-13', campaignStartDays: 4 },
      2027: { festivalDay: '2027-01-13', campaignStartDays: 4 },
      2028: { festivalDay: '2028-01-13', campaignStartDays: 4 },
      2029: { festivalDay: '2029-01-13', campaignStartDays: 4 },
      2030: { festivalDay: '2030-01-13', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🔥 Lohri Bonfire Feast',
      heroHeadline: 'Warm Slices around the',
      heroHeadlineHighlight: 'Lohri Bonfire.',
      heroSubheadline: 'Celebrate the Punjabi winter harvest with hot, crispy wood-fired artisan pizzas. Flat 20% OFF on Lohri!',
      heroGradient: 'from-slate-950/95 via-orange-950/70 to-amber-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(234, 88, 12, 0.3)',
      icon: '🔥',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Lohri Harvest Celebration',
      badge: '🔥 20% OFF LOHRI FEAST',
      description: 'Flat 20% OFF on all handcrafted pizzas & appetizers.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🪁 3. Makar Sankranti / Pongal (14 January)
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    hindiName: 'मकर संक्रांति',
    category: 'hindu',
    priority: 85,
    dateSource: 'solar',
    datesByYear: {
      2026: { festivalDay: '2026-01-14', campaignStartDays: 5 },
      2027: { festivalDay: '2027-01-14', campaignStartDays: 5 },
      2028: { festivalDay: '2028-01-14', campaignStartDays: 5 },
      2029: { festivalDay: '2029-01-14', campaignStartDays: 5 },
      2030: { festivalDay: '2030-01-14', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#0ea5e9',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-sky-500 via-amber-400 to-orange-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🪁 Makar Sankranti & Pongal',
      heroHeadline: 'Flavours Soaring High in the',
      heroHeadlineHighlight: 'Festive Skies.',
      heroSubheadline: 'Celebrate Uttarayan & Pongal with soaring delicious artisan pizzas and crispy sides. Flat 20% OFF on festival day.',
      heroGradient: 'from-slate-950/95 via-sky-950/60 to-amber-950/30',
      accentBorder: 'border-sky-400/40',
      themeGlow: 'rgba(14, 165, 233, 0.25)',
      icon: '🪁',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Makar Sankranti Festive Offer',
      badge: '🪁 20% OFF SANKRANTI FEAST',
      description: 'Flat 20% OFF on all pizzas and sides on Makar Sankranti.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🌼 4. Vasant Panchami (23 January 2026)
  {
    id: 'vasant-panchami',
    name: 'Vasant Panchami',
    hindiName: 'बसंत पंचमी',
    category: 'hindu',
    priority: 80,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-01-23', campaignStartDays: 4 },
      2027: { festivalDay: '2027-02-11', campaignStartDays: 4 },
      2028: { festivalDay: '2028-01-31', campaignStartDays: 4 },
      2029: { festivalDay: '2029-01-20', campaignStartDays: 4 },
      2030: { festivalDay: '2030-02-08', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#eab308',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🌼 Vasant Panchami Spring Special',
      heroHeadline: 'Welcoming the Golden Bloom of',
      heroHeadlineHighlight: 'Spring Flavours.',
      heroSubheadline: 'Celebrate the arrival of spring with yellow-golden gourmet cheese pizzas and rich sides. 20% OFF on Vasant Panchami!',
      heroGradient: 'from-slate-950/95 via-yellow-950/60 to-amber-950/30',
      accentBorder: 'border-yellow-400/40',
      themeGlow: 'rgba(234, 179, 8, 0.3)',
      icon: '🌼',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Vasant Panchami Spring Offer',
      badge: '🌼 20% OFF SPRING SPECIAL',
      description: 'Flat 20% OFF on all handcrafted menu items.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🇮🇳 5. Republic Day (26 January)
  {
    id: 'republic-day',
    name: 'Republic Day',
    hindiName: 'गणतंत्र दिवस',
    category: 'national',
    priority: 100,
    dateSource: 'fixed',
    datesByYear: {
      2026: { festivalDay: '2026-01-26', campaignStartDays: 5 },
      2027: { festivalDay: '2027-01-26', campaignStartDays: 5 },
      2028: { festivalDay: '2028-01-26', campaignStartDays: 5 },
      2029: { festivalDay: '2029-01-26', campaignStartDays: 5 },
      2030: { festivalDay: '2030-01-26', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#16a34a',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-white to-emerald-600',
      badgeText: 'text-slate-900 font-black',
      heroTag: '🇮🇳 77th Republic Day Celebration',
      heroHeadline: 'Pride in Every Slice.',
      heroHeadlineHighlight: 'Celebrate Sovereignty.',
      heroSubheadline: 'Handcrafted artisan pizzas honouring the Constitution of India. Enjoy flat 20% OFF on Pizzas & 10% OFF on all other items on Republic Day.',
      heroGradient: 'from-slate-950/95 via-slate-900/70 to-emerald-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
      icon: '🇮🇳',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      pizzaDiscountValue: 20,
      otherDiscountValue: 10,
      title: 'Republic Day Special Offer',
      badge: '🇮🇳 20% OFF PIZZAS • 10% OFF OTHERS',
      description: 'Get Flat 20% OFF on all Pizzas and 10% OFF on all Burgers, Momos, Fries & Sides.',
      terms: 'Automatically applied on food subtotal. Valid for Dine-in, Takeaway & Delivery.',
    },
  },

  // 🔱 6. Maha Shivratri (15 February 2026)
  {
    id: 'mahashivratri',
    name: 'Maha Shivratri',
    hindiName: 'महाशिवरात्रि',
    category: 'hindu',
    priority: 85,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-02-15', campaignStartDays: 5 },
      2027: { festivalDay: '2027-03-05', campaignStartDays: 5 },
      2028: { festivalDay: '2028-02-24', campaignStartDays: 5 },
      2029: { festivalDay: '2029-02-12', campaignStartDays: 5 },
      2030: { festivalDay: '2030-03-03', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#3b82f6',
      secondaryAccent: '#6366f1',
      badgeBg: 'bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🔱 Divine Maha Shivratri Special',
      heroHeadline: 'Sacred Devotion &',
      heroHeadlineHighlight: 'Artisan Cheesy Crusts.',
      heroSubheadline: 'Sattvic-inspired, 100% pure vegetarian recipes crafted with devotion. Special 20% discount on all orders on festival day.',
      heroGradient: 'from-slate-950/95 via-indigo-950/70 to-blue-950/30',
      accentBorder: 'border-blue-500/40',
      themeGlow: 'rgba(59, 130, 246, 0.25)',
      icon: '🔱',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Maha Shivratri Divine Feast',
      badge: '🔱 20% OFF DIVINE FEAST',
      description: 'Flat 20% OFF on all gourmet pizzas, momos, and appetizers.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🎨 7. Holi & Holika Dahan (3-4 March 2026)
  {
    id: 'holi',
    name: 'Holi',
    hindiName: 'होली',
    category: 'hindu',
    priority: 95,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-03-04', festivalDayEnd: '2026-03-04', campaignStartDays: 6 },
      2027: { festivalDay: '2027-03-21', campaignStartDays: 6 },
      2028: { festivalDay: '2028-03-11', campaignStartDays: 6 },
      2029: { festivalDay: '2029-02-28', campaignStartDays: 6 },
      2030: { festivalDay: '2030-03-19', campaignStartDays: 6 },
    },
    theme: {
      primaryAccent: '#ec4899',
      secondaryAccent: '#eab308',
      badgeBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400',
      badgeText: 'text-white font-black',
      heroTag: '🎨 Rangon Ka Tyohaar, Harino’s Ke Saath',
      heroHeadline: 'Splash of Joy &',
      heroHeadlineHighlight: 'Cheesy Festive Slices.',
      heroSubheadline: 'Vibrant toppings, rich melted cheese, and crispy wood-fired crusts for your Holi celebrations. Flat 20% OFF on festival day!',
      heroGradient: 'from-slate-950/95 via-pink-950/60 to-purple-950/40',
      accentBorder: 'border-pink-500/40',
      themeGlow: 'rgba(236, 72, 153, 0.3)',
      icon: '🎨',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Holi Colorful Feast Offer',
      badge: '🎨 20% OFF HOLI CELEBRATION',
      description: 'Get Flat 20% OFF on all pizzas, sides, burgers and momos.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🏹 8. Ram Navami (26 March 2026)
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    hindiName: 'राम नवमी',
    category: 'hindu',
    priority: 85,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-03-26', campaignStartDays: 4 },
      2027: { festivalDay: '2027-04-15', campaignStartDays: 4 },
      2028: { festivalDay: '2028-04-03', campaignStartDays: 4 },
      2029: { festivalDay: '2029-03-24', campaignStartDays: 4 },
      2030: { festivalDay: '2030-04-11', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🏹 Shri Ram Navami Celebration',
      heroHeadline: 'Auspicious Slices of',
      heroHeadlineHighlight: 'Joy & Righteousness.',
      heroSubheadline: 'Celebrating Ram Navami with pure vegetarian handcrafted pizzas and festive sides. Flat 20% OFF on Ram Navami Day.',
      heroGradient: 'from-slate-950/95 via-orange-950/60 to-amber-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
      icon: '🏹',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Ram Navami Auspicious Feast',
      badge: '🏹 20% OFF RAM NAVAMI',
      description: 'Flat 20% OFF on entire menu on Ram Navami.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🌾 9. Baisakhi / Vaisakhi (14 April 2026)
  {
    id: 'baisakhi',
    name: 'Baisakhi',
    hindiName: 'बैसाखी',
    category: 'sikh',
    priority: 85,
    dateSource: 'solar',
    datesByYear: {
      2026: { festivalDay: '2026-04-14', campaignStartDays: 5 },
      2027: { festivalDay: '2027-04-14', campaignStartDays: 5 },
      2028: { festivalDay: '2028-04-13', campaignStartDays: 5 },
      2029: { festivalDay: '2029-04-14', campaignStartDays: 5 },
      2030: { festivalDay: '2030-04-14', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#eab308',
      secondaryAccent: '#f97316',
      badgeBg: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🌾 Baisakhi Harvest Celebration',
      heroHeadline: 'Golden Harvest &',
      heroHeadlineHighlight: 'Artisan Cheesy Crusts.',
      heroSubheadline: 'Celebrating the bountiful harvest with rich gourmet pizzas and farm-fresh toppings. Enjoy 20% OFF on Baisakhi Day.',
      heroGradient: 'from-slate-950/95 via-amber-950/70 to-orange-950/30',
      accentBorder: 'border-amber-500/40',
      themeGlow: 'rgba(234, 179, 8, 0.25)',
      icon: '🌾',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Baisakhi Harvest Special',
      badge: '🌾 20% OFF BAISAKHI FEAST',
      description: 'Flat 20% OFF on all handcrafted items on Baisakhi.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🇮🇳 10. Independence Day (15 August 2026)
  {
    id: 'independence-day',
    name: 'Independence Day',
    hindiName: 'स्वतंत्रता दिवस',
    category: 'national',
    priority: 100,
    dateSource: 'fixed',
    datesByYear: {
      2026: { festivalDay: '2026-08-15', campaignStartDays: 6 },
      2027: { festivalDay: '2027-08-15', campaignStartDays: 6 },
      2028: { festivalDay: '2028-08-15', campaignStartDays: 6 },
      2029: { festivalDay: '2029-08-15', campaignStartDays: 6 },
      2030: { festivalDay: '2030-08-15', campaignStartDays: 6 },
    },
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#16a34a',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-white to-emerald-600',
      badgeText: 'text-slate-900 font-black',
      heroTag: '🇮🇳 80th Independence Day Special',
      heroHeadline: 'Celebrate India.',
      heroHeadlineHighlight: 'Celebrate with Harino’s.',
      heroSubheadline: 'Honoring national freedom with pure vegetarian culinary excellence. Enjoy flat 20% OFF on Pizzas & 10% OFF on all other items on Independence Day.',
      heroGradient: 'from-slate-950/95 via-slate-900/70 to-emerald-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
      icon: '🇮🇳',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      pizzaDiscountValue: 20,
      otherDiscountValue: 10,
      title: 'Independence Day Offer',
      badge: '🇮🇳 20% OFF PIZZAS • 10% OFF OTHERS',
      description: 'Get Flat 20% OFF on all Pizzas and 10% OFF on all Burgers, Momos, Fries & Sides.',
      terms: '20% OFF on Pizzas + 10% OFF on other items. Automatically applied on food subtotal.',
    },
  },

  // 🪢 11. Raksha Bandhan (FRIDAY, 28 AUGUST 2026) — CRITICAL ACCURACY
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    hindiName: 'रक्षा बंधन',
    category: 'hindu',
    priority: 95,
    dateSource: 'lunar',
    datesByYear: {
      2026: { 
        festivalDay: '2026-08-28', // FRIDAY, 28 AUGUST 2026
        campaignStartDays: 5,       // Campaign theme starts 23/24 August 2026
        themeDurationDays: 7,
      },
      2027: { festivalDay: '2027-08-17', campaignStartDays: 5 },
      2028: { festivalDay: '2028-08-25', campaignStartDays: 5 },
      2029: { festivalDay: '2029-08-24', campaignStartDays: 5 },
      2030: { festivalDay: '2030-08-13', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#dc2626', // Deep Vermillion / Red
      secondaryAccent: '#f59e0b', // Festive Gold
      badgeBg: 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🎀 Raksha Bandhan Sibling Feast',
      heroHeadline: 'Celebrate the Bond of Love.',
      heroHeadlineHighlight: 'Rakhi Wali Khushiyan, Harino’s Ke Saath.',
      heroSubheadline: 'Share a cheesy slice, laugh a little louder, and celebrate your favourite sibling with handcrafted artisan pizzas. Flat 20% OFF on Raksha Bandhan!',
      heroGradient: 'from-slate-950/95 via-red-950/70 to-amber-950/30',
      accentBorder: 'border-red-500/40',
      themeGlow: 'rgba(220, 38, 38, 0.3)',
      icon: '🎀',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Raksha Bandhan Sibling Feast',
      badge: '🎀 20% OFF SIBLING FEAST',
      description: 'Flat 20% OFF on all pizzas, sides, and momos on Raksha Bandhan.',
      terms: 'Automatically applied on cart subtotal. Valid for Dine-in, Takeaway & Delivery on 28 August 2026.',
    },
  },

  // 🦚 12. Janmashtami (4 September 2026)
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    hindiName: 'जन्माष्टमी',
    category: 'hindu',
    priority: 90,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-09-04', campaignStartDays: 5 },
      2027: { festivalDay: '2027-08-25', campaignStartDays: 5 },
      2028: { festivalDay: '2028-08-13', campaignStartDays: 5 },
      2029: { festivalDay: '2029-09-01', campaignStartDays: 5 },
      2030: { festivalDay: '2030-08-21', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#0284c7',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-sky-600 via-blue-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🦚 Shri Krishna Janmashtami Special',
      heroHeadline: 'Divine Joy &',
      heroHeadlineHighlight: 'Festive Makhan & Gourmet Slices.',
      heroSubheadline: 'Celebrating the birth of Lord Krishna with rich pure vegetarian delicacies. Special 20% OFF on Janmashtami.',
      heroGradient: 'from-slate-950/95 via-sky-950/70 to-indigo-950/30',
      accentBorder: 'border-sky-500/40',
      themeGlow: 'rgba(2, 132, 199, 0.25)',
      icon: '🦚',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Janmashtami Divine Celebration',
      badge: '🦚 20% OFF JANMASHTAMI SPECIAL',
      description: 'Flat 20% OFF on all gourmet pizzas and sides.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🐘 13. Ganesh Chaturthi (14 September 2026)
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    hindiName: 'गणेश चतुर्थी',
    category: 'hindu',
    priority: 90,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-09-14', campaignStartDays: 5 },
      2027: { festivalDay: '2027-09-04', campaignStartDays: 5 },
      2028: { festivalDay: '2028-08-24', campaignStartDays: 5 },
      2029: { festivalDay: '2029-09-12', campaignStartDays: 5 },
      2030: { festivalDay: '2030-09-01', campaignStartDays: 5 },
    },
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#facc15',
      badgeBg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🐘 Ganpati Bappa Morya Feast',
      heroHeadline: 'Auspicious Beginnings with',
      heroHeadlineHighlight: 'Harino’s Artisan Crusts.',
      heroSubheadline: 'Welcoming Lord Ganesha with delightful pure vegetarian feasts. Enjoy flat 20% discount on festival day.',
      heroGradient: 'from-slate-950/95 via-orange-950/70 to-amber-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(234, 88, 12, 0.25)',
      icon: '🐘',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Ganesh Chaturthi Auspicious Feast',
      badge: '🐘 20% OFF GANESHOTSAV SPECIAL',
      description: 'Flat 20% OFF on all items on Ganesh Chaturthi.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🔱 14. Navratri & Durga Puja (11-20 October 2026)
  {
    id: 'navratri',
    name: 'Navratri',
    hindiName: 'नवरात्रि',
    category: 'hindu',
    priority: 90,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-10-11', festivalDayEnd: '2026-10-20', campaignStartDays: 5, offerDurationDays: 10, themeDurationDays: 15 },
      2027: { festivalDay: '2027-09-30', festivalDayEnd: '2027-10-09', campaignStartDays: 5, offerDurationDays: 10, themeDurationDays: 15 },
      2028: { festivalDay: '2028-10-18', festivalDayEnd: '2028-10-27', campaignStartDays: 5, offerDurationDays: 10, themeDurationDays: 15 },
      2029: { festivalDay: '2029-10-08', festivalDayEnd: '2029-10-17', campaignStartDays: 5, offerDurationDays: 10, themeDurationDays: 15 },
      2030: { festivalDay: '2030-09-27', festivalDayEnd: '2030-10-06', campaignStartDays: 5, offerDurationDays: 10, themeDurationDays: 15 },
    },
    theme: {
      primaryAccent: '#dc2626',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🔱 Navratri & Durga Utsav',
      heroHeadline: 'Nine Nights of Devotion &',
      heroHeadlineHighlight: 'Pure Vegetarian Excellence.',
      heroSubheadline: 'Handcrafted with fresh dough and pure devotion for your festive Dandiya and Garba gatherings. Flat 20% OFF during Navratri!',
      heroGradient: 'from-slate-950/95 via-red-950/70 to-rose-950/30',
      accentBorder: 'border-red-500/40',
      themeGlow: 'rgba(220, 38, 38, 0.25)',
      icon: '🔱',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Navratri Festival Feast',
      badge: '🔱 20% OFF NAVRATRI SPECIAL',
      description: 'Flat 20% OFF on all pizzas, sides, and appetizers.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🏹 15. Dussehra / Vijayadashami (20 October 2026)
  {
    id: 'dussehra',
    name: 'Dussehra',
    hindiName: 'दशहरा',
    category: 'hindu',
    priority: 90,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-10-20', campaignStartDays: 4 },
      2027: { festivalDay: '2027-10-10', campaignStartDays: 4 },
      2028: { festivalDay: '2028-10-28', campaignStartDays: 4 },
      2029: { festivalDay: '2029-10-17', campaignStartDays: 4 },
      2030: { festivalDay: '2030-10-06', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#c026d3',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🏹 Vijayadashami Victory Feast',
      heroHeadline: 'Victory of Goodness.',
      heroHeadlineHighlight: 'Celebration of Pure Taste.',
      heroSubheadline: 'Celebrate the triumph of good over evil with hot, cheesy artisan pizzas. Flat 20% discount on Dussehra Day.',
      heroGradient: 'from-slate-950/95 via-fuchsia-950/70 to-purple-950/30',
      accentBorder: 'border-fuchsia-500/40',
      themeGlow: 'rgba(192, 38, 211, 0.25)',
      icon: '🏹',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Dussehra Victory Celebration',
      badge: '🏹 20% OFF VIJAYADASHAMI',
      description: 'Flat 20% OFF on entire menu on Dussehra.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🌕 16. Karwa Chauth (29 October 2026)
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    hindiName: 'करवा चौथ',
    category: 'hindu',
    priority: 85,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-10-29', campaignStartDays: 4 },
      2027: { festivalDay: '2027-10-18', campaignStartDays: 4 },
      2028: { festivalDay: '2028-11-05', campaignStartDays: 4 },
      2029: { festivalDay: '2029-10-26', campaignStartDays: 4 },
      2030: { festivalDay: '2030-10-15', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#e11d48',
      secondaryAccent: '#fb7185',
      badgeBg: 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-300',
      badgeText: 'text-white font-black',
      heroTag: '🌕 Karwa Chauth Moonlit Dinner',
      heroHeadline: 'Under the Moonlit Sky.',
      heroHeadlineHighlight: 'Break the Fast with Cheesy Slices.',
      heroSubheadline: 'Break your auspicious fast together with warm, handcrafted cheesy artisan pizzas. Flat 20% OFF on festival evening.',
      heroGradient: 'from-slate-950/95 via-rose-950/70 to-pink-950/30',
      accentBorder: 'border-rose-500/40',
      themeGlow: 'rgba(225, 29, 72, 0.25)',
      icon: '🌕',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Karwa Chauth Moonlit Special',
      badge: '🌕 20% OFF MOONLIT FEAST',
      description: 'Flat 20% OFF on all pizzas, sides, and momos.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🪔 17. Diwali / Deepavali (SUNDAY, 8 NOVEMBER 2026) — MAJOR THEME
  {
    id: 'diwali',
    name: 'Diwali',
    hindiName: 'दीपावली',
    category: 'hindu',
    priority: 100,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-11-08', festivalDayEnd: '2026-11-08', campaignStartDays: 7, offerDurationDays: 1, themeDurationDays: 10 },
      2027: { festivalDay: '2027-10-29', campaignStartDays: 7, offerDurationDays: 1 },
      2028: { festivalDay: '2028-11-17', campaignStartDays: 7, offerDurationDays: 1 },
      2029: { festivalDay: '2029-11-06', campaignStartDays: 7, offerDurationDays: 1 },
      2030: { festivalDay: '2030-10-27', campaignStartDays: 7, offerDurationDays: 1 },
    },
    theme: {
      primaryAccent: '#f59e0b',
      secondaryAccent: '#ef4444',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-red-600',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🪔 Grand Diwali Festival of Lights',
      heroHeadline: 'Illuminating Flavours.',
      heroHeadlineHighlight: 'Diwali at Harino’s.',
      heroSubheadline: 'Celebrate the Grand Festival of Lights with pure vegetarian cheesy indulgence, warm garlic bread, and family feasts. Flat 25% OFF on Diwali!',
      heroGradient: 'from-slate-950/95 via-amber-950/80 to-yellow-950/40',
      accentBorder: 'border-amber-400/60',
      themeGlow: 'rgba(245, 158, 11, 0.4)',
      icon: '🪔',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 25,
      title: 'Grand Diwali Celebration Offer',
      badge: '🪔 25% OFF GRAND DIWALI FEAST',
      description: 'Flat 25% OFF on all pizzas, sides, and appetizers on Diwali.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🎁 18. Bhai Dooj (11 November 2026)
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    hindiName: 'भाई दूज',
    category: 'hindu',
    priority: 85,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-11-11', campaignStartDays: 3 },
      2027: { festivalDay: '2027-10-31', campaignStartDays: 3 },
      2028: { festivalDay: '2028-11-19', campaignStartDays: 3 },
      2029: { festivalDay: '2029-11-08', campaignStartDays: 3 },
      2030: { festivalDay: '2030-10-29', campaignStartDays: 3 },
    },
    theme: {
      primaryAccent: '#e11d48',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🎁 Bhai Dooj Sibling Blessing',
      heroHeadline: 'Tilak, Love & Sibling Blessings.',
      heroHeadlineHighlight: 'Celebrate Sibling Bond with Pizza.',
      heroSubheadline: 'Sweeten the occasion with warm cheesy slices and gourmet sides for your brother and sister. 20% OFF on Bhai Dooj!',
      heroGradient: 'from-slate-950/95 via-rose-950/70 to-red-950/30',
      accentBorder: 'border-rose-500/40',
      themeGlow: 'rgba(225, 29, 72, 0.25)',
      icon: '🎁',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Bhai Dooj Sibling Special',
      badge: '🎁 20% OFF BHAI DOOJ FEAST',
      description: 'Flat 20% OFF on all pizzas, sides & momos.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // ☀️ 19. Chhath Puja (15 November 2026)
  {
    id: 'chhath-puja',
    name: 'Chhath Puja',
    hindiName: 'छठ पूजा',
    category: 'hindu',
    priority: 85,
    dateSource: 'lunar',
    datesByYear: {
      2026: { festivalDay: '2026-11-15', campaignStartDays: 4 },
      2027: { festivalDay: '2027-11-04', campaignStartDays: 4 },
      2028: { festivalDay: '2028-11-22', campaignStartDays: 4 },
      2029: { festivalDay: '2029-11-11', campaignStartDays: 4 },
      2030: { festivalDay: '2030-11-01', campaignStartDays: 4 },
    },
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '☀️ Chhath Mahaparv Special',
      heroHeadline: 'Salutations to the Rising Sun.',
      heroHeadlineHighlight: 'Pure Sattvic Devotion & Feasts.',
      heroSubheadline: 'Honoring Lord Surya with 100% pure vegetarian culinary craftsmanship for family gatherings. Flat 20% OFF on Chhath.',
      heroGradient: 'from-slate-950/95 via-orange-950/70 to-amber-950/30',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(234, 88, 12, 0.25)',
      icon: '☀️',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Chhath Puja Mahaparv Offer',
      badge: '☀️ 20% OFF CHHATH FEAST',
      description: 'Flat 20% OFF on entire menu on Chhath Puja.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🎄 20. Christmas (25 December 2026)
  {
    id: 'christmas',
    name: 'Christmas',
    hindiName: 'क्रिसमस',
    category: 'christian',
    priority: 95,
    dateSource: 'fixed',
    datesByYear: {
      2026: { festivalDay: '2026-12-25', campaignStartDays: 7, themeDurationDays: 10 },
      2027: { festivalDay: '2027-12-25', campaignStartDays: 7, themeDurationDays: 10 },
      2028: { festivalDay: '2028-12-25', campaignStartDays: 7, themeDurationDays: 10 },
      2029: { festivalDay: '2029-12-25', campaignStartDays: 7, themeDurationDays: 10 },
      2030: { festivalDay: '2030-12-25', campaignStartDays: 7, themeDurationDays: 10 },
    },
    theme: {
      primaryAccent: '#10b981',
      secondaryAccent: '#ef4444',
      badgeBg: 'bg-gradient-to-r from-emerald-600 via-red-600 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🎄 Merry Christmas Holiday Feast',
      heroHeadline: 'Holiday Magic in Every Slice.',
      heroHeadlineHighlight: 'Warm Slices for Cozy Winter.',
      heroSubheadline: 'Celebrate Christmas with Harino’s handcrafted hot pizzas, melting mozzarella, and crispy sides. Flat 20% OFF on Christmas Day!',
      heroGradient: 'from-slate-950/95 via-emerald-950/70 to-red-950/30',
      accentBorder: 'border-emerald-500/40',
      themeGlow: 'rgba(16, 185, 129, 0.25)',
      icon: '🎄',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Christmas Holiday Special',
      badge: '🎄 20% OFF CHRISTMAS SPECIAL',
      description: 'Flat 20% OFF on all pizzas and sides on Christmas.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },
];
