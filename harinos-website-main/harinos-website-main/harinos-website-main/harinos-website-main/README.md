# Harino's Pizza Web App

Mobile-first ordering PWA for Harino's Pizza built with React, TypeScript, Vite, and Firebase-compatible realtime order sync.

## Free Production Stack

Use this stack to avoid monthly hosting and database charges for a small outlet workload:

- Frontend: Vercel free deployment
- Backend: Vercel serverless `/api` functions
- Database: Firebase Spark plan with Cloud Firestore

For roughly 100 orders per day, Firestore Spark's free daily quota is the best fit. Firestore is accessed only through the serverless API, so customer order data is not exposed through public Firestore rules.

## Required Vercel Environment

Set these in Vercel Project Settings -> Environment Variables:

```bash
STORAGE_DRIVER=firebase
FIREBASE_PROJECT_ID=...
FIREBASE_SERVICE_ACCOUNT_BASE64=...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

The `VITE_FIREBASE_*` values come from Firebase Console -> Project settings -> Your apps -> Web app config.

Do not set `VITE_ORDER_API_BASE_URL` on Vercel unless you deploy a separate backend. The app uses Firestore live sync directly when `VITE_FIREBASE_*` is configured.

## Run Locally

From the repository root:

```bash
npm install
npm run dev
npm run build
```

## Main Files

- `constants.tsx`: menu, offers, outlet information
- `services/firebaseClient.ts`: Firebase web initialization and collection names
- `services/orderApi.ts`: Firestore live order/customer sync
- `services/storage.ts`: local profile/session fallback
- `components/AdminPanel.tsx`: admin, manager, staff order handling
- `components/CustomerLoginModal.tsx`: customer sign-in details
- `backend/`: optional Express backend with MySQL, Firebase Admin, or JSON storage drivers

## Backend Storage Drivers

The Vercel `/api` function uses the Express backend code as a fallback and future server-controlled API.

Storage options:

- `STORAGE_DRIVER=firebase`
- `STORAGE_DRIVER=mysql`
- `STORAGE_DRIVER=json` for local development only

For a no-charge production deployment, use `STORAGE_DRIVER=firebase`.
