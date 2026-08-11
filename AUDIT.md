# Security & Correctness Audit — Gap Report

Scope: `e-commerce-multivendor-web-application`. Stack: Express/Mongo backend, React/Vite frontend. Audit performed as-found, before any fixes.

Priority legend: **CRIT** = must fix before deploy · **HIGH** = fix before deploy · **MED** = should fix · **LOW** = nice to have.

---

## 1. Security

### 1.1 Hardcoded secrets / credentials — CRIT
| # | Where | Finding |
|---|-------|---------|
| S1 | `Backend/.env` | Real MongoDB Atlas URI with username+password; JWT secret; Cloudinary credentials; Stripe secret + webhook secret. `PROJECT_STATUS=production` while frontend URL is localhost. |
| S2 | `Frontend/.env` | Stripe **secret** key bundled into the frontend project (plus publishable key). Secret key must never live in a frontend repo/Vercel env invoked by browsers. |
| S3 | `Backend/src/controllers/ShopController.js:299-308` | Gmail account + app password hardcoded for nodemailer transport. |
| S4 | `Backend/src/controllers/CheckoutController.js:23-24` | Stripe shipping-rate IDs hardcoded. |

### 1.2 Input validation / injection — HIGH
- Product/category/shop/edit endpoints trust `req.body` fields (e.g. `ProductController.updateProduct` does `findByIdAndUpdate(id, req.body)` — mass-assignment), `OrderController.updateOrderStatus` accepts any `status` string, `eventController`/`notification` no validation.
- No role check before `updateOrderStatus` — any authenticated user can flip any order status.
- Route params used directly in `findById` — invalid ObjectIds return 500/raw errors instead of 400.
- No HTML escaping concern server-side (Mongo/Express), but user content (`name`, `description`, reviews) is rendered with React (`{}`) which escapes by default — XSS surface is low. No sanitization of markdown/links.

### 1.3 AuthN / AuthZ — CRIT
- `validateToken` (`Backend/src/middelware/validateToken.js`) verifies JWT only; **no `role` on the token and no admin/seller/customer authorization.** Admin dashboard, shop approval/rejection, order status changes, user deletion, product deletion, shop deletion, report listing, request listing are effectively usable by any logged-in user (or public):
  - `GET /api/order` (all orders), `GET /api/user` (all users), `DELETE /api/products/:id`, `DELETE /api/shop/:id`, `PUT /api/shop/approve-shop/:id`, `GET /api/reports` are **unauthenticated**.
- Registration lets anyone create an account; there is no way to verify email.
- `DELETE /api/user` uses `req.userId` (good) but `GET /api/user/:id` lets anyone fetch any user profile.
- Cookie: `secure` honored, but no `sameSite` attribute (CSRF exposure for cookie-auth).

### 1.4 CORS — HIGH
`server.js` cors origin **hardcoded** to `http://localhost:5173`. Deployed frontend (Vercel) would be blocked. No env-var-driven origin list.

### 1.5 Rate limiting — HIGH
No rate limiting anywhere. Login/register/checkout/refund endpoints are open to brute-force and abuse.

### 1.6 File upload — HIGH
`utils/multer.js` accepts any mimetype, any size, stores to `src/uploads/` with the client's original filename; `server.js` serves `uploads/` as static. An attacker can upload `.js/.html/.svg` and serve it from the API origin (stored-XSS / malware hosting). No file-type whitelist, size cap, or scanning. `express.json()` also has no body-size cap.

### 1.7 Secrets in cookies / logs — MED
Controllers `console.log` full request bodies / product metadata; webhook logs `item.price.product`; checkout logs `req.body` (could contain PII).

---

## 2. Correctness / Bugs

