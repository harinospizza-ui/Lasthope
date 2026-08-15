export interface FestivalTheme {
  primaryAccent: string;
  secondaryAccent: string;
  badgeBg: string;
  badgeText: string;
  heroTag: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroGradient?: string;
  accentBorder?: string;
  themeGlow?: string;
}

export interface FestivalMedia {
  heroImage: string;
  promotionalImage: string;
  video?: string;
  videoPoster?: string;
}

export interface FestivalOffer {
  enabled: boolean;
  discountType: 'percentage';
  discountValue: number; // headline discount (e.g. 20)
  pizzaDiscountValue?: number; // e.g. 20% on pizzas
  otherDiscountValue?: number; // e.g. 10% on all other items
  title: string;
  badge: string;
  description: string;
  terms: string;
}

export interface FestivalCampaign {
  id: string;
  name: string;
  eventType: 'national' | 'festival' | 'commercial';
  financialYear: string; // e.g. "2026-27"
  startDate: string; // ISO 8601 with +05:30 offset
  endDate: string; // ISO 8601 with +05:30 offset
  priority: number; // Higher number takes precedence if overlapping
  enabled: boolean;
  theme: FestivalTheme;
  media: FestivalMedia;
  offer: FestivalOffer;
}

/**
 * CENTRALIZED FESTIVAL & NATIONAL OCCASIONS CAMPAIGN CALENDAR (FY 2026-27)
 * 
 * Rules:
 * 1. Timezone: IST (UTC+05:30)
 * 2. Precedence: Sorted deterministically by highest priority first, then latest start date.
 * 3. Commercial non-Muslim Indian national occasions & cultural festivals only.
 */
