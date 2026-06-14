# Harino's Order Receiver

This backend is the live order receiver for the Harino's web app. It stores orders and customer verification records through a selectable storage driver.

On Vercel, this backend is exposed through the root `api/index.ts` serverless function, so no paid always-on server is required.

## Commands

```bash
npm install
npm run build
npm start
```

## Storage Drivers

Set `STORAGE_DRIVER` to one of:

- `mysql` for a real MySQL database
- `firebase` for Firestore
- `json` for local development only

## MySQL Environment

Use these when `STORAGE_DRIVER=mysql`:

```bash
PORT=4000
STORAGE_DRIVER=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=harinos_orders
```

The server creates the required `orders` and `customers` tables automatically.

## Firebase Environment

Use these when `STORAGE_DRIVER=firebase`. This is the recommended no-charge production setup for about 100 orders per day:

```bash
PORT=4000
STORAGE_DRIVER=firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT_BASE64=base64_encoded_service_account_json
```

`FIREBASE_SERVICE_ACCOUNT_JSON` also works, but base64 is safer for deployment dashboards.

## Local JSON Environment

Use only for development:

```bash
PORT=4000
STORAGE_DRIVER=json
ORDER_FILE_STORE=./harinos-data
```

## Frontend Connection

On the same Vercel deployment, the frontend automatically calls `/api`. Use `VITE_ORDER_API_BASE_URL` only when the backend is hosted separately.