### 2.1 Dead/broken code — HIGH
- `Frontend/src/api/api-Client.js:188` contains a stray `ad` statement (would be a syntax error; the file is only "working" because that function is barely executed and the build tooling tolerated it).
- ~25 exported API helpers point to **nonexistent backend routes** (e.g. `api/product/create`, `api/order/get-seller-all-orders/:id`, `api/product/get-seller-products/:id`, `api/review/get-product-reviews/:id`, `api/cart/*`, `api/cartItem/*`, `createReview` hardcodes product id `660b33a59cc01fa8dd32a28a`).
- `Backend/src/controllers/userController.js`, `OrderController.getOrder`, `ShopController` call `next(new ErrorHandler(...))` but `next` is **never in scope** → would throw `ReferenceError` when that path is hit.
- `OrderController.getOrder` also has an N+1 and references `req`/`next` pattern that can crash; `backend/src/server.js` ErrorHandler middleware is commented out.
- Duplicate `checkout`/`addToCart`/`getShops` helpers in api-Client (responses shadowed, e.g. `getShop` uses `responseBody` before assignment).
- `Frontend/src/components/Card/card.jsx`, `Frontend/src/components/Product/ProductCard.jsx` may not be used; several UI files import nothing and are empty shells (`components/CheckOut/Checkout.jsx`).
- `Frontend` `App.jsx` contains JSX comments like `// Admin Dashboard` inside JSX (renders as text `//` on the page).
- `updateUserInformation` routes through `USER_UPDATE_REQUEST` but the entire profile/order pages fetch with `.getOrdersByUserId` before user loads → crashes (see 2.3 / 5.3).

### 2.2 Performance / indexes — MED/HIGH
- `Product.find()`, `Order.find()`, `LineOrderItems.find({orderId: ...})`, `Whishlist.find()`, `Notification.find()` run per request with **no indexes** declared (`{userId:…}`, `{orderId:…}`, `{productId:…}`, `{shopId:…}` all un-indexed).
- N+1: `ProductController.getProductsByCategory` iterates reviews/disounts per product; `OrderController.getOrdersByUserId` runs `LineOrderItems.find` inside a `for` loop; webhook loops `lineItems.forEach` with awaits.
- `getShopOrders` (ShopController) conflates "user who owns the shop" with the customer — query `Order.find({userId: user._id})` where `user` is the *shop owner*, not the customer → returns wrong orders. Fundamental modeling bug for multi-tenant orders.

### 2.3 Race conditions — CRIT
- Stock is decremented in the **webhook** via `findById → save()` non-atomic increments. Two concurrent webhooks for the same product can oversell. No `$inc` atomic operation, no stock check.
- Checkout deletes the user's cart (`Cart.findOneAndDelete`) **before** payment completes; if payment fails/cancels, cart is already gone.
- Webhook is **not idempotent**: duplicate `checkout.session.completed` deliveries create duplicate Orders + duplicate LineOrderItems + duplicate Balance increments and double-decrements stock. No `paymentResult.id` uniqueness nor event-ID dedup.
- No transaction/`Session` for the multi-document writes (order + line items + shop + product) — partial failures leave inconsistent state.

### 2.4 Payment flow — HIGH
- Webhook verifies signature (good) but has no `payment_intent/customer` caching and no `session.payment_status` boolean gate; metadata `productId`/`shopId` are trusted from Stripe (fine, but no validation when mapping to `new mongoose.Types.ObjectId(...)` → can throw on malformed).
- `client_reference_id` (userId) is trusted without verifying the user exists.
- If Stripe-event isn't `checkout.session.completed`, response never sent within try (returns 200 undefined path) — fine, but no ack/log otherwise.
- No retry/queue on shop balance update failure (updates fail silently per-item in a forEach).
- `refundOrder` changes DB status but never refunds Stripe (no API call) and never restores shop `Balance` or stock.

### 2.5 Multivendor-specific — HIGH
- **Commission/split logic: none.** Shop `Balance` is credited the full line-item `amount_total` with no platform commission or payout/settlement model.
- Order splitting across vendors: one order is created; shop balance is credited via webhook but `Shop.transections` is never updated.
- `getShopOrders` (see 2.2) is broken for true multi-vendor order attribution.

---

## 3. Config / Environment

- **C1** No `.env.example` for backend or frontend.
- **C2** Hardcoded `http://localhost:5173` / `http://localhost:8000` throughout frontend (`api-Client.js`, redux actions, `sections/Shops.jsx`, `sections/Requests.jsx`) and backend env values.
- **C3** Mongo connection: single `mongoose.connect` at boot; on failure the process just logs and **does not exit** — server never listens but "runs" (misleading). No connection-pool tuning, no retry/backoff.
- **C4** `PROJECT_STATUS` typo/inconsistency vs a real `NODE_ENV`; `CLOUDIANRY_API_SECRET` (typo) is the de-facto var name.
- **C5** Stripe shipping rate IDs + allowed countries hardcoded in code.
- **C6** `vite.config.js` has an `images.domains` block that is not a valid Vite option (leftover from Next.js) — harmless but misleading; also whitespace `"localhost "`.

