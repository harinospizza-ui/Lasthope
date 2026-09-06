# HARINO''S - Fast Food Outlet Ordering Platform 🍕🍔

A high-performance, mobile-first ordering application and management suite built specifically for **HARINO''S** fast food outlet. The platform supports online customer ordering with live offers, WhatsApp order dispatch, real-time Firebase sync, staff POS/kitchen management, and cross-platform native packaging (PWA, Android APK, and iOS).

---

## 🌟 Key Features

- **Customer Ordering**: Fast menu browsing, burger/pizza/momo customization, road-distance outlet routing, real-time cart pricing, and Sunday Dhamaka / festival discounts.
- **WhatsApp Checkout & Live Tracking**: Immediate WhatsApp order generation with order receipts, GPS location links, and order status updates.
- **Real-Time Staff/Kitchen Dashboard**: Staff POS terminal, order preparation timeline, customer verification queue, and automated receipts.
- **Admin Management Suite**: Menu management, dynamic offer creator, wallet credit manager, analytics reports, and backup/restore utilities.
- **FCM Push Notifications**: Instant order alerts for kitchen staff and status updates for customers.
- **Cross-Platform**: Operates as a Progressive Web App (PWA), Android App (via Capacitor), and iOS App.

---

## 📂 Project Architecture

```
Lasthope-main/
├── android/                         # Capacitor Android Studio native project
├── ios/                             # Capacitor Xcode iOS native project
├── functions/                       # Firebase Cloud Functions (TypeScript backend)
│   ├── src/index.ts                 # FCM push triggers & Firestore event handlers
│   ├── package.json
│   └── tsconfig.json
├── public/                          # Public static assets & PWA files
│   ├── images/                      # Menu item pictures, branding, payment QR
│   ├── app/                         # App static assets
│   ├── downloads/                   # Downloadable resources
│   ├── festivals/                   # Festive campaign assets
│   ├── icon-192.png, icon-512.png   # App icons
│   ├── manifest.json                # Web App Manifest
│   ├── sw.js                        # Service worker (PWA & FCM push notifications)
│   └── firebase-messaging-sw.js     # Background messaging service worker
├── src/                             # Application Source Code
│   ├── components/                  # Domain-categorized React components
│   │   ├── admin/                   # 13 Staff/Admin dashboards & POS screens
│   │   ├── customer/                # 8 Customer modals & interaction popups
│   │   ├── menu/                    # 5 Menu, cart, and past order components
│   │   ├── common/                  # 4 Header, Hero, ErrorBoundary, Download
│   │   └── index.ts                 # Master barrel export
│   ├── config/                      # Business configurations
│   │   ├── constants.tsx            # Default menu, outlet coordinates, offers
│   │   ├── adminConfig.ts           # Staff role permissions
│   │   ├── deliveryPricing.ts       # Delivery fee calculations
│   │   ├── festivalCampaigns.ts     # Festival rules & dates
│   │   └── index.ts
│   ├── hooks/                       # Reusable React hooks
│   │   ├── useFCMNotifications.ts   # Firebase Cloud Messaging listener hook
│   │   ├── useInstallPrompt.ts      # PWA install prompt handler
│   │   ├── useSwipeDismiss.ts       # Mobile touch dismiss gesture hook
│   │   └── index.ts
│   ├── services/                    # APIs, storage & cloud clients
│   │   ├── firebaseClient.ts        # Firebase web SDK configuration
│   │   ├── orderApi.ts              # Real-time Firestore orders, customers, menu sync
│   │   ├── fcmService.ts            # Client-side notification dispatcher
│   │   ├── festivalEngine.ts        # Festival discount & campaign evaluator
│   │   ├── notificationService.ts   # Staff & customer alert dispatchers
│   │   ├── storage.ts               # Local cache & offline fallback
│   │   ├── browserSupport.ts        # Clipboard, geolocation & permissions
│   │   └── index.ts
│   ├── utils/                       # Calculation & formatting helpers
│   │   ├── offerUtils.ts            # Dynamic cart pricing & BOGO calculations
│   │   ├── outletUtils.ts           # Geolocation & nearest outlet routing
│   │   └── index.ts
│   ├── types/                       # TypeScript interfaces & data models
│   │   └── index.ts
│   ├── App.tsx                      # Root application component
│   ├── index.tsx                    # React DOM entrypoint
│   └── vite-env.d.ts                # Vite environment types
├── docs/                            # Architecture specs & integration guides
│   ├── CODEBASE_ANALYSIS_AND_PHASE1_PLAN.md
│   ├── NOTIFICATION_SYSTEM_OVERHAUL.md
│   ├── PHASE1_IMPLEMENTATION_COMPLETE.md
│   └── SSD_INTEGRATION_GUIDE.md
├── scripts/                         # Maintenance & verification utilities
│   ├── setup_harinos.py             # Database seed & setup utility
│   └── verify_sessions_and_fcm.js   # Session & FCM verification script
├── capacitor.config.ts              # Capacitor mobile configuration
├── firebase.json                    # Firebase deployment configuration
├── firestore.rules                  # Firestore security rules
├── index.html                       # HTML application shell
├── package.json                     # Project dependencies & scripts
├── tsconfig.json                    # TypeScript compiler configuration
├── vercel.json                      # Vercel deployment configuration
└── vite.config.ts                   # Vite bundler configuration with @ path alias
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite 6
- **Mobile Engine**: Capacitor 8 (Android & iOS)
- **Backend & Realtime DB**: Firebase Spark Plan (Cloud Firestore, Firebase Authentication, Cloud Functions)
- **Push Notifications**: Firebase Cloud Messaging (FCM) + Web Push Service Worker
- **Hosting**: Vercel or Firebase Hosting

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates production-ready assets in the `dist/` directory.

### 4. Mobile Native Build (Capacitor)
```bash
# Sync web build to native folders
npm run cap:sync

# Open Android Studio
npm run cap:android

# Open Xcode (macOS)
npm run cap:ios
```

---

## ⚙️ Environment Configuration

Set these environment variables in your `.env` file or hosting provider (Vercel / Firebase):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🛡️ License & Ownership

Proprietary software developed for **HARINO''S**. All rights reserved.
