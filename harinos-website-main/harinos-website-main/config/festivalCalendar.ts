/**
 * Centralized Multi-Year Indian Festival Calendar
 * 
 * Rules:
 * 1. Timezone: India Standard Time (IST / Asia/Kolkata / UTC+05:30)
 * 2. Strict Exclusion: ALL Muslim religious festivals (Eid, Ramadan, Muharram, etc.) are strictly excluded.
 * 3. Scope: Indian National Days, Hindu, Sikh, Jain, Buddhist, and Harino's commercial celebrations.
 * 4. Multi-Year Support: Provides exact Gregorian date mappings for Hindu lunar & national festivals across 2026-2030+.
 */

export type FestivalCategory = 'national' | 'hindu' | 'sikh' | 'commercial';

export interface MultiYearFestivalDefinition {
  id: string;
  name: string;
  category: FestivalCategory;
  priority: number; // Higher number = higher precedence during overlap
  datesByYear: Record<number, {
    festivalDay: string; // YYYY-MM-DD
    festivalDayEnd?: string; // YYYY-MM-DD (for multi-day events like Diwali/Navratri)
    offerDurationDays?: number; // default 1 day
    themeDurationDays?: number; // default 7 days pre-festival
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
 * Muslim festivals are excluded by design and verified by category assertions.
 */
export const MULTI_YEAR_FESTIVALS: MultiYearFestivalDefinition[] = [
  // 🇮🇳 1. Republic Day (National) - Jan 26
  {
    id: 'republic-day',
    name: 'Republic Day',
    category: 'national',
    priority: 100,
    datesByYear: {
      2026: { festivalDay: '2026-01-26' },
      2027: { festivalDay: '2027-01-26' },
      2028: { festivalDay: '2028-01-26' },
      2029: { festivalDay: '2029-01-26' },
      2030: { festivalDay: '2030-01-26' },
    },
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#16a34a',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-white to-emerald-600',
      badgeText: 'text-slate-900 font-black',
      heroTag: '🇮🇳 Republic Day Celebration',
      heroHeadline: 'Pride in Every Slice.',
      heroHeadlineHighlight: 'Celebrate Sovereignty.',
      heroSubheadline: 'Handcrafted pure veg pizzas honouring the Constitution of India. Enjoy flat 20% OFF on Pizzas & 10% OFF on all other items on Republic Day.',
      heroGradient: 'from-slate-950/90 via-slate-900/60 to-slate-900/20',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
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

  // 🔱 2. Maha Shivratri (Hindu Lunar)
  {
    id: 'mahashivratri',
    name: 'Maha Shivratri',
    category: 'hindu',
    priority: 85,
    datesByYear: {
      2026: { festivalDay: '2026-02-15' },
      2027: { festivalDay: '2027-03-05' },
      2028: { festivalDay: '2028-02-24' },
      2029: { festivalDay: '2029-02-12' },
      2030: { festivalDay: '2030-03-03' },
    },
    theme: {
      primaryAccent: '#3b82f6',
      secondaryAccent: '#6366f1',
      badgeBg: 'bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🔱 Divine Maha Shivratri Special',
      heroHeadline: 'Sacred Flavours.',
      heroHeadlineHighlight: '100% Pure Vegetarian Kitchen.',
      heroSubheadline: 'Pure Sattvic-inspired vegetarian recipes crafted with devotion. Special 20% discount on all orders on festival day.',
      heroGradient: 'from-slate-950/95 via-indigo-950/60 to-slate-900/20',
      accentBorder: 'border-blue-500/40',
      themeGlow: 'rgba(59, 130, 246, 0.25)',
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

  // 🎨 3. Holi (Hindu Lunar)
  {
    id: 'holi',
    name: 'Holi',
    category: 'hindu',
    priority: 95,
    datesByYear: {
      2026: { festivalDay: '2026-03-04' },
      2027: { festivalDay: '2027-03-21' },
      2028: { festivalDay: '2028-03-11' },
      2029: { festivalDay: '2029-02-28' },
      2030: { festivalDay: '2030-03-19' },
    },
    theme: {
      primaryAccent: '#ec4899',
      secondaryAccent: '#eab308',
      badgeBg: 'bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400',
      badgeText: 'text-white font-black',
      heroTag: '🎨 Festival of Colours & Crusts',
      heroHeadline: 'Splash of Flavours.',
      heroHeadlineHighlight: 'Celebrate Holi with Harino’s.',
      heroSubheadline: 'Vibrant toppings, melt-in-the-mouth cheese, and crispy crusts for your Holi gatherings. Flat 20% OFF on festival day.',
      heroGradient: 'from-purple-950/90 via-pink-950/50 to-slate-900/20',
      accentBorder: 'border-pink-500/40',
      themeGlow: 'rgba(236, 72, 153, 0.25)',
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

  // 🌾 4. Baisakhi / Solar New Year (Sikh / Hindu) - Apr 13/14
  {
    id: 'baisakhi',
    name: 'Baisakhi',
    category: 'sikh',
    priority: 85,
    datesByYear: {
      2026: { festivalDay: '2026-04-14' },
      2027: { festivalDay: '2027-04-14' },
      2028: { festivalDay: '2028-04-13' },
      2029: { festivalDay: '2029-04-14' },
      2030: { festivalDay: '2030-04-14' },
    },
    theme: {
      primaryAccent: '#eab308',
      secondaryAccent: '#f97316',
      badgeBg: 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🌾 Baisakhi Harvest Celebration',
      heroHeadline: 'Golden Harvest.',
      heroHeadlineHighlight: 'Rich Handcrafted Pizzas.',
      heroSubheadline: 'Celebrating the bountiful harvest with rich gourmet pizzas and farm-fresh toppings. Enjoy 20% OFF on Baisakhi Day.',
      heroGradient: 'from-amber-950/90 via-orange-950/50 to-slate-900/20',
      accentBorder: 'border-amber-500/40',
      themeGlow: 'rgba(234, 179, 8, 0.25)',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Baisakhi Harvest Special',
      badge: '🌾 20% OFF BAISAKHI FEAST',
      description: 'Flat 20% OFF on all handcrafted items.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🇮🇳 5. Independence Day (National) - Aug 15
  {
    id: 'independence-day',
    name: 'Independence Day',
    category: 'national',
    priority: 100,
    datesByYear: {
      2026: { festivalDay: '2026-08-15' },
      2027: { festivalDay: '2027-08-15' },
      2028: { festivalDay: '2028-08-15' },
      2029: { festivalDay: '2029-08-15' },
      2030: { festivalDay: '2030-08-15' },
    },
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#16a34a',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600',
      badgeText: 'text-white font-black',
      heroTag: '🇮🇳 Independence Day Special',
      heroHeadline: 'Celebrate India.',
      heroHeadlineHighlight: 'Celebrate with Harino’s.',
      heroSubheadline: 'Honoring national freedom with pure vegetarian culinary excellence. Enjoy flat 20% OFF on all handcrafted Pizzas & 10% OFF on all other items on Independence Day.',
      heroGradient: 'from-slate-950/90 via-slate-900/60 to-slate-900/20',
      accentBorder: 'border-orange-500/30',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
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
      terms: '20% OFF on Pizzas + 10% OFF on other items. Automatically applied on food subtotal. Valid for Dine-in, Takeaway & Delivery.',
    },
  },

  // 🪢 6. Raksha Bandhan (Hindu Lunar)
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    category: 'hindu',
    priority: 90,
    datesByYear: {
      2026: { festivalDay: '2026-08-27' },
      2027: { festivalDay: '2027-08-17' },
      2028: { festivalDay: '2028-08-05' },
      2029: { festivalDay: '2029-08-24' },
      2030: { festivalDay: '2030-08-13' },
    },
    theme: {
      primaryAccent: '#e11d48',
      secondaryAccent: '#fbbf24',
      badgeBg: 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500',
      badgeText: 'text-white font-black',
      heroTag: '🪢 Raksha Bandhan Sibling Feast',
      heroHeadline: 'The Sacred Bond of Love.',
      heroHeadlineHighlight: 'Treat Your Siblings with Harino’s.',
      heroSubheadline: 'Share handcrafted cheesy slices and gourmet sides with your beloved brother & sister. Flat 20% discount on festival day.',
      heroGradient: 'from-rose-950/90 via-red-950/50 to-slate-900/20',
      accentBorder: 'border-rose-500/40',
      themeGlow: 'rgba(225, 29, 72, 0.25)',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Raksha Bandhan Sibling Feast',
      badge: '🪢 20% OFF SIBLING FEAST',
      description: 'Flat 20% OFF on all pizzas, sides, and momos on Raksha Bandhan.',
      terms: 'Automatically applied on cart subtotal. Valid for Dine-in, Takeaway & Delivery.',
    },
  },

  // 🦚 7. Janmashtami (Hindu Lunar)
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    category: 'hindu',
    priority: 90,
    datesByYear: {
      2026: { festivalDay: '2026-09-04' },
      2027: { festivalDay: '2027-08-25' },
      2028: { festivalDay: '2028-08-13' },
      2029: { festivalDay: '2029-09-01' },
      2030: { festivalDay: '2030-08-21' },
    },
    theme: {
      primaryAccent: '#0284c7',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-sky-600 via-blue-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🦚 Shri Krishna Janmashtami Special',
      heroHeadline: 'Divine Joy & Pure Butter.',
      heroHeadlineHighlight: 'Festive Makhan & Gourmet Slices.',
      heroSubheadline: 'Celebrating the birth of Lord Krishna with rich pure vegetarian delicacies. Special 20% OFF on Janmashtami.',
      heroGradient: 'from-sky-950/90 via-blue-950/50 to-slate-900/20',
      accentBorder: 'border-sky-500/40',
      themeGlow: 'rgba(2, 132, 199, 0.25)',
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

  // 🐘 8. Ganesh Chaturthi (Hindu Lunar)
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    category: 'hindu',
    priority: 90,
    datesByYear: {
      2026: { festivalDay: '2026-09-14' },
      2027: { festivalDay: '2027-09-04' },
      2028: { festivalDay: '2028-08-24' },
      2029: { festivalDay: '2029-09-12' },
      2030: { festivalDay: '2030-09-01' },
    },
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#facc15',
      badgeBg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🐘 Ganesh Chaturthi Modak & Crusts',
      heroHeadline: 'Ganpati Bappa Morya!',
      heroHeadlineHighlight: 'Auspicious Slices with Harino’s.',
      heroSubheadline: 'Welcoming Lord Ganesha with delightful pure vegetarian feasts. Enjoy flat 20% discount on festival day.',
      heroGradient: 'from-orange-950/90 via-amber-950/50 to-slate-900/20',
      accentBorder: 'border-orange-500/40',
      themeGlow: 'rgba(234, 88, 12, 0.25)',
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

  // 🔱 9. Navratri & Durga Puja (Hindu Lunar)
  {
    id: 'navratri',
    name: 'Navratri',
    category: 'hindu',
    priority: 90,
    datesByYear: {
      2026: { festivalDay: '2026-10-11', festivalDayEnd: '2026-10-12', offerDurationDays: 2 },
      2027: { festivalDay: '2027-09-30', festivalDayEnd: '2027-10-01', offerDurationDays: 2 },
      2028: { festivalDay: '2028-10-18', festivalDayEnd: '2028-10-19', offerDurationDays: 2 },
      2029: { festivalDay: '2029-10-08', festivalDayEnd: '2029-10-09', offerDurationDays: 2 },
      2030: { festivalDay: '2030-09-27', festivalDayEnd: '2030-09-28', offerDurationDays: 2 },
    },
    theme: {
      primaryAccent: '#dc2626',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🔱 Navratri & Durga Utsav',
      heroHeadline: 'Nine Nights of Devotion.',
      heroHeadlineHighlight: 'Pure Vegetarian Excellence.',
      heroSubheadline: '100% pure vegetarian, fresh dough handcrafted with devotion for your festive evenings. Flat 20% OFF during Ashtami & Navami.',
      heroGradient: 'from-red-950/90 via-rose-950/50 to-slate-900/20',
      accentBorder: 'border-red-500/40',
      themeGlow: 'rgba(220, 38, 38, 0.25)',
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

  // 🏹 10. Dussehra (Vijayadashami)
  {
    id: 'dussehra',
    name: 'Dussehra',
    category: 'hindu',
    priority: 90,
    datesByYear: {
      2026: { festivalDay: '2026-10-20' },
      2027: { festivalDay: '2027-10-10' },
      2028: { festivalDay: '2028-10-28' },
      2029: { festivalDay: '2029-10-17' },
      2030: { festivalDay: '2030-10-06' },
    },
    theme: {
      primaryAccent: '#c026d3',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🏹 Vijayadashami Victory Feast',
      heroHeadline: 'Victory of Goodness.',
      heroHeadlineHighlight: 'Celebration of Pure Taste.',
      heroSubheadline: 'Celebrate the triumph of goodness and light with grand cheesy pizzas. Flat 20% discount on Dussehra Day.',
      heroGradient: 'from-fuchsia-950/90 via-purple-950/50 to-slate-900/20',
      accentBorder: 'border-fuchsia-500/40',
      themeGlow: 'rgba(192, 38, 211, 0.25)',
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

  // 🌕 11. Karwa Chauth (Hindu Lunar)
  {
    id: 'karwa-chauth',
    name: 'Karwa Chauth',
    category: 'hindu',
    priority: 85,
    datesByYear: {
      2026: { festivalDay: '2026-10-29' },
      2027: { festivalDay: '2027-10-18' },
      2028: { festivalDay: '2028-11-05' },
      2029: { festivalDay: '2029-10-26' },
      2030: { festivalDay: '2030-10-15' },
    },
    theme: {
      primaryAccent: '#e11d48',
      secondaryAccent: '#fb7185',
      badgeBg: 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-300',
      badgeText: 'text-white font-black',
      heroTag: '🌕 Karwa Chauth Moon Feast',
      heroHeadline: 'Under the Moonlit Sky.',
      heroHeadlineHighlight: 'A Romantic Dinner Feast.',
      heroSubheadline: 'Break your auspicious fast together with warm, handcrafted cheesy artisan pizzas. Flat 20% OFF on festival evening.',
      heroGradient: 'from-rose-950/90 via-pink-950/50 to-slate-900/20',
      accentBorder: 'border-rose-500/40',
      themeGlow: 'rgba(225, 29, 72, 0.25)',
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

  // 🪔 12. Diwali & Dhanteras (Hindu Lunar)
  {
    id: 'diwali',
    name: 'Diwali',
    category: 'hindu',
    priority: 100,
    datesByYear: {
      2026: { festivalDay: '2026-11-06', festivalDayEnd: '2026-11-08', offerDurationDays: 3 },
      2027: { festivalDay: '2027-10-27', festivalDayEnd: '2027-10-29', offerDurationDays: 3 },
      2028: { festivalDay: '2028-11-15', festivalDayEnd: '2028-11-17', offerDurationDays: 3 },
      2029: { festivalDay: '2029-11-04', festivalDayEnd: '2029-11-06', offerDurationDays: 3 },
      2030: { festivalDay: '2030-10-25', festivalDayEnd: '2030-10-27', offerDurationDays: 3 },
    },
    theme: {
      primaryAccent: '#f59e0b',
      secondaryAccent: '#ef4444',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-red-600',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🪔 Grand Diwali Festival of Lights',
      heroHeadline: 'Illuminating Flavours.',
      heroHeadlineHighlight: 'The Grand Diwali Family Feast.',
      heroSubheadline: 'Celebrate Dhanteras, Choti Diwali & Deepavali with pure vegetarian cheesy indulgence. Flat 25% discount during Diwali days!',
      heroGradient: 'from-amber-950/95 via-yellow-950/60 to-slate-900/20',
      accentBorder: 'border-amber-400/50',
      themeGlow: 'rgba(245, 158, 11, 0.35)',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 25,
      title: 'Grand Diwali Celebration Offer',
      badge: '🪔 25% OFF GRAND DIWALI FEAST',
      description: 'Flat 25% OFF on all pizzas, sides, and appetizers during Diwali.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🎄 13. Christmas & New Year (Commercial / Holiday)
  {
    id: 'christmas-newyear',
    name: 'Christmas & New Year',
    category: 'commercial',
    priority: 95,
    datesByYear: {
      2026: { festivalDay: '2026-12-24', festivalDayEnd: '2026-12-25', offerDurationDays: 2, themeDurationDays: 14 },
      2027: { festivalDay: '2027-12-24', festivalDayEnd: '2027-12-25', offerDurationDays: 2, themeDurationDays: 14 },
      2028: { festivalDay: '2028-12-24', festivalDayEnd: '2028-12-25', offerDurationDays: 2, themeDurationDays: 14 },
      2029: { festivalDay: '2029-12-24', festivalDayEnd: '2029-12-25', offerDurationDays: 2, themeDurationDays: 14 },
      2030: { festivalDay: '2030-12-24', festivalDayEnd: '2030-12-25', offerDurationDays: 2, themeDurationDays: 14 },
    },
    theme: {
      primaryAccent: '#10b981',
      secondaryAccent: '#ef4444',
      badgeBg: 'bg-gradient-to-r from-emerald-600 via-red-600 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🎄 Christmas & New Year Festivities',
      heroHeadline: 'Holiday Magic in Every Slice.',
      heroHeadlineHighlight: 'Warm Cheesy Slices for Winter.',
      heroSubheadline: 'Celebrate the festive season with Harino’s handcrafted hot pizzas and gourmet garlic bread. Flat 20% OFF on Christmas!',
      heroGradient: 'from-emerald-950/90 via-red-950/50 to-slate-900/20',
      accentBorder: 'border-emerald-500/40',
      themeGlow: 'rgba(16, 185, 129, 0.25)',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Christmas Holiday Special',
      badge: '🎄 20% OFF HOLIDAY SPECIAL',
      description: 'Flat 20% OFF on all pizzas and sides on Christmas.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🪁 14. Makar Sankranti / Pongal (Hindu Solar) - Jan 14
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    category: 'hindu',
    priority: 85,
    datesByYear: {
      2026: { festivalDay: '2026-01-14' },
      2027: { festivalDay: '2027-01-14' },
      2028: { festivalDay: '2028-01-14' },
      2029: { festivalDay: '2029-01-14' },
      2030: { festivalDay: '2030-01-14' },
    },
    theme: {
      primaryAccent: '#0ea5e9',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-sky-500 via-amber-400 to-orange-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🪁 Makar Sankranti Kite Festival',
      heroHeadline: 'Flavours Soaring High.',
      heroHeadlineHighlight: 'Crispy Festive Crusts.',
      heroSubheadline: 'Celebrate Uttarayan & Pongal with soaring delicious pizzas and gourmet appetizers. Flat 20% OFF on festival day.',
      heroGradient: 'from-sky-950/90 via-amber-950/50 to-slate-900/20',
      accentBorder: 'border-sky-400/40',
      themeGlow: 'rgba(14, 165, 233, 0.25)',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Makar Sankranti Festive Offer',
      badge: '🪁 20% OFF SANKRANTI FEAST',
      description: 'Flat 20% OFF on entire menu on Makar Sankranti.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },
];
