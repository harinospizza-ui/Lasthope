import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const isHapticsSupported = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') return false;
    // Check capacitor native platform or web vibration
    return true;
  } catch {
    return false;
  }
};

/**
 * Light tactile feedback for filter clicks, tab switches, and option selections.
 */
export const hapticLight = async (): Promise<void> => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
  }
};

/**
 * Medium tactile feedback for adding to cart, increasing quantities, and primary button taps.
 */
export const hapticMedium = async (): Promise<void> => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(25);
    }
  }
};

/**
 * Heavy tactile feedback for checkout actions and drawer dismissals.
 */
export const hapticHeavy = async (): Promise<void> => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(40);
    }
  }
};

/**
 * Success vibration pulse for successful order placement, coupon application, and coin rewards.
 */
export const hapticSuccess = async (): Promise<void> => {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([30, 40, 50]);
    }
  }
};

export const HapticsService = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
  success: hapticSuccess,
  isSupported: isHapticsSupported
};
