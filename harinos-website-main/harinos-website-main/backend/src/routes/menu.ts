import { Router } from 'express';
import { getOrderStore } from '../storage/index.js';
import { MenuItem, OutletConfig, OfferCard } from '../types.js';

const router = Router();

const DEFAULT_OUTLETS = [
  {
    id: 'outlet-1',
    enabled: true,
    name: "Harino's Main Outlet",
    phone: '+917818958571',
    latitude: 28.011897,
    longitude: 77.675534,
    deliveryRadiusKm: 7,
    freeDeliveryRadiusKm: 3,
    freeDeliveryMinimumOrder: 150,
    minimumOrderIncrementPerKm: 100,
    deliveryChargePerKm: 15,
  },
];

const DEFAULT_OFFERS = [
  {
    id: 'offer-card-1',
    enabled: false,
    image: '/images/vegover.jpeg',
    offerTitle: 'Buy any Large Pizza and get a burger free',
    displayText: 'Season Offer.',
    condition: 'Apply on Pizza when selected size price is Rs 299 or more.',
    additionalItem: 'Stuffed Garlic Bread',
    additionalItemImage: '/images/stuffed.jpeg',
    notifyCustomers: true,
  },
  {
    id: 'offer-card-2',
    enabled: false,
    image: '/images/hari.jpeg',
    offerTitle: "New launch: Harino's Special",
    displayText: 'Try our latest limited time dish',
    condition: "Apply on Harino's Special when selected size price is Rs 219 or more.",
    additionalItem: 'Tikka Burger',
    additionalItemImage: '/images/tikkaburgar.jpeg',
    notifyCustomers: true,
  },
  {
    id: 'offer-card-3',
    enabled: false,
    image: '/images/chocolava.jpeg',
    offerTitle: 'Store update or custom announcement',
    displayText: 'Keep this card for info, timings, launch news, bundle highlights, or any message you want to show.',
    condition: 'Display only card. No automatic discount rule.',
    additionalItem: 'Cold Coffee',
    additionalItemImage: '/images/coldcoffee.jpeg',
    notifyCustomers: false,
  },
];

const DEFAULT_MENU_ITEMS = [
  {
    id: 'p1_co',
    name: "Cheese & Onion Pizza",
    description: "Classic hand-stretched pizza topped with mozzarella and onions.",
    price: 99,
    category: 'Pizza',
    image: "/images/cheeseonion.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 99 }, { label: 'Medium', price: 219 }, { label: 'Large', price: 329 }]
  },
  {
    id: 'p1_t',
    name: "Cheese & Tomato",
    description: "Double mozzarella with fresh juicy tomatoes.",
    price: 119,
    category: 'Pizza',
    image: "/images/cheesetomato.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 119 }, { label: 'Medium', price: 239 }, { label: 'Large', price: 349 }]
  },
  {
    id: 'p1_cap',
    name: "Cheese & Capsicum",
    description: "Double mozzarella with crunchy green capsicum.",
    price: 119,
    category: 'Pizza',
    image: "/images/cheesecap.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 119 }, { label: 'Medium', price: 239 }, { label: 'Large', price: 349 }]
  },
  {
    id: 'p1_corn',
    name: "Cheese & Corn",
    description: "Sweet golden corn smothered in mozzarella.",
    price: 129,
    category: 'Pizza',
    image: "/images/sweetcorn.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 129 }, { label: 'Medium', price: 259 }, { label: 'Large', price: 369 }]
  },
  {
    id: 'p1_p',
    name: "Cheese & Paneer",
    description: "Soft paneer chunks smothered in mozzarella.",
    price: 129,
    category: 'Pizza',
    image: "/images/cheesepaneer.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 129 }, { label: 'Medium', price: 259 }, { label: 'Large', price: 369 }]
  },
  {
    id: 'p2_tp',
    name: "Tandoori Paneer (Paneer + Onion)",
    description: "Smoky tandoori marinated paneer with grilled onions.",
    price: 149,
    category: 'Pizza',
    image: "/images/tanduripaneer.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 149 }, { label: 'Medium', price: 289 }, { label: 'Large', price: 409 }]
  },
  {
    id: 'p_hs',
    name: "Harino's Special",
    description: "Signature masterpiece with paneer, corn, olives and secret spices.",
    price: 219,
    category: 'Pizza',
    image: "/images/hari.jpeg",
    vegetarian: true,
    available: true,
    popular: true,
    sizes: [{ label: 'Regular', price: 219 }, { label: 'Medium', price: 349 }, { label: 'Large', price: 499 }]
  },
  {
    id: 'm1_v',
    name: "Veg Steam Momos",
    description: "Delicate steamed veggie dumplings.",
    price: 40,
    category: 'Momos & Fries',
    image: "/images/steammomos.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Half', price: 40 }, { label: 'Full', price: 60 }]
  },
  {
    id: 'b_tk',
    name: "Tikka Burger",
    description: "Spicy tikka patty with premium mayo.",
    price: 40,
    category: 'Burgers',
    image: "/images/tikkaburgar.jpeg",
    vegetarian: true,
    available: true
  },
  {
    id: 's_cl',
    name: "Choco Lava Cake",
    description: "Molten chocolate center cake.",
    price: 60,
    category: 'Sides & Snacks',
    image: "/images/chocolava.jpeg",
    vegetarian: true,
    available: true
  },
  {
    id: 'd_cc',
    name: "Cold Coffee",
    description: "Iced coffee blend.",
    price: 70,
    category: 'Beverages',
    image: "/images/coldcoffee.jpeg",
    vegetarian: true,
    available: true,
    sizes: [{ label: 'Regular', price: 70 }]
  }
];

