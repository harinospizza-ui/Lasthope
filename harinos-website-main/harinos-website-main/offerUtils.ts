import { MENU_ITEMS } from './constants';
import {
  CartItem,
  Category,
  CategoryFilter,
  MenuItem,
  OfferCard,
  PricedCartItem,
} from './types';

export const getItemBasePrice = (
  item: Pick<MenuItem, 'price' | 'sizes'>,
  selectedSize?: string,
): number => {
  if (!selectedSize || !item.sizes?.length) {
    return item.price;
  }

  const matchedSize = item.sizes.find((size) => size.label === selectedSize);
  return matchedSize ? matchedSize.price : item.price;
};

export const getCartItemId = (
  item: Pick<CartItem, 'id' | 'selectedSize' | 'isOfferBonus' | 'sourceOfferId'>,
): string => {
  const sizeSuffix = item.selectedSize ? `-${item.selectedSize}` : '';
  return item.isOfferBonus
    ? `bonus-${item.sourceOfferId ?? 'offer'}-${item.id}${sizeSuffix}`
    : `${item.id}${sizeSuffix}`;
};

export const normalizeStoredCartItem = (item: MenuItem & Partial<CartItem>): CartItem => ({
  ...item,
  quantity: Math.max(1, item.quantity ?? 1),
  selectedSize: item.selectedSize,
  basePrice: item.basePrice ?? getItemBasePrice(item, item.selectedSize),
});

