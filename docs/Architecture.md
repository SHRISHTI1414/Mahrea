# Mahrea — Technical Architecture Document

**Version:** 1.0  
**Date:** June 2026  
**Stack:** Next.js 15 · Node.js · PostgreSQL · Prisma · Cloudinary · JWT  
**Status:** Approved for Development

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [System Overview](#2-system-overview)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Authentication Strategy](#6-authentication-strategy)
7. [Image & Video Storage Strategy](#7-image--video-storage-strategy)
8. [Payment Gateway Strategy](#8-payment-gateway-strategy)
9. [Deployment Architecture](#9-deployment-architecture)
10. [Folder Structure](#10-folder-structure)
11. [API Modules](#11-api-modules)

---

## 1. Tech Stack

### Core

| Layer | Technology | Rationale |
|---|---|---|
| Frontend Framework | Next.js 15 (App Router) | SSR + ISR for SEO; React Server Components for performance; single framework for customer site and admin |
| Backend Runtime | Node.js 22 LTS (via Next.js Route Handlers) | API layer embedded in Next.js — no separate server process for V1; extractable to standalone service later |
| Language | TypeScript 5 (strict mode) | Type safety across frontend and backend; shared types prevent contract drift |
| Database | PostgreSQL 16 | Relational integrity for orders, inventory, and pricing; mature ecosystem; managed hosting available |
| ORM | Prisma 5 | Type-safe queries; migration system; works with both local dev and managed Postgres |
| Media Storage | Cloudinary | Managed image and video CDN; auto-transformation, WebP conversion, adaptive streaming for opening video |
| Authentication | JWT (Access + Refresh token) | Stateless; works across SSR and API Route Handlers; suitable for both customer and admin roles |
| Payment | Razorpay | Best Indian payment gateway — UPI, Cards, Net Banking, EMI, COD; GST-compliant order receipts |
| State Management | Zustand | Lightweight; handles cart, wishlist, and UI state on client; no boilerplate |
| Styling | Tailwind CSS 4 | Utility-first; consistent spacing and typography; pairs naturally with shadcn/ui |
| Component Base | shadcn/ui | Unstyled, accessible primitives; fully customisable to Mahrea's luxury aesthetic |
| Validation | Zod | Schema validation shared between frontend forms and API Route Handlers |
| Email | Resend + React Email | Transactional emails (order confirmation, shipping, password reset); React-rendered templates |

### Dev & Ops

| Tool | Purpose |
|---|---|
| Turborepo | Monorepo task runner — parallel builds, shared cache |
| pnpm workspaces | Package manager for monorepo |
| ESLint + Prettier | Code quality and formatting |
| Husky + lint-staged | Pre-commit hooks |
| GitHub Actions | CI/CD pipeline |
| Vercel | Frontend hosting (Next.js native) |
| Neon | Serverless PostgreSQL (managed, scales to zero) |
| Sentry | Error monitoring (frontend and backend) |

---

## 2. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAHREA PLATFORM                          │
│                                                                 │
│  ┌─────────────────────────┐   ┌─────────────────────────────┐  │
│  │   CUSTOMER SITE         │   │   ADMIN DASHBOARD           │  │
│  │   next.js 15            │   │   next.js 15                │  │
│  │   (route group: /)      │   │   (route group: /admin)     │  │
│  │   SSR + ISR + RSC       │   │   CSR only (no SEO needed)  │  │
│  └────────────┬────────────┘   └──────────────┬──────────────┘  │
│               │                               │                 │
│               └──────────────┬────────────────┘                 │
│                              │                                  │
│                    ┌─────────▼──────────┐                       │
│                    │   API LAYER        │                       │
│                    │   Next.js Route    │                       │
│                    │   Handlers /api/*  │                       │
│                    │   Node.js runtime  │                       │
│                    └────┬──────┬────────┘                       │
│                         │      │                                │
│              ┌──────────▼──┐  ┌▼────────────┐                  │
│              │  PostgreSQL  │  │  Cloudinary  │                 │
│              │  via Prisma  │  │  (media CDN) │                 │
│              └─────────────┘  └─────────────┘                  │
│                                                                 │
│  External Services:  Razorpay · Resend · Sentry                 │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Decision: Monolithic Next.js for V1

The API layer lives inside the Next.js app as Route Handlers (`/app/api/`). This is Node.js running in the Next.js runtime. The decision to not run a separate Express server is deliberate for V1:

- **Zero additional infrastructure** to manage at launch.
- **Shared Prisma client** between RSC data fetching and Route Handlers — no duplication.
- **Extractable:** the `/app/api/` directory maps 1:1 to a standalone Express app. If traffic demands it, Route Handlers can be moved to a separate Node.js service without touching business logic.

The single Next.js app hosts both the customer site and the admin dashboard under separate route groups with separate layouts and middleware guards.

---

## 3. Frontend Architecture

### 3.1 Rendering Strategy per Page Type

| Page Type | Rendering Method | Why |
|---|---|---|
| Homepage | ISR (revalidate: 3600s) | SEO critical; content changes infrequently; cache invalidated on admin content update |
| Category listing pages | ISR (revalidate: 1800s) | SEO critical; product grid data changes when stock or products update |
| Product Detail Page | ISR (revalidate: 900s) + on-demand revalidation | SEO critical; price and stock can change — revalidate on admin update |
| Search results | SSR | Dynamic per query; cannot be cached statically |
| Cart | Client-side only | Personalised; no SEO value; real-time stock check at checkout |
| Checkout | SSR | Requires session; price must be server-confirmed |
| Order confirmation | SSR | Session-authenticated; unique per order |
| Account pages | SSR | Authenticated; personalised |
| Admin dashboard | Client-side (CSR) | Authenticated; no SEO; data always live |
| Legal / About / Contact | Static (build time) | Content never changes between deploys |
| 404 / 500 | Static | |

### 3.2 Route Structure (App Router)

```
app/
├── (customer)/                  ← Route group: customer layout
│   ├── layout.tsx               ← Navbar, footer, cart drawer, video entry wrapper
│   ├── page.tsx                 ← Homepage (ISR)
│   ├── [category]/
│   │   ├── page.tsx             ← Category listing (ISR)
│   │   └── [slug]/
│   │       └── page.tsx         ← Product Detail Page (ISR)
│   ├── search/
│   │   └── page.tsx             ← Search results (SSR)
│   ├── cart/
│   │   └── page.tsx             ← Cart (CSR)
│   ├── checkout/
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← Checkout step 1: address
│   │   ├── shipping/page.tsx    ← Step 2: shipping + review
│   │   └── payment/page.tsx     ← Step 3: payment
│   ├── order/
│   │   └── confirmation/
│   │       └── [orderId]/page.tsx
│   ├── account/
│   │   ├── layout.tsx           ← Account sidebar layout
│   │   ├── page.tsx             ← Overview
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [orderId]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── addresses/page.tsx
│   │   └── profile/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── legal/
│       ├── privacy-policy/page.tsx
│       ├── terms/page.tsx
│       ├── returns/page.tsx
│       └── shipping/page.tsx
├── (auth)/                      ← Route group: minimal auth layout (no nav/footer)
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/[token]/page.tsx
├── (admin)/                     ← Route group: admin layout
│   ├── layout.tsx               ← Admin sidebar, top bar, auth guard
│   └── admin/
│       ├── page.tsx             ← Dashboard overview
│       ├── products/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       ├── inventory/
│       │   ├── page.tsx
│       │   └── alerts/page.tsx
│       ├── pricing/
│       │   ├── page.tsx
│       │   └── bulk/page.tsx
│       ├── orders/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── customers/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── content/
│       │   ├── homepage/page.tsx
│       │   └── banners/page.tsx
│       └── settings/
│           ├── users/page.tsx
│           ├── platform/page.tsx
│           └── audit-log/page.tsx
├── api/                         ← All API Route Handlers (see Section 11)
├── not-found.tsx                ← 404
├── error.tsx                    ← 500
├── loading.tsx                  ← Global loading skeleton
└── layout.tsx                   ← Root layout (fonts, metadata, providers)
```

### 3.3 Component Architecture

Components are separated by concern, not by page:

```
components/
├── ui/                 ← shadcn/ui base components (button, input, dialog, etc.)
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CartDrawer.tsx
│   └── AdminSidebar.tsx
├── home/
│   ├── VideoEntry.tsx          ← Opening video with skip logic
│   ├── HeroSection.tsx
│   ├── FeaturedCollections.tsx
│   ├── NewArrivals.tsx
│   └── PromoBanner.tsx
├── catalogue/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── FilterPanel.tsx
│   ├── SortDropdown.tsx
│   ├── CategoryHero.tsx
│   └── Pagination.tsx
├── product/
│   ├── ImageGallery.tsx
│   ├── ProductInfo.tsx
│   ├── SizeSelector.tsx
│   ├── StockBadge.tsx
│   ├── TrustBadges.tsx
│   └── RelatedProducts.tsx
├── cart/
│   ├── CartItem.tsx
│   └── CartSummary.tsx
├── checkout/
│   ├── AddressForm.tsx
│   ├── ShippingSelector.tsx
│   ├── PaymentPanel.tsx
│   └── OrderSummary.tsx
├── account/
│   ├── AccountNav.tsx
│   ├── OrderCard.tsx
│   └── AddressCard.tsx
├── admin/
│   ├── StatsCard.tsx
│   ├── DataTable.tsx
│   ├── ProductForm.tsx
│   ├── OrderTimeline.tsx
│   ├── ImageUploader.tsx
│   └── RichTextEditor.tsx
└── shared/
    ├── Breadcrumb.tsx
    ├── EmptyState.tsx
    └── ErrorBoundary.tsx
```

### 3.4 State Management

| State | Tool | Scope |
|---|---|---|
| Cart (items, quantity, total) | Zustand + localStorage | Client-wide; persisted locally; synced to server on login |
| Wishlist | Zustand + API sync | Client-wide; synced to DB for logged-in users |
| Opening video seen | sessionStorage | Per-session; checked before rendering VideoEntry |
| Admin filter/sort state | Zustand | Admin session; not persisted |
| Server data | React Server Components + `cache()` | Fetched server-side; no client store needed |
| Auth state (user, role) | Zustand (hydrated from cookie) | Client-wide; token in httpOnly cookie |

### 3.5 SEO Architecture

- All customer-facing pages export a `generateMetadata()` function.
- Product pages include JSON-LD: `Product` schema with `name`, `image`, `price`, `availability`, `brand`.
- Category pages include `BreadcrumbList` JSON-LD.
- `sitemap.ts` in the app root generates an XML sitemap from the database (products + categories).
- `robots.ts` blocks `/admin/*`, `/api/*`, `/account/*`, `/checkout/*`.
- Canonical tags handled by Next.js `metadata.alternates.canonical`.
- `next/image` used for all images — automatic WebP, responsive srcset, lazy load.

---

## 4. Backend Architecture

### 4.1 API Layer (Next.js Route Handlers)

All API endpoints live under `app/api/`. Each Route Handler follows the same pattern:

```
Request → Middleware Chain → Handler → Response
             │
             ├── Rate Limiter (Upstash Redis)
             ├── Auth Guard (JWT verify + role check)
             ├── Input Validation (Zod)
             └── Error Normaliser
```

There is no Express — Next.js Route Handlers run on Node.js and are functionally identical. They can be extracted to Express handlers with minimal changes if a separate backend is ever needed.

### 4.2 Middleware

Next.js `middleware.ts` at the root runs on every request before it hits a Route Handler or page:

| Concern | What it does |
|---|---|
| Admin route guard | Verifies admin JWT; redirects to `/admin/login` if invalid |
| Customer auth check | Soft check — does not redirect, passes auth state to page |
| Rate limiting | Applied to `/api/auth/*` and `/api/payments/*` routes |
| CSRF | SameSite=Strict on cookies + custom header check on state-mutating requests |
| Security headers | X-Frame-Options, CSP, X-Content-Type-Options |

### 4.3 Service Layer Pattern

Business logic is not written inside Route Handlers. Route Handlers are thin — they validate input and call a service function:

```
app/api/orders/route.ts
  └── calls lib/services/order.service.ts
        └── calls lib/repositories/order.repository.ts (Prisma queries)
              └── returns typed result to service
                    └── service returns to Route Handler
                          └── Route Handler serialises to JSON response
```

This three-layer separation (Handler → Service → Repository) means:

- Services are testable without HTTP.
- Prisma queries are centralised in repositories.
- When the API is extracted to a standalone Express server, only the Route Handler wrapper changes.

### 4.4 Error Handling

All Route Handlers are wrapped in a single `withErrorHandler` wrapper that:

- Catches `ZodError` → returns 400 with field-level validation messages.
- Catches `PrismaClientKnownRequestError` → maps to 404, 409, etc.
- Catches `UnauthorisedError` (custom) → returns 401.
- Catches `ForbiddenError` (custom) → returns 403.
- Catches anything else → logs to Sentry, returns 500 with a safe message.
- Never leaks stack traces or Prisma error details to the client.

### 4.5 Webhooks

External services POST to Mahrea webhooks. These handlers are exempt from customer auth middleware but verify their own signatures:

| Endpoint | Source | Verification |
|---|---|---|
| `/api/webhooks/razorpay` | Razorpay payment events | HMAC-SHA256 signature header |
| `/api/webhooks/shiprocket` | Shipping status updates | API key header |

---

## 5. Database Architecture

### 5.1 Schema Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│     User      │────<│    Order     │>────│    OrderItem     │
│  (customers + │     │              │     │                  │
│   admins)     │     └──────┬───────┘     └────────┬─────────┘
└──────┬────────┘            │                      │
       │                     │                      │
       │              ┌──────▼───────┐       ┌──────▼─────────┐
       │              │   Payment    │       │    Product      │
       │              └──────────────┘       │                │
       │                                     └──┬─────────────┘
  ┌────▼──────────┐                             │
  │    Address    │                    ┌─────────▼──────────┐
  └───────────────┘                    │   ProductImage     │
                                       └────────────────────┘
  ┌───────────────┐                    ┌────────────────────┐
  │    Cart       │────────────────────│   ProductVariant   │
  │  + CartItem   │                    └────────────────────┘
  └───────────────┘
                                       ┌────────────────────┐
  ┌───────────────┐                    │     Category       │
  │   Wishlist    │                    └────────────────────┘
  │ + WishlistItem│
  └───────────────┘                    ┌────────────────────┐
                                       │    Inventory       │
  ┌───────────────┐                    └────────────────────┘
  │    Coupon     │
  └───────────────┘                    ┌────────────────────┐
                                       │  HomepageContent   │
  ┌───────────────┐                    └────────────────────┘
  │   AuditLog    │
  └───────────────┘                    ┌────────────────────┐
                                       │  CategoryBanner    │
                                       └────────────────────┘
```

### 5.2 Core Table Definitions (Prisma Schema)

#### Users

```
User
  id            UUID (PK)
  email         String (unique)
  phone         String?
  passwordHash  String
  firstName     String
  lastName      String
  role          Enum: CUSTOMER | ADMIN | SUPER_ADMIN
  isActive      Boolean (default: true)
  isFlagged     Boolean (default: false)       ← fraud flag, set by admin
  createdAt     DateTime
  updatedAt     DateTime
  lastLoginAt   DateTime?

  relations: orders, addresses, cart, wishlist, refreshTokens, auditLogs
```

#### RefreshToken (for JWT rotation)

```
RefreshToken
  id          UUID (PK)
  token       String (unique, hashed)
  userId      UUID (FK → User)
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime
```

#### Category

```
Category
  id          UUID (PK)
  name        String (unique)               ← "rings", "bracelets", etc.
  slug        String (unique)
  displayName String
  description String?
  isActive    Boolean (default: true)
  sortOrder   Int
  bannerId    UUID? (FK → CategoryBanner)
  createdAt   DateTime

  relations: products, banner
```

#### Product

```
Product
  id              UUID (PK)
  name            String
  slug            String (unique)
  sku             String (unique)
  categoryId      UUID (FK → Category)
  description     String (rich text HTML, sanitised on write)
  material        Enum: GOLD | SILVER | PLATINUM | ROSE_GOLD | OTHER
  purity          String?                  ← "22KT", "925", "18KT", etc.
  weightGrams     Decimal
  isHallmarked    Boolean (default: false)
  taxClass        Enum: GST_3 | GST_5      ← 3% gold, 5% diamonds
  status          Enum: DRAFT | PUBLISHED | UNPUBLISHED
  isFeatured      Boolean (default: false)
  isNewArrival    Boolean (default: false)
  metaTitle       String?
  metaDescription String?
  createdAt       DateTime
  updatedAt       DateTime

  relations: images, variants, inventory, orderItems, wishlistItems, cartItems, stoneDetails
```

#### ProductImage

```
ProductImage
  id            UUID (PK)
  productId     UUID (FK → Product)
  cloudinaryId  String                ← Cloudinary public_id
  url           String                ← Cloudinary delivery URL
  altText       String?
  isPrimary     Boolean (default: false)
  sortOrder     Int
```

#### ProductVariant

```
ProductVariant
  id        UUID (PK)
  productId UUID (FK → Product)
  size      String                    ← "6", "7", "M", "Free Size"
  sku       String (unique)           ← variant-level SKU
```

#### StoneDetail

```
StoneDetail
  id          UUID (PK)
  productId   UUID (FK → Product)
  stoneType   Enum: DIAMOND | RUBY | EMERALD | PEARL | SAPPHIRE | OTHER
  caratWeight Decimal?
  cut         String?
```

#### Inventory

```
Inventory
  id                  UUID (PK)
  productId           UUID (FK → Product, unique)
  variantId           UUID? (FK → ProductVariant, unique)
  quantity            Int
  lowStockThreshold   Int (default: 5)
  updatedAt           DateTime

  relations: adjustmentLogs
```

#### StockAdjustmentLog

```
StockAdjustmentLog
  id            UUID (PK)
  inventoryId   UUID (FK → Inventory)
  adminId       UUID (FK → User)
  previousQty   Int
  newQty        Int
  reason        String
  createdAt     DateTime
```

#### Pricing

```
Pricing
  id          UUID (PK)
  productId   UUID (FK → Product, unique)
  basePrice   Int                    ← stored in PAISE (integer, never float)
  salePrice   Int?                   ← null = no active sale
  saleActive  Boolean (default: false)
  updatedAt   DateTime
  updatedById UUID (FK → User)
```

> **Why paise?** Floating-point arithmetic on prices causes rounding errors. Store as integers (100 = ₹1.00), divide by 100 only for display.

#### Order

```
Order
  id              UUID (PK)
  orderNumber     String (unique, human-readable: "MHR-2026-00042")
  customerId      UUID (FK → User)
  addressId       UUID (FK → Address, snapshot copied to order)
  status          Enum: PENDING_PAYMENT | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUND_REQUESTED | REFUNDED
  subtotal        Int (paise)
  discountAmount  Int (paise, default: 0)
  shippingCharge  Int (paise)
  taxAmount       Int (paise)
  total           Int (paise)
  couponId        UUID? (FK → Coupon)
  trackingNumber  String?
  courierName     String?
  internalNote    String?
  createdAt       DateTime
  updatedAt       DateTime

  relations: items, payment, statusHistory, refund
```

#### OrderItem

```
OrderItem
  id          UUID (PK)
  orderId     UUID (FK → Order)
  productId   UUID (FK → Product)
  variantId   UUID? (FK → ProductVariant)
  productName String                 ← snapshot at time of order
  sku         String                 ← snapshot
  unitPrice   Int (paise)            ← snapshot
  quantity    Int
  lineTotal   Int (paise)
  imageUrl    String                 ← snapshot
```

#### OrderStatusHistory

```
OrderStatusHistory
  id          UUID (PK)
  orderId     UUID (FK → Order)
  fromStatus  OrderStatus?
  toStatus    OrderStatus
  changedById UUID (FK → User)       ← admin who made the change
  note        String?
  createdAt   DateTime
```

#### Payment

```
Payment
  id                UUID (PK)
  orderId           UUID (FK → Order, unique)
  razorpayOrderId   String (unique)
  razorpayPaymentId String?
  method            Enum: UPI | CARD | NET_BANKING | COD | EMI
  status            Enum: PENDING | PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED
  amount            Int (paise)
  paidAt            DateTime?
  rawWebhookData    JSON             ← full Razorpay payload, audit only
```

#### Address

```
Address
  id          UUID (PK)
  userId      UUID (FK → User)
  label       String?               ← "Home", "Office"
  fullName    String
  phone       String
  line1       String
  line2       String?
  city        String
  state       String
  pincode     String
  country     String (default: "India")
  isDefault   Boolean (default: false)
```

#### Cart + CartItem

```
Cart
  id        UUID (PK)
  userId    UUID? (FK → User, nullable for guest cart)
  guestId   String?                 ← UUID in cookie for guest carts
  createdAt DateTime
  updatedAt DateTime

CartItem
  id        UUID (PK)
  cartId    UUID (FK → Cart)
  productId UUID (FK → Product)
  variantId UUID? (FK → ProductVariant)
  quantity  Int
```

#### Wishlist + WishlistItem

```
Wishlist
  id     UUID (PK)
  userId UUID (FK → User, unique)

WishlistItem
  id        UUID (PK)
  wishlistId UUID (FK → Wishlist)
  productId  UUID (FK → Product)
  addedAt    DateTime
```

#### Coupon

```
Coupon
  id              UUID (PK)
  code            String (unique, uppercase)
  type            Enum: PERCENTAGE | FIXED_AMOUNT
  value           Int                ← % or paise
  minOrderValue   Int? (paise)
  maxUses         Int?
  usedCount       Int (default: 0)
  expiresAt       DateTime?
  isActive        Boolean
  createdAt       DateTime
```

#### HomepageContent

```
HomepageContent
  id              UUID (PK)
  section         Enum: HERO | PROMO_BANNER | BRAND_STORY | NEW_ARRIVALS_CONFIG
  data            JSON               ← flexible per section (headline, image URL, CTA, etc.)
  status          Enum: DRAFT | PUBLISHED
  updatedAt       DateTime
  updatedById     UUID (FK → User)
```

#### CategoryBanner

```
CategoryBanner
  id            UUID (PK)
  categoryId    UUID (FK → Category, unique)
  cloudinaryId  String
  imageUrl      String
  altText       String
  updatedAt     DateTime
```

#### AuditLog

```
AuditLog
  id         UUID (PK)
  adminId    UUID (FK → User)
  action     String               ← "PRODUCT_CREATED", "PRICE_UPDATED", etc.
  entityType String               ← "Product", "Order", "Coupon"
  entityId   UUID
  before     JSON?
  after      JSON?
  ip         String
  createdAt  DateTime
```

### 5.3 Indexing Strategy

| Table | Columns to Index | Reason |
|---|---|---|
| Product | `slug`, `categoryId`, `status`, `isFeatured`, `isNewArrival` | Listing, PDP lookup, homepage queries |
| Order | `customerId`, `status`, `createdAt`, `orderNumber` | Customer order history, admin filters |
| OrderItem | `orderId`, `productId` | Order detail, product sales reporting |
| Inventory | `productId`, `variantId` | Stock checks on every add-to-cart |
| Cart | `userId`, `guestId` | Cart lookup on every page load |
| AuditLog | `adminId`, `entityType`, `createdAt` | Audit log pagination |
| RefreshToken | `token`, `userId`, `expiresAt` | Token validation on every authenticated request |

### 5.4 Database Conventions

- All primary keys: UUID v4 (generated by Prisma `@default(uuid())`).
- All tables have `createdAt` and `updatedAt` (auto-managed by Prisma `@updatedAt`).
- Soft deletes for Products and Users via `deletedAt DateTime?` — never hard delete customer or product data.
- Prices always stored in paise (integer). Display layer divides by 100.
- All user-supplied HTML (product descriptions) sanitised with `DOMPurify` before write. Stored as HTML string, rendered with `dangerouslySetInnerHTML` (safe — already sanitised server-side).
- No cascade deletes. Foreign key violations surface as errors, not silent data loss.

---

## 6. Authentication Strategy

### 6.1 Token Architecture

Two-token pattern to balance security and UX:

| Token | Lifetime | Storage | Purpose |
|---|---|---|---|
| Access Token (JWT) | 15 minutes | httpOnly cookie | Authorises API requests |
| Refresh Token | 7 days (customer) / 24 hours (admin) | httpOnly cookie (separate) | Issues new access tokens |

**Why httpOnly cookies, not localStorage?**  
XSS attacks cannot read httpOnly cookies. localStorage is accessible to any JavaScript on the page, making it vulnerable if a third-party script is compromised. For a payments site this is non-negotiable.

### 6.2 Token Payload

```
Access Token Payload:
{
  sub: "user-uuid",
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN",
  email: "user@example.com",
  iat: 1234567890,
  exp: 1234568790
}
```

No sensitive data (price, address, payment info) in the token payload. Only identity and role.

### 6.3 Authentication Flow

```
LOGIN REQUEST
     │
     ▼
Verify email + bcrypt.compare(password, hash)
     │
     ├── FAIL → Return 401 (increment failed attempt counter in DB)
     │           After 5 fails → lock account for 15 min
     │
     └── PASS →
           ├── Generate Access Token (JWT, signed with ACCESS_SECRET)
           ├── Generate Refresh Token (random UUID, store hashed in DB)
           ├── Set both as httpOnly, Secure, SameSite=Strict cookies
           └── Return user profile (no tokens in response body)


TOKEN REFRESH (every 15 min, triggered by 401 response)
     │
     ▼
Read refresh token cookie
     │
     ├── Validate: exists, not expired, not revoked
     │
     └── PASS →
           ├── Revoke old refresh token (token rotation)
           ├── Generate new Access Token
           ├── Generate new Refresh Token (stored hashed)
           └── Set both cookies


LOGOUT
     │
     ▼
Revoke refresh token in DB (set revokedAt)
Clear both cookies
```

### 6.4 Admin vs. Customer Auth

| Aspect | Customer | Admin |
|---|---|---|
| Login URL | `/login` | `/admin/login` |
| Refresh token TTL | 7 days | 24 hours |
| Inactivity timeout | 30 days (re-login if refresh expired) | 30 minutes (middleware check) |
| Role check | Middleware for `/account/*` routes | Middleware for all `/admin/*` routes; role ADMIN or SUPER_ADMIN required |
| 2FA | Optional (Phase 2) | Optional TOTP for SUPER_ADMIN (Phase 2) |

### 6.5 Password Security

- Hashed with `bcrypt`, cost factor 12.
- Minimum password requirements enforced by Zod at the API layer.
- Password reset: time-limited token (1 hour), stored hashed in DB, single-use.
- Forgot password email sent via Resend; never discloses whether email exists (always returns "if this email is registered, you'll receive an email").

### 6.6 API Route Protection Pattern

Every protected Route Handler uses a `requireAuth(role?)` middleware that:

1. Reads the access token cookie.
2. Verifies the JWT signature and expiry.
3. Checks that the user's role meets the minimum required role.
4. Attaches `req.user` to the request context.
5. Returns 401 or 403 if any check fails.

---

## 7. Image & Video Storage Strategy

### 7.1 Cloudinary Account Structure

```
Mahrea Cloudinary root/
├── products/
│   └── {product-id}/
│       ├── primary.jpg
│       ├── gallery-1.jpg
│       └── gallery-2.jpg
├── banners/
│   ├── homepage-hero.jpg
│   ├── promo-banner.jpg
│   └── categories/
│       ├── rings.jpg
│       ├── bracelets.jpg
│       └── ...
├── content/
│   ├── brand-story.jpg
│   └── about.jpg
├── video/
│   └── opening-brand-film.mp4
└── icons/
    └── (static, versioned)
```

### 7.2 Image Upload Flow (Admin)

Admin never uploads directly from the browser to Cloudinary using the API secret. The flow uses signed uploads:

```
Admin selects image
      │
      ▼
Browser requests signed upload params from: POST /api/admin/upload/sign
      │
      ▼
Server generates: { signature, timestamp, api_key, folder, upload_preset }
using CLOUDINARY_API_SECRET (server-only env var)
      │
      ▼
Browser POSTs image directly to Cloudinary using signed params
      │
      ▼
Cloudinary returns { public_id, secure_url }
      │
      ▼
Browser sends { public_id, secure_url } to: POST /api/admin/products/[id]/images
      │
      ▼
Server saves to ProductImage table
```

The `CLOUDINARY_API_SECRET` never leaves the server.

### 7.3 Image Transformation Strategy

Cloudinary transformations are applied via URL parameters — no pre-processing needed. Transformation presets:

| Preset | Dimensions | Format | Quality | Usage |
|---|---|---|---|---|
| `thumb` | 300×300 | WebP | auto | Product card grid |
| `medium` | 600×600 | WebP | auto | PDP thumbnail strip |
| `large` | 1200×1200 | WebP | auto | PDP main image |
| `og` | 1200×630 | JPG | 80 | Open Graph / social share |
| `banner_desktop` | 2400×800 | WebP | auto | Category hero desktop |
| `banner_mobile` | 800×600 | WebP | auto | Category hero mobile |

`next/image` handles responsive delivery automatically when given the Cloudinary base URL. Set `remotePatterns` in `next.config.ts` to allow `res.cloudinary.com`.

### 7.4 Opening Video Strategy

The brand intro video requires special handling:

| Concern | Solution |
|---|---|
| File hosted | Cloudinary Video (not self-hosted — CDN edge delivery) |
| Format | MP4 (H.264) + WebM fallback |
| Autoplay | Muted by default (browser policy compliance) |
| First load | Preload `metadata` only on page load; start streaming on video entry |
| Session control | `sessionStorage.setItem('videoSeen', 'true')` after skip or completion; checked before rendering the entry screen |
| Admin swap | Admin uploads new video via signed Cloudinary upload; URL saved in `HomepageContent` table (section: HERO_VIDEO); no deployment needed |
| Mobile | Same video, same Cloudinary URL; Cloudinary serves adaptive bitrate based on connection speed |
| Poster frame | Static JPG extracted from video frame 1, set as `poster` attribute; loads instantly while video buffers |

### 7.5 Alt Text and Accessibility

- Every `ProductImage` record has an `altText` field. Admin is required to fill this when uploading.
- Default fallback: `{productName} - {material} {category}` (auto-generated if admin leaves blank).
- All `next/image` uses this `altText`. No decorative-only images skip alt text.

---

## 8. Payment Gateway Strategy

### 8.1 Gateway: Razorpay

Razorpay is the only payment gateway for V1. It supports all payment methods required by the PRD (UPI, Cards, Net Banking, EMI, COD), generates GST-compliant order receipts, and has a well-documented Node.js SDK.

### 8.2 Payment Flow

```
Customer clicks "Pay Now"
      │
      ▼
POST /api/checkout/create-order
   ├── Server validates cart (stock, pricing — fresh DB read, never trust client)
   ├── Creates Order record (status: PENDING_PAYMENT)
   ├── Creates Razorpay Order via SDK: razorpay.orders.create({ amount, currency, receipt })
   └── Returns: { razorpayOrderId, amount, currency, keyId }

      │
      ▼
Client opens Razorpay Checkout modal (using razorpayOrderId)
Customer completes payment on Razorpay UI

      │
      ▼
Razorpay calls: POST /api/webhooks/razorpay
   ├── Verify HMAC-SHA256 signature (using RAZORPAY_WEBHOOK_SECRET)
   ├── On payment.captured:
   │     ├── Verify razorpay_payment_id + razorpay_order_id + razorpay_signature
   │     ├── Update Payment record (status: PAID, razorpayPaymentId)
   │     ├── Update Order status: PENDING_PAYMENT → CONFIRMED
   │     ├── Decrement Inventory quantities
   │     ├── Clear Cart
   │     └── Send order confirmation email via Resend
   └── On payment.failed:
         └── Update Order status → CANCELLED, Payment status → FAILED
```

**Critical rule:** Stock is decremented only after `payment.captured` webhook is received, not before. This prevents inventory being held for abandoned payments.

### 8.3 Refund Flow

```
Admin initiates refund from Order Detail page
      │
      ▼
POST /api/admin/orders/[id]/refund  { amount, reason }
   ├── Validate: order is DELIVERED or CONFIRMED; refund amount ≤ total paid
   ├── Call: razorpay.payments.refund(razorpayPaymentId, { amount, notes })
   ├── Update Order status: REFUND_REQUESTED → REFUNDED
   ├── Update Payment status: REFUNDED | PARTIALLY_REFUNDED
   └── Send refund confirmation email to customer
```

### 8.4 Security Rules

- Razorpay `key_id` (public) is safe to expose to the frontend.
- Razorpay `key_secret` and `webhook_secret` are server-only environment variables — never in client-side code.
- Payment amount is always calculated server-side on order creation. Client sends cart ID, not price.
- Razorpay order ID is single-use. A new order is created for each checkout attempt.
- All webhook events are idempotent — processing the same `payment.captured` event twice must not create duplicate orders.

### 8.5 COD (Cash on Delivery)

- COD orders skip Razorpay entirely.
- Order is created directly with status `CONFIRMED`.
- Payment record is created with `method: COD`, `status: PENDING`.
- Admin marks payment collected manually; payment status updated to `PAID`.
- COD can be enabled or disabled per order value threshold in Platform Settings.

---

## 9. Deployment Architecture

### 9.1 Infrastructure

| Service | Provider | Purpose |
|---|---|---|
| Next.js App | Vercel | Frontend hosting, Edge Network, ISR cache, automatic SSL |
| PostgreSQL | Neon | Serverless managed Postgres; scales to zero; point-in-time recovery |
| Media CDN | Cloudinary | Image and video delivery; transformation; adaptive streaming |
| Email | Resend | Transactional email delivery |
| Error Monitoring | Sentry | Frontend + API errors with stack traces |
| Rate Limiting | Upstash Redis | Serverless Redis for rate limit counters (login, API) |

**Why Vercel for Next.js?** Vercel built Next.js. ISR, on-demand revalidation, middleware, and Edge Functions work without any configuration. No ops burden at launch.

**Why Neon for Postgres?** Neon is serverless Postgres — it scales to zero between requests (no cost when idle), branches the database like Git (useful for staging), and connects to Vercel with a single environment variable.

### 9.2 Environment Tiers

| Tier | Branch | Database | Purpose |
|---|---|---|---|
| Production | `main` | Neon `main` branch | Live site |
| Staging | `staging` | Neon `staging` branch | Pre-release testing; mirrors production |
| Development | `*` (PR) | Neon PR branch (auto-created) | Per-PR preview with isolated database |
| Local | — | Local Postgres or Neon dev | Developer machines |

Vercel automatically creates a preview deployment for every PR. Neon creates a database branch per PR. This means each PR gets a fully isolated full-stack environment.

### 9.3 Environment Variables

All secrets managed in Vercel's environment variable system:

```
# Database
DATABASE_URL                  ← Neon connection string (pooled)
DATABASE_URL_UNPOOLED         ← Neon direct connection (for migrations)

# Auth
JWT_ACCESS_SECRET             ← 256-bit random string
JWT_REFRESH_SECRET            ← Different 256-bit random string

# Cloudinary
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET         ← Server only (never NEXT_PUBLIC_)

# Razorpay
RAZORPAY_KEY_ID               ← Also exposed as NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET           ← Server only
RAZORPAY_WEBHOOK_SECRET       ← Server only

# Resend
RESEND_API_KEY

# Upstash (rate limiting)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN

# Sentry
SENTRY_DSN
NEXT_PUBLIC_SENTRY_DSN

# App
NEXT_PUBLIC_APP_URL           ← "https://mahrea.in"
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

`NEXT_PUBLIC_` prefix exposes a variable to the browser. Everything without it is server-only.

### 9.4 CI/CD Pipeline

```
Developer pushes to feature branch
      │
      ▼
GitHub Actions: CI
   ├── pnpm install
   ├── Type check (tsc --noEmit)
   ├── Lint (eslint)
   └── Run tests (vitest)

      │ Pass
      ▼
Vercel: Preview Deployment
   ├── Build Next.js app
   ├── Run Prisma migrations on Neon PR branch
   └── Deploy to preview URL (shared with PR)

      │ PR approved + merged to staging
      ▼
Vercel: Staging Deployment → staging.mahrea.in

      │ QA sign-off
      ▼
Merge staging → main
      │
      ▼
Vercel: Production Deployment
   ├── Zero-downtime deployment
   ├── Run Prisma migrations on Neon main
   └── Purge ISR cache for updated content
```

### 9.5 ISR Cache Invalidation

When admin updates a product, price, or homepage content, the corresponding ISR-cached page must be revalidated. This is done using Next.js on-demand revalidation:

- Admin saves product → API calls `revalidatePath('/rings')` and `revalidatePath('/rings/[product-slug]')`.
- Admin saves homepage content → API calls `revalidatePath('/')`.
- Admin updates category banner → API calls `revalidatePath('/[category]')`.

No rebuild needed — the cache is surgically purged.

---

## 10. Folder Structure

```
mahrea/                                  ← Monorepo root
├── apps/
│   └── web/                             ← Next.js 15 application
│       ├── app/                         ← App Router root
│       │   ├── (customer)/              ← Customer route group
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx             ← Homepage
│       │   │   ├── [category]/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [slug]/page.tsx
│       │   │   ├── search/page.tsx
│       │   │   ├── cart/page.tsx
│       │   │   ├── checkout/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── shipping/page.tsx
│       │   │   │   └── payment/page.tsx
│       │   │   ├── order/confirmation/[orderId]/page.tsx
│       │   │   ├── account/
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── orders/
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [orderId]/page.tsx
│       │   │   │   ├── wishlist/page.tsx
│       │   │   │   ├── addresses/page.tsx
│       │   │   │   └── profile/page.tsx
│       │   │   ├── about/page.tsx
│       │   │   ├── contact/page.tsx
│       │   │   └── legal/
│       │   │       ├── privacy-policy/page.tsx
│       │   │       ├── terms/page.tsx
│       │   │       ├── returns/page.tsx
│       │   │       └── shipping/page.tsx
│       │   ├── (auth)/                  ← Auth route group (no nav/footer)
│       │   │   ├── layout.tsx
│       │   │   ├── login/page.tsx
│       │   │   ├── register/page.tsx
│       │   │   ├── forgot-password/page.tsx
│       │   │   └── reset-password/[token]/page.tsx
│       │   ├── (admin)/                 ← Admin route group
│       │   │   ├── layout.tsx           ← Admin sidebar + topbar
│       │   │   └── admin/
│       │   │       ├── page.tsx         ← Dashboard
│       │   │       ├── products/
│       │   │       │   ├── page.tsx
│       │   │       │   ├── new/page.tsx
│       │   │       │   └── [id]/edit/page.tsx
│       │   │       ├── inventory/
│       │   │       │   ├── page.tsx
│       │   │       │   └── alerts/page.tsx
│       │   │       ├── pricing/
│       │   │       │   ├── page.tsx
│       │   │       │   └── bulk/page.tsx
│       │   │       ├── orders/
│       │   │       │   ├── page.tsx
│       │   │       │   └── [id]/page.tsx
│       │   │       ├── customers/
│       │   │       │   ├── page.tsx
│       │   │       │   └── [id]/page.tsx
│       │   │       ├── content/
│       │   │       │   ├── homepage/page.tsx
│       │   │       │   └── banners/page.tsx
│       │   │       └── settings/
│       │   │           ├── users/page.tsx
│       │   │           ├── platform/page.tsx
│       │   │           └── audit-log/page.tsx
│       │   ├── api/                     ← Route Handlers (API layer)
│       │   │   ├── auth/
│       │   │   │   ├── register/route.ts
│       │   │   │   ├── login/route.ts
│       │   │   │   ├── logout/route.ts
│       │   │   │   ├── refresh/route.ts
│       │   │   │   ├── me/route.ts
│       │   │   │   ├── forgot-password/route.ts
│       │   │   │   └── reset-password/route.ts
│       │   │   ├── products/
│       │   │   │   ├── route.ts         ← GET (list)
│       │   │   │   └── [id]/
│       │   │   │       ├── route.ts     ← GET (single)
│       │   │   │       └── images/route.ts
│       │   │   ├── categories/
│       │   │   │   └── route.ts
│       │   │   ├── search/route.ts
│       │   │   ├── cart/
│       │   │   │   ├── route.ts
│       │   │   │   └── [itemId]/route.ts
│       │   │   ├── wishlist/
│       │   │   │   ├── route.ts
│       │   │   │   └── [productId]/route.ts
│       │   │   ├── coupons/
│       │   │   │   └── validate/route.ts
│       │   │   ├── checkout/
│       │   │   │   └── create-order/route.ts
│       │   │   ├── orders/
│       │   │   │   ├── route.ts
│       │   │   │   └── [id]/route.ts
│       │   │   ├── admin/
│       │   │   │   ├── products/
│       │   │   │   │   ├── route.ts
│       │   │   │   │   └── [id]/route.ts
│       │   │   │   ├── inventory/
│       │   │   │   │   ├── route.ts
│       │   │   │   │   └── [id]/adjust/route.ts
│       │   │   │   ├── pricing/
│       │   │   │   │   ├── route.ts
│       │   │   │   │   ├── [productId]/route.ts
│       │   │   │   │   └── bulk/route.ts
│       │   │   │   ├── orders/
│       │   │   │   │   ├── route.ts
│       │   │   │   │   ├── [id]/route.ts
│       │   │   │   │   ├── [id]/status/route.ts
│       │   │   │   │   └── [id]/refund/route.ts
│       │   │   │   ├── customers/
│       │   │   │   │   ├── route.ts
│       │   │   │   │   └── [id]/route.ts
│       │   │   │   ├── content/
│       │   │   │   │   ├── homepage/route.ts
│       │   │   │   │   └── banners/[categoryId]/route.ts
│       │   │   │   ├── upload/sign/route.ts
│       │   │   │   └── settings/
│       │   │   │       ├── users/route.ts
│       │   │   │       ├── platform/route.ts
│       │   │   │       └── audit-log/route.ts
│       │   │   └── webhooks/
│       │   │       └── razorpay/route.ts
│       │   ├── not-found.tsx
│       │   ├── error.tsx
│       │   ├── loading.tsx
│       │   ├── layout.tsx
│       │   ├── sitemap.ts
│       │   └── robots.ts
│       ├── components/                  ← UI components (see Section 3.3)
│       ├── lib/
│       │   ├── auth/
│       │   │   ├── jwt.ts               ← sign, verify, decode
│       │   │   ├── password.ts          ← bcrypt helpers
│       │   │   └── middleware.ts        ← requireAuth, requireRole
│       │   ├── services/                ← Business logic
│       │   │   ├── auth.service.ts
│       │   │   ├── product.service.ts
│       │   │   ├── order.service.ts
│       │   │   ├── cart.service.ts
│       │   │   ├── inventory.service.ts
│       │   │   ├── pricing.service.ts
│       │   │   ├── customer.service.ts
│       │   │   └── content.service.ts
│       │   ├── repositories/            ← Prisma query wrappers
│       │   │   ├── product.repository.ts
│       │   │   ├── order.repository.ts
│       │   │   ├── user.repository.ts
│       │   │   └── ...
│       │   ├── cloudinary.ts            ← upload sign, transform URL helpers
│       │   ├── razorpay.ts              ← SDK instance + helpers
│       │   ├── email/
│       │   │   ├── resend.ts            ← Resend client
│       │   │   └── templates/           ← React Email templates
│       │   │       ├── OrderConfirmation.tsx
│       │   │       ├── ShippingUpdate.tsx
│       │   │       ├── PasswordReset.tsx
│       │   │       └── RefundConfirmation.tsx
│       │   ├── validators/              ← Zod schemas
│       │   │   ├── product.schema.ts
│       │   │   ├── order.schema.ts
│       │   │   ├── auth.schema.ts
│       │   │   └── checkout.schema.ts
│       │   ├── errors.ts                ← Custom error classes
│       │   ├── withErrorHandler.ts      ← Route Handler wrapper
│       │   └── utils.ts
│       ├── hooks/                       ← Custom React hooks
│       │   ├── useCart.ts
│       │   ├── useWishlist.ts
│       │   ├── useAuth.ts
│       │   └── useInfiniteScroll.ts
│       ├── stores/                      ← Zustand stores
│       │   ├── cart.store.ts
│       │   ├── wishlist.store.ts
│       │   └── ui.store.ts
│       ├── types/                       ← TypeScript types
│       │   ├── api.types.ts             ← API request/response shapes
│       │   ├── db.types.ts              ← Derived from Prisma types
│       │   └── next.types.ts
│       ├── middleware.ts                ← Next.js middleware (auth guard)
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── packages/
│   └── database/                        ← Shared Prisma package
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts                  ← Dev seed data
│       ├── src/
│       │   └── index.ts                 ← Exports: db (PrismaClient singleton)
│       ├── package.json
│       └── tsconfig.json
├── .github/
│   └── workflows/
│       ├── ci.yml                       ← Type check, lint, test on PR
│       └── deploy.yml                   ← Staging and production deploy gates
├── .env.local                           ← Local dev secrets (gitignored)
├── .env.example                         ← Template for all required env vars
├── turbo.json                           ← Turborepo pipeline config
├── pnpm-workspace.yaml
└── package.json
```

---

## 11. API Modules

All endpoints are prefixed `/api/`. Customer endpoints are public or require CUSTOMER role. Admin endpoints require ADMIN or SUPER_ADMIN role.

### 11.1 Auth Module `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create customer account. Rate limited: 5/min per IP |
| POST | `/auth/login` | Public | Login; returns tokens as httpOnly cookies. Rate limited: 10/min per IP |
| POST | `/auth/logout` | Customer | Revoke refresh token, clear cookies |
| POST | `/auth/refresh` | Cookie (refresh token) | Rotate refresh token; issue new access token |
| GET | `/auth/me` | Customer | Return current user profile |
| POST | `/auth/forgot-password` | Public | Send reset email if account exists (always returns 200) |
| POST | `/auth/reset-password` | Public | Validate reset token; set new password |
| POST | `/auth/admin/login` | Public | Admin login. Rate limited: 5/min per IP; lockout after 5 fails |
| POST | `/auth/admin/logout` | Admin | Revoke admin session |

---

### 11.2 Products Module `/api/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | List published products. Query params: `category`, `material`, `stone`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` |
| GET | `/products/[id]` | Public | Single product by ID or slug |
| GET | `/products/featured` | Public | Products where `isFeatured=true`, limited to 8 |
| GET | `/products/new-arrivals` | Public | Products where `isNewArrival=true`, limited to 8 |
| GET | `/products/[id]/related` | Public | Up to 4 products in the same category |

---

### 11.3 Categories Module `/api/categories`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | Public | All active categories with banner URLs |
| GET | `/categories/[slug]` | Public | Single category with banner |

---

### 11.4 Search Module `/api/search`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/search?q=[query]` | Public | Full-text search over product name, description, material. Returns products with filters. |
| GET | `/search/suggest?q=[query]` | Public | Typeahead suggestions: top 5 matching product names. Used by the header search bar. |

---

### 11.5 Cart Module `/api/cart`

Guest carts are identified by a `guest_id` cookie (UUID set on first visit). On login, guest cart is merged with the customer's cart.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | Public (guest or customer) | Get current cart with line items, subtotal |
| POST | `/cart` | Public | Add item: `{ productId, variantId?, quantity }`. Checks stock. |
| PATCH | `/cart/[itemId]` | Public | Update quantity |
| DELETE | `/cart/[itemId]` | Public | Remove item |
| DELETE | `/cart` | Public | Clear cart |
| POST | `/cart/merge` | Customer | Merge guest cart into authenticated cart after login |

---

### 11.6 Wishlist Module `/api/wishlist`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/wishlist` | Customer | Get wishlist items |
| POST | `/wishlist` | Customer | Add product: `{ productId }` |
| DELETE | `/wishlist/[productId]` | Customer | Remove from wishlist |

---

### 11.7 Coupons Module `/api/coupons`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/coupons/validate` | Public | Validate coupon code against cart total. Returns discount amount or error. |

---

### 11.8 Checkout Module `/api/checkout`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/checkout/create-order` | Customer (or guest with email) | Validates cart stock + pricing server-side; creates Order + Razorpay order; returns `razorpayOrderId` |

---

### 11.9 Orders Module `/api/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/orders` | Customer | Customer's own order history. Paginated. |
| GET | `/orders/[id]` | Customer | Single order detail (customer can only see their own) |

---

### 11.10 Admin — Products `/api/admin/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/products` | Admin | All products (including drafts). Filterable + searchable. |
| POST | `/admin/products` | Admin | Create product |
| GET | `/admin/products/[id]` | Admin | Single product (full detail including drafts) |
| PATCH | `/admin/products/[id]` | Admin | Update product fields |
| DELETE | `/admin/products/[id]` | Admin | Soft delete (sets `deletedAt`) |
| PATCH | `/admin/products/[id]/status` | Admin | Publish / unpublish / draft |
| POST | `/admin/products/[id]/images` | Admin | Save uploaded image metadata (after Cloudinary upload) |
| DELETE | `/admin/products/[id]/images/[imageId]` | Admin | Remove image |
| PATCH | `/admin/products/[id]/images/[imageId]/primary` | Admin | Set as primary image |

---

### 11.11 Admin — Inventory `/api/admin/inventory`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/inventory` | Admin | All products with stock levels. Filterable by status (in_stock, low, out). |
| GET | `/admin/inventory/alerts` | Admin | Products at or below low-stock threshold |
| PATCH | `/admin/inventory/[id]/adjust` | Admin | Adjust stock: `{ quantity, reason }`. Logs to `StockAdjustmentLog`. |

---

### 11.12 Admin — Pricing `/api/admin/pricing`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/pricing` | Admin | All products with current prices. Paginated. |
| PATCH | `/admin/pricing/[productId]` | Admin | Update price: `{ basePrice, salePrice, saleActive }`. Validates `salePrice < basePrice`. Logs to audit. |
| POST | `/admin/pricing/bulk` | Admin | Bulk price update from CSV. Preview mode: `{ dryRun: true }` returns diff without applying. Apply mode: `{ dryRun: false }` applies all changes. |

---

### 11.13 Admin — Orders `/api/admin/orders`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/orders` | Admin | All orders. Filterable by status, date range, payment method. Searchable by order number, customer name/email. |
| GET | `/admin/orders/[id]` | Admin | Full order detail with items, payment, status history, customer info |
| PATCH | `/admin/orders/[id]/status` | Admin | Update order status: `{ status, note?, trackingNumber?, courierName? }`. Triggers customer email. |
| POST | `/admin/orders/[id]/refund` | Admin | Initiate Razorpay refund: `{ amount, reason }` |
| PATCH | `/admin/orders/[id]/note` | Admin | Update internal note |
| GET | `/admin/orders/export` | Admin | CSV export of filtered orders |

---

### 11.14 Admin — Customers `/api/admin/customers`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/customers` | Admin | All customers. Searchable by name, email, phone. Sortable by spend, order count, join date. |
| GET | `/admin/customers/[id]` | Admin | Customer profile: personal details, addresses, order history, lifetime value |
| PATCH | `/admin/customers/[id]/flag` | Admin | Flag or unflag customer account: `{ isFlagged, reason }` |

---

### 11.15 Admin — Content `/api/admin/content`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/content/homepage` | Admin | All homepage content sections |
| PATCH | `/admin/content/homepage/[section]` | Admin | Update section data: `{ data, status }`. On publish, triggers ISR revalidation for `/`. |
| GET | `/admin/content/banners` | Admin | All category banners |
| PUT | `/admin/content/banners/[categoryId]` | Admin | Replace category banner with new Cloudinary image. Triggers ISR revalidation for category page. |

---

### 11.16 Admin — Upload `/api/admin/upload`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/admin/upload/sign` | Admin | Generate Cloudinary signed upload params: `{ folder, uploadPreset }`. Returns `{ signature, timestamp, apiKey }`. |

---

### 11.17 Admin — Settings `/api/admin/settings`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/settings/users` | Super Admin | List all admin users |
| POST | `/admin/settings/users` | Super Admin | Create admin user |
| PATCH | `/admin/settings/users/[id]` | Super Admin | Update role or deactivate |
| GET | `/admin/settings/platform` | Super Admin | Get platform settings (tax rates, shipping config, COD threshold) |
| PATCH | `/admin/settings/platform` | Super Admin | Update platform settings |
| GET | `/admin/settings/audit-log` | Super Admin | Paginated audit log. Filterable by admin, entity type, date. |

---

### 11.18 Webhooks `/api/webhooks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/webhooks/razorpay` | Signature (HMAC) | Handles: `payment.captured`, `payment.failed`, `refund.processed` |
| POST | `/webhooks/shiprocket` | API key header | Handles shipping status updates → updates order tracking + customer email |

---

## Appendix A: Key Decisions Summary

| Decision | Choice | Alternative Considered | Reason |
|---|---|---|---|
| API layer | Next.js Route Handlers | Separate Express server | Fewer moving parts for V1; extractable later |
| Admin hosting | Same Next.js app (route group) | Separate Next.js app | Single deployment; shared codebase; simpler env var management |
| Price storage | Integer (paise) | Decimal/float | Prevents floating-point rounding errors on financial data |
| Token storage | httpOnly cookies | localStorage | XSS protection; critical for payments platform |
| Refresh token | Stored hashed in DB | Stateless | Allows revocation (logout, account lock); small DB cost is worth it |
| ISR revalidation | On-demand via API | Time-based only | Admin content changes reflect immediately without stale cache |
| Guest cart | Cookie `guest_id` | Force login first | Industry standard; reduces checkout friction |
| Stock decrement timing | On `payment.captured` webhook | On order creation | Prevents inventory held by abandoned payments |
| Image upload | Signed Cloudinary upload | Proxy through server | Avoids large file payloads hitting the Next.js server |

---

*Document prepared for Mahrea — Luxury Jewellery Platform. This is the authoritative technical reference for all engineering decisions in V1.*