// Menu Items
router.get('/menu-items', async (_req, res, next) => {
  try {
    const store = getOrderStore();
    let items = await store.getMenuItems();
    if (items.length === 0) {
      console.log('Seeding default menu items...');
      for (const item of DEFAULT_MENU_ITEMS) {
        await store.saveMenuItem(item as MenuItem);
      }
      items = await store.getMenuItems();
    }
    res.json({ success: true, menuItems: items });
  } catch (error) {
    next(error);
  }
});

router.post('/menu-items', async (req, res, next) => {
  try {
    const item = req.body as Partial<MenuItem>;
    if (!item.id || !item.name || typeof item.price !== 'number') {
      res.status(400).json({ success: false, message: 'Invalid menu item payload.' });
      return;
    }
    await getOrderStore().saveMenuItem(item as MenuItem);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/menu-items/seed', async (req, res, next) => {
  try {
    const items = req.body as MenuItem[];
    if (!Array.isArray(items)) {
      res.status(400).json({ success: false, message: 'Payload must be an array of menu items.' });
      return;
    }
    const store = getOrderStore();
    for (const item of items) {
      await store.saveMenuItem(item);
    }
    res.json({ success: true, count: items.length });
  } catch (error) {
    next(error);
  }
});

// Outlets
router.get('/outlets', async (_req, res, next) => {
  try {
    const store = getOrderStore();
    let outlets = await store.getOutlets();
    if (outlets.length === 0) {
      console.log('Seeding default outlets...');
      for (const outlet of DEFAULT_OUTLETS) {
        await store.saveOutlet(outlet as OutletConfig);
      }
      outlets = await store.getOutlets();
    }
    res.json({ success: true, outlets });
  } catch (error) {
    next(error);
  }
});

router.post('/outlets', async (req, res, next) => {
  try {
    const outlet = req.body as Partial<OutletConfig>;
    if (!outlet.id || !outlet.name || !outlet.phone) {
      res.status(400).json({ success: false, message: 'Invalid outlet payload.' });
      return;
    }
    await getOrderStore().saveOutlet(outlet as OutletConfig);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/outlets/seed', async (req, res, next) => {
  try {
    const outlets = req.body as OutletConfig[];
    if (!Array.isArray(outlets)) {
      res.status(400).json({ success: false, message: 'Payload must be an array of outlets.' });
      return;
    }
    const store = getOrderStore();
    for (const outlet of outlets) {
      await store.saveOutlet(outlet);
    }
    res.json({ success: true, count: outlets.length });
  } catch (error) {
    next(error);
  }
});

// Offers
router.get('/offers', async (_req, res, next) => {
  try {
    const store = getOrderStore();
    let offers = await store.getOffers();
    if (offers.length === 0) {
      console.log('Seeding default offers...');
      for (const offer of DEFAULT_OFFERS) {
        await store.saveOffer(offer as OfferCard);
      }
      offers = await store.getOffers();
    }
    res.json({ success: true, offers });
  } catch (error) {
    next(error);
  }
});

router.post('/offers', async (req, res, next) => {
  try {
    const offer = req.body as Partial<OfferCard>;
    if (!offer.id || !offer.offerTitle) {
      res.status(400).json({ success: false, message: 'Invalid offer payload.' });
      return;
    }
    await getOrderStore().saveOffer(offer as OfferCard);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/offers/seed', async (req, res, next) => {
  try {
    const offers = req.body as OfferCard[];
    if (!Array.isArray(offers)) {
      res.status(400).json({ success: false, message: 'Payload must be an array of offers.' });
      return;
    }
    const store = getOrderStore();
    for (const offer of offers) {
      await store.saveOffer(offer);
    }
    res.json({ success: true, count: offers.length });
  } catch (error) {
    next(error);
  }
});

export default router;
