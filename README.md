<div align="center">

# E-Commerce Multivendor Web Application

**A full-stack marketplace where multiple sellers run their own shops, customers shop, pay with Stripe, and an admin oversees it all.**

Built as a final Bachelor of Computer Science project.

![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?logo=redux&logoColor=white)

</div>

---

## Overview

A complete multivendor e-commerce platform supporting three distinct roles:

- **Customers** — browse the catalog, search & filter products, manage a cart and wishlist, check out with Stripe, review purchased items, and track order status.
- **Sellers** — open a shop request, manage products, inventory, discounts, transactions, and a payout balance.
- **Admin** — approve seller applications, manage users, shops, orders, categories, reports, events, and view revenue analytics.

The backend exposes a REST API with JWT cookie authentication, role-based access control, rate limiting, and a hardened Stripe webhook that creates orders and updates stock/balances atomically.

---

## Tech Stack

### Backend (`Backend/`)
| Concern | Technology |
| --- | --- |
| Runtime | Node.js 18 + Express 4 (CommonJS) |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT in an httpOnly cookie + bcrypt password hashing |
| Payments | Stripe Checkout Sessions + signed webhook |
| Media | Cloudinary (streamed uploads) |
| Email | Nodemailer (SMTP) |
| Security | express-rate-limit, express-validator, CORS, role middleware |

### Frontend (`Frontend/`)
| Concern | Technology |
| --- | --- |
| Core | React 18 + Vite 5 (ESM/JSX) |
| State | Redux Toolkit + Thunk |
| Routing | React Router 6 |
| Styling | Tailwind CSS + Material UI + Ant Design + styled-components |
| Charts | ApexCharts / Recharts |
| Forms | React Hook Form |
| Payments | Stripe.js |

---

## Features

### Storefront
- Product catalog with categories, deals sections (`best-deals` / `fearture-deals`) and search/filter
- Product detail pages with ratings and reviews
- Shopping cart and wishlist (per user)
- Stripe Checkout with shipping-rate selection
- Order history with live status tracking

### Seller Dashboard
- Shop application flow managed/approved by an admin
- Product and inventory management
- Discounts and transactions tracking
- Seller payout balance (`Shop.Balance`)

### Admin Dashboard
- User, shop, product, and category management
- Order management (status allowlist + authorization)
- Seller-application approval (`Requests` / `RequestShopDetails`)
- Reports and event management
- Revenue & analytics charts

### Platform
- Multi-vendor order splitting — each shop is credited only for its own line items
- Atomic stock/balance updates on payment (prevents overselling)
- Idempotent webhook with Stripe signature verification
- Role-based route protection (`Admin` / `Seller` / `Customer`)
- Rate-limited auth & webhook endpoints
- Seeder with realistic demo data and test accounts

---

## Project Structure

```
e-commerce-multivendor-web-application/
├── Backend/
│   ├── .env.example              # copy to .env and fill in credentials
│   ├── package.json
│   └── src/
│       ├── server.js             # Express bootstrap, webhook, middleware wiring
│       ├── controllers/          # 11 controllers (auth, order, shop, checkout, …)
│       ├── models/               # 17 Mongoose models
│       ├── routes/               # 10 route files
│       ├── middelware/           # validateToken (JWT) + roles (RBAC)
│       ├── seed/                 # demo-data seeder
│       └── utils/                # multer (image-only), uploadImage (Cloudinary), ErrorHandler
└── Frontend/
    ├── .env.example              # VITE_API_URL, VITE_STRIPE_PUBLISH_KEY
    ├── vite.config.js
    └── src/
        ├── api/api-Client.js     # env-driven API client
        ├── redux/                # actions + reducers (user, cart, wishlist, shop, order, product)
        ├── page/                 # Login, SignUp, SellerForm, admin dashboards, 404
        ├── sections/             # dashboard pages (Dashboard, User, Products, Requests, …)
        ├── components/           # storefront + seller components
        ├── layout/               # Layout, LayoutSeller, Container
        └── utils/                # ProtectRoute (role-aware), ErrorBoundary, styles
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (backend) / Node.js 24 (frontend) — see `engines` in each `package.json`
- MongoDB (local or Atlas)
- Stripe account (test keys) and Cloudinary account

### 1. Backend

```bash
cd Backend
npm install
copy .env.example .env    # fill in MONGO_URI, JWT_SECRET_KEY, Stripe, Cloudinary
npm run dev               # http://localhost:8000  (or npm start)
```

### 2. Frontend

```bash
cd Frontend
npm install --legacy-peer-deps
copy .env.example .env    # set VITE_API_URL=http://localhost:8000
npm run dev               # http://localhost:5173
```

### 3. Verify
- `GET http://localhost:8000/api/products` → `200`
- `GET http://localhost:5173/` → app loads
- **Note:** for local auth over `http://localhost`, set `PROJECT_STATUS` to anything other than `production`, otherwise the `Secure` httpOnly JWT cookie is dropped by the browser.

