# Mahrea — API Requirements

**Version:** 1.0 | June 2026  
**Base URL:** `/api`  
**Auth:** JWT via httpOnly cookie (`access_token`)  
**Format:** All requests and responses are `application/json`

---

## Auth Levels

| Symbol | Meaning |
|---|---|
| 🌐 | Public — no auth required |
| 🔐 | Customer — valid customer JWT required |
| 🛡️ | Admin — role must be `admin` or `super_admin` |
| 👑 | Super Admin — role must be `super_admin` |

---

## 1. Authentication — `/api/auth`

| Method | Endpoint | Auth | Request Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/auth/register` | 🌐 | `{ email?, phone?, password, firstName, lastName }` | `{ user }` + sets cookies | Rate limit: 5/min/IP |
| POST | `/auth/login` | 🌐 | `{ emailOrPhone, password }` | `{ user }` + sets cookies | Rate limit: 10/min/IP; lockout after 5 fails |
| POST | `/auth/logout` | 🔐 | — | `{ success }` | Clears cookies |
| POST | `/auth/refresh` | 🌐 (refresh cookie) | — | Sets new cookies | Refresh token rotation |
| GET | `/auth/me` | 🔐 | — | `{ user }` | Returns current user profile |
| POST | `/auth/otp/send` | 🌐 | `{ phone }` | `{ success }` | Sends OTP via msg91; rate limit: 3/hour/phone |
| POST | `/auth/otp/verify` | 🌐 | `{ phone, otp }` | `{ user }` + sets cookies | Creates user if new |
| POST | `/auth/forgot-password` | 🌐 | `{ email }` | `{ success }` | Always 200 — never reveals if email exists |
| POST | `/auth/reset-password` | 🌐 | `{ token, newPassword }` | `{ success }` | Token valid 1 hour, single use |
| POST | `/auth/admin/login` | 🌐 | `{ email, password }` | `{ user }` + sets cookies | Admin-specific; rate limit: 5/min/IP |
| POST | `/auth/admin/logout` | 🛡️ | — | `{ success }` | Clears admin session |

---

## 2. Products — `/api/products`

| Method | Endpoint | Auth | Query Params / Body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/products` | 🌐 | `?category=rings&metal=gold&minPrice=500&maxPrice=5000&sort=price_asc&page=1&limit=24` | `{ products[], total, page, totalPages }` | Published products only |
| GET | `/products/[id]` | 🌐 | — | `{ product }` | By ID or slug |
| GET | `/products/[id]/related` | 🌐 | `?limit=4` | `{ products[] }` | Same category, different product |
| GET | `/products/featured` | 🌐 | `?limit=8` | `{ products[] }` | `isFeatured: true` |
| GET | `/products/new-arrivals` | 🌐 | `?limit=8` | `{ products[] }` | `isNewArrival: true` |
| GET | `/products/by-budget` | 🌐 | `?maxPrice=199` | `{ products[] }` | For Shop by Budget section |
| GET | `/products/by-mood` | 🌐 | `?tag=everyday-minimal` | `{ products[] }` | Products tagged with mood |
| GET | `/products/search` | 🌐 | `?q=diamond+ring` | `{ products[], total }` | Full-text search |

---

## 3. Categories — `/api/categories`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/categories` | 🌐 | — | `{ categories[] }` — all active, ordered |
| GET | `/categories/[slug]` | 🌐 | — | `{ category }` with banner image |

---

## 4. Cart — `/api/cart`

Guest carts use a `guest_id` UUID set in a cookie on first visit.