export const getOfferConditionLabel = (offer: OfferCard): string => {
  if (offer.condition) {
    return offer.condition;
  }

  const parts: string[] = [];
  if (offer.isSundayOffer) {
    parts.push('Sunday Only');
  }
  if (offer.minimumOrder) {
    parts.push(`Min Order Rs ${offer.minimumOrder}`);
  }
  if (offer.targetCategory && offer.targetCategory !== 'All') {
    let targetDesc = offer.targetCategory;
    if (offer.targetCategory === 'Pizza' && offer.targetSize && offer.targetSize !== 'All') {
      targetDesc = `${offer.targetSize} Pizza`;
    }
    parts.push(`Applies on ${targetDesc}`);
  }
  if (offer.offerPercentage) {
    parts.push(`${offer.offerPercentage}% Off`);
  }
  if (offer.additionalItem) {
    parts.push(`Free ${offer.additionalItem}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'Special Promo';
};

// Check if a category matches defensively (handling singular, plural, and case)
const matchesCategory = (itemCategory: string, targetCategory: string): boolean => {
  const itemCat = itemCategory.toLowerCase().trim();
  const targetCat = targetCategory.toLowerCase().trim();

  return (
    itemCat === targetCat ||
    (targetCat === 'pizza' && itemCat === 'pizza') ||
    (targetCat === 'burger' && itemCat === 'burgers') ||
    (targetCat === 'burgers' && itemCat === 'burgers') ||
    (targetCat === 'fries' && itemCat === 'fries') ||
    (targetCat === 'momos' && itemCat === 'momos') ||
    (targetCat === 'beverage' && itemCat === 'beverages') ||
    (targetCat === 'beverages' && itemCat === 'beverages') ||
    (targetCat === 'side orders' && itemCat === 'sides') ||
    (targetCat === 'side' && itemCat === 'sides') ||
    (targetCat === 'sides' && itemCat === 'sides')
  );
};

export const doesOfferConditionMatchCart = (offer: OfferCard, cart: CartItem[]): boolean => {
  if (!offer.enabled) return false;

  const today = new Date().getDay();
  if (offer.isSundayOffer && today !== 0) {
    return false;
  }

  const customerCart = cart.filter((item) => !item.isOfferBonus);
  if (!customerCart.length) {
    return false;
  }

  // Calculate cart subtotal
  const cartSubtotal = customerCart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

  // Check minimum order
  if (offer.minimumOrder && cartSubtotal < offer.minimumOrder) {
    return false;
  }

  // If no target category is specified or it is All, the condition is met (since min order matches)
  if (!offer.targetCategory || offer.targetCategory === 'All') {
    return true;
  }

  // Otherwise, at least one item in the cart must match the target category (and size if pizza)
  return customerCart.some((item) => {
    if (!matchesCategory(item.category, offer.targetCategory || '')) {
      return false;
    }

    if (
      item.category === Category.PIZZA &&
      offer.targetSize &&
      offer.targetSize !== 'All'
    ) {
      const itemSize = (item.selectedSize || '').toLowerCase().trim();
      const targetSize = offer.targetSize.toLowerCase().trim();
      if (itemSize !== targetSize) {
        return false;
      }
    }

    return true;
  });
};

export const getMatchingDiscountOffer = (
  offers: OfferCard[],
  item: Pick<MenuItem, 'id' | 'category'> & { selectedSize?: string },
): OfferCard | undefined => {
  const today = new Date().getDay();

  return offers.find((offer) => {
    if (!offer.enabled || !offer.offerPercentage) {
      return false;
    }

    if (offer.isSundayOffer && today !== 0) {
      return false;
    }

    if (offer.targetCategory && offer.targetCategory !== 'All') {
      if (!matchesCategory(item.category, offer.targetCategory)) {
        return false;
      }

      if (
        item.category === Category.PIZZA &&
        offer.targetSize &&
        offer.targetSize !== 'All'
      ) {
        const itemSize = (item.selectedSize || '').toLowerCase().trim();
        const targetSize = offer.targetSize.toLowerCase().trim();
        if (itemSize !== targetSize) {
          return false;
        }
      }
    }

    return true;
  });
};

export const isOfferUnlocked = (
  offer: OfferCard,
  itemAmount: number,
  cartAmount: number,
): boolean => {
  if (offer.minimumOrder) {
    return cartAmount >= offer.minimumOrder;
  }
  return true;
};

export const getOfferMinimumScope = (offer: OfferCard): 'cart' | 'item' => {
  if (offer.minimumOrder) {
    return 'cart';
  }
  if (offer.targetSize && offer.targetSize !== 'All') {
    return 'item';
  }
  return 'cart';
};

export const getApplicableDiscountOffer = (
  offers: OfferCard[],
  item: Pick<MenuItem, 'id' | 'category'> & { selectedSize?: string },
  itemAmount: number,
  cartAmount: number,
): OfferCard | undefined => {
  const today = new Date().getDay();

  for (const offer of offers) {
    if (!offer.enabled || !offer.offerPercentage) {
      continue;
    }

    // Check Sunday rule
    if (offer.isSundayOffer && today !== 0) {
      continue;
    }

    // Check Minimum Order
    if (offer.minimumOrder && cartAmount < offer.minimumOrder) {
      continue;
    }

    // Check target category / size filter
    if (offer.targetCategory && offer.targetCategory !== 'All') {
      if (!matchesCategory(item.category, offer.targetCategory)) {
        continue;
      }

      // Check size for Pizza
      if (
        item.category === Category.PIZZA &&
        offer.targetSize &&
        offer.targetSize !== 'All'
      ) {
        const itemSize = (item.selectedSize || '').toLowerCase().trim();
        const targetSize = offer.targetSize.toLowerCase().trim();
        if (itemSize !== targetSize) {
          continue;
        }
      }
    }

    return offer;
  }

  return undefined;
};

export const getDiscountedUnitPrice = (basePrice: number, offer?: OfferCard): number => {
  if (!offer?.offerPercentage) {
    return basePrice;
  }

  return Math.round(basePrice * (1 - offer.offerPercentage / 100));
};

export const buildPricedCart = (cart: CartItem[], offers: OfferCard[]): PricedCartItem[] => {
  const cartSubtotal = cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);

  return cart.map((item) => {
    if (item.isOfferBonus) {
      const sourceOffer = offers.find((offer) => offer.id === item.sourceOfferId);

      return {
        ...item,
        discountedPrice: 0,
        totalPrice: 0,
        appliedOfferId: item.sourceOfferId,
        appliedOfferTitle: sourceOffer?.offerTitle ?? 'Auto Added',
      };
    }

    const lineAmount = item.basePrice * item.quantity;
    const matchedOffer = getApplicableDiscountOffer(offers, item, lineAmount, cartSubtotal);
    const discountedPrice = getDiscountedUnitPrice(item.basePrice, matchedOffer);

    return {
      ...item,
      discountedPrice,
      totalPrice: discountedPrice * item.quantity,
      appliedOfferId: matchedOffer?.id,
      appliedOfferTitle: matchedOffer?.offerTitle,
    };
  });
};

export const getOfferActionTarget = (
  offer: OfferCard,
): { category: CategoryFilter; item?: MenuItem } => {
  // Try to find if a category matches
  if (offer.targetCategory && offer.targetCategory !== 'All') {
    // Map to Category enum
    const foundCategory = Object.values(Category).find(
      (cat) => cat.toLowerCase() === (offer.targetCategory || '').toLowerCase(),
    );
    if (foundCategory) {
      return { category: foundCategory };
    }
  }

  return { category: 'All' };
};

export const getOfferActionLabel = (offer: OfferCard): string => {
  const target = getOfferActionTarget(offer);

  if (target.category !== 'All') {
    return `View ${target.category}`;
  }

  return 'Browse Menu';
};

export const getOfferNotificationMessage = (offer: OfferCard): string => {
  const extraItemText = offer.additionalItem ? ` Bonus highlight: ${offer.additionalItem}.` : '';
  const conditionLabel = getOfferConditionLabel(offer);
  return `${offer.displayText} (${conditionLabel})${extraItemText}`.trim();
};

export const getOfferReleaseSignature = (offers: OfferCard[]): string =>
  offers
    .filter((offer) => offer.enabled && offer.notifyCustomers)
    .map((offer) =>
      [
        offer.id,
        offer.offerTitle,
        offer.displayText,
        offer.offerPercentage ?? '',
        getOfferConditionLabel(offer),
        offer.additionalItem ?? '',
        offer.additionalItemImage ?? '',
      ].join('|'),
    )
    .join('||');

// Find a menu item by name for bonus auto-adding
const findMenuItemByName = (itemName: string): MenuItem | undefined => {
  const normalizedItemName = itemName.toLowerCase().trim();

  return MENU_ITEMS.find((item) => {
    const normalizedMenuName = item.name.toLowerCase().trim();
    return (
      normalizedMenuName === normalizedItemName ||
      normalizedMenuName.includes(normalizedItemName) ||
      normalizedItemName.includes(normalizedMenuName)
    );
  });
};

export const getAutomaticOfferBonusItems = (cart: CartItem[], offers: OfferCard[]): CartItem[] => {
  const today = new Date().getDay();

  return offers
    .filter((offer) => offer.enabled && !!offer.additionalItem)
    .flatMap((offer) => {
      // Check Sunday rule
      if (offer.isSundayOffer && today !== 0) {
        return [];
      }

      if (!doesOfferConditionMatchCart(offer, cart) || !offer.additionalItem) {
        return [];
      }

      const bonusMenuItem = findMenuItemByName(offer.additionalItem);
      if (!bonusMenuItem || !bonusMenuItem.available) {
        return [];
      }

      // If the offer is specifically applied to Pizza, and the bonus item is a Pizza,
      // default the free item size to Regular
      const selectedSize =
        bonusMenuItem.category === Category.PIZZA
          ? 'Regular'
          : bonusMenuItem.sizes?.[0]?.label;

      return [
        {
          ...bonusMenuItem,
          quantity: 1,
          selectedSize,
          basePrice: 0,
          isOfferBonus: true,
          sourceOfferId: offer.id,
          originalPrice: getItemBasePrice(bonusMenuItem, selectedSize),
        },
      ];
    });
};
