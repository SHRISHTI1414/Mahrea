# Mahrea — Technical Architecture

**Version:** 1.0 | June 2026  
**Stack:** Next.js 15 · TypeScript · Tailwind CSS · MongoDB · Cloudinary · JWT · Razorpay

---

## 1. Guiding Principle

This is a startup MVP. The architecture must be:
- **Simple** — one codebase, one deployment, one database
- **Shippable** — no over-engineering, no microservices
- **Scalable** — structured to grow without rewrites

A single Next.js application handles the customer website, admin dashboard, and all API endpoints. No separate backend server.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + ISR for SEO; API routes for backend; one deploy |
| Language | TypeScript (strict) | Catches bugs early; shared types across frontend and API |
| Styling | Tailwind CSS 4 | Fast UI development; consistent design tokens |
| Database | MongoDB Atlas | Flexible schema for varied jewellery attributes; managed hosting |
| ODM | Mongoose | Schema validation, middleware hooks, clean model syntax |
| Auth | JWT (httpOnly cookies) | Stateless; XSS-safe; works with SSR |
| Media | Cloudinary | Image CDN, auto WebP, responsive transforms, video |
| Payment | Razorpay | Best Indian gateway — UPI, Cards, Net Banking |
| Email | Resend + React Email | Transactional emails with React templates |
| SMS / OTP | msg91 | Indian SMS OTP for phone login |
| Social Auth | NextAuth.js | Google + Facebook OAuth, integrates with MongoDB |
| State | Zustand | Client-side cart, wishlist, UI state |
| Hosting | Vercel | Zero-config Next.js deploy, edge CDN, preview deployments |

---

## 3. Application Structure

One Next.js app. Three route groups. One API layer.

```
Customer Website  ──┐
Admin Dashboard   ──┼──► Next.js App ──► MongoDB Atlas
API Layer         ──┘         │
                              ├──► Cloudinary (images)
                              ├──► Razorpay (payments)
                              ├──► Resend (emails)
                              └──► msg91 (SMS OTP)
```

### Route Groups

| Route Group | URL Pattern | Rendering | Who Uses It |
|---|---|---|---|
| `(customer)` | `/`, `/rings`, `/cart`, etc. | SSR + ISR | Shoppers |
| `(auth)` | `/login`, `/signup`, `/verify` | SSR | All users |
| `(admin)` | `/admin/*` | Client-side | Mahrea team |
| `api/` | `/api/*` | Node.js runtime | Internal + webhooks |

---

## 4. Page Rendering Strategy

| Page | Method | Cache | Reason |
|---|---|---|---|
| Homepage | ISR | 1 hour, on-demand revalidate | SEO critical; content changes via admin |
| Category pages | ISR | 30 min, on-demand revalidate | SEO critical; products change |
| Product Detail Page | ISR | 15 min, on-demand revalidate | SEO + price accuracy |
| Cart | Client-side | None | Personalised, real-time |
| Checkout | SSR | None | Auth required, prices server-verified |
| Account pages | SSR | None | Auth required |
| Admin pages | Client-side | None | Auth required, always live data |
| Legal/About/Contact | Static | Build time | Content never changes mid-deploy |

When admin updates any product or homepage content, the API calls `revalidatePath()` to instantly purge the ISR cache. No stale data on the storefront.

---

## 5. Folder Structure

