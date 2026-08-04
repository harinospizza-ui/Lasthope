import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CartItem,
  Category,
  CategoryFilter,
  CustomerLocation,
  AdminSession,
  CustomerProfile,
  MenuItem,
  OfferCard,
  Order,
  OrderItem,
  OrderType,
  OutletConfig,
  WalletTransaction,
} from './types';
import { MENU_ITEMS, OFFER_CARDS, OUTLET_LOCATIONS } from './constants';
import { StorageService } from './services/storage';
import { setDynamicFirebaseConfig } from './services/firebaseClient';
import { NotificationService } from './services/notification';
import { getServerOrders, saveCustomerToServer, saveFullOrderToServer, subscribeServerOrder, subscribeServerOrders, getServerMenuItems, seedMenuItemsToServer, subscribeServerMenuItems, getServerOutlets, seedOutletsToServer, subscribeServerOutlets, getServerOffers, seedOffersToServer, subscribeServerOffers, saveWalletTransactionToServer, getServerCustomers, verifyServerCustomer, getServerSettings, getServerCustomerById } from './services/orderApi';
import { copyTextToClipboard, getNotificationPermission } from './services/browserSupport';
import { notifyStaffNewOrder, requestNotificationPermission } from './services/notificationService';
import {
  buildPricedCart,
  getAutomaticOfferBonusItems,
  getCartItemId,
  getOfferActionTarget,
  getItemBasePrice,
  normalizeStoredCartItem,
} from './offerUtils';
import {
  OutletMatch,
  buildCustomerMapUrl,
  findNearestOutletByRoadDistance,
} from './outletUtils';
import { getDeliveryPricingSummary } from './deliveryPricing';
import Header from './components/Header';
import Hero from './components/Hero';
import OfferCarousel from './components/OfferCarousel';
import MenuSection from './components/MenuSection';
import CartSidebar from './components/CartSidebar';
import PastOrders from './components/PastOrders';
import PaymentModal from './components/PaymentModal';
import InstallPopup from './components/InstallPopup';
import ServiceModeModal from './components/ServiceModeModal';
import CustomerLoginModal from './components/CustomerLoginModal';
import AdminPanel from './components/AdminPanel';
import { WalletModal } from './components/WalletModal';
import FirstTimeUserModal from './components/FirstTimeUserModal';
import { useSwipeDismiss } from './hooks/useSwipeDismiss';

interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

const APP_HISTORY_NAMESPACE = 'harinos-ui';
const CUSTOMER_CARE_WHATSAPP_URL = 'https://wa.me/917818958571';

const SUNDAY_DHAMAKA_CARD: OfferCard = {
  id: 'offer-sunday-dhamaka',
  enabled: true,
  image: '/images/hari.jpeg',
  offerTitle: 'Sunday Dhamaka',
  displayText: 'Buy any Large Pizza and get a matching Regular Pizza FREE!',
  condition: 'Automatic buy 1 Large Pizza get 1 Regular free. Sunday only.',
  notifyCustomers: true,
};

type AppScreen = 'menu' | 'orders' | 'category' | 'cart' | 'payment' | 'success';

interface ResolvedOrderContext {
  customerLocation: CustomerLocation | null;
  outlet: OutletConfig;
  distanceKm: number | null;
}

const receiptHtml = (order: Order): string => `
<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${order.id}</title>
<style>
  *{box-sizing:border-box}
  body{
    font-family:'Courier New',monospace;
    font-size:10px;
    line-height:1.2;
    color:#000;
    background:#fff;
    margin:0;
    padding:2mm;
    width: 54mm;
  }
  .center{text-align:center}
  .brand{font-size:14px;font-weight:900;letter-spacing:.05em}
  .dash{border-top:1px dashed #000;margin:4px 0}
  .row{display:flex;justify-content:space-between;gap:4px}
  .total{font-size:12px;font-weight:900}
  @media print{
    @page {
      size: 54mm auto;
      margin: 0;
    }
    body {
      width: 54mm;
      margin: 0;
      padding: 1mm;
    }
  }
</style></head><body>
<div class="center"><div class="brand">HARINO'S PIZZA</div><div>${order.outletName ?? ''}</div></div>
<div class="dash"></div>
<div class="center"><b>ORDER: #${order.id}</b><br>${order.orderType.toUpperCase()}<br>${new Date(order.receivedAt ?? order.date).toLocaleString()}</div>
<div class="dash"></div>
<div>Cust: ${order.customerName ?? 'Customer'}</div>
<div>Ph: ${order.customerPhone ?? ''}</div>
<div>Payment: ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}</div>
<div class="dash"></div>
${order.items.map((item) => `<div class="row"><span>${item.quantity}x ${item.name}${item.selectedSize ? ` [${item.selectedSize}]` : ''}</span><b>Rs ${Math.round(item.totalPrice)}</b></div>`).join('')}
<div class="dash"></div>
<div class="row"><span>Subtotal</span><b>Rs ${Math.round(order.total - (order.deliveryFee ?? 0) + (order.walletAmountRedeemed ?? 0) + (order.rewardPointsRedeemed ?? 0))}</b></div>
${order.deliveryFee ? `<div class="row"><span>Delivery Fee</span><b>Rs ${Math.round(order.deliveryFee)}</b></div>` : ''}
${order.walletAmountRedeemed ? `<div class="row"><span>Wallet Paid</span><b>-Rs ${Math.round(order.walletAmountRedeemed)}</b></div>` : ''}
${order.rewardPointsRedeemed ? `<div class="row"><span>Points Paid</span><b>-Rs ${Math.round(order.rewardPointsRedeemed)}</b></div>` : ''}
<div class="dash"></div>
<div class="row total"><span>GRAND TOTAL</span><span>Rs ${Math.round(order.total)}</span></div>
<div class="dash"></div>
<div class="center">Thank you! Come again!<br>Because Hari Knows</div>
</body></html>`;