export const FESTIVAL_CAMPAIGNS: FestivalCampaign[] = [
  // 🇮🇳 1. Independence Day 2026 (Active Today: 15 August 2026)
  {
    id: 'independence-day-2026',
    name: '80th Independence Day',
    eventType: 'national',
    financialYear: '2026-27',
    startDate: '2026-08-15T00:00:00+05:30',
    endDate: '2026-08-21T23:59:59+05:30',
    priority: 100,
    enabled: true,
    theme: {
      primaryAccent: '#f97316', // Vibrant Saffron
      secondaryAccent: '#16a34a', // Indian Emerald Green
      badgeBg: 'bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600',
      badgeText: 'text-white font-black',
      heroTag: '🇮🇳 80th Independence Day Special',
      heroHeadline: 'Celebrate India.',
      heroHeadlineHighlight: 'Celebrate with Harino’s.',
      heroSubheadline:
        'Honoring 80 years of freedom with pure vegetarian culinary excellence. Enjoy flat 20% OFF on all handcrafted Pizzas & 10% OFF on all other items.',
      heroGradient: 'from-slate-950/90 via-slate-900/60 to-slate-900/20',
      accentBorder: 'border-orange-500/30',
      themeGlow: 'rgba(249, 115, 22, 0.25)',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
      video: '/festivals/independence-day/promo.mp4',
      videoPoster: '/festivals/independence-day/hero.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      pizzaDiscountValue: 20,
      otherDiscountValue: 10,
      title: '80th Independence Day Offer',
      badge: '🇮🇳 20% OFF PIZZAS • 10% OFF OTHERS',
      description: 'Get Flat 20% OFF on all Pizzas and 10% OFF on all Burgers, Momos, Fries & Sides.',
      terms: '20% OFF on Pizzas + 10% OFF on other items. Automatically applied on food subtotal. Valid for Dine-in, Takeaway & Delivery.',
    },
  },

  // 🪢 2. Raksha Bandhan 2026
  {
    id: 'raksha-bandhan-2026',
    name: 'Raksha Bandhan',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-08-27T00:00:00+05:30',
    endDate: '2026-08-31T23:59:59+05:30',
    priority: 85,
    enabled: true,
    theme: {
      primaryAccent: '#e11d48',
      secondaryAccent: '#fbbf24',
      badgeBg: 'bg-gradient-to-r from-rose-500 to-amber-500',
      badgeText: 'text-white font-black',
      heroTag: '🪢 Raksha Bandhan Sibling Feast',
      heroHeadline: 'Celebrating the Sacred Bond of Love.',
      heroHeadlineHighlight: 'Treat Your Siblings.',
      heroSubheadline:
        'Share handcrafted cheesy slices and gourmet sides with your beloved brother & sister. Flat 20% discount on every order.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Raksha Bandhan Special',
      badge: '🪢 20% OFF SIBLING FEAST',
      description: 'Flat 20% OFF on all pizzas, sides, and momos.',
      terms: 'Automatically applied on cart subtotal.',
    },
  },

  // 🦚 3. Krishna Janmashtami 2026
  {
    id: 'janmashtami-2026',
    name: 'Janmashtami',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-09-04T00:00:00+05:30',
    endDate: '2026-09-08T23:59:59+05:30',
    priority: 85,
    enabled: true,
    theme: {
      primaryAccent: '#0284c7',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-sky-500 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🦚 Shri Krishna Janmashtami Celebration',
      heroHeadline: 'Pure Delights & Blessed Flavors.',
      heroHeadlineHighlight: 'Festive Gourmet Treats.',
      heroSubheadline:
        '100% Pure Vegetarian handcrafted recipes prepared with utmost hygiene and devotion. Enjoy 20% OFF storewide.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Janmashtami Mahotsav Offer',
      badge: '🦚 20% OFF STOREWIDE',
      description: 'Flat 20% OFF on all gourmet pizzas and sides.',
      terms: 'No coupon required. Pure vegetarian.',
    },
  },

  // 🌺 4. Ganesh Chaturthi 2026
  {
    id: 'ganesh-chaturthi-2026',
    name: 'Ganesh Chaturthi',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-09-14T00:00:00+05:30',
    endDate: '2026-09-19T23:59:59+05:30',
    priority: 90,
    enabled: true,
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#facc15',
      badgeBg: 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400',
      badgeText: 'text-white font-black',
      heroTag: '🌺 Ganpati Bappa Morya! Festive Offer',
      heroHeadline: 'Welcome Lord Ganesha With Joy.',
      heroHeadlineHighlight: 'Feast with Harino’s.',
      heroSubheadline:
        'Celebrate auspicious beginnings with family and friends. Savor your favorites with flat 20% OFF.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Ganesh Utsav 20% Off',
      badge: '🌺 20% OFF FESTIVE BLESSINGS',
      description: 'Celebrate Ganesh Utsav with flat 20% savings on your cart.',
      terms: 'Automatically calculated during checkout.',
    },
  },

  // 🪔 5. Navratri & Durga Puja 2026
  {
    id: 'navratri-2026',
    name: 'Navratri & Durga Puja',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-10-11T00:00:00+05:30',
    endDate: '2026-10-19T23:59:59+05:30',
    priority: 90,
    enabled: true,
    theme: {
      primaryAccent: '#dc2626',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-red-600 to-yellow-500',
      badgeText: 'text-white font-black',
      heroTag: '🪔 Shubh Navratri & Durga Puja Special',
      heroHeadline: 'Nine Divine Days of Flavor.',
      heroHeadlineHighlight: 'Pure Veg Celebration.',
      heroSubheadline:
        'Garba nights and family dinners made special with 100% vegetarian handcrafted crusts and 20% OFF.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Navratri Utsav 20% Off',
      badge: '🪔 20% OFF NAVRATRI SPECIAL',
      description: 'Flat 20% OFF across the complete pure-veg menu.',
      terms: 'Valid on Dine-in, Takeaway, and Delivery.',
    },
  },

  // 🏹 6. Dussehra (Vijayadashami) 2026
  {
    id: 'dussehra-2026',
    name: 'Dussehra',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-10-20T00:00:00+05:30',
    endDate: '2026-10-23T23:59:59+05:30',
    priority: 90,
    enabled: true,
    theme: {
      primaryAccent: '#d97706',
      secondaryAccent: '#b45309',
      badgeBg: 'bg-gradient-to-r from-amber-600 to-orange-500',
      badgeText: 'text-white font-black',
      heroTag: '🏹 Vijayadashami Victory Celebration',
      heroHeadline: 'Celebrate The Victory of Goodness.',
      heroHeadlineHighlight: 'Grand Feast at Harino’s.',
      heroSubheadline:
        'Commemorate Dussehra with delicious artisanal pizzas and sides. Flat 20% discount on every order.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Dussehra Victory Offer',
      badge: '🏹 20% OFF VIJAYADASHAMI',
      description: 'Flat 20% OFF on all orders during Dussehra week.',
      terms: 'Auto-applied discount in cart.',
    },
  },

  // 🌙 7. Karwa Chauth 2026
  {
    id: 'karwa-chauth-2026',
    name: 'Karwa Chauth',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-10-29T00:00:00+05:30',
    endDate: '2026-10-31T23:59:59+05:30',
    priority: 80,
    enabled: true,
    theme: {
      primaryAccent: '#be123c',
      secondaryAccent: '#f43f5e',
      badgeBg: 'bg-gradient-to-r from-rose-700 to-pink-500',
      badgeText: 'text-white font-black',
      heroTag: '🌙 Karwa Chauth Celebration Dinner',
      heroHeadline: 'Break The Fast Together.',
      heroHeadlineHighlight: 'Romantic Gourmet Feast.',
      heroSubheadline:
        'Celebrate an evening of devotion and love with hot gourmet pizza and crunchy appetizers. Flat 20% OFF.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Karwa Chauth Dinner Special',
      badge: '🌙 20% OFF COUPLE’S FEAST',
      description: 'Flat 20% OFF on complete order.',
      terms: 'Automatic discount applied at checkout.',
    },
  },

  // 🪔 8. Diwali & Dhanteras Mega Festival 2026
  {
    id: 'diwali-2026',
    name: 'Diwali & Dhanteras',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2026-11-06T00:00:00+05:30',
    endDate: '2026-11-13T23:59:59+05:30',
    priority: 100,
    enabled: true,
    theme: {
      primaryAccent: '#f59e0b', // Radiant Gold
      secondaryAccent: '#b45309',
      badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500',
      badgeText: 'text-slate-950 font-black',
      heroTag: '🪔 Grand Diwali & Dhanteras Mahotsav',
      heroHeadline: 'Festival of Lights & Warmth.',
      heroHeadlineHighlight: 'Light Up Your Tastebuds.',
      heroSubheadline:
        'Wishing you prosperity, joy, and the richest handcrafted pizzas. Enjoy our signature 20% Diwali discount storewide.',
      accentBorder: 'border-amber-400/40',
      themeGlow: 'rgba(245, 158, 11, 0.3)',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
      video: '/festivals/diwali/promo.mp4',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Diwali Mahotsav 20% Off',
      badge: '🪔 20% OFF DIWALI MEGA FEAST',
      description: 'Flat 20% discount on all gourmet pizzas, burgers, momos, and sides.',
      terms: 'Valid throughout the Diwali campaign period.',
    },
  },

  // 🎄 9. Christmas & New Year Holiday Festival 2026-27
  {
    id: 'christmas-newyear-2026',
    name: 'Christmas & New Year',
    eventType: 'commercial',
    financialYear: '2026-27',
    startDate: '2026-12-24T00:00:00+05:30',
    endDate: '2027-01-01T23:59:59+05:30',
    priority: 95,
    enabled: true,
    theme: {
      primaryAccent: '#dc2626',
      secondaryAccent: '#15803d',
      badgeBg: 'bg-gradient-to-r from-red-600 via-emerald-600 to-amber-400',
      badgeText: 'text-white font-black',
      heroTag: '🎄 Holiday Season & New Year Carnival',
      heroHeadline: 'Winter Cheer & Festive Bites.',
      heroHeadlineHighlight: 'Welcome 2027 With Harino’s.',
      heroSubheadline:
        'Wrap up the year with cheesy wood-fired goodness. Enjoy 20% holiday discount on all party orders.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Holiday Season 20% Off',
      badge: '🎄 20% OFF HOLIDAY CARNIVAL',
      description: 'Flat 20% OFF on all pizzas and sides for Christmas & New Year celebrations.',
      terms: 'Automatic discount at checkout.',
    },
  },

  // 🪁 10. Makar Sankranti, Pongal & Lohri 2027
  {
    id: 'makar-sankranti-2027',
    name: 'Makar Sankranti & Lohri',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2027-01-13T00:00:00+05:30',
    endDate: '2027-01-16T23:59:59+05:30',
    priority: 85,
    enabled: true,
    theme: {
      primaryAccent: '#ea580c',
      secondaryAccent: '#f59e0b',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      badgeText: 'text-white font-black',
      heroTag: '🪁 Makar Sankranti & Lohri Utsav',
      heroHeadline: 'High Spirits, Soaring Flavors.',
      heroHeadlineHighlight: 'Harvest Season Delights.',
      heroSubheadline:
        'Celebrate the warmth of bonfires and kites with freshly baked pizza crusts and 20% savings.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Sankranti & Lohri 20% Off',
      badge: '🪁 20% OFF HARVEST FEAST',
      description: 'Flat 20% OFF across the menu.',
      terms: 'Automatically deducted from order total.',
    },
  },

  // 🇮🇳 11. Republic Day 2027
  {
    id: 'republic-day-2027',
    name: 'Republic Day',
    eventType: 'national',
    financialYear: '2026-27',
    startDate: '2027-01-25T00:00:00+05:30',
    endDate: '2027-01-31T23:59:59+05:30',
    priority: 100,
    enabled: true,
    theme: {
      primaryAccent: '#f97316',
      secondaryAccent: '#16a34a',
      badgeBg: 'bg-gradient-to-r from-orange-500 via-white/80 to-emerald-600',
      badgeText: 'text-slate-900 font-black',
      heroTag: '🇮🇳 78th Republic Day Celebration',
      heroHeadline: 'Pride of The Nation.',
      heroHeadlineHighlight: 'Taste of India with Harino’s.',
      heroSubheadline:
        'Celebrating unity, democracy, and culinary passion. Enjoy flat 20% OFF automatically applied on your cart.',
      accentBorder: 'border-emerald-500/30',
      themeGlow: 'rgba(22, 163, 74, 0.25)',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
      video: '/festivals/republic-day/promo.mp4',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Republic Day 20% Off',
      badge: '🇮🇳 20% OFF PATRIOTIC FEAST',
      description: 'Flat 20% OFF on all pizzas, burgers, momos, and garlic bread.',
      terms: 'Automatically calculated at checkout.',
    },
  },

  // 🔱 12. Mahashivratri 2027
  {
    id: 'mahashivratri-2027',
    name: 'Mahashivratri',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2027-03-05T00:00:00+05:30',
    endDate: '2027-03-08T23:59:59+05:30',
    priority: 85,
    enabled: true,
    theme: {
      primaryAccent: '#4f46e5',
      secondaryAccent: '#9333ea',
      badgeBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      badgeText: 'text-white font-black',
      heroTag: '🔱 Maha Shivratri Divine Celebration',
      heroHeadline: 'Devotion, Peace & Purity.',
      heroHeadlineHighlight: 'Pure Vegetarian Delights.',
      heroSubheadline:
        '100% Pure Vegetarian artisanal recipes crafted with precision and care. Flat 20% OFF.',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Maha Shivratri Offer',
      badge: '🔱 20% OFF PURE VEG FEAST',
      description: 'Flat 20% discount on all vegetarian delicacies.',
      terms: 'No coupon required.',
    },
  },

  // 🎨 13. Holi Festival of Colors 2027
  {
    id: 'holi-2027',
    name: 'Holi (Festival of Colors)',
    eventType: 'festival',
    financialYear: '2026-27',
    startDate: '2027-03-21T00:00:00+05:30',
    endDate: '2027-03-26T23:59:59+05:30',
    priority: 100,
    enabled: true,
    theme: {
      primaryAccent: '#ec4899',
      secondaryAccent: '#8b5cf6',
      badgeBg: 'bg-gradient-to-r from-pink-500 via-amber-400 to-violet-600',
      badgeText: 'text-white font-black',
      heroTag: '🎨 Happy Holi! Festival of Vibrant Colors',
      heroHeadline: 'Splash of Joy, Burst of Flavors.',
      heroHeadlineHighlight: 'Holi Celebration Feast.',
      heroSubheadline:
        'Color your day with piping hot pizzas and cheesy garlic breads. Flat 20% OFF on all festive orders.',
      accentBorder: 'border-pink-400/40',
      themeGlow: 'rgba(236, 72, 153, 0.3)',
    },
    media: {
      heroImage: '/festivals/independence-day/hero.webp',
      promotionalImage: '/festivals/independence-day/offer.webp',
      video: '/festivals/holi/promo.mp4',
    },
    offer: {
      enabled: true,
      discountType: 'percentage',
      discountValue: 20,
      title: 'Holi Festival 20% Off',
      badge: '🎨 20% OFF COLORFUL FEAST',
      description: 'Flat 20% OFF on the entire menu during Holi week.',
      terms: 'Automatically applied at checkout.',
    },
  },
];
