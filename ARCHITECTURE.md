# Architecture Overview

This document describes the existing `e-commerce-multivendor-web-application` project as found during the audit pass. It was written **before** any changes were made.

## Stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Backend  | Node.js + Express 4 (CommonJS), MongoDB via Mongoose 8             |
| Frontend | React 18 + Vite 5 (ESM/JSX), Redux Toolkit, React Router 6, Tailwind, Material UI (v4), Ant Design, ApexCharts, Stripe.js |
| Payments | Stripe (Checkout Sessions + webhook)                               |
| Media    | Cloudinary (image upload), local disk also used                   |
| Auth     | JWT in an httpOnly cookie + bcrypt password hashing                |

- Backend entry point: `Backend/src/server.js` (`npm start` → `nodemon server.js`)
- Frontend entry point: `Frontend/src/main.jsx` (`npm run dev` → Vite)
- Root folder contains only a 3-line `README.md`; there is **no git repository**.

## Folder layout

```
e-commerce-multivendor-web-application/
├── Backend/
│   ├── .env                      # real credentials (MONGO_URI, JWT, Stripe, Cloudinary)
│   ├── package.json
│   └── src/
│       ├── server.js             # Express bootstrap, mongoose connect, Stripe webhook
│       ├── controllers/          # auth, product, shop, order, checkout, review,
│       │                         # category, user, report, event, notification
│       ├── models/               # 14 Mongoose models
│       ├── routes/               # 10 route files
│       ├── middelware/           # validateToken (JWT from cookie)
│       ├── uploads/              # ~150 locally-stored product images (legacy files)
│       └── utils/                # multer, uploadImage (Cloudinary), ErrorHandler
└── Frontend/
    ├── .env                      # Stripe publishable + secret (secret should not be here)
    ├── vite.config.js
    └── src/
        ├── api/api-Client.js     # all raw fetch() calls, base URL hardcoded localhost:8000
        ├── redux/                # actions + reducers (user, cart, wishlist, shop, order, product)
        ├── page/                 # Login, SignUp, SellerForm, NotFound, Admin layout
        ├── sections/             # admin dashboard pages (Dashboard, User, Products, …)
        ├── components/           # storefront + seller-dashboard components
        ├── layout/               # Layout, LayoutSeller, Container
        └── utils/                # ProtectRoute, styles
```

## Core domain modeling

- **User** (`models/User.js`) — `role: enum[Admin, Customer, Seller]` (default Customer), bcrypt-hashed `password`, optional `shopId`, `orders`.
- **Shop** (`models/Shop.js`) — belongs to one `userId`; carries `Balance` (seller payout balance), `views`, `transections`.
- **Product** (`models/Product.js`) — belongs to `categoryId` + `shopId`; `price`, `available_quantity`, `total_sell`, optional `discountId`, nested `image.url`.
- **Cart** / **LineCartItems** — one cart per user; line items link `productId` + `quantity`.
- **Whishlist** — per-user per-product.
- **Order** / **LineOrderItems** — order has one shipping address and a status enum; line items link `productId` + `orderId`.
- **Category**, **Discount**, **Review**, **Report**, **Notification**, **Events**, **Requests**/**RequestShopDetails** (seller-approval workflow), **ShippingAdresse**.

## Request flow

1. Customer browses catalog: `GET /api/products` → `getProducts` (populated category/shop).
2. Cart ops are per-user (`PUT /api/user/add-to-cart`, `GET /api/user/cart`, …), all behind `validateToken` (JWT cookie).
3. Checkout: `POST /api/user/checkout` (auth) creates a Stripe Checkout Session with `client_reference_id = userId`, then deletes the user's Cart.
4. Stripe webhook `POST /webhook` (raw body) creates Order + LineOrderItems + ShippingAdresse, increments each shop's `Balance`, decrements product stock, increments `total_sell`. **No idempotency check.**
5. Seller onboarding: customer files a "create shop" request → Admin approves/rejects (`/api/shop/approve-shop/:id` / `reject-shop/:id`); approval promotes user to `Seller` and links `shopId`.

## Auth / security posture found

- JWT (`1d`) stored in httpOnly cookie `auth_token`; `secure` flag driven by `PROJECT_STATUS=production`.
- `validateToken` only asserts a valid token; **no role checks anywhere** (any authenticated user can hit admin/seller endpoints).
- CORS is hardcoded to `http://localhost:5173` in `server.js`.
- Backend `PROJECT_STATUS = 'production'`, `FRONT_END_URL`, `ECOMMERCE_STORE_URL` are hardcoded to `localhost:5173`.
- Real production-derivable credentials live in `Backend/.env` and `Frontend/.env` (Atlas user+password, JWT secret, Cloudinary API secret, Stripe test keys, Gmail app password hardcoded in `ShopController.js`).

## Key cross-file responsibilities

- All backend responses are JSON via controllers; no global error middleware is wired (`app.use(ErrorHandler)` is commented out), and several controllers call an undefined `next(new ErrorHandler(...))`.
- The frontend `api-Client.js` hardcodes `http://localhost:8000` in ~75 URLs and contains a syntax error (`ad` on line 188), dead endpoints, mismatch with backend routes, and one hardcoded product id (`/api/review/660b33a59cc01fa8dd32a28a`).