```
mahrea/
├── src/
│   ├── app/
│   │   ├── (customer)/
│   │   │   ├── layout.tsx              # Navbar, footer, cart drawer
│   │   │   ├── page.tsx                # Homepage (ISR)
│   │   │   ├── [category]/
│   │   │   │   ├── page.tsx            # Category listing (ISR)
│   │   │   │   └── [slug]/page.tsx     # Product Detail Page (ISR)
│   │   │   ├── cart/page.tsx
│   │   │   ├── wishlist/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx            # Address step
│   │   │   │   └── payment/page.tsx    # Payment step
│   │   │   ├── order/
│   │   │   │   └── confirmation/[id]/page.tsx
│   │   │   ├── account/
│   │   │   │   ├── orders/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── legal/
│   │   │       ├── privacy-policy/page.tsx
│   │   │       └── terms/page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx              # Minimal layout (no nav/footer)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify-otp/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx              # Admin sidebar + auth guard
│   │   │   └── admin/
│   │   │       ├── page.tsx            # Dashboard overview
│   │   │       ├── products/
│   │   │       │   ├── page.tsx        # Product list
│   │   │       │   ├── new/page.tsx    # Add product
│   │   │       │   └── [id]/page.tsx   # Edit product
│   │   │       ├── categories/page.tsx
│   │   │       ├── inventory/page.tsx
│   │   │       ├── orders/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── customers/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       └── content/
│   │   │           ├── homepage/page.tsx
│   │   │           └── banners/page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── otp/send/route.ts
│   │   │   │   ├── otp/verify/route.ts
│   │   │   │   ├── refresh/route.ts
│   │   │   │   └── forgot-password/route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── cart/
│   │   │   │   ├── route.ts
│   │   │   │   └── [itemId]/route.ts
│   │   │   ├── wishlist/route.ts
│   │   │   ├── checkout/create-order/route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── products/route.ts
│   │   │   │   ├── categories/route.ts
│   │   │   │   ├── inventory/route.ts
│   │   │   │   ├── orders/route.ts
│   │   │   │   ├── customers/route.ts
│   │   │   │   ├── content/homepage/route.ts
│   │   │   │   └── upload/sign/route.ts
│   │   │   └── webhooks/
│   │   │       └── razorpay/route.ts
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── home/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── ShopByMood.tsx
│   │   │   ├── ShopByCategory.tsx
│   │   │   ├── TrendingCollections.tsx
│   │   │   ├── ShopByBudget.tsx
│   │   │   ├── TrustBadges.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── NewsletterSection.tsx
│   │   ├── catalogue/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SortDropdown.tsx
│   │   ├── product/
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ProductInfo.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── GiftPackagingOption.tsx
│   │   │   └── RelatedProducts.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── AddressForm.tsx
│   │   │   └── PaymentPanel.tsx
│   │   ├── admin/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── HomepageEditor.tsx
│   │   │   └── OrderDetail.tsx
│   │   └── shared/
│   │       ├── Breadcrumb.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── mongodb.ts              # MongoDB connection singleton
│   │   ├── auth/
│   │   │   ├── jwt.ts              # Sign, verify, decode tokens
│   │   │   └── middleware.ts       # requireAuth, requireAdmin
│   │   ├── cloudinary.ts           # Upload sign, transform helpers
│   │   ├── razorpay.ts             # Razorpay SDK + helpers
│   │   ├── resend.ts               # Email client
│   │   ├── msg91.ts                # SMS OTP client
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── cart.service.ts
│   │   │   └── content.service.ts
│   │   └── validators/             # Zod schemas
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Category.ts
│   │   ├── Order.ts
│   │   ├── Cart.ts
│   │   ├── Wishlist.ts
│   │   └── Content.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── cart.store.ts
│   │   └── ui.store.ts
│   └── types/
│       ├── product.types.ts
│       ├── order.types.ts
│       └── api.types.ts
├── public/
│   ├── fonts/
│   └── images/
├── docs/                           # Architecture, PRD, analysis docs
├── .env.example                    # All required env variables listed
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. MongoDB Data Models

### User
```
{
  _id: ObjectId
  email: String (unique, sparse)
  phone: String (unique, sparse)
  passwordHash: String
  firstName: String
  lastName: String
  role: Enum ["customer", "admin", "super_admin"]
  isActive: Boolean
  googleId: String (sparse)
  facebookId: String (sparse)
  addresses: [AddressSchema]
  createdAt: Date
  updatedAt: Date
}
```

### Product
```
{
  _id: ObjectId
  name: String
  slug: String (unique)
  sku: String (unique)
  categoryId: ObjectId → Category
  description: String (HTML, sanitised)
  material: Enum ["gold", "silver", "rose_gold", "platinum", "other"]
  purity: String           // "22KT", "925", "18KT"
  metalColor: String       // "Yellow Gold", "Rose Gold", "Rhodium"
  weightGrams: Number
  isHallmarked: Boolean
  images: [{ cloudinaryId, url, altText, isPrimary, sortOrder }]
  variants: [{ size, sku, stockQty }]
  basePrice: Number        // stored in paise (₹1 = 100 paise)
  salePrice: Number        // null if no sale active
  saleActive: Boolean
  stockQty: Number
  lowStockThreshold: Number (default: 5)
  tags: [String]           // for mood filters, collections
  isFeatured: Boolean
  isNewArrival: Boolean
  status: Enum ["draft", "published", "unpublished"]
  metaTitle: String
  metaDescription: String
  deletedAt: Date          // soft delete
  createdAt: Date
  updatedAt: Date
}
```

### Category
```
{
  _id: ObjectId
  name: String (unique)
  slug: String (unique)
  displayName: String
  description: String
  bannerImage: { cloudinaryId, url, altText }
  startingPrice: Number    // displayed on homepage ("Start from ₹9,073")
  sortOrder: Number
  isActive: Boolean
  createdAt: Date
}
```

### Order
```
{
  _id: ObjectId
  orderNumber: String      // "MHR-2026-00042"
  customerId: ObjectId → User
  items: [{
    productId: ObjectId
    variantSize: String
    productName: String    // snapshot
    imageUrl: String       // snapshot
    unitPrice: Number      // snapshot in paise
    quantity: Number
    lineTotal: Number
  }]
  shippingAddress: {       // full snapshot — not a reference
    fullName, phone, line1, line2, city, state, pincode, country
  }
  subtotal: Number         // paise
  giftPackaging: Boolean
  giftPackagingCharge: Number
  shippingCharge: Number
  total: Number            // paise
  status: Enum ["pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled"]
  payment: {
    razorpayOrderId: String
    razorpayPaymentId: String
    method: Enum ["upi", "card"]
    status: Enum ["pending", "paid", "failed"]
    paidAt: Date
  }
  trackingNumber: String
  createdAt: Date
  updatedAt: Date
}
```

### Cart
```
{
  _id: ObjectId
  userId: ObjectId (nullable — for logged-in users)
  guestId: String (nullable — cookie ID for guests)
  items: [{
    productId: ObjectId
    variantSize: String
    quantity: Number
    addedAt: Date
  }]
  updatedAt: Date
}
```

### Wishlist
```
{
  _id: ObjectId
  userId: ObjectId (unique)
  products: [ObjectId → Product]
  updatedAt: Date
}
```

### Content (Homepage & Banners)
```
{
  _id: ObjectId
  key: String (unique)     // "homepage_hero", "homepage_testimonials", etc.
  data: Mixed              // flexible JSON per section type
  updatedAt: Date
  updatedBy: ObjectId → User
}
```

---

## 7. Authentication Flow

### Token Strategy
- **Access Token** — JWT, 15 min TTL, stored in httpOnly cookie
- **Refresh Token** — JWT, 7 days TTL (customer) / 24h (admin), stored in httpOnly cookie

### Email/Password Login
```
POST /api/auth/login
→ Validate email/phone + bcrypt.compare(password, hash)
→ Generate access token + refresh token
→ Set both as httpOnly, Secure, SameSite=Strict cookies
→ Return user profile (no tokens in response body)
```

### Phone OTP Login
```
POST /api/auth/otp/send  { phone }
→ Generate 6-digit OTP
→ Store hashed OTP + expiry (5 min) in User document
→ Send SMS via msg91

