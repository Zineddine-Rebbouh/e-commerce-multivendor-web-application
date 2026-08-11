# Changelog

All notable changes made during the audit → fix → run → deploy-readiness pass.

## [Unreleased] / 2026-08-10

### Security
- **Secrets**: removed the Stripe **secret** key from `Frontend/.env` (now only public `VITE_` vars + placeholder publish key). Backend `.env` gitignored; `Backend/.env.example` + `Frontend/.env.example` added. Gmail/SMTP creds moved from `ShopController.js` to env vars.
- **AuthZ**: added `Backend/src/middelware/roles.js` (`requireRole`, `requireAdmin`, `requireSeller`, `requireAdminOrSeller`) and applied to admin/shop/order-management routes.
- **CORS**: `server.js` reads `CORS_ORIGIN` (comma-separated) with `http://localhost:5173` fallback instead of a hardcoded origin.
- **Rate limiting**: `authLimiter` (50 req/15min) on `/api/auth`, `webhookLimiter` (500 req/15min) on `/webhook`.
- **Uploads**: `utils/multer.js` now image-only (mimetype whitelist) with a 5 MB cap and `memoryStorage` (no stray files on disk); `utils/uploadImage.js` streams the buffer to Cloudinary. `server.js` no longer serves `src/uploads` statically.
- **Webhook hardening**: Stripe signature verified; idempotency guard on `paymentResult.id`; atomic `$inc` stock/balance with stock guard; cart cleared only after a confirmed payment.
- Body size capped at 2mb for JSON/urlencoded payloads.

### Correctness / Bugs
- Rewrote `Frontend/src/api/api-Client.js`: env-driven single `API_BASE` (`VITE_API_URL`), unified request helper; every exported helper now maps to a real backend route.
- Fixed `App.jsx` stray `//` JSX comment (rendered as `//` text).
- Fixed undefined-`e`/wrong-id bug in `ProductsPage.jsx` (`handleDeleteProduct` now filters by `product._id`).
- Removed `next(new ErrorHandler(...))` misuse in controllers (`next` was never in scope).
- `OrderController.updateOrderStatus`: status value allowlist + admin/owner/seller authorization.
- Added indexes on hot collection fields (`user`, `order`, `product`, `shop`, category).
- Fixed `MONGO_URI` in `Backend/.env` (stray `MONGO_DB_CONNECTION=` prefix broke the connection string).
- `server.js` now `process.exit(1)`s if MongoDB is unreachable at boot and only listens after a successful connect.

### Frontend
- Added `Frontend/src/components/ErrorBoundary.jsx`, wraps `<App/>` in `main.jsx`.
- `ProtectRoute` now supports a `role` prop; `/dashboard/*` require `Admin`, `/shop/*` require `Seller` (in `App.jsx`).
- Gated anonymous startup dispatches: cart/wishlist load only after `LoadUser` succeeds (`App.jsx`).
- `vite.config.js` rewritten (valid Vite options, explicit dev port 5173).

### Ops / Tooling
- `Backend/package.json`: `start` → `node src/server.js`, added `dev` → `nodemon src/server.js`.
- `.gitignore` added for `Backend` and `Frontend` (node_modules, dist, `.env`, logs, uploads).
- Documentation: `ARCHITECTURE.md`, `AUDIT.md` (+ resolution status), `CHANGELOG.md`, `DEPLOYMENT.md` (this file).

### Verified
- Backend boots against MongoDB (Atlas) — `MongoDB connected`, listening on port 8000; `GET /api/products`, `GET /api/categories`, `GET /api/shop` return 200.
- Frontend dev server runs on 5173 and serves the app; `npm run build` completes successfully.