| Method | Endpoint | Auth | Body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/cart` | 🌐 | — | `{ cart, items[], subtotal, total }` | Reads `userId` or `guest_id` cookie |
| POST | `/cart` | 🌐 | `{ productId, variantSize?, quantity, giftPackaging? }` | `{ cart }` | Validates stock before adding |
| PATCH | `/cart/[itemId]` | 🌐 | `{ quantity }` | `{ cart }` | |
| DELETE | `/cart/[itemId]` | 🌐 | — | `{ cart }` | |
| DELETE | `/cart` | 🌐 | — | `{ success }` | Clear entire cart |
| POST | `/cart/merge` | 🔐 | `{ guestId }` | `{ cart }` | Merge guest cart into user cart on login |

---

## 5. Wishlist — `/api/wishlist`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/wishlist` | 🔐 | — | `{ products[] }` |
| POST | `/wishlist` | 🔐 | `{ productId }` | `{ success }` |
| DELETE | `/wishlist/[productId]` | 🔐 | — | `{ success }` |

---

## 6. Checkout — `/api/checkout`

| Method | Endpoint | Auth | Body | Response | Notes |
|---|---|---|---|---|---|
| POST | `/checkout/create-order` | 🌐 | `{ addressId?, address?, cartId }` | `{ orderId, razorpayOrderId, amount, currency, keyId }` | Server validates all prices; creates Order + Razorpay order |

---

## 7. Orders — `/api/orders`

| Method | Endpoint | Auth | Query / Body | Response |
|---|---|---|---|---|
| GET | `/orders` | 🔐 | `?page=1&limit=10` | `{ orders[], total }` — customer's own orders only |
| GET | `/orders/[id]` | 🔐 | — | `{ order }` — 403 if not customer's order |

---

## 8. Content — `/api/content`

| Method | Endpoint | Auth | Response | Notes |
|---|---|---|---|---|
| GET | `/content/homepage` | 🌐 | `{ hero, moods, categories, collections, budget, trust, testimonials, newsletter }` | All homepage sections in one call |
| GET | `/content/homepage/[section]` | 🌐 | `{ data }` | Single section if needed |

---

## 9. Newsletter — `/api/newsletter`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/newsletter/subscribe` | 🌐 | `{ email }` | `{ success }` |

---

## 10. Webhooks — `/api/webhooks`

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| POST | `/webhooks/razorpay` | HMAC signature | Handles: `payment.captured`, `payment.failed`. Verifies `x-razorpay-signature` header |

---

## 11. Upload — `/api/admin/upload`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/admin/upload/sign` | 🛡️ | `{ folder, uploadPreset? }` | `{ signature, timestamp, apiKey, cloudName }` — for direct browser-to-Cloudinary upload |

---

## 12. Admin — Products — `/api/admin/products`

| Method | Endpoint | Auth | Body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/admin/products` | 🛡️ | `?status=published&category=rings&search=diamond&page=1` | `{ products[], total }` | Includes drafts and unpublished |
| POST | `/admin/products` | 🛡️ | Full product object | `{ product }` | Triggers ISR revalidation on category page |
| GET | `/admin/products/[id]` | 🛡️ | — | `{ product }` | |
| PATCH | `/admin/products/[id]` | 🛡️ | Partial product fields | `{ product }` | Triggers revalidation |
| PATCH | `/admin/products/[id]/status` | 🛡️ | `{ status: "published" \| "unpublished" \| "draft" }` | `{ product }` | |
| DELETE | `/admin/products/[id]` | 🛡️ | — | `{ success }` | Soft delete — sets `deletedAt` |
| POST | `/admin/products/[id]/images` | 🛡️ | `{ cloudinaryId, url, altText, isPrimary }` | `{ image }` | |
| DELETE | `/admin/products/[id]/images/[imageId]` | 🛡️ | — | `{ success }` | |
| PATCH | `/admin/products/[id]/images/[imageId]/primary` | 🛡️ | — | `{ success }` | |

---

## 13. Admin — Categories — `/api/admin/categories`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/admin/categories` | 🛡️ | — | `{ categories[] }` |
| POST | `/admin/categories` | 🛡️ | `{ name, displayName, slug, description }` | `{ category }` |
| PATCH | `/admin/categories/[id]` | 🛡️ | `{ displayName?, isActive?, sortOrder?, bannerImage? }` | `{ category }` |
| PATCH | `/admin/categories/reorder` | 🛡️ | `{ order: [{ id, sortOrder }] }` | `{ success }` |

