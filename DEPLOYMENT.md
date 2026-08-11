# Deployment Guide

Two-part deployment: **frontend** (static) to Vercel, **backend** (Node/Express) to Render.

```
Browser ──▶ Vercel (React/Vite, public) ──▶ Render (Express API /api/*)
                                                │
                                                └──▶ MongoDB Atlas (+ Stripe, Cloudinary)
```

The frontend calls the backend through `VITE_API_URL`. CORS on the backend must include the
frontend origin via `CORS_ORIGIN`. The Stripe webhook must point at your deployed `/webhook` URL.

---

## 1. Backend (Render)

Recommended: a **Web Service** (not static site) so `/webhook` runs continuously.

- Build command: `npm install`
- Start command: `npm start` (runs `node src/server.js`)
- Health: the API responds at `GET /api/products` (200) — optional Render health-check path.
- **Node version:** `engines` declares `18.x`. Render supports it; Node 24 also works locally.

Environment variables (set these in Render → Environment):

| Variable | Example | Notes |
|---|---|---|
| `PORT` | `8000` | Render injects `PORT` automatically. |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority` | Atlas connection string. |
| `JWT_SECRET_KEY` | `<random 32+ chars>` | Generate fresh. |
| `CORS_ORIGIN` | `https://yourstore.vercel.app` | Comma-separated list of allowed frontend origins. Add your local `http://localhost:5173` too if testing against prod. |
| `CLOUDINARY_CLOUD_NAME` | `dglejwggj` | |
| `CLOUDINARY_API_KEY` | `<key>` | |
| `CLOUDIANRY_API_SECRET` | `<secret>` | **Spelling matches the code** (`CLOUDIANRY...`) — keep it identical. |
| `STRIPE_PUBLISH_KEY` | `pk_test_...` | Publishable key (safe to share). |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Secret — never expose to the frontend. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | From the Stripe webhook endpoint you create. |
| `PROJECT_STATUS` | `production` | |
| `FRONT_END_URL` / `ECOMMERCE_STORE_URL` | `https://yourstore.vercel.app` | Used for emails/links. |
| `STRIPE_SHIPPING_RATE_STANDARD` | `shr_...` | Stripe shipping-rate IDs (see `CheckoutController`). |
| `STRIPE_SHIPPING_RATE_EXPRESS` | `shr_...` | |
| `SHIPPING_ALLOWED_COUNTRIES` | `US,CA` | CSV. |
| SMTP vars | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Used by nodemailer (`ShopController`). |

Stripe webhook:
1. In Stripe Dashboard → Webhooks → Add endpoint: `https://your-api.onrender.com/webhook`.
2. Subscribe to `checkout.session.completed`.
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## 2. Frontend (Vercel)

Import the `Frontend` directory (or project root with `--source frontend`) as a Vercel project.

- Build command: `npm run build`
- Install: `npm install --legacy-peer-deps` (required — MUI v4 / React 18 peer conflict).
- Output directory: `dist`

Environment variable:

| Variable | Example | Notes |
|---|---|---|
| `VITE_API_URL` | `https://your-api.onrender.com` | No trailing slash; used by `api-Client.js`. |
| `VITE_STRIPE_PUBLISH_KEY` | `pk_test_...` | Only the **publishable** key. |

Then set backend `CORS_ORIGIN` to your Vercel URL.

---

## 3. Local development

```powershell
# Backend (port 8000)
cd Backend
npm install
copy .env.example .env     # fill in real values (MONGO_URI, Stripe, Cloudinary)
npm run dev                # or: npm start

# Frontend (port 5173)
cd Frontend
npm install --legacy-peer-deps
copy .env.example .env     # set VITE_API_URL=http://localhost:8000
npm run dev
```

- `GET http://localhost:8000/api/products` should return `200`.
- `GET http://localhost:5173/` should load the app.

---

## 4. Security checklist before going live

- [ ] Rotate all credentials that ever appeared in a repo/git history (`MONGO_URI`, `JWT_SECRET_KEY`, Stripe, Cloudinary, SMTP).
- [ ] Confirm `CORS_ORIGIN` is your real frontend domain, not `*`.
- [ ] Confirm the Stripe webhook secret matches the deployed endpoint.
- [ ] Confirm uploads go to Cloudinary only (the API no longer serves `src/uploads`).
- [ ] Remaining known gaps are tracked in `AUDIT.md` §7 (refund flow, npm audit, loading states, a11y).