POST /api/auth/otp/verify  { phone, otp }
→ Validate OTP hash + expiry
→ Issue JWT tokens as cookies
→ Create User if new (phone-only signup)
```

### Google / Facebook OAuth
- Handled by NextAuth.js
- On success: create or update User with googleId/facebookId
- Issue same JWT cookies for session consistency

### Admin Auth
- Same token system, shorter refresh TTL
- `middleware.ts` checks role === "admin" | "super_admin" on all `/admin/*` routes
- Redirects to `/admin/login` if check fails

---

## 8. Image Strategy (Cloudinary)

### Upload Flow (Admin)
```
Admin selects image in admin panel
→ Browser calls POST /api/admin/upload/sign
→ Server generates signed Cloudinary params (API secret never leaves server)
→ Browser uploads directly to Cloudinary
→ Cloudinary returns { public_id, secure_url }
→ Browser saves { public_id, url } to Product via API
```

### Folder Structure
```
mahrea/
├── products/{product-id}/      # Product images
├── banners/
│   ├── homepage/               # Hero banners
│   └── categories/             # Category hero images
├── moods/                      # Shop by Mood images
├── collections/                # Trending collection images
├── auth/                       # Login/Signup background images
└── content/                    # Brand story, about us
```

### Transformations (URL-based, no pre-processing)
| Use | Dimensions | Format |
|---|---|---|
| Product card | 400×400 | WebP |
| PDP main image | 800×800 | WebP |
| PDP full-screen | 1200×1200 | WebP |
| Category banner desktop | 2400×800 | WebP |
| Auth page background | 1440×900 | WebP |
| OG image | 1200×630 | JPG |

---

## 9. Payment Flow (Razorpay)

```
Customer clicks "Pay Now"
→ POST /api/checkout/create-order
   → Server validates cart (fresh DB read — never trust client price)
   → Creates Order in MongoDB (status: pending_payment)
   → Creates Razorpay order via SDK
   → Returns { razorpayOrderId, amount }

→ Client opens Razorpay modal
→ Customer pays (UPI or Card)

→ Razorpay sends webhook: POST /api/webhooks/razorpay
   → Verify HMAC-SHA256 signature
   → On payment.captured:
      → Update Order: status → confirmed, payment.status → paid
      → Decrement stock
      → Send confirmation email via Resend
      → Revalidate ISR cache for PDP (stock update)
   → On payment.failed:
      → Update Order: status → cancelled
```

**Critical rule:** Stock is decremented only after `payment.captured` — never on order creation.

---

## 10. Deployment

| Service | Provider | Plan |
|---|---|---|
| Application | Vercel | Pro (or Hobby for dev) |
| Database | MongoDB Atlas | M0 Free → M10 on scaling |
| Media CDN | Cloudinary | Free (25GB) → Paid |
| Email | Resend | Free (3000/month) → Paid |
| SMS OTP | msg91 | Pay per SMS |
| Payment | Razorpay | No monthly fee, per-transaction |

### Environment Variables Required
```
# MongoDB
MONGODB_URI

# Auth
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL

# OAuth
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET

# Cloudinary
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET          # Server only — NEVER NEXT_PUBLIC_

# Razorpay
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET            # Server only
RAZORPAY_WEBHOOK_SECRET        # Server only
NEXT_PUBLIC_RAZORPAY_KEY_ID   # Safe for browser

# Resend
RESEND_API_KEY

# msg91
MSG91_AUTH_KEY
MSG91_TEMPLATE_ID

# App
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_WHATSAPP_NUMBER   # For returns redirect
```

---

## 11. What We Are NOT Doing

| Not in Architecture | Why |
|---|---|
| Separate Express backend | One Next.js app is enough for MVP; extractable later |
| Microservices | Overkill for a jewellery startup; adds ops complexity |
| Kubernetes / Docker | Vercel handles infra; no container orchestration needed |
| Redis / queues | Not needed until order volume demands it |
| Elasticsearch | MongoDB text search is sufficient for Phase 1 catalogue |
| GraphQL | REST Route Handlers are simpler and faster to build |
| PostgreSQL / Prisma | MongoDB is the right fit for variable jewellery attributes |