const a4InvoiceHtml = (order: Order): string => {
  const displayId = getDisplayOrderId(order.id);
  const orderDate = new Date(order.receivedAt ?? order.date).toLocaleString();

  const itemRows = order.items.map(item => {
    const sizeStr = item.selectedSize ? ` (${item.selectedSize})` : '';
    const name = `${item.name}${sizeStr}`;
    return `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left; font-size: 13px; vertical-align: top;">
          <div style="font-weight: bold; color: #333;">${name}</div>
          ${item.description ? `<div style="font-size: 11px; color: #777; margin-top: 2px;">${item.description}</div>` : ''}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px; color: #555; vertical-align: top;">Rs ${Math.round(item.discountedPrice ?? item.price)}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px; color: #555; vertical-align: top;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px; font-weight: bold; color: #333; vertical-align: top;">Rs ${Math.round(item.totalPrice)}</td>
      </tr>
    `;
  }).join('');

  const subtotal = Math.round(order.total - (order.deliveryFee ?? 0) + (order.walletAmountRedeemed ?? 0) + (order.rewardPointsRedeemed ?? 0));
  const deliveryFeeRow = order.deliveryFee 
    ? `<tr>
         <td style="padding: 8px 10px; text-align: left; font-size: 13px; color: #666;">Delivery Fee</td>
         <td style="padding: 8px 10px; text-align: right; font-size: 13px; font-weight: bold; color: #333;">Rs ${Math.round(order.deliveryFee)}</td>
       </tr>`
    : '';
  const walletRow = order.walletAmountRedeemed
    ? `<tr>
         <td style="padding: 8px 10px; text-align: left; font-size: 13px; color: #666;">Wallet Redeemed</td>
         <td style="padding: 8px 10px; text-align: right; font-size: 13px; font-weight: bold; color: #2e7d32;">-Rs ${Math.round(order.walletAmountRedeemed)}</td>
       </tr>`
    : '';
  const pointsRow = order.rewardPointsRedeemed
    ? `<tr>
         <td style="padding: 8px 10px; text-align: left; font-size: 13px; color: #666;">Coins Redeemed</td>
         <td style="padding: 8px 10px; text-align: right; font-size: 13px; font-weight: bold; color: #2e7d32;">-Rs ${Math.round(order.rewardPointsRedeemed)}</td>
       </tr>`
    : '';

  const grandTotal = Math.round(order.total);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - #${displayId}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
          color: #333;
          margin: 0;
          padding: 20px;
          background: #fff;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          padding: 20px;
        }
        .header-table {
          width: 100%;
          border-bottom: 3px solid #e53935;
          padding-bottom: 20px;
          margin-bottom: 25px;
        }
        .logo-title {
          font-size: 28px;
          font-weight: 800;
          color: #e53935;
          margin: 0;
          letter-spacing: 1px;
        }
        .logo-subtitle {
          font-size: 12px;
          color: #666;
          margin: 4px 0 0 0;
        }
        .invoice-heading {
          font-size: 26px;
          font-weight: 800;
          color: #333;
          margin: 0;
          text-align: right;
        }
        .invoice-meta {
          font-size: 13px;
          color: #666;
          margin: 5px 0 0 0;
          text-align: right;
        }
        .details-table {
          width: 100%;
          margin-bottom: 30px;
        }
        .details-column {
          width: 50%;
          vertical-align: top;
        }
        .details-card {
          background: #f8f9fa;
          border: 1px solid #eef0f2;
          border-radius: 12px;
          padding: 15px;
          margin-right: 10px;
          min-height: 120px;
        }
        .details-card-right {
          background: #f8f9fa;
          border: 1px solid #eef0f2;
          border-radius: 12px;
          padding: 15px;
          margin-left: 10px;
          min-height: 120px;
        }
        .card-title {
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          color: #e53935;
          margin: 0 0 10px 0;
          border-bottom: 1px dashed rgba(229, 57, 53, 0.2);
          padding-bottom: 4px;
        }
        .card-text {
          font-size: 13px;
          line-height: 1.6;
          color: #495057;
          margin: 0;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background: #e53935;
          color: #fff;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
          padding: 12px 10px;
          border: none;
        }
        .summary-table {
          width: 320px;
          margin-left: auto;
          border-collapse: collapse;
        }
        .grand-total-row {
          border-top: 2px solid #e53935;
          font-weight: 800;
          font-size: 16px;
          color: #e53935;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          border-top: 1px solid #eef0f2;
          padding-top: 20px;
          font-size: 12px;
          color: #868e96;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Logo and invoice heading -->
        <table class="header-table" style="width: 100%;">
          <tr>
            <td style="text-align: left; vertical-align: middle;">
              <h1 class="logo-title">HARINO'S PIZZA</h1>
              <p class="logo-subtitle">${order.outletName ?? 'Harino\'s Pizza Outlet'}</p>
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <h2 class="invoice-heading">INVOICE</h2>
              <p class="invoice-meta">Order ID: <strong>#${displayId}</strong></p>
              <p class="invoice-meta">Date: ${orderDate}</p>
            </td>
          </tr>
        </table>

        <!-- Billed to & Order details -->
        <table class="details-table" style="width: 100%;">
          <tr>
            <td class="details-column">
              <div class="details-card">
                <h3 class="card-title">Billed To</h3>
                <p class="card-text">
                  <strong>Name:</strong> ${order.customerName ?? 'Customer'}<br>
                  <strong>Phone:</strong> ${order.customerPhone ?? 'N/A'}<br>
                  <strong>Email:</strong> ${order.customerEmail ?? 'N/A'}
                </p>
              </div>
            </td>
            <td class="details-column">
              <div class="details-card-right">
                <h3 class="card-title">Order Info</h3>
                <p class="card-text">
                  <strong>Type:</strong> ${order.orderType.toUpperCase()}<br>
                  <strong>Payment:</strong> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : 'UPI'}<br>
                  <strong>Address:</strong> ${order.outletAddress ?? 'Outlet Address'}
                </p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Items Table -->
        <table class="items-table" style="width: 100%;">
          <thead>
            <tr>
              <th style="text-align: left; border-top-left-radius: 8px; border-bottom-left-radius: 8px;">Item Description</th>
              <th style="text-align: right; width: 100px;">Price</th>
              <th style="text-align: right; width: 80px;">Qty</th>
              <th style="text-align: right; width: 120px; border-top-right-radius: 8px; border-bottom-right-radius: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- Totals Summary -->
        <table class="summary-table">
          <tr>
            <td style="padding: 8px 10px; text-align: left; font-size: 13px; color: #666;">Subtotal</td>
            <td style="padding: 8px 10px; text-align: right; font-size: 13px; font-weight: bold; color: #333;">Rs ${subtotal}</td>
          </tr>
          ${deliveryFeeRow}
          ${walletRow}
          ${pointsRow}
          <tr class="grand-total-row">
            <td style="padding: 12px 10px; text-align: left;">Grand Total</td>
            <td style="padding: 12px 10px; text-align: right;">Rs ${grandTotal}</td>
          </tr>
        </table>

        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0; font-weight: bold;">Thank you for dining with Harino's Pizza!</p>
          <p style="margin: 5px 0 0 0; font-style: italic;">Because Hari Knows</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const printOrderReceipt = (order: Order) => {
  const displayId = getDisplayOrderId(order.id);
  const scriptId = 'html2pdf-cdn-script';
  let script = document.getElementById(scriptId) as HTMLScriptElement;

  const runHtml2Pdf = () => {
    const element = document.createElement('div');
    element.innerHTML = a4InvoiceHtml(order);
    
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right in mm
      filename:     `Order_${displayId}_Bill.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (window as any).html2pdf().from(element).set(opt).save();
  };

  const fallbackPrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(a4InvoiceHtml(order));
    win.document.close();
    win.focus();
    window.setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  if (!(window as any).html2pdf) {
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.integrity = 'sha512-GsLlZN/3F2ErC5IfS51RR359xOPgq19cV50fGRoUX30jOb3JzuUMxlKCgizUXyURvuVEcKxpUMt5PRCxQN161Q==';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        runHtml2Pdf();
      };
      script.onerror = () => {
        console.error('Failed to load html2pdf from CDN, falling back to print dialog.');
        fallbackPrint();
      };
      document.body.appendChild(script);
    } else {
      let checkCount = 0;
      const interval = setInterval(() => {
        checkCount++;
        if ((window as any).html2pdf) {
          clearInterval(interval);
          runHtml2Pdf();
        } else if (checkCount > 50) {
          clearInterval(interval);
          fallbackPrint();
        }
      }, 100);
    }
  } else {
    runHtml2Pdf();
  }
};

export const getDisplayOrderId = (orderId: string): string => {
  if (!orderId) return '';
  const parts = orderId.split('-');
  if (parts.length >= 3) {
    return parts[2];
  }
  return parts[parts.length - 1];
};

export const extendMenuItemsWithGeneratedSeries = (items: MenuItem[]): MenuItem[] => {
  const extended: MenuItem[] = [];
  
  // Filter out any generated items that might be cached or passed in
  const sourceItems = items.filter(
    (item) => 
      item &&
      item.id &&
      !item.id.startsWith('cheese_') && 
      !item.id.startsWith('masala_') &&
      !item.id.startsWith('makhni_') &&
      !item.id.startsWith('tandoori_')
  );

  for (const item of sourceItems) {
    extended.push(item);

    // Exclude Harino's Special (p_hs) from the series generator
    if (item.category === Category.PIZZA && item.id !== 'p_hs') {
      // 1. Makhni Series version
      if (!item.name.toLowerCase().includes('makhni')) {
        const makhniId = `makhni_${item.id}`;
        extended.push({
          ...item,
          id: makhniId,
          name: `${item.name.replace(" Pizza", "").split(" (")[0]} Makhni Pizza`,
          description: `Rich and creamy makhni gravy base. ${item.description}`,
          price: item.price + 30,
          sizes: item.sizes?.map((sz) => ({
            label: sz.label,
            price: sz.label === 'Regular' ? sz.price + 30 : sz.label === 'Medium' ? sz.price + 45 : sz.label === 'Large' ? sz.price + 60 : sz.price + 30,
          })),
        });
      }

      // 2. Tandoori Series version
      if (!item.name.toLowerCase().includes('tandoori')) {
        const tandooriId = `tandoori_${item.id}`;
        extended.push({
          ...item,
          id: tandooriId,
          name: `${item.name.replace(" Pizza", "").split(" (")[0]} Tandoori Pizza`,
          description: `Smoky tandoori sauce base. ${item.description}`,
          price: item.price + 25,
          sizes: item.sizes?.map((sz) => ({
            label: sz.label,
            price: sz.label === 'Regular' ? sz.price + 25 : sz.label === 'Medium' ? sz.price + 35 : sz.label === 'Large' ? sz.price + 50 : sz.price + 25,
          })),
        });
      }
    }
  }

  return extended;
};

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(StorageService.getCustomerProfile());
  const [adminSession, setAdminSession] = useState<AdminSession | null>(StorageService.getAdminSession());
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [isServiceModeModalOpen, setIsServiceModeModalOpen] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [customerLocation, setCustomerLocation] = useState<CustomerLocation | null>(null);
  const [view, setView] = useState<'menu' | 'orders'>('menu');
  const [pastOrders, setPastOrders] = useState<Order[]>(StorageService.getPastOrders());
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [dismissedOrderId, setDismissedOrderId] = useState<string | null>(() => {
    return localStorage.getItem('dismissed_tracker_order_id') || null;
  });
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [nearestOutletMatch, setNearestOutletMatch] = useState<OutletMatch | null>(null);
  const [isResolvingOutletMatch, setIsResolvingOutletMatch] = useState(false);

  // Wallet and Discounts State
  const [useWallet, setUseWallet] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [isWalletPaymentOpen, setIsWalletPaymentOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState<string>('');
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);
  const [uncompletedOrdersCount, setUncompletedOrdersCount] = useState(0);

  const customerProfileRef = useRef(customerProfile);
  customerProfileRef.current = customerProfile;

  const lastProfileUpdateRef = useRef<number>(0);
  const lastNotifiedStatusRef = useRef<Record<string, string>>({});
  const updateLocalCustomerProfile = useCallback((profile: CustomerProfile | null) => {
    if (profile) {
      const localPhoto = StorageService.getProfilePhoto();
      if (localPhoto) {
        profile.avatar = localPhoto;
      }
      setCustomerProfile(profile);
      StorageService.saveCustomerProfile(profile);
    } else {
      setCustomerProfile(null);
      localStorage.removeItem('harinos_customer_profile');
      localStorage.removeItem('harinos_profile_photo');
    }
    lastProfileUpdateRef.current = Date.now();
  }, []);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newVersionString, setNewVersionString] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(extendMenuItemsWithGeneratedSeries(MENU_ITEMS));
  const [outlets, setOutlets] = useState<OutletConfig[]>(OUTLET_LOCATIONS);
  const [offers, setOffers] = useState<OfferCard[]>(OFFER_CARDS);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Initialize config immediately using Vite variables
  useEffect(() => {
    setConfigLoaded(true);
    const isTutorialCompleted = localStorage.getItem('harinos_tutorial_completed');
    if (!isTutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  // Listen to new orders for logged-in Admin/Manager/Staff devices
  useEffect(() => {
    if (!adminSession) {
      setUncompletedOrdersCount(0);
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(err => console.error('Error clearing app badge:', err));
      }
      return;
    }
    
    // Request notification permission automatically if not set
    if ('Notification' in window && Notification.permission === 'default') {
      void Notification.requestPermission();
    }

    const notifiedIds = new Set<string>();
    let initialLoad = true;

    const unsubscribe = subscribeServerOrders((serverOrders) => {
      let playSound = false;
      serverOrders.forEach((o) => {
        if (o.id && !notifiedIds.has(o.id)) {
          notifiedIds.add(o.id);
          // Only trigger alert if this is NOT the initial load and it's a new status order
          if (!initialLoad && o.status === 'new') {
            playSound = true;
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🍕 New Order Received', {
                body: `Order #${o.id.replace('HRN-', '')} from ${o.customerName || 'Customer'} - Rs ${Math.round(o.total)}`,
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                requireInteraction: true,
              });
            }
          }
        }
      });

      // Calculate uncompleted orders count
      const activeOrders = serverOrders.filter((o) => {
        if (!o) return false;
        if (o.isDeleted || String(o.isDeleted) === 'true') return false;
        const status = (o.status || 'new').toLowerCase().trim();
        if (status === 'done' || status === 'cancelled' || status === 'delete' || status === 'deleted') {
          return false;
        }
        return ['new', 'preparing', 'ready', 'out_for_delivery'].includes(status);
      });
      const count = activeOrders.length;
      setUncompletedOrdersCount(count);

      // Set App Badge on Device
      if ('setAppBadge' in navigator) {
        if (count > 0) {
          navigator.setAppBadge(count).catch(err => console.error('Error setting app badge:', err));
        } else {
          navigator.clearAppBadge().catch(err => console.error('Error clearing app badge:', err));
        }
      }

      if (playSound) {
        // play order sound/chime
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-120.wav');
          void audio.play();
        } catch (e) {
          console.warn('Failed to play chime:', e);
        }
      }
      initialLoad = false;
    }, (err) => {
      console.warn('Orders notification subscription failed:', err);
    });

    return () => {
      unsubscribe();
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(err => console.error('Error clearing app badge:', err));
      }
    };
  }, [adminSession]);

  // Fetch application settings and static data (menu, outlets, offers) on startup with caching
  useEffect(() => {
    if (!configLoaded) return;

    const loadData = async () => {
      try {
        // Failsafe DB Recovery, Menu Verification & Repairs (Staff/Admin only to prevent guest permission errors)
        if (adminSession) {
          try {
            const { initializeFirebaseCollections } = await import('./services/orderApi');
            await initializeFirebaseCollections();
          } catch (dbErr) {
            console.warn('Failsafe collection initialization error (non-fatal):', dbErr);
          }

          try {
            const { recoverMenuItems } = await import('./services/orderApi');
            await recoverMenuItems(MENU_ITEMS);
          } catch (menuErr) {
            console.warn('Failsafe menu items recovery error (non-fatal):', menuErr);
          }

          try {
            const { repairMissingCustomerProfiles } = await import('./services/orderApi');
            await repairMissingCustomerProfiles();
          } catch (repairErr) {
            console.warn('Failsafe repair missing customer profiles error (non-fatal):', repairErr);
          }
        }

        // Fetch settings once to get instagramUrl and current menuVersion
        const settings = await getServerSettings();
        if (settings.instagramUrl) {
          setInstagramUrl(settings.instagramUrl);
        }

        const serverVersion = settings.menuVersion || '1.0';
        const localVersion = localStorage.getItem('cached_menu_version');

        if (localVersion === serverVersion) {
          const cachedMenu = localStorage.getItem('cached_menu_items');
          const cachedOutlets = localStorage.getItem('cached_outlets');
          const cachedOffers = localStorage.getItem('cached_offers');

          if (cachedMenu && cachedOutlets && cachedOffers) {
            try {
              const parsedMenu = JSON.parse(cachedMenu) as MenuItem[];
              const parsedOutlets = JSON.parse(cachedOutlets) as OutletConfig[];
              const parsedOffers = JSON.parse(cachedOffers) as OfferCard[];

              const hasMomos = parsedMenu.some(item => item.category === Category.MOMOS);
              const hasFries = parsedMenu.some(item => item.category === Category.FRIES);
              const hasSides = parsedMenu.some(item => item.category === Category.SIDES);

              // Validate that outlets has at least one active (enabled) outlet
              const hasActiveOutlets = Array.isArray(parsedOutlets) && 
                parsedOutlets.length > 0 && 
                parsedOutlets.some(o => o && o.enabled === true);

              if (hasMomos && hasFries && hasSides && hasActiveOutlets) {
                console.log('Loading menu, outlets, and offers from local storage cache.');
                setMenuItems(parsedMenu);
                setOutlets(parsedOutlets);
                setOffers(parsedOffers);
                return;
              } else {
                console.warn('Cache validation failed (corrupt/inactive outlets or missing categories). Clearing cache...');
                localStorage.removeItem('cached_outlets');
                localStorage.removeItem('cached_menu_items');
                localStorage.removeItem('cached_offers');
                localStorage.removeItem('cached_menu_version');
              }
            } catch (err) {
              console.warn('Error parsing cache data, clearing cache...', err);
              localStorage.removeItem('cached_outlets');
              localStorage.removeItem('cached_menu_items');
              localStorage.removeItem('cached_offers');
              localStorage.removeItem('cached_menu_version');
            }
          }
        }

        console.log('Cache mismatch or empty cache. Loading from server...');
        const items = await getServerMenuItems();
        let finalMenuItems = [];
        if (items.length === 0) {
          console.log('Seeding database menu_items...');
          await seedMenuItemsToServer(MENU_ITEMS);
          finalMenuItems = extendMenuItemsWithGeneratedSeries(MENU_ITEMS);
        } else {
          finalMenuItems = extendMenuItemsWithGeneratedSeries(items);
        }
        setMenuItems(finalMenuItems);

        const outletList = await getServerOutlets();
        let finalOutlets = [];
        if (outletList.length === 0) {
          console.log('Seeding database outlets...');
          await seedOutletsToServer(OUTLET_LOCATIONS);
          finalOutlets = OUTLET_LOCATIONS;
        } else {
          finalOutlets = outletList;
        }
        setOutlets(finalOutlets);

        const offerList = await getServerOffers();
        const hasSundayDhamaka = offerList.some(o => o.id === 'offer-sunday-dhamaka');
        const finalOffers = hasSundayDhamaka ? offerList : [SUNDAY_DHAMAKA_CARD, ...offerList];
        if (offerList.length === 0) {
          console.log('Seeding database offers...');
          await seedOffersToServer(finalOffers);
          setOffers(finalOffers);
        } else {
          setOffers(finalOffers);
        }

        // Cache them locally
        localStorage.setItem('cached_menu_items', JSON.stringify(finalMenuItems));
        localStorage.setItem('cached_outlets', JSON.stringify(finalOutlets));
        localStorage.setItem('cached_offers', JSON.stringify(finalOffers));
        localStorage.setItem('cached_menu_version', serverVersion);
        console.log('Successfully updated local storage cache to version:', serverVersion);
      } catch (err) {
        console.error('Failed to load settings or menu data:', err);
      }
    };

    loadData();
  }, [configLoaded]);

  // Request notification permission on app load
  useEffect(() => {
    void requestNotificationPermission();
  }, []);

  // Listen to live broadcast notifications in real-time
  useEffect(() => {
    if (!configLoaded) return;
    const isFirstRun = { current: true };
    
    let unsubscribe: () => void = () => {};
    
    import('./services/firebaseClient').then(({ db }) => {
      import('firebase/firestore').then(({ collection, query, orderBy, limit, onSnapshot }) => {
        const q = query(
          collection(db(), 'broadcast_notifications'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          if (snapshot.empty) return;
          const latestDoc = snapshot.docs[0].data();
          const docId = snapshot.docs[0].id;
          
          if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
          }
          
          const title = latestDoc.title;
          const body = latestDoc.body;
          const icon = latestDoc.icon;
          
          if (title && body) {
            NotificationService.show(title, body, icon);
            
            const newNotif = {
              id: docId || `broadcast-${Date.now()}`,
              title,
              message: body,
              type: 'info' as const,
              timestamp: new Date().toISOString()
            };
            setInAppNotifications(prev => [newNotif, ...prev]);
          }
        });
      });
    });
    
    return () => unsubscribe();
  }, [configLoaded]);

  // Real-time synchronization of Menu, Outlets, and Offers
  useEffect(() => {
    if (!configLoaded) return;
    
    // Subscribe to menu items
    const unsubMenu = subscribeServerMenuItems(
      (items) => {
        if (items && items.length > 0) {
          const extended = extendMenuItemsWithGeneratedSeries(items);
          setMenuItems(extended);
          localStorage.setItem('cached_menu_items', JSON.stringify(extended));
        }
      },
      (err) => console.warn('Menu subscription failed:', err)
    );

    // Subscribe to outlets
    const unsubOutlets = subscribeServerOutlets(
      (outlets) => {
        if (outlets && outlets.length > 0) {
          setOutlets(outlets);
          localStorage.setItem('cached_outlets', JSON.stringify(outlets));
        }
      },
      (err) => console.warn('Outlets subscription failed:', err)
    );

    // Subscribe to offers
    const unsubOffers = subscribeServerOffers(
      (offers) => {
        if (offers && offers.length > 0) {
          setOffers(offers);
          localStorage.setItem('cached_offers', JSON.stringify(offers));
        }
      },
      (err) => console.warn('Offers subscription failed:', err)
    );

    return () => {
      unsubMenu();
      unsubOutlets();
      unsubOffers();
    };
  }, [configLoaded]);

  // Periodic background profile self-healing check
  useEffect(() => {
    if (!configLoaded) return;
    const runRepair = async () => {
      try {
        const { repairMissingCustomerProfiles } = await import('./services/orderApi');
        await repairMissingCustomerProfiles();
      } catch (err) {}
    };
    const timer = setInterval(runRepair, 60000);
    return () => clearInterval(timer);
  }, [configLoaded]);

  // Periodic check for PWA updates against build version
  useEffect(() => {
    if (import.meta.env.DEV) return;

    const checkVersion = async () => {
      if (!navigator.onLine) return;
      try {
        const res = await fetch('/version.json?t=' + Date.now(), {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          const serverVersion = data.version;
          const currentVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '';
          if (serverVersion && currentVersion && serverVersion !== currentVersion) {
            setNewVersionString(serverVersion);
            setShowUpdateModal(true);
          }
        }
      } catch (err) {
        console.warn('Failed to check version:', err);
      }
    };

    void checkVersion();
    const interval = setInterval(checkVersion, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time legacy user sync: detects profiles from previous versions and pushes to Firestore for admin verification
  useEffect(() => {
    if (!configLoaded) return;
    
    const syncLegacyUser = async () => {
      const localProfile = StorageService.getCustomerProfile();
      if (localProfile && localProfile.phone) {
        try {
          const { getDoc, doc, setDoc } = await import('firebase/firestore');
          const { db } = await import('./services/firebaseClient');
          
          const cleanId = localProfile.phone.replace(/\D/g, '');
          const docRef = doc(db(), 'customers', cleanId);
          const snap = await getDoc(docRef);
          
          if (!snap.exists()) {
            // First time detecting this legacy user on the new deployment:
            // Register them in Firestore as legacy unverified so the admin can verify their profile.
            const legacyCust: CustomerProfile = {
              ...localProfile,
              id: cleanId,
              legacyUser: true,
              verified: false, // Set to false to trigger admin verification request
              status: 'active',
              createdAt: localProfile.createdAt || new Date().toISOString()
            };
            await setDoc(docRef, legacyCust);
            console.log('Registered legacy/previous version customer profile for admin verification:', localProfile.phone);
          } else {
            // Document exists, sync local verified/coins status with server
            const serverCust = snap.data() as CustomerProfile;
            const serverPoints = serverCust.rewardPoints ?? serverCust.coins ?? 0;
            const localPoints = localProfile.rewardPoints ?? localProfile.coins ?? 0;

            if (
              serverCust.verified !== localProfile.verified || 
              serverPoints !== localPoints || 
              serverCust.status !== localProfile.status
            ) {
              const updated = {
                ...localProfile,
                verified: !!serverCust.verified,
                coins: serverPoints,
                rewardPoints: serverPoints,
                status: serverCust.status ?? localProfile.status ?? 'active',
                legacyUser: !!serverCust.legacyUser
              };
               updateLocalCustomerProfile(updated);
            }
          }
        } catch (err) {
          console.warn('Failsafe legacy user profile sync failed:', err);
        }
      }
    };
    
    void syncLegacyUser();
  }, [configLoaded]);

  const menuRef = useRef<HTMLDivElement>(null);
  const applyAppScreen = useCallback((screen: AppScreen) => {
    setView(screen === 'orders' ? 'orders' : 'menu');
    setIsCategoryModalOpen(screen === 'category');
    setIsCartOpen(screen === 'cart');
    setIsPaymentOpen(screen === 'payment');
    setShowOrderSuccess(screen === 'success');
  }, []);
  const pushAppScreen = useCallback((screen: AppScreen) => {
    const currentState = window.history.state as { app?: string; screen?: AppScreen } | null;

    if (currentState?.app === APP_HISTORY_NAMESPACE && currentState.screen === screen) {
      return;
    }

    window.history.pushState({ app: APP_HISTORY_NAMESPACE, screen }, '', window.location.href);
  }, []);
  const replaceAppScreen = useCallback((screen: AppScreen) => {
    window.history.replaceState({ app: APP_HISTORY_NAMESPACE, screen }, '', window.location.href);
  }, []);
  const handleAppBack = useCallback((fallback?: () => void) => {
    const currentState = window.history.state as { app?: string; screen?: AppScreen } | null;

    if (currentState?.app === APP_HISTORY_NAMESPACE && currentState.screen && currentState.screen !== 'menu') {
      window.history.back();
      return;
    }

    fallback?.();
  }, []);
  const categorySwipeDismiss = useSwipeDismiss({
    direction: 'down',
    onDismiss: () => handleAppBack(() => setIsCategoryModalOpen(false)),
  });
  const successSwipeDismiss = useSwipeDismiss({
    direction: 'down',
    onDismiss: () => {
      applyAppScreen('menu');
      replaceAppScreen('menu');
    },
  });
  const ordersSwipeDismiss = useSwipeDismiss({
    direction: 'right',

    onDismiss: () => handleAppBack(() => setView('menu')),
  });
  const activeOfferCards = useMemo(
    () =>
      offers.filter((offer) => {
        if (!offer.enabled) return false;
        if (offer.isSundayOffer && new Date().getDay() !== 0) return false;
        return true;
      }),
    [offers],
  );
  const activeOutlets = useMemo(
    () => outlets.filter((outlet) => outlet.enabled),
    [outlets],
  );
  const nearestOutlet = nearestOutletMatch?.outlet ?? null;
  const outletDistanceKm = nearestOutletMatch?.distanceKm ?? null;
  const selectedOutlet = useMemo(
    () => nearestOutlet ?? activeOutlets[0] ?? null,
    [activeOutlets, nearestOutlet],
  );

  useEffect(() => {
    const currentState = window.history.state as { app?: string; screen?: AppScreen } | null;

    if (currentState?.app !== APP_HISTORY_NAMESPACE) {
      replaceAppScreen('menu');
    }

    const handlePopState = (event: PopStateEvent) => {
      const nextState = event.state as { app?: string; screen?: AppScreen } | null;
      const nextScreen = nextState?.app === APP_HISTORY_NAMESPACE ? nextState.screen ?? 'menu' : 'menu';
      applyAppScreen(nextScreen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [applyAppScreen, replaceAppScreen]);

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const currentTimeInMins = now.getHours() * 60 + now.getMinutes();
      const openingTime = 11 * 60;
      const closingTime = 21 * 60;

      if (currentTimeInMins < openingTime || currentTimeInMins >= closingTime) {
        setIsStoreOpen(false);
        setStatusMessage('Store is currently closed. Open: 11:00 AM - 08:00 PM.');
        return;
      }

      setIsStoreOpen(true);
      setStatusMessage('Orders are being prepared fresh.');
    };

    checkStoreStatus();
    const interval = window.setInterval(checkStoreStatus, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    NotificationService.notifyOfferReleases(activeOfferCards);
  }, [activeOfferCards]);



  useEffect(() => {
    const handleUnauthorized = () => {
      setAdminSession(null);
      setIsAdminPanelOpen(false);
      const newNotif: InAppNotification = {
        id: Math.random().toString(),
        title: 'Session Expired',
        message: 'Your staff session has expired. Please log in again.',
        type: 'warning'
      };
      setInAppNotifications(prev => [newNotif, ...prev]);
    };
    window.addEventListener('harinos-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('harinos-unauthorized', handleUnauthorized);
    };
  }, []);

  // Real-time single-device session sync listener for Admin & Manager, plus Firebase Auth for all staff
  useEffect(() => {
    if (!configLoaded || !adminSession) {
      return;
    }
 
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    let unsubscribeUser: (() => void) | undefined;
 
    const setupSessionListener = async () => {
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const { db } = await import('./services/firebaseClient');
        const { reauthenticateStaffSession } = await import('./services/orderApi');
 
        // Authenticate client with Firebase Auth using role-based credentials
        await reauthenticateStaffSession();
 
        if (!isMounted) return;
 
        // 1. Single device sync for Admin & Manager
        if (adminSession.role === 'admin' || adminSession.role === 'manager') {
          const docRef = doc(db(), 'userSessions', adminSession.username);
          unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (!isMounted) return;
 
            if (!docSnap.exists()) {
              console.warn('Session document missing. Forcing logout.');
              triggerForcedLogout();
              return;
            }
 
            const data = docSnap.data();
            if (data?.sessionId !== adminSession.sessionId) {
              console.warn('Session ID mismatch. Local:', adminSession.sessionId, 'Remote:', data?.sessionId);
              triggerForcedLogout();
            }
          }, (error) => {
            console.error('Session sync error:', error);
          });
        }

        // 2. Real-time password change sync listener for all roles
        const collectionName = adminSession.role === 'admin' ? 'admins' : adminSession.role === 'manager' ? 'managers' : 'staff';
        const userDocRef = doc(db(), collectionName, adminSession.username);
        unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (!isMounted) return;
          if (!docSnap.exists()) {
            console.warn('User document missing. Forcing logout due to password change.');
            triggerPasswordLogout();
            return;
          }
          const data = docSnap.data();
          if (adminSession.passwordHash && data?.passwordHash !== adminSession.passwordHash) {
            console.warn('Password hash changed. Forcing logout.');
            triggerPasswordLogout();
          }
        }, (error) => {
          console.error('User doc sync error:', error);
        });
      } catch (err) {
        console.error('Failed to setup session listener:', err);
      }
    };
 
    const triggerForcedLogout = () => {
      // Clean local storage
      StorageService.clearAdminSession();
      setAdminSession(null);
      setIsAdminPanelOpen(false);
 
      // Call API logout endpoint to clean up backend
      const apiBase = (import.meta.env.VITE_ORDER_API_BASE_URL ?? '/api').trim() || '/api';
      fetch(`${apiBase}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminSession.token}`,
          'X-Session-Id': adminSession.sessionId || '',
        },
        body: JSON.stringify({ forced: true }),
      }).catch(() => {});
 
      // Alert user
      alert('Your account was logged in from another device.');
    };

    const triggerPasswordLogout = () => {
      StorageService.clearAdminSession();
      setAdminSession(null);
      setIsAdminPanelOpen(false);
      alert('Your password was changed by the administrator. Please log in again with your new password.');
    };
 
    setupSessionListener();
 
    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [configLoaded, adminSession]);

  const activeOrder = useMemo(() => {
    const latest = pastOrders[0];
    if (!latest) return null;
    if (dismissedOrderId === latest.id) return null;

    if (latest.status !== 'done' && latest.status !== 'cancelled') {
      return latest;
    }

    try {
      const orderTime = new Date(latest.date).getTime();
      const now = new Date().getTime();
      const ageHours = (now - orderTime) / (1000 * 60 * 60);
      if (ageHours < 24) {
        return latest;
      }
    } catch (e) {
      // Fallback
    }
    return null;
  }, [pastOrders, dismissedOrderId]);

  const trackedOrderId = activeOrder?.id || latestOrder?.id;

  useEffect(() => {
    if (!configLoaded || !trackedOrderId) return;
    const handleCancellationRefreshes = (orderStatus: string) => {
      if (orderStatus === 'cancelled' && customerProfile?.id) {
        void import('./services/orderApi').then(({ getServerCustomerById }) => {
          getServerCustomerById(customerProfile.id).then((fresh) => {
            if (fresh) {
              setCustomerProfile(fresh);
              StorageService.saveCustomerProfile(fresh);
            }
          }).catch(() => undefined);
        });
      }
    };

    const handleBrowserNotification = (order: Order) => {
      if (!order.status || !order.id) return;
      const lastStatus = lastNotifiedStatusRef.current[order.id];
      if (lastStatus && lastStatus !== order.status) {
        const titleMap: Record<string, string> = {
          new: '🍕 Order Placed',
          preparing: '👨‍🍳 Preparing Your Order',
          ready: '✅ Order Ready!',
          out_for_delivery: '🚗 Out for Delivery',
          done: '🎉 Order Complete',
          cancelled: '❌ Order Cancelled'
        };
        const msgMap: Record<string, string> = {
          new: 'Your order has been received by Harino\'s.',
          preparing: 'The kitchen has started preparing your fresh pizza!',
          ready: 'Your order is hot and ready for pickup!',
          out_for_delivery: 'Our delivery partner is on the way to your location.',
          done: 'Thank you for ordering from Harino\'s! Enjoy your meal.',
          cancelled: 'Your order has been cancelled by the store.'
        };
        const title = titleMap[order.status] || 'Order Status Update';
        const body = msgMap[order.status] || `Your order status is now ${order.status}`;
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: `order-status-${order.id}`
          });
        }
      }
      lastNotifiedStatusRef.current[order.id] = order.status;
    };

    const unsubscribe = subscribeServerOrder(
      trackedOrderId,
      (order) => {
        if (!order) return;
        setPastOrders((currentOrders) =>
          currentOrders.map((currentOrder) => (currentOrder.id === order.id ? order : currentOrder))
        );
        if (latestOrder?.id === order.id) {
          setLatestOrder(order);
        }
        if (order.status) {
          handleCancellationRefreshes(order.status);
          handleBrowserNotification(order);
        }
      },
      () => undefined,
    );
    const statusPoll = window.setInterval(() => {
      void import('./services/orderApi').then(({ getServerOrderById }) => {
        getServerOrderById(trackedOrderId)
          .then((updatedOrder) => {
            if (!updatedOrder) return;
            setPastOrders((currentOrders) =>
              currentOrders.map((currentOrder) => (currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder)),
            );
            if (latestOrder?.id === updatedOrder.id) {
              setLatestOrder(updatedOrder);
            }
            if (updatedOrder.status) {
              handleCancellationRefreshes(updatedOrder.status);
              handleBrowserNotification(updatedOrder);
            }
          })
          .catch(() => undefined);
      });
    }, 5000);
    return () => {
      unsubscribe?.();
      window.clearInterval(statusPoll);
    };
  }, [configLoaded, trackedOrderId, latestOrder?.id, customerProfile?.id]);

  useEffect(() => {
    if (!configLoaded || !customerProfile?.id) return;
    let isMounted = true;

    const pollProfile = async () => {
      try {
        const fresh = await getServerCustomerById(customerProfile.id);
        if (fresh && isMounted) {
          // If the profile was updated locally within the last 5 seconds, ignore server polling to prevent race conditions
          if (Date.now() - lastProfileUpdateRef.current < 5000) {
            return;
          }
          if (fresh.status === 'blocked' || fresh.status === 'removed') {
            alert('Your account has been deactivated or blocked by an administrator. You will be logged out.');
            updateLocalCustomerProfile(null);
            return;
          }
          const oldBalance = customerProfileRef.current?.walletBalance ?? 0;
          const newBalance = fresh.walletBalance ?? 0;
          if (newBalance > oldBalance) {
            setShowCelebration(true);
            setTimeout(() => {
              setShowCelebration(false);
            }, 2000);
          }
          setCustomerProfile(fresh);
          StorageService.saveCustomerProfile(fresh);
        }
      } catch (err) {
        console.error('Failed to poll profile:', err);
      }
    };

    pollProfile();
    const interval = setInterval(pollProfile, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [configLoaded, customerProfile?.id]);

  useEffect(() => {
    if (!configLoaded || !customerProfile) return;
    const reauth = async () => {
      try {
        const { reauthenticateCustomerSession } = await import('./services/orderApi');
        await reauthenticateCustomerSession();
      } catch (err) {
        console.warn('Failed to reauthenticate customer session:', err);
      }
    };
    void reauth();
  }, [configLoaded, customerProfile?.id]);

  const showNotification = useCallback((messageOrObj: string | { title: string; message: string; type?: 'success' | 'info' | 'warning' | 'error' }) => {
    let title = "Harino's Pizza";
    let message = "";
    let type: 'success' | 'info' | 'warning' | 'error' = "info";

    if (typeof messageOrObj === 'string') {
      message = messageOrObj;
      if (message.toLowerCase().includes('added')) {
        title = "Added to Basket";
        type = "success";
      } else if (message.toLowerCase().includes('copied') || message.toLowerCase().includes('copied!')) {
        title = "Link Copied";
        type = "success";
      } else if (message.toLowerCase().includes('unable') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('required')) {
        title = "Attention Required";
        type = "warning";
      } else if (message.toLowerCase().includes('restored')) {
        title = "Basket Restored";
        type = "success";
      } else if (message.toLowerCase().includes('dine-in')) {
        title = "Dine-in Only";
        type = "info";
      } else if (message.toLowerCase().includes('received') || message.toLowerCase().includes('syncing')) {
        title = "Order Received";
        type = "success";
      }
    } else {
      title = messageOrObj.title;
      message = messageOrObj.message;
      type = messageOrObj.type || "info";
    }

    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNotif = { id, title, message, type };

    setInAppNotifications((current) => [...current, newNotif]);

    setTimeout(() => {
      setInAppNotifications((current) => current.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const refreshNearestOutletMatch = useCallback(
    async (location: CustomerLocation): Promise<OutletMatch | null> => {
      if (!activeOutlets.length) {
        setNearestOutletMatch(null);
        return null;
      }

      setIsResolvingOutletMatch(true);

      try {
        const outletMatch = await findNearestOutletByRoadDistance(location, activeOutlets);
        setNearestOutletMatch(outletMatch);
        return outletMatch;
      } catch (error) {
        console.error('Road distance routing failed:', error);
        setNearestOutletMatch(null);
        throw error;
      } finally {
        setIsResolvingOutletMatch(false);
      }
    },
    [activeOutlets],
  );

  const scrollMenuIntoView = useCallback(() => {
    window.setTimeout(() => {
      menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  const openOrdersView = useCallback(() => {
    setView('orders');
    pushAppScreen('orders');
  }, [pushAppScreen]);

  const openCartView = useCallback(() => {
    setIsCartOpen(true);
    pushAppScreen('cart');
  }, [pushAppScreen]);

  const openCategoryView = useCallback(() => {
    setIsCategoryModalOpen(true);
    pushAppScreen('category');
  }, [pushAppScreen]);
  const closeCategoryView = useCallback(() => {
    handleAppBack(() => setIsCategoryModalOpen(false));
  }, [handleAppBack]);
  const closeCartView = useCallback(() => {
    handleAppBack(() => setIsCartOpen(false));
  }, [handleAppBack]);
  const closePaymentView = useCallback(() => {
    handleAppBack(() => setIsPaymentOpen(false));
  }, [handleAppBack]);
  const closeOrdersView = useCallback(() => {
    handleAppBack(() => setView('menu'));
  }, [handleAppBack]);
  const closeSuccessView = useCallback(() => {
    applyAppScreen('menu');
    replaceAppScreen('menu');
  }, [applyAppScreen, replaceAppScreen]);
  const returnToMenu = useCallback(() => {
    if (view === 'orders') {
      closeOrdersView();
      return;
    }

    applyAppScreen('menu');
    replaceAppScreen('menu');
  }, [applyAppScreen, closeOrdersView, replaceAppScreen, view]);

  const handleExploreCategory = useCallback(
    (category: CategoryFilter) => {
      setSelectedCategory(category);
      applyAppScreen('menu');
      replaceAppScreen('menu');
      scrollMenuIntoView();
    },
    [applyAppScreen, replaceAppScreen, scrollMenuIntoView],
  );

  const detectLocation = useCallback(async (
    options?: { silentFailure?: boolean },
  ): Promise<CustomerLocation | null> => {
    if (!activeOutlets.length) {
      alert('No active outlet is configured right now. Add a live outlet in constants.tsx before accepting orders.');
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });

      const resolvedLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        mapUrl: buildCustomerMapUrl(position.coords.latitude, position.coords.longitude),
      };

      setCustomerLocation(resolvedLocation);

      try {
        await refreshNearestOutletMatch(resolvedLocation);
      } catch (routingError) {
        console.error('Road distance routing failed:', routingError);
        showNotification('Unable to calculate road distance right now. Please try again.');
      }

      return resolvedLocation;
    } catch (error) {
      if (options?.silentFailure) {
        showNotification('Enable location so we can calculate road distance and delivery charges.');
      } else {
        alert('Location is mandatory so we can calculate delivery distance and route your order.');
      }
      return null;
    }
  }, [activeOutlets.length, refreshNearestOutletMatch, showNotification]);

  const handleOrderTypeChange = async (type: OrderType) => {
    setOrderType(type);

    if (type !== 'dinein') {
      setCart((currentCart) => {
        const filteredCart = currentCart.filter((item) => item.category !== Category.BEVERAGES);
        if (filteredCart.length !== currentCart.length) {
          showNotification('Beverages are available for dine-in only.');
        }
        return filteredCart;
      });
    }

    if (type === 'delivery' && !customerLocation) {
      await detectLocation({ silentFailure: true });
    }
  };

  const handleServiceModeSelection = async (type: OrderType) => {
    await handleOrderTypeChange(type);
    setIsServiceModeModalOpen(false);
  };

  const handleShare = async () => {
    const isVerified = customerProfile && (customerProfile.verified === true || String(customerProfile.verified) === 'true');
    const shareText = isVerified && customerProfile.referralCode
      ? `Hey! Order from Harino's Pizza and use my referral code ${customerProfile.referralCode} to get reward points: https://harinos.store`
      : `Check out Harino's Pizza at https://harinos.store`;

    const shareData = {
      title: "Harino's Pizza",
      text: shareText,
      url: 'https://harinos.store',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
      return;
    }

    try {
      const didCopy = await copyTextToClipboard(shareText);
      if (didCopy) {
        showNotification({ title: 'Link Copied', message: 'Referral message copied to clipboard.', type: 'success' });
        return;
      }

      alert('Visit us at harinos.store.');
    } catch (error) {
      alert('Visit us at harinos.store.');
    }
  };

  const addToCart = useCallback(
    (item: MenuItem, selectedSize?: string) => {
      if (item.category === Category.BEVERAGES && orderType !== 'dinein') {
        showNotification('Beverages are available for dine-in only.');
        return;
      }

      if (!item.available) {
        return;
      }

      const normalizedSize = selectedSize ?? item.sizes?.[0]?.label;
      const basePrice = getItemBasePrice(item, normalizedSize);

      setCart((currentCart) => {
        const cartItemId = getCartItemId({ id: item.id, selectedSize: normalizedSize });
        const existingItem = currentCart.find((cartItem) => getCartItemId(cartItem) === cartItemId);

        if (existingItem) {
          return currentCart.map((cartItem) => {
            return getCartItemId(cartItem) === cartItemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem;
          });
        }

        return [
          ...currentCart,
          {
            ...item,
            quantity: 1,
            selectedSize: normalizedSize,
            basePrice,
          },
        ];
      });

      showNotification(`${item.name} added to basket.`);
    },
    [orderType, showNotification],
  );

  const handleOfferAction = useCallback(
    (offer: OfferCard) => {
      const target = getOfferActionTarget(offer);
      setSelectedCategory(target.category);
      applyAppScreen('menu');
      replaceAppScreen('menu');
      if (target.item) {
        showNotification(`${target.item.name} is featured in this offer.`);
      }
      scrollMenuIntoView();
    },
    [applyAppScreen, replaceAppScreen, scrollMenuIntoView, showNotification],
  );

  const handleNotificationsEnabled = useCallback(() => {
    NotificationService.notifyOfferReleases(activeOfferCards, { force: true });
  }, [activeOfferCards]);

  const resolveOrderContext = useCallback(async (): Promise<ResolvedOrderContext | null> => {
    if (!activeOutlets.length) {
      alert('No active outlet is configured right now. Add a live outlet in constants.tsx before accepting orders.');
      return null;
    }

    if (orderType !== 'delivery') {
      if (!selectedOutlet) {
        alert('No active outlet is configured right now. Add a live outlet in constants.tsx before accepting orders.');
        return null;
      }

      return {
        customerLocation,
        outlet: selectedOutlet,
        distanceKm: null,
      };
    }

    const resolvedLocation = customerLocation ?? (await detectLocation());
    if (!resolvedLocation) {
      return null;
    }

    let outletMatch: OutletMatch | null = null;

    try {
      outletMatch = await refreshNearestOutletMatch(resolvedLocation);
    } catch (error) {
      alert('We could not calculate the road distance to your nearest outlet. Please try again.');
      return null;
    }

    if (!outletMatch) {
      alert('We could not match your location to an active outlet.');
      return null;
    }

    return {
      customerLocation: resolvedLocation,
      outlet: outletMatch.outlet,
      distanceKm: outletMatch.distanceKm,
    };
  }, [
    activeOutlets,
    customerLocation,
    detectLocation,
    orderType,
    refreshNearestOutletMatch,
    selectedOutlet,
  ]);

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (getCartItemId(item) !== cartItemId) {
          return item;
        }

        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }),
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => getCartItemId(item) !== cartItemId),
    );
  };

  const handleReorder = useCallback((order: Order) => {
    const manualOrderItems = order.items.filter((item) => !item.isOfferBonus);

    if (!manualOrderItems.length) {
      alert('This saved order only contains promotional bonus items.');
      return;
    }

    const reorderItems = manualOrderItems
      .map((item) => {
        const freshItem = menuItems.find((menuItem) => menuItem.id === item.id);
        const nextItem = freshItem ?? item;
        return normalizeStoredCartItem({
          ...nextItem,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          basePrice: freshItem ? getItemBasePrice(freshItem, item.selectedSize) : item.basePrice,
        });
      })
      .filter((item) => item.available);

    if (!reorderItems.length) {
      alert('Items from the previous order are currently unavailable.');
      return;
    }

    setCart(reorderItems);
    setView('menu');
    setIsCartOpen(true);
    pushAppScreen('cart');
    showNotification('Last order restored to basket.');
  }, [pushAppScreen, showNotification]);

  const filteredItems = useMemo(() => {
    let result = menuItems;
    if (selectedCategory !== 'All') {
      result = result.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    if (vegOnly) {
      // Harino's Pizza is pure veg. Categorized items have Category enum values.
      // Filter out any non-veg if defined, or match category types.
      result = result.filter((item) => item.category !== 'nonveg');
    }
    if (popularOnly) {
      result = result.filter((item) => item.popular);
    }
    return result;
  }, [selectedCategory, menuItems, searchQuery, vegOnly, popularOnly]);

  const baseSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.basePrice * item.quantity, 0),
    [cart],
  );

  const bonusCart = useMemo(
    () =>
      getAutomaticOfferBonusItems(cart, activeOfferCards).filter(
        (item) => orderType === 'dinein' || item.category !== Category.BEVERAGES,
      ),
    [activeOfferCards, cart, orderType],
  );

  const cartWithBonuses = useMemo(() => [...cart, ...bonusCart], [bonusCart, cart]);

  const pricedCart = useMemo(
    () => buildPricedCart(cartWithBonuses, activeOfferCards),
    [activeOfferCards, cartWithBonuses],
  );

  const subtotal = useMemo(
    () => pricedCart.reduce((sum, item) => sum + item.totalPrice, 0),
    [pricedCart],
  );

  const deliveryPricing = useMemo(
    () => getDeliveryPricingSummary(nearestOutlet, outletDistanceKm, subtotal),
    [nearestOutlet, outletDistanceKm, subtotal],
  );

  const deliveryFee = useMemo(() => {
    if (orderType !== 'delivery') {
      return 0;
    }

    return deliveryPricing.fee;
  }, [deliveryPricing.fee, orderType]);

  const finalDeliveryFee = orderType === 'delivery' && deliveryFee > 0 ? deliveryFee : 0;
  const currentTotal = subtotal + finalDeliveryFee;

  const customerWalletBalance = customerProfile?.walletBalance ?? 0;
  const customerRewardPoints = customerProfile?.rewardPoints ?? 0;
  const rewardPointsValue = customerRewardPoints * 0.1;

  const walletDiscount = useWallet ? Math.min(customerWalletBalance, currentTotal) : 0;
  const pointsDiscount = usePoints ? Math.min(rewardPointsValue, currentTotal - walletDiscount) : 0;
  const grandTotal = Math.max(0, currentTotal - walletDiscount - pointsDiscount);

  const includedGst = subtotal - subtotal / 1.05;
  const totalCartItems = pricedCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutInitiate = async () => {
    if (!isStoreOpen) {
      alert(statusMessage || 'Store is closed right now.');
      return;
    }

    if (!customerProfile) {
      showNotification('Please sign in once before ordering.');
      return;
    }

    const checkoutContext = await resolveOrderContext();
    if (!checkoutContext) {
      return;
    }

    if (getNotificationPermission() === 'default') {
      await NotificationService.requestPermission();
    }

    if (orderType === 'delivery') {
      if (checkoutContext.distanceKm === null) {
        alert('Location is required to calculate the delivery route.');
        return;
      }

      if (checkoutContext.distanceKm > 5 || checkoutContext.distanceKm > checkoutContext.outlet.deliveryRadiusKm) {
        alert(
          `Sorry, we only deliver up to 5 km by road. Your distance is ${checkoutContext.distanceKm.toFixed(1)} km.`,
        );
        return;
      }
    }

    setIsCartOpen(false);
    setIsPaymentOpen(true);
    pushAppScreen('payment');
  };

  const handlePaymentComplete = async (paymentMethod?: string) => {
    const checkoutContext = await resolveOrderContext();
    if (!checkoutContext) {
      showNotification(
        orderType === 'delivery'
          ? 'Location is still required to place this order.'
          : 'We could not match this order to an active outlet.',
      );
      return;
    }

    setIsPaymentOpen(false);

    const { customerLocation: resolvedLocation, outlet, distanceKm } = checkoutContext;
    const locationString = orderType === 'delivery' && resolvedLocation ? resolvedLocation.mapUrl : 'Not shared';

    const orderItems: OrderItem[] = pricedCart.map((item) => ({ ...item }));
    const orderPayload = {
      items: orderItems,
      total: grandTotal,
      date: new Date().toLocaleString(),
      orderType,
      deliveryFee: finalDeliveryFee,
      outletId: outlet.id,
      outletName: outlet.name,
      outletPhone: outlet.phone,
      outletAddress: outlet.address,
      customerLocationUrl: locationString,
      customerLocation: resolvedLocation || undefined,
      distanceKm,
      customerName: customerProfile?.name,
      customerPhone: customerProfile?.phone,
      customerEmail: customerProfile?.email,
      walletAmountRedeemed: walletDiscount,
      rewardPointsRedeemed: pointsDiscount,
      rewardPointsEarned: subtotal > 200 ? Math.floor(subtotal / 10) : 0,
      paymentMethod: paymentMethod || 'UPI',
    };


    // Deduct applied wallet amount and points from profile
    if (customerProfile) {
      const updatedProfile = { ...customerProfile };

      if (useWallet && walletDiscount > 0) {
        updatedProfile.walletBalance = Math.max(0, (updatedProfile.walletBalance ?? 0) - walletDiscount);
        // Log transaction
        const tx: WalletTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          customerId: customerProfile.id,
          customerName: customerProfile.name,
          customerPhone: customerProfile.phone,
          amount: -walletDiscount,
          type: 'debit',
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        void saveWalletTransactionToServer(tx).catch(console.error);
      }

      if (usePoints && pointsDiscount > 0) {
        const pointsDeducted = Math.round(pointsDiscount * 10);
        updatedProfile.rewardPoints = Math.max(0, (updatedProfile.rewardPoints ?? 0) - pointsDeducted);
        updatedProfile.coins = updatedProfile.rewardPoints; // Sync coins with rewardPoints
        // Log transaction
        const tx: WalletTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          customerId: customerProfile.id,
          customerName: customerProfile.name,
          customerPhone: customerProfile.phone,
          amount: -pointsDiscount,
          type: 'reward',
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        void saveWalletTransactionToServer(tx).catch(console.error);
      }

      const pointsEarned = subtotal > 200 ? Math.floor(subtotal / 10) : 0;
      if (pointsEarned > 0) {
        updatedProfile.rewardPoints = (updatedProfile.rewardPoints ?? 0) + pointsEarned;
        updatedProfile.coins = updatedProfile.rewardPoints; // Sync coins with rewardPoints
        // No WalletTransaction is created for coins earned, ensuring only coins are credited without cash wallet changes.
      }

      // Sync state and localStorage immediately synchronously to prevent stale server overrides
      updateLocalCustomerProfile(updatedProfile);

      // Save to server asynchronously but await it to ensure DB writes finish
      try {
        await saveCustomerToServer(updatedProfile);
      } catch (err) {
        console.error('Failed to sync updated customer profile to server:', err);
      }
    }

    setUseWallet(false);
    setUsePoints(false);

    let placedOrder: Order;
    try {
      placedOrder = await saveFullOrderToServer(orderPayload);
      // Notify staff/admin about new order
      void notifyStaffNewOrder(placedOrder, outlet.id);
    } catch (error) {
      console.error('Central Firestore order sync failed:', error);
      alert('Service temporarily unavailable. Please try again later.');
      return;
    }

    StorageService.saveOrder(placedOrder);
    setPastOrders((currentOrders) => [placedOrder, ...currentOrders].slice(0, 3));
    setLatestOrder(placedOrder);
    setDismissedOrderId(null);
    localStorage.removeItem('dismissed_tracker_order_id');
    setShowOrderSuccess(true);
    replaceAppScreen('success');
    setCart([]);
  };

  const categoryButtons: CategoryFilter[] = ['All', Category.PIZZA, Category.BURGERS, Category.FRIES, Category.MOMOS, Category.SIDES, Category.BEVERAGES];
  const saveCustomerProfile = useCallback(async (profile: CustomerProfile) => {
    try {
      const remoteCustomers = await getServerCustomers();
      const cleanPhone = (p?: string) => (p || '').replace(/\D/g, '');
      const targetPhone = cleanPhone(profile.phone);

      const existing = remoteCustomers.find(
        (c) => c.phone && cleanPhone(c.phone) === targetPhone
      );

      if (existing) {
        const mergedProfile: CustomerProfile = {
          ...existing,
          ...profile,
          name: profile.name.trim() || existing.name,
          phone: profile.phone.trim() || existing.phone,
          avatar: profile.avatar || existing.avatar,
        };
        updateLocalCustomerProfile(mergedProfile);
        void saveCustomerToServer(mergedProfile).catch(() => undefined);
        if (!customerProfile) {
          alert(`Welcome back, ${mergedProfile.name}! Loaded your existing wallet balance of Rs ${(mergedProfile.walletBalance ?? 0).toFixed(2)} and ${mergedProfile.rewardPoints ?? 0} reward points.`);
        }
        return;
      }
    } catch (err) {
      console.error('Error fetching existing customer profile:', err);
    }

    updateLocalCustomerProfile(profile);
    void saveCustomerToServer(profile).catch(() => undefined);
  }, [customerProfile]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream-50 text-slate-900">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(230,92,0,0.15),transparent_35%),radial-gradient(circle_at_top_right,rgba(234,222,202,0.5),transparent_30%),linear-gradient(180deg,#faf7f0_0%,#f4efe6_35%,#eadeca_100%)]" />
      <div className="pointer-events-none absolute -left-24 top-[24rem] h-72 w-72 rounded-full bg-red-100/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-[36rem] h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-[70rem] h-64 w-64 rounded-full bg-orange-50/50 blur-3xl" />

      <ServiceModeModal
        isOpen={isServiceModeModalOpen}
        selectedType={orderType}
        onSelect={handleServiceModeSelection}
        storeStatus={statusMessage || 'Choose a service mode to continue.'}
      />

      <Header
        cartCount={totalCartItems}
        onCartClick={openCartView}
        onViewOrders={openOrdersView}
        onViewMenu={returnToMenu}
        activeView={view}
        onShare={handleShare}
        onNotificationsEnabled={handleNotificationsEnabled}
        onAdminTrigger={() => setIsAdminPanelOpen(true)}
        customerProfile={customerProfile}
        onWalletClick={() => setIsWalletModalOpen(true)}
        onHelpTour={() => setShowTutorial(true)}
      />
      {showTutorial && (
        <FirstTimeUserModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          onDetectLocation={detectLocation}
        />
      )}
      {!customerProfile && <CustomerLoginModal onSave={saveCustomerProfile} onAdminTrigger={() => setIsAdminPanelOpen(true)} />}
      <InstallPopup
        blocked={
          isCartOpen ||
          isPaymentOpen ||
          showOrderSuccess ||
          isCategoryModalOpen ||
          isServiceModeModalOpen ||
          view === 'orders'
        }
      />

      <main className="relative z-10 pt-20">
        {view === 'menu' ? (
          <>
            <Hero onShare={handleShare} onExploreMenu={openCategoryView} />
            <OfferCarousel offers={activeOfferCards} onAction={handleOfferAction} />

            {/* Active Order Tracking Card */}
            {activeOrder && (
              <div className="max-w-md mx-auto px-4 mt-6">
                <div className="rounded-3xl border border-red-200 bg-white/95 backdrop-blur-md p-6 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                  {/* Neon border decoration */}
                  <div className={`absolute top-0 left-0 w-2 h-full ${
                    activeOrder.status === 'cancelled'
                      ? 'bg-red-500'
                      : activeOrder.status === 'done'
                        ? 'bg-emerald-500'
                        : 'bg-red-600'
                  }`} />

                  <div className="flex justify-between items-start mb-4 pl-3">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Active Order Tracker</span>
                      <h4 className="text-lg font-display font-bold text-slate-900 mt-0.5">Order #{activeOrder.id}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        activeOrder.status === 'cancelled'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : activeOrder.status === 'done'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-red-100 text-red-700 border-red-200/50'
                      }`}>
                        {activeOrder.status === 'cancelled' 
                          ? 'CANCELLED' 
                          : activeOrder.status === 'done' 
                            ? 'COMPLETE' 
                            : (activeOrder.status ?? 'new').replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {(activeOrder.status === 'done' || activeOrder.status === 'cancelled') && (
                        <button
                          onClick={() => {
                            setDismissedOrderId(activeOrder.id);
                            localStorage.setItem('dismissed_tracker_order_id', activeOrder.id);
                          }}
                          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs font-bold transition-all"
                          title="Dismiss Tracker"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {activeOrder.status === 'cancelled' ? (
                    <div className="pl-3 mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 shadow-sm">
                      <span className="text-red-500 text-base mt-0.5">⚠️</span>
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-red-700 block uppercase tracking-wider">Cancellation Reason</span>
                        <p className="text-sm font-semibold text-red-600 mt-1 leading-relaxed">
                          {activeOrder.cancellationReason || 'No reason specified by administration.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-3 mb-5">
                      {/* Visual Progress Steps */}
                      <div className="flex items-center justify-between mt-4 relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                        {['placed', 'preparing', 'ready', 'complete'].map((step, idx) => {
                          const status = activeOrder.status ?? 'new';
                          
                          let currentStepIndex = 0;
                          if (status === 'new') {
                            currentStepIndex = 0;
                          } else if (status === 'preparing') {
                            currentStepIndex = 1;
                          } else if (status === 'ready' || status === 'out_for_delivery') {
                            currentStepIndex = 2;
                          } else if (status === 'done') {
                            currentStepIndex = 3;
                          }

                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;

                          let labelText = '';
                          if (idx === 0) labelText = 'Placed';
                          else if (idx === 1) labelText = 'Preparing';
                          else if (idx === 2) labelText = 'Ready';
                          else if (idx === 3) labelText = 'Complete';

                          return (
                            <div key={step} className="flex flex-col items-center z-10 relative">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                isCurrent
                                  ? 'bg-red-600 text-white ring-4 ring-red-100 scale-110 shadow-lg shadow-red-200'
                                  : isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mt-1.5 whitespace-nowrap hidden sm:inline">
                                {labelText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pl-3 flex flex-col sm:flex-row gap-3 items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-600">
                      {activeOrder.status === 'cancelled' 
                        ? 'This order was cancelled by the store.' 
                        : activeOrder.status === 'done'
                          ? 'Order complete! Enjoy your meal!'
                          : activeOrder.estimatedTime 
                            ? `Estimated Time: ${activeOrder.estimatedTime}` 
                            : 'Fresh ingredients are being prepared.'
                      }
                    </div>
                    <button
                      onClick={() => printOrderReceipt(activeOrder)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 transition-premium w-full sm:w-auto justify-center"
                    >
                      <span>🖨️</span>
                      <span>Download POS Bill</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={menuRef} className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 pb-24 scroll-mt-24">
              {/* Search & Filter Bar */}
              <div className="mb-6 bg-white border border-slate-200/80 rounded-[2rem] p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search delicious pizzas, momos..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-205 rounded-2xl font-semibold text-slate-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10 text-sm placeholder:text-slate-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 font-bold cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                  <button
                    onClick={() => setPopularOnly(!popularOnly)}
                    className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                      popularOnly
                        ? 'bg-amber-50 border-amber-300 text-amber-850 font-black scale-105 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    ⭐ Popular
                  </button>
                </div>
              </div>

              <div className="relative mb-8 md:mb-12">
                <div className="flex space-x-2 overflow-x-auto pb-4 pt-2 px-1 hide-scrollbar snap-x snap-mandatory scroll-smooth">
                  {categoryButtons.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleExploreCategory(category)}
                      className={`snap-start whitespace-nowrap px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-sm flex-shrink-0 cursor-pointer ${selectedCategory === category
                          ? 'bg-red-655 border-red-655 text-white scale-105 shadow-md shadow-red-900/10'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-red-655'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-cream-50/30 to-transparent pointer-events-none md:hidden" />
              </div>

              {!isStoreOpen && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] text-center mb-10">
                  <span className="text-amber-700 font-bold text-sm">Outlet Closed - {statusMessage}</span>
                </div>
              )}

              <MenuSection
                items={filteredItems}
                onAddToCart={addToCart}
                offers={activeOfferCards}
                cartSubtotal={baseSubtotal}
                cart={cart}
                onUpdateQuantity={updateQuantity}
              />
            </div>
          </>
        ) : (
          <div style={ordersSwipeDismiss.style} {...ordersSwipeDismiss.bind}>
            <PastOrders orders={pastOrders} onReorder={handleReorder} />
          </div>
        )}
      </main>

      <footer className="relative z-10 overflow-hidden border-t border-slate-200 bg-white py-20 pb-32 text-slate-800 md:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(230,92,0,0.06),transparent_65%)]" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-5xl md:text-6xl mb-4 text-red-650">Harino&apos;s</h2>
          <div className="text-slate-500 font-bold tracking-[0.6em] uppercase text-[9px] md:text-[11px] mb-10 opacity-60">
            Because Hari Knows
          </div>
          <div className="text-slate-400/30 text-[8px] uppercase tracking-widest mt-8">harinos.store</div>
        </div>
      </footer>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={closeCategoryView}
          />
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[3rem]"
            style={categorySwipeDismiss.style}
            {...categorySwipeDismiss.bind}
          >
            <div className="bg-slate-50 border-b border-slate-200 p-5 text-center sm:p-8">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
              <h3 className="mb-2 text-2xl font-display text-slate-800 sm:text-3xl">Explore Our Kitchen</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.24em] font-black">
                Choose a category and jump to the menu
              </p>
              <div className="mt-3 text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
                Swipe down to close
              </div>
            </div>
            <div className="p-5 sm:p-8 md:p-12 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryButtons.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleExploreCategory(category)}
                    className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-200 hover:bg-red-50/50 transition-all group cursor-pointer"
                  >
                    <div className="text-left">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-650 transition-colors">
                        Category
                      </div>
                      <div className="text-xl font-display font-bold text-slate-900">{category}</div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-350 group-hover:text-red-650 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {pricedCart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-4 right-20 z-50 md:hidden">
          <button
            onClick={openCartView}
            className="w-full bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-black shadow-sm">{totalCartItems}</div>
              <span className="text-[10px] font-black uppercase tracking-widest">View Basket</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-display font-bold text-red-500">Rs {subtotal.toFixed(0)}</span>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeCartView}
        items={pricedCart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        total={subtotal}
        onCheckout={handleCheckoutInitiate}
        orderType={orderType}
        setOrderType={handleOrderTypeChange}
        deliveryFee={deliveryFee}
        deliveryPricing={deliveryPricing}
        nearestOutlet={nearestOutlet}
        selectedOutlet={selectedOutlet}
        outletDistanceKm={outletDistanceKm}
        isResolvingOutletMatch={isResolvingOutletMatch}
        customerLocation={customerLocation}
        onDetectLocation={detectLocation}
        pastOrders={pastOrders}
        onReorder={handleReorder}
        customerProfile={customerProfile}
        useWallet={useWallet}
        setUseWallet={setUseWallet}
        usePoints={usePoints}
        setUsePoints={setUsePoints}
        walletDiscount={walletDiscount}
        pointsDiscount={pointsDiscount}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={closePaymentView}
        total={currentTotal - walletDiscount - pointsDiscount}
        onPaymentComplete={handlePaymentComplete}
        outletName={selectedOutlet?.name}
        outletPhone={selectedOutlet?.phone}
        showCOD={true}
        customerProfile={customerProfile}
      />

      <PaymentModal
        isOpen={isWalletPaymentOpen}
        onClose={() => setIsWalletPaymentOpen(false)}
        total={parseFloat(topUpAmount) || 0}
        onPaymentComplete={async () => {
          const amount = parseFloat(topUpAmount);
          if (isNaN(amount) || amount <= 0) return;

          if (!customerProfile) return;

          // Log transaction as pending
          const tx: WalletTransaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            customerId: customerProfile.id,
            customerName: customerProfile.name,
            customerPhone: customerProfile.phone,
            amount: amount,
            type: 'topup',
            status: 'pending',
            createdAt: new Date().toISOString()
          };

          try {
            await saveWalletTransactionToServer(tx);
            setIsWalletPaymentOpen(false);
            setIsWalletModalOpen(false);
            setTopUpAmount('');

            showNotification({
              title: 'Top-up Request Submitted',
              message: `Your top-up of Rs ${amount.toFixed(2)} is pending. Your wallet will be updated within 24h.`,
              type: 'info'
            });
            alert(`Your top-up request of Rs ${amount.toFixed(2)} is submitted successfully. Your wallet will be updated within 24h.`);
          } catch (err) {
            console.error('Wallet top-up failed:', err);
            alert('Wallet top-up failed. Please try again.');
          }
        }}
      />
      <a
        href={CUSTOMER_CARE_WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-2xl shadow-green-900/25 transition-transform active:scale-95"
        aria-label="Chat with customer care on WhatsApp"
      >
        <svg className="h-8 w-8" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="M16.02 3.2A12.65 12.65 0 005.19 22.36L3.2 29l6.82-1.79A12.65 12.65 0 1016.02 3.2zm0 2.3a10.35 10.35 0 018.77 15.86 10.34 10.34 0 01-13.98 3.4l-.49-.29-4.05 1.06 1.08-3.94-.32-.51A10.35 10.35 0 0116.02 5.5zm-4.2 4.84c-.23 0-.6.08-.91.43-.31.34-1.2 1.17-1.2 2.86 0 1.68 1.23 3.31 1.4 3.54.17.23 2.38 3.8 5.86 5.18 2.9 1.15 3.49.92 4.12.86.63-.06 2.02-.83 2.31-1.63.29-.8.29-1.49.2-1.63-.08-.14-.31-.23-.66-.4-.34-.17-2.02-1-2.34-1.11-.31-.12-.54-.17-.77.17-.23.34-.88 1.11-1.08 1.34-.2.23-.4.26-.74.09-.34-.17-1.45-.53-2.76-1.7-1.02-.91-1.71-2.03-1.91-2.37-.2-.34-.02-.53.15-.7.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59h-.67z" />
        </svg>
      </a>

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-24 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-2xl transition-transform active:scale-95 animate-fade-in"
          aria-label="Follow us on Instagram"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      )}

      {isWalletModalOpen && customerProfile && (
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          customerProfile={customerProfile}
          onProfileChange={updateLocalCustomerProfile}
          showNotification={showNotification}
          onProceedToPayment={(amount) => {
            setTopUpAmount(String(amount));
            setIsWalletPaymentOpen(true);
          }}
          instagramUrl={instagramUrl}
        />
      )}

      {/* Celebration Popup (Joy confetti overlay) */}
      {showCelebration && (
        <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-red-600/10 backdrop-blur-[1px] animate-fade-in" />
          <div className="relative bg-white/95 border-2 border-amber-400 rounded-3xl p-8 text-center shadow-[0_25px_60px_-15px_rgba(251,191,36,0.4)] animate-bounce scale-110 flex flex-col items-center justify-center max-w-[85%]">
            <span className="text-6xl animate-spin mb-4">🎉</span>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Wallet Added!</div>
            <h4 className="text-2xl font-display font-black text-slate-900 mt-1">SUCCESSFUL TOP-UP!</h4>
            <p className="text-xs text-slate-500 mt-2 font-medium">Your balance has been updated. Happy ordering! 🍕</p>
            <div className="absolute -top-10 -left-10 text-4xl animate-ping">✨</div>
            <div className="absolute -bottom-10 -right-10 text-4xl animate-ping">🌟</div>
          </div>
        </div>
      )}

      {/* Premium Glassmorphic Toast Notification Stack */}
      <div className="fixed top-24 right-4 z-[250] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {inAppNotifications.map((notif) => {
          let icon = "ℹ️";
          let borderClass = "border-blue-500/30";
          let bgClass = "bg-slate-900/95 text-white";
          if (notif.type === 'success') {
            icon = "✅";
            borderClass = "border-emerald-500/30";
          } else if (notif.type === 'warning') {
            icon = "⚠️";
            borderClass = "border-amber-500/30";
          } else if (notif.type === 'error') {
            icon = "❌";
            borderClass = "border-red-500/30";
          }

          return (
            <div
              key={notif.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${borderClass} ${bgClass} backdrop-blur-md shadow-2xl animate-slide-in-right transition-all max-w-[90%] md:max-w-md ml-auto`}
            >
              <span className="text-xl shrink-0 mt-0.5">{icon}</span>
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase tracking-wider">{notif.title}</h4>
                <p className="text-[10px] font-semibold opacity-90 mt-1">{notif.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setInAppNotifications((current) => current.filter((n) => n.id !== notif.id))}
                className="text-slate-400 hover:text-white text-xs font-bold leading-none p-1"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {notification && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] md:max-w-xs">
          <div className="bg-white text-slate-800 px-6 md:px-8 py-4 rounded-2xl shadow-2xl border border-slate-200 mx-auto text-center font-bold">
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">{notification}</span>
          </div>
        </div>
      )}

      {showOrderSuccess && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center px-0 sm:items-center sm:px-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeSuccessView} />
          <div
            className="relative w-full max-w-sm rounded-t-[2rem] border-2 border-red-650 bg-white p-6 text-center text-slate-800 shadow-2xl sm:rounded-[3rem] sm:p-10"
            style={successSwipeDismiss.style}
            {...successSwipeDismiss.bind}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 sm:hidden" />
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl mb-6 mx-auto shadow-xl font-black">
              ✓
            </div>
            <h4 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight text-slate-900">Order Received</h4>
            <p className="text-slate-500 text-[10px] md:text-[11px] uppercase tracking-widest mt-4 font-bold">
              Status: {(latestOrder?.status ?? 'new').replace(/_/g, ' ').toUpperCase()}
            </p>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
              Swipe down to dismiss
            </p>
            <p className="text-[10px] md:text-[11px] text-red-650 font-black tracking-[0.5em] mt-8 uppercase">
              Because Hari Knows
            </p>
            <button
              onClick={closeSuccessView}
              className="mt-10 px-10 py-4 bg-red-650 hover:bg-red-750 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all w-full cursor-pointer shadow-md"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {adminSession && uncompletedOrdersCount > 0 && !isAdminPanelOpen && (
        <div className="fixed bottom-24 right-6 z-[180] animate-bounce">
          <button
            onClick={() => setIsAdminPanelOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl border-2 border-white hover:bg-slate-800 transition-all cursor-pointer relative"
            title="Active Uncompleted Orders"
          >
            <span className="text-xl">🍕</span>
            <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-655 border-2 border-white text-[10px] font-black text-white">
              {uncompletedOrdersCount}
            </span>
          </button>
        </div>
      )}

      {isAdminPanelOpen && (
        <AdminPanel
          session={adminSession}
          onSessionChange={setAdminSession}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowUpdateModal(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-800 shadow-2xl p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(230,92,0,0.06),_transparent_50%)] pointer-events-none" />
            <div className="relative text-center">
              <span className="text-5xl mb-4 block">🚀</span>
              <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 mb-2">New version available</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Update to the latest version of Harino's App for new menu items, improved speed, and new features.
              </p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      if ('caches' in window) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(key => caches.delete(key)));
                      }
                      if ('serviceWorker' in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const registration of registrations) {
                          await registration.unregister();
                        }
                      }
                    } catch (e) {
                      console.warn(e);
                    } finally {
                      window.location.reload();
                    }
                  }}
                  className="flex-1 rounded-2xl bg-red-650 hover:bg-red-750 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Update Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {view === 'menu' && totalCartItems > 0 && !isCartOpen && !isPaymentOpen && !showOrderSuccess && !isServiceModeModalOpen && !showTutorial && !isAdminPanelOpen && !isWalletModalOpen && (
        <div className="fixed bottom-6 inset-x-4 z-50 md:left-auto md:right-6 md:w-96 animate-slide-up">
          <button
            onClick={openCartView}
            className="w-full flex items-center justify-between bg-red-655 text-white px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(230,92,0,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer font-bold border border-red-700/10"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
                {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-sm font-black text-white">Rs {grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest">
              <span>View Basket</span>
              <span>🛒 →</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