---

## 4. Dependencies

- Backend `npm audit`: **21 vulnerabilities (14 high, 2 critical)** — `bcrypt@5`→`tar` (critical, fixed in bcrypt 6), `send@<0.19`/`serve-static`, `qs`, `picomatch`, `validator`.
- Frontend `npm audit`: **5 vulnerabilities (1 high, 1 critical)**.
- Bail-out: `@material-ui/core@4` conflicts with React 18 peer types (requires `--legacy-peer-deps` to install at all). MUI v4 is EOL/deprecated.
- Unused/bundled bloat: `recharts` + `apexcharts` + `react-apexcharts` + `@mui/x-data-grid` + `moment` + `date-fns` + `swiper` + `react-slick` + `slick-carousel` all installed; production JS bundle is **2.57 MB (uncompressed), 761 kB gzip** — Vite warns chunk > 500 kB.

---

## 5. Frontend-specific

- **F1** ~75 `fetch()` calls hardcode `http://localhost:8000`; many are dead/mismatched (see 2.1). Breaks any non-local deployment immediately.
- **F2** No error boundaries; app-wide no fallback.
- **F3** Protected routes use client-only `ProtectRoute` (checking `isAuthenticated` from Redux). Admin/shop routes aren't role-gated; a Seller can open `/dashboard`.
- **F4** No loading-state handling on most pages; `LoadUser`, product fetch, cart fetch fire on app mount and **every failure path is swallowed** (`error.response.data.message` will throw again on a network error).
- **F5** `App.jsx` initial dispatches call `getUserWhilistItems`, `getUserCartItems`, `getAllProducts` for anonymous users → Unauthorized 401s on first paint (console spam + empty states).
- **F6** Accessibility: most `<img>` in cards lack `alt`; buttons vs links; no `aria-label` on icon buttons (quantity +/-); form labels exist but some `for`/`id` mismatch; files are not `defer`-dependent; no `lang` issues (present). Color contrast / focus styles unverified.
- **F7** Console warnings on every build: e.g. `"deleteCategory" is not exported by "src/api/api-Client.js"` — missing export referenced by `sections/Categories.jsx`.
- **F8** `Login` redirect logic double-navigates; `SignUp` navigates to `/sign-in` after registering (fine) but backend already sets the auth cookie — inconsistent UX.
- **F9** No failure handling on checkout mutation (`onError` only logs).

---

## 6. Testing

- **No test files exist.** `Backend/package.json` test script is `echo "Error: no test specified"`. There is no lint/CI. `Frontend` has no `test` script either.
- Verified locally: backend installs cleanly; frontend builds (with warnings). Backend startup and end-to-end flows are smoke-tested only after fixes (Phase 3).

---

## 7. Resolution Status (post-fix)

Status of each finding after the Phase 2 fix pass. "Open" items are tracked for a follow-up pass.

