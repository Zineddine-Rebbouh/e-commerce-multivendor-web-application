# Seeding Guide & Dataset Report

Companion to `Backend/src/seed/index.js`. Everything below reflects the **actual**
Mongoose models — no schema assumptions.

## 1. Run the seed

From `Backend/`:

```powershell
npm run seed          # insert; skips records that already exist (idempotent)
npm run seed:reset    # wipe all seeded collections, then re-insert
```

- Reads `MONGO_URI` from `Backend/.env` (or `process.env`).
- Passwords hashed with bcrypt salt 10 — same as `authController.register`.
- Every insert is guarded by a natural-key lookup, so reruns never duplicate.
- Reads the live schema from `src/models/*`; it does not modify schema or app code.

## 2. Entities seeded (counts)

| Entity (model)               | Count |
|------------------------------|-------|
| User                         | 13    |
| Shop                         | 4     |
| Category                     | 6     |
| Discount                     | 6     |
| Product                      | 24    |
| Order                        | 12    |
| LineOrderItems               | 30    |
| ShippingAdresse              | 5     |
| Cart                         | 13    |
| LineCartItems                | 9     |
| Whishlist                    | 6     |
| Review                       | 22    |
| Notification                 | 10    |
| RequestShopDetails           | 3     |
| Requests                     | 3     |
| Reports                      | 2     |
| Event                        | 2     |

## 3. Test accounts (password `Password@123` for all)

| Role     | Email                          | Purpose                                        |
|----------|--------------------------------|------------------------------------------------|
| Admin    | admin@example.com              | Full dashboard access                          |
| Admin    | system.admin@example.com       | Secondary admin                                |
| Seller   | ahmed.benali@gmail.com         | TechNova Digital (electronics)                 |
| Seller   | sofia.mansouri@gmail.com       | Elégance Fashion (fashion)                     |
| Seller   | karim.haddadi@gmail.com        | Urban Athletics (sports)                       |
| Seller   | nour.djellaoui@gmail.com       | Maison & Lumière (home/beauty/books)           |
| Customer | lina.boudiaf@gmail.com         | New customer: cart (2) + wishlist (2), no orders |
| Customer | omar.zeddam@gmail.com          | Brand-new customer, zero activity, has a pending shop request |
| Customer | yacine.meziane@gmail.com       | Delivered order (multi-vendor) + reviews       |
| Customer | amel.saidi@gmail.com           | Repeat buyer: Pending/On Hold/Shipped/Delivered orders, 3 cart items, reviews |
| Customer | rania.cherif@gmail.com         | Processing + Refunded + Shipped (valid refund target) orders |
| Customer | mehdi.touhami@gmail.com        | Cancelled + Returned orders, wishlist          |
| Customer | nadia.belkacem@gmail.com       | High-value delivered orders (revenue demo)     |

## 4. Scenario coverage

- **Products**: 24 across 6 categories; high stock (`USB-C Fast Charger` 497), low
  stock (`Espresso Machine` 5, `Sunscreen` 2, `Camping Tent` 3), **out of stock**
  (`Smartphone 256GB` 0 with total_sell 4), discounted (12 → `best-deals`),
  non-discounted (12 → `fearture-deals`), with reviews, without reviews, brand-new
  zero-sale product (`Smartwatch Fitness Band`).
- **Order statuses**: Pending, Processing, Shipped, Delivered, On Hold, Cancelled,
  Refunded (within the 7-day refund window), Returned — all via valid enum values.
- **Payments**: all orders `paymentMethod: card`, `paymentResult.status: paid`,
  unique `paymentResult.id` (`pi_seed_*`). `totalPrice = Σ(price×qty) + shippingPrice`.
- **Integrity**: `product.available_quantity = base − sold`, `total_sell = Σ line
  quantities`, `Shop.Balance = Σ(price×qty)` across that shop's line items,
  `product.rating = round(mean review rating, 1dp)`, carts unique per user, reviews
  authored by customers who actually ordered, no orphan refs.
- **Multi-vendor**: order A ships products from 3 different shops; each shop's
  balance/transections reflects only its line items (verified: seller Ahmed sees 8
  shop orders across orders A,B,C,E,F,H,J,K).

## 5. Verified flows

- Public: `GET /api/products` (24), `/api/categories` (6), `/api/shop` (4),
  `/api/products/best-deals` (12), `/api/products/fearture-deals` (12).
- Admin `admin@example.com`: `GET /api/order` (12 orders), `GET /api/user` (200).
- Customer `amel.saidi@gmail.com`: cart returns 3 items, wishlist 0.
- Seller `ahmed.benali@gmail.com`: role `Seller`, `GET /api/shop/orders/:id` → 8.
- Role gate: seller hitting admin-only `GET /api/user` → **403**.
- Bad password → **401**; product detail returns seeded reviews (author: Yacine Meziane, rating 5).

## 6. Issues & inconsistencies discovered in the existing backend

1. **Secure-cookie breaks local HTTP auth.** `Backend/.env` sets
   `PROJECT_STATUS=production`, and `authController` marks the JWT cookie
   `Secure`+`SameSite=None` in production. Such a cookie is dropped by
   browsers/clients over plain `http://localhost`, so login succeeds but every
   subsequent authenticated call returns 401 locally. For local testing set
   `PROJECT_STATUS` to anything other than `production` (verified working).
2. **`Event` model vs `eventController` mismatch.** Controller writes
   `{title, description, date, time, location, image}` but the model expects
   `{name, productId, start_Date, finish_Date, originalPrice, discountPrice,
   stock, images, shopId, shop, sold_out}`. The controller cannot produce valid
   Event documents. The frontend Events page is hardcoded static data, so Events
   are orphaned end-to-end. Seeds follow the model.
3. **Stale/dangling refs.** `User.orders` references a model named `"Orders"`
   (never registered); `Notification` declares refs to `Promotion`, `Feedback`,
   `Payment`, `Shipping`, `CustomerSupport`, `PlatformUpdate`, `Recommendation` —
   none of those models exist. Harmless to seed (left unset), but misleading.
4. **`Cart.LineCartItemsId` is vestigial.** The cart flow stores items in
   `LineCartItems` keyed by `cartId`; the single `LineCartItemsId` field on Cart
   is never used by controllers. Seeding leaves it unset (matches register).
5. **Refund does not move money.** `refundOrder` only flips `Order.status` to
   `Refunded`; it never calls the Stripe refund API and never restores shop
   `Balance` or product stock. The seed mirrors the app's actual behavior: shop
   balances include payments for subsequently Cancelled/Refunded/Returned orders.
6. **Currency mismatch.** Stripe checkout is hardcoded `USD`, while several
   frontend tables display `DZD`. Seed prices are USD to match the payment rail.
7. **No uniqueness on emails/names** at the DB level — the seed enforces
   uniqueness at the application level (natural-key upserts).
8. **No test suite.** `npm test` is a stub. Seed integrity was verified by a
   throwaway consistency script (0 problems) and live-API flows, not automated tests.