---

## 14. Admin — Inventory — `/api/admin/inventory`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/admin/inventory` | 🛡️ | `?status=low` | `{ inventory[] }` — all products with stock levels |
| GET | `/admin/inventory/alerts` | 🛡️ | — | `{ products[] }` — below threshold |
| PATCH | `/admin/inventory/[productId]/adjust` | 🛡️ | `{ quantity, reason }` | `{ inventory }` — logs adjustment |

---

## 15. Admin — Pricing — `/api/admin/pricing`

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/admin/pricing` | 🛡️ | — | `{ products[] }` with price fields |
| PATCH | `/admin/pricing/[productId]` | 🛡️ | `{ basePrice, salePrice?, saleActive }` | `{ product }` — validates salePrice < basePrice |

---

## 16. Admin — Orders — `/api/admin/orders`

| Method | Endpoint | Auth | Query / Body | Response |
|---|---|---|---|---|
| GET | `/admin/orders` | 🛡️ | `?status=confirmed&from=2026-01-01&search=MHR-2026&page=1` | `{ orders[], total }` |
| GET | `/admin/orders/[id]` | 🛡️ | — | `{ order }` with full detail |
| PATCH | `/admin/orders/[id]/status` | 🛡️ | `{ status, trackingNumber?, courierName? }` | `{ order }` |
| GET | `/admin/orders/export` | 🛡️ | `?from=2026-01-01&to=2026-06-30` | CSV file download |

---

## 17. Admin — Customers — `/api/admin/customers`

| Method | Endpoint | Auth | Query | Response |
|---|---|---|---|---|
| GET | `/admin/customers` | 🛡️ | `?search=riya&sort=spend_desc&page=1` | `{ customers[], total }` |
| GET | `/admin/customers/[id]` | 🛡️ | — | `{ customer, orders[] }` — profile + history |

---

## 18. Admin — Content — `/api/admin/content`

| Method | Endpoint | Auth | Body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/admin/content/homepage` | 🛡️ | — | `{ sections }` | All homepage sections |
| PATCH | `/admin/content/homepage/[section]` | 🛡️ | `{ data }` | `{ content }` | Triggers `revalidatePath('/')` |
| GET | `/admin/content/banners` | 🛡️ | — | `{ banners[] }` | |
| PUT | `/admin/content/banners/[categoryId]` | 🛡️ | `{ cloudinaryId, url, altText }` | `{ banner }` | Triggers category page revalidation |

---

## Error Response Format

All API errors follow this shape:

```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Price must be a positive number",
  "fields": {
    "basePrice": "Must be greater than 0"
  }
}
```

| HTTP Status | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Invalid request body (Zod validation failed) |
| 401 | `UNAUTHORISED` | Missing or expired JWT |
| 403 | `FORBIDDEN` | Valid JWT but insufficient role |
| 404 | `NOT_FOUND` | Resource does not exist |
| 409 | `CONFLICT` | Duplicate (e.g., email already registered, slug taken) |
| 422 | `BUSINESS_RULE` | Valid input but violates business logic (e.g., sale price > base price) |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error — safe message returned, full error logged to Sentry |

---

## Key Rules

1. **Prices are always in paise** in the database and API. `basePrice: 149900` = ₹1,499. The frontend divides by 100 for display.
2. **Stock check on add-to-cart** — if stockQty < quantity requested, return 422 with a clear message.
3. **Stock decrement on webhook** — never on order creation. Only after `payment.captured`.
4. **Admin content saves trigger ISR revalidation** — `revalidatePath()` called for every affected URL.
5. **Guest cart by `guest_id` cookie** — set on first visit. Merged with user cart on login.
6. **Razorpay webhook signature must be verified** before processing — reject unsigned requests with 401.
7. **Cloudinary API secret never in responses** — `/admin/upload/sign` returns a signed payload only.