| # | Finding | Status | Notes |
|---|---------|--------|-------|
| S1 | Backend `.env` secrets | Partial | `.env` gitignored + `.env.example` created. Real creds still required to boot; rotate before any shared repo push (existing `.git` already tracked them historically). |
| S2 | Frontend contained Stripe secret | Resolved | `Frontend/.env` now only holds `VITE_API_URL` + placeholder publish key; secret removed. |
| S3 | Gmail creds hardcoded | Resolved | nodemailer transport reads SMTP vars from env (see `.env.example`). |
| S4 | Stripe shipping-rate IDs hardcoded | Resolved | Read from `STRIPE_SHIPPING_RATE_STANDARD`/`_EXPRESS` + `SHIPPING_ALLOWED_COUNTRIES` env. |
| 1.2 | Input validation / mass assignment | Partial | `updateOrderStatus` validated + allowlisted. `findByIdAndUpdate(req.body)` spots remain; invalid ObjectIds still 500 in some paths. |
| 1.3 | AuthN/AuthZ | Resolved | `requireAdmin`/`requireSeller`/`requireAdminOrSeller` in `middelware/roles.js` applied to shop/admin/order/status/delete routes. `validateToken` still cookie-only (no CSRF token); `GET`: some non-sensitive reads remain public by design. |
| 1.4 | Hardcoded CORS | Resolved | `CORS_ORIGIN` env (comma-separated) with `http://localhost:5173` fallback. |
| 1.5 | No rate limiting | Resolved | `authLimiter` (50/15min) on `/api/auth`, `webhookLimiter` (500/15min) on `/webhook`. |
| 1.6 | Unsafe uploads | Partial | Multer now image-only, 5MB cap; `express.json()` capped 2mb. `src/uploads` still served statically - stop in follow-up. |
| 1.7 | Secrets/PII in logs | Partial | Some `console.log(req.body)`/products remain in controllers. |
| 2.1 | Dead/broken code, `next` misuse, stray syntax | Resolved | `api-Client.js` rewritten (env-driven, all exports mapped incl. `deleteCategory`); `App.jsx` JSX comment fixed; `next` misuse removed. |
| 2.2 | Missing indexes | Resolved | Indexes added on hot `userId`/`orderId`/`productId`/`shopId`/category fields across models. |
| 2.3 | Webhook race conditions | Resolved | Idempotency via `paymentResult.id`; atomic `$inc` stock/balance with stock guard; cart cleared only after confirmed payment in webhook. |
| 2.4 | Payment flow | Partial | Signature verified, user existence checked. `refundOrder` (userController) still flips status only - no Stripe refund call, no Balance/stock restore. |
| 2.5 | Multivendor | Partial | `Shop.transections` now updated via `$addToSet` in webhook. No commission model; `getShopOrders` ownership semantics unchanged. |
| C1 | No `.env.example` | Resolved | `Backend/.env.example` + `Frontend/.env.example` added. |
| C2 | Hardcoded localhost URLs | Resolved | `API_BASE` env-driven (`VITE_API_URL`); no raw `localhost:8000` fetches remain in `src`. |
| C3 | Mongo boot failure handling | Resolved | `server.js` `process.exit(1)` on connect failure; listens only after connect. |
| C4 | Env naming quirks (`PROJECT_STATUS`, `CLOUDIANRY_API_SECRET`) | Documented | `.env.example` matches the code's `CLOUDIANRY_API_SECRET` spelling. |
| C5 | Stripe rate/country hardcodes | Resolved | Env-driven (see S4). |
| C6 | Invalid `vite.config.js` block | Resolved | Config rewritten; explicit dev port 5173. |
| 4 | npm audit deps | Open | `bcrypt@5`/`send`/`qs`/`validator` vulns unchanged; backend 21 (14 high/2 crit), frontend 5 (1 high/1 crit). Update + retest in dependency pass. |
| F1 | Raw localhost fetches | Resolved | Only the `API_BASE` fallback constant remains. |
| F2 | No error boundary | Resolved | `components/ErrorBoundary.jsx` wraps `<App/>` in `main.jsx`. |
| F3 | Non-role-gated routes | Resolved | `ProtectRoute` supports `role` prop; `/dashboard/*` require admin, `/shop/*` require seller. |
| F4 | No loading/error states | Open | Most pages still lack busy/empty/error UI. |
| F5 | Anonymous dispatches on mount | Resolved | Cart/wishlist load now fires only after `isAuthenticated`. |
| F6 | Accessibility | Open | `alt`/`aria-label`/focus-contrast pass still pending. |
| F7 | Missing `deleteCategory` export | Resolved | Export exists in `api-Client.js`. |
| F8 | Login double-navigate / UX | Open | Redirect flow unchanged. |
| F9 | Checkout error handling | Open | `onError` still only logs. |
| 6 | Tests | Open | No test files; backend `test` script is a stub. |

---

## Priority Order
Tasks ordered by risk:
1. Remove/rotate all hardcoded secrets; introduce `.env.example`. (S1-S4)
2. Enforce role-based auth on every protected route; gate admin/seller/order-management endpoints. (1.3)
3. Make webhook idempotent + atomic stock decrement + cart-not-deleted-on-checkout. (2.3, 2.4)
4. CORS from env; add rate limiting; sanitize uploads (file-type/size whitelist, body size cap). (1.4-1.6)
5. Fix broken/missing API endpoints + `next` misuse + stray syntax error. (2.1)
6. Frontend: single env-driven API base URL; missing exports; error/loading states; error boundaries. (5.x)
7. Index hot collections. (2.2)
8. Registry updates / dependency fixes for audit findings. (4)