---

## Demo Data

Seed a realistic dataset with pre-built admin, seller, and customer accounts (password `Password@123` for all — see `SEEDING.md`):

```bash
cd Backend
npm run seed          # idempotent insert
npm run seed:reset    # wipe and re-insert
```

| Role | Email | Purpose |
| --- | --- | --- |
| Admin | admin@example.com | Full dashboard access |
| Seller | ahmed.benali@gmail.com | TechNova Digital (electronics) |
| Seller | sofia.mansouri@gmail.com | Elégance Fashion |
| Customer | lina.boudiaf@gmail.com | Cart + wishlist, no orders |
| Customer | amel.saidi@gmail.com | Repeat buyer across multiple order statuses |

Seeded content includes 24 products across 6 categories, 12 orders spanning all status values, discounts, reviews, and multi-vendor orders.

---

## Scripts

### Backend (`backend/package.json`)
| Script | Description |
| --- | --- |
| `npm start` | Run with `node src/server.js` |
| `npm run dev` | Run with nodemon (auto-reload) |
| `npm run seed` | Insert demo data (idempotent) |
| `npm run seed:reset` | Wipe & re-seed all collections |

### Frontend (`frontend/package.json`)
| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint with zero-warning policy |
| `npm run preview` | Preview the production build |

---

## API Overview

Authenticated endpoints use a JWT stored in the `auth_token` httpOnly cookie.

| Area | Base path | Highlights |
| --- | --- | --- |
| Auth | `/api/auth` | register, login, logout, load user |
| User | `/api/user` | cart, wishlist, checkout, profile |
| Products | `/api/products` | catalog, deals, product detail |
| Categories | `/api/categories` | category listing & CRUD |
| Orders | `/api/order` | list, update status, refund |
| Shops | `/api/shop` | shops, seller orders, approve/reject |
| Reviews | `/api/review` | product reviews |
| Reports | `/api/reports` | report handling |
| Events | `/api/events` | platform events |
| Notifications | `/api/notifications` | user notifications |
| Webhook | `/webhook` | Stripe `checkout.session.completed` |

---

## Deployment

Production is split across two hosts — static React on **Vercel**, Express API on **Render**, backed by **MongoDB Atlas**:

```
Browser ──▶ Vercel (React/Vite) ──▶ Render (Express API /api/*)
                                        │
                                        └──▶ MongoDB Atlas (+ Stripe, Cloudinary)
```

Key configuration points:
- `VITE_API_URL` on the frontend must point at the deployed API (no trailing slash).
- Backend `CORS_ORIGIN` must list the frontend origin.
- Point the Stripe webhook at `https://<your-api>/webhook` subscribed to `checkout.session.completed`, and add the signing secret as `STRIPE_WEBHOOK_SECRET`.
- Run `npm install --legacy-peer-deps` in the frontend (MUI v4 port peer conflict with React 18).

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step environment variable reference and pre-launch security checklist.

---

## Documentation

| Document | Contents |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Domain model, request flow, folder layout, security posture |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel + Render deployment guide & env reference |
| [SEEDING.md](./SEEDING.md) | Seeder usage, demo accounts, scenario coverage, known quirks |
| [CHANGELOG.md](./CHANGELOG.md) | Audit → fix → deploy-readiness changes, security hardening |
| [AUDIT.md](./AUDIT.md) | Security/correctness audit findings & resolution status |

---

## Roadmap

- **Automated tests** — `npm test` is currently a stub; replace with a real Jest/Supertest suite.
- **Real refund flow** — `refundOrder` currently flips the status but does not move money or restore stock/balances.
- **Currency consistency** — Stripe is billed in USD while some admin tables display DZD.
- **Events module** — frontend Events page is static data; align the controller and model and wire it end-to-end.
- **DB-level uniqueness** — enforce unique indexes on emails and shop names.

---

## License

ISC — see the `package.json` files in `Backend/` and `Frontend/`.

## Acknowledgements

Built with the excellent **MERN-stack ecosystem**: Express, Mongoose, React, Redux Toolkit, Material UI, Ant Design, Stripe, and Cloudinary.