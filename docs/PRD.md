# Mahrea — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** June 2026  
**Owner:** Lead Full Stack Developer  
**Status:** Draft — Startup Ready  

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [User Roles](#2-user-roles)
3. [User Flows](#3-user-flows)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Page Inventory](#6-page-inventory)
7. [Feature Inventory](#7-feature-inventory)
8. [Admin Requirements](#8-admin-requirements)
9. [Future Scalability Requirements](#9-future-scalability-requirements)
10. [Risks and Assumptions](#10-risks-and-assumptions)

---

## 1. Product Vision

### 1.1 Mission Statement

Mahrea is a luxury jewellery platform built to redefine how customers discover, experience, and purchase fine jewellery online. Every interaction — from the opening brand film to the final unboxing — must feel intentional, elevated, and personal.

### 1.2 Problem Statement

The luxury jewellery market online suffers from three compounding failures:

- **Trust deficit** — Customers cannot assess craftsmanship, material purity, or stone quality through flat product listings.
- **Generic shopping UX** — Most jewellery platforms look and feel like commodity e-commerce, undermining the purchase's emotional weight.
- **Operational blindspots** — Small and mid-size jewellers lack the tooling to manage inventory, pricing, and customers in one coherent system.

### 1.3 Solution

Mahrea bridges the gap between boutique jewellery retail and modern digital commerce by delivering:

- A cinematic, brand-first customer experience anchored by an opening video and rich visual storytelling.
- A curated catalogue spanning contemporary and Indian ethnic jewellery collections.
- A full-featured admin platform enabling complete operational control over products, inventory, pricing, customers, and orders from a single dashboard.

### 1.4 Value Proposition

| Stakeholder | Value |
|---|---|
| Customer | A luxury shopping experience that mirrors walking into a premium boutique. |
| Admin / Business Owner | Complete control over every operational variable from one dashboard. |
| Business | Higher average order value driven by trust, aesthetics, and curation. |

### 1.5 Target Audience

- **Primary:** Women aged 25–50, upper-middle to affluent income bracket, urban, fashion and jewellery conscious, comfortable purchasing fine jewellery online.
- **Secondary:** Gift purchasers (partners, family) seeking curated, premium options for milestone occasions.
- **Tertiary:** Indian diaspora globally seeking high-quality ethnic jewellery online.

### 1.6 Success Metrics

| Metric | Target (Month 6) |
|---|---|
| Conversion Rate | ≥ 2.5% |
| Average Order Value | ≥ ₹15,000 |
| Video Completion Rate (Opening) | ≥ 60% |
| Admin Task Completion Time | ≤ 3 mins for any CRUD operation |
| Page Load Time (LCP) | ≤ 2.5 seconds |
| Mobile Traffic Share | ≥ 65% |

---

## 2. User Roles

### 2.1 Role Overview

| Role | Access Level | Description |
|---|---|---|
| Guest Visitor | Public | Browses the website without an account. Can view all catalogue pages. |
| Registered Customer | Authenticated | Can place orders, save wishlists, track orders, and manage their profile. |
| Admin (Operator) | Admin Dashboard | Full operational control — products, inventory, pricing, orders, customers, homepage content. |
| Super Admin | Admin Dashboard + System Config | All admin permissions plus user management (adding/removing admins) and platform-level settings. |

### 2.2 Guest Visitor

- Can access the full customer-facing website.
- Can browse all categories and product detail pages.
- Cannot add to cart or checkout without registering or logging in.
- Experiences the mandatory opening video on first visit.

### 2.3 Registered Customer

All guest permissions plus:

- Add to cart and proceed to checkout.
- Save items to a wishlist.
- View order history and order status.
- Manage delivery addresses and account details.
- Receive order confirmation emails and shipping updates.

### 2.4 Admin (Operator)

- Secure, separate login portal (not accessible from the customer-facing site navigation).
- Manage the full product catalogue: add, edit, unpublish, delete products.
- Manage inventory: track stock levels, receive low-stock alerts.
- Manage pricing: update prices, apply discounts, set sale pricing.
- Manage orders: view, update status, and process refunds.
- Manage customers: view profiles, purchase history, contact details.
- Manage homepage content: update hero banners, featured collections, promotional copy.
- Cannot access system-level or platform configuration settings.

### 2.5 Super Admin

All admin permissions plus:

- Create and deactivate admin accounts.
- View platform-level audit logs.
- Configure global platform settings (tax rates, shipping zones, currency).
- Access analytics and business reporting.

---

## 3. User Flows

### 3.1 Customer: First Visit Flow

```
Landing on Website
      │
      ▼
Opening Brand Video (mandatory, full-screen, auto-play muted)
      │
      ├── [Skip Button appears at 5 seconds]
      │
      ▼
Homepage (hero section, featured collections, promotional banner)
      │
      ├── Browse Category (Rings / Bracelets / Earrings / Pendants / Anklets / Indian Ethnic)
      │         │
      │         ▼
      │   Category Listing Page (filters: price, material, stone, occasion)
      │         │
      │         ▼
      │   Product Detail Page (images, description, size guide, material info, add to cart)
      │         │
      │         ├── Add to Cart → Cart Drawer / Cart Page
      │         │         │
      │         │         ▼
      │         │   Checkout (Guest or Login prompt)
      │         │         │
      │         │         ▼
      │         │   Order Confirmation
      │         │
      │         └── Add to Wishlist → Prompt to Register/Login if Guest
      │
      └── Search → Results Page → Product Detail Page
```

### 3.2 Customer: Return Visit Flow

```
Visit Website
      │
      ▼
Homepage (video skipped via session cookie — not re-shown)
      │
      ▼
Login → My Account
      │
      ├── View Order History → Order Detail → Track Order
      ├── View Wishlist → Add to Cart
      └── Update Profile / Address
```

### 3.3 Customer: Checkout Flow

```
Cart Review
      │
      ▼
Login / Guest Checkout (Guest requires email + phone)
      │
      ▼
Delivery Address Entry / Selection
      │
      ▼
Shipping Method Selection
      │
      ▼
Order Summary Review
      │
      ▼
Payment
  ├── UPI
  ├── Credit / Debit Card
  ├── Net Banking
  └── Pay on Delivery (if enabled)
      │
      ▼
Order Confirmation Page + Email Confirmation
      │
      ▼
Order Tracking (email updates at each status change)
```

### 3.4 Admin: Product Management Flow

```
Admin Login
      │
      ▼
Admin Dashboard (summary metrics)
      │
      ▼
Product Management
      │
      ├── Add New Product
      │     ├── Name, Category, Description
      │     ├── Images (multiple, with primary image selection)
      │     ├── Material, Purity, Stone Type, Weight
      │     ├── Pricing (base price, sale price, tax class)
      │     ├── Inventory (SKU, stock quantity, low-stock threshold)
      │     └── Publish / Save as Draft
      │
      ├── Edit Existing Product → Inline editing of all fields
      │
      ├── Unpublish Product (removes from storefront, preserves data)
      │
      └── Delete Product (with confirmation dialog)
```

### 3.5 Admin: Order Management Flow

```
Order Management → Order List (filterable by status / date / customer)
      │
      ▼
Order Detail
      │
      ├── View Items, Customer Info, Delivery Address, Payment Status
      ├── Update Order Status: Confirmed → Processing → Shipped → Delivered
      ├── Upload Tracking Number
      └── Initiate Refund / Cancellation
```

---

## 4. Functional Requirements

### 4.1 Customer-Facing Website

#### FR-C-01: Mandatory Opening Video

- On every user's first visit (per browser session), an immersive brand video plays full-screen before the homepage is accessible.
- The video auto-plays muted (to comply with browser autoplay policies).
- A "Skip" button appears after 5 seconds.
- Once the video ends or is skipped, the user transitions to the homepage with a smooth fade or cinematic cut.
- A session cookie prevents the video from replaying on subsequent page loads within the same session.
- The video must be swappable by the admin via Homepage Content Management without a deployment.

#### FR-C-02: Homepage

- Hero section: full-width visual (image or video), headline, subheadline, primary CTA button.
- Featured Collections section: curated horizontal scroll or grid of categories (Rings, Bracelets, Earrings, Pendants, Anklets, Indian Ethnic).
- New Arrivals section: up to 8 products, pulled dynamically from the admin-controlled featured product list.
- Promotional Banner: mid-page static or animated banner with text and a CTA link (admin-controlled).
- Brand Story section: editorial copy with an image, reinforcing the brand's values and craftsmanship.
- Footer: navigation links, contact info, social media icons, newsletter sign-up, legal links (Privacy Policy, Terms, Returns).

#### FR-C-03: Category Pages

Applicable to: Rings, Bracelets, Earrings, Pendants, Anklets, Indian Ethnic Collection.

- Category hero banner (image + category name, admin-controlled).
- Product grid: minimum 3 columns on desktop, 2 columns on mobile.
- Each product card displays: primary image (hover shows secondary image), product name, price, "Add to Wishlist" icon.
- Filter panel:
  - Price range slider (min–max).
  - Material (Gold, Silver, Platinum, Rose Gold, etc.).
  - Stone Type (Diamond, Ruby, Emerald, Pearl, etc.).
  - Occasion (Wedding, Daily Wear, Festival, Party).
  - Sort by: Price (Low–High, High–Low), Newest First, Bestsellers.
- Pagination or infinite scroll (configurable).
- "No products found" state with suggested categories.

#### FR-C-04: Product Detail Page

- Image gallery: minimum 5 images, full-screen zoom on click, thumbnail navigation.
- Product name, category breadcrumb, SKU.
- Price display: base price, sale price (if applicable, shown with strikethrough), savings badge.
- Material and purity information (e.g., 22KT Gold, 925 Sterling Silver).
- Stone details (type, carat, cut — where applicable).
- Weight (grams).
- Size/variant selector (where applicable — e.g., ring sizes).
- Stock status: "In Stock", "Only X left", "Out of Stock".
- Add to Cart button (disabled if Out of Stock).
- Add to Wishlist button.
- Product description (rich text, with care instructions).
- Hallmark / certification badge (BIS Hallmark, Certified Diamonds).
- Shipping and return policy snippet.
- Related Products section (up to 4, same category).

#### FR-C-05: Cart

- Persistent cart for logged-in users, session-based for guests.
- Line items: image thumbnail, name, size/variant, price, quantity adjuster, remove button.
- Order subtotal, applicable taxes, estimated shipping (or "Calculated at checkout").
- Coupon/promo code field.
- "Continue Shopping" and "Proceed to Checkout" CTAs.

#### FR-C-06: User Account

- Registration: name, email, phone, password.
- Login: email + password, with "Forgot Password" flow.
- My Orders: list of past orders with status, order date, total, and link to order detail.
- Wishlist: saved products with Add to Cart and Remove options.
- Address Book: save and manage multiple delivery addresses.
- Profile: update name, email, phone, password.

#### FR-C-07: Search

- Global search bar in the header.
- Real-time suggestions as user types (product name, category).
- Search results page with filters identical to category pages.
- Handles zero-result state with alternative recommendations.

#### FR-C-08: Navigation

- Desktop: sticky top navigation bar with logo, category links, search icon, wishlist icon, cart icon, account icon.
- Mobile: hamburger menu with full-screen nav overlay.
- Category mega-menu on desktop showing subcategory options and a featured image.

---

### 4.2 Admin Dashboard

Covered in detail in Section 8. Summary of modules:

- FR-A-01: Admin Login and Authentication
- FR-A-02: Dashboard Overview (summary metrics)
- FR-A-03: Product Management
- FR-A-04: Inventory Management
- FR-A-05: Price Management
- FR-A-06: Customer Management
- FR-A-07: Order Management
- FR-A-08: Homepage Content Management

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Requirement | Target |
|---|---|
| Largest Contentful Paint (LCP) | ≤ 2.5 seconds on 4G mobile |
| Time to Interactive (TTI) | ≤ 3.5 seconds |
| Cumulative Layout Shift (CLS) | ≤ 0.1 |
| Opening video initial load | ≤ 3 seconds before first frame plays |
| API response time (product listing) | ≤ 300ms at p95 |
| Admin dashboard page load | ≤ 2 seconds |
| Image optimization | All images served in WebP format with lazy loading |

### 5.2 Scalability

- The platform must handle 10,000 concurrent visitors without degradation at launch, with a path to 100,000 concurrent visitors.
- Product catalogue must support up to 5,000 SKUs without performance impact on search or filtering.
- Order volume must support up to 500 orders per day at launch.

### 5.3 Security

- All data in transit encrypted via TLS 1.3.
- All passwords hashed using bcrypt with appropriate salt rounds.
- Admin panel secured behind separate authentication with session timeouts (30 minutes of inactivity).
- Role-based access control (RBAC) enforced at the API layer, not just the UI layer.
- PCI-DSS compliance for payment data — card data must never be stored on Mahrea's servers (handled by payment gateway tokenization).
- Protection against OWASP Top 10 vulnerabilities: SQL injection, XSS, CSRF, broken authentication, etc.
- Rate limiting on login endpoints to prevent brute-force attacks.
- Input sanitization on all form fields.
- Admin audit log for all create, update, and delete operations.

### 5.4 Reliability and Availability

- Uptime SLA: 99.9% (excluding planned maintenance).
- Automated database backups: every 24 hours, retained for 30 days.
- Zero-downtime deployments for content updates.
- Graceful error states — users must never see a raw server error. Custom 404, 500, and maintenance pages required.

### 5.5 Accessibility

- WCAG 2.1 Level AA compliance.
- All images must have descriptive alt text.
- Keyboard navigable throughout the customer site.
- Sufficient colour contrast ratios for all text elements.
- Screen reader compatible navigation and forms.

### 5.6 SEO

- Server-side rendering (SSR) or static generation for all customer-facing pages.
- Unique `<title>` and `<meta description>` per page.
- Structured data (JSON-LD) for products (Product schema), breadcrumbs, and the organisation.
- Canonical URLs for paginated listing pages.
- Auto-generated XML sitemap submitted to Google Search Console.
- All images include descriptive filenames and alt text.
- Clean, human-readable URL structure: `/rings/diamond-solitaire-band-18kt-gold`.

### 5.7 Cross-Browser and Device Compatibility

- Customer website: fully functional on Chrome, Safari, Firefox, Edge (latest 2 versions).
- Mobile: iOS Safari 15+, Chrome for Android.
- Admin dashboard: Chrome and Firefox desktop only (mobile admin is not a launch requirement).
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1280px (desktop), 1920px (wide desktop).

### 5.8 Internationalisation Readiness

- All currency values displayed in INR (₹) at launch.
- Date formats consistent (DD MMM YYYY).
- Architecture must support multi-currency and multi-language in a future phase without a rewrite (i18n-ready strings from day one).

---

## 6. Page Inventory

### 6.1 Customer-Facing Pages

| Page ID | Page Name | URL Pattern | Auth Required | Priority |
|---|---|---|---|---|
| P-C-01 | Opening Video / Entry Screen | `/` (pre-home) | No | Critical |
| P-C-02 | Homepage | `/` | No | Critical |
| P-C-03 | Rings Category | `/rings` | No | Critical |
| P-C-04 | Bracelets Category | `/bracelets` | No | Critical |
| P-C-05 | Earrings Category | `/earrings` | No | Critical |
| P-C-06 | Pendants Category | `/pendants` | No | Critical |
| P-C-07 | Anklets Category | `/anklets` | No | Critical |
| P-C-08 | Indian Ethnic Collection | `/indian-ethnic` | No | Critical |
| P-C-09 | Product Detail Page | `/[category]/[product-slug]` | No | Critical |
| P-C-10 | Search Results | `/search?q=[query]` | No | High |
| P-C-11 | Cart | `/cart` | No | Critical |
| P-C-12 | Checkout | `/checkout` | Partial (Guest allowed) | Critical |
| P-C-13 | Order Confirmation | `/order/confirmation/[order-id]` | No | Critical |
| P-C-14 | Customer Login | `/account/login` | No | High |
| P-C-15 | Customer Register | `/account/register` | No | High |
| P-C-16 | Forgot Password | `/account/forgot-password` | No | High |
| P-C-17 | Reset Password | `/account/reset-password/[token]` | No | High |
| P-C-18 | My Account — Overview | `/account` | Yes | High |
| P-C-19 | My Orders | `/account/orders` | Yes | High |
| P-C-20 | Order Detail | `/account/orders/[order-id]` | Yes | High |
| P-C-21 | Wishlist | `/account/wishlist` | Yes | High |
| P-C-22 | Address Book | `/account/addresses` | Yes | Medium |
| P-C-23 | Profile Settings | `/account/profile` | Yes | Medium |
| P-C-24 | About Us | `/about` | No | Medium |
| P-C-25 | Contact Us | `/contact` | No | Medium |
| P-C-26 | Privacy Policy | `/legal/privacy-policy` | No | High |
| P-C-27 | Terms and Conditions | `/legal/terms` | No | High |
| P-C-28 | Returns and Refund Policy | `/legal/returns` | No | High |
| P-C-29 | Shipping Policy | `/legal/shipping` | No | Medium |
| P-C-30 | 404 Not Found | `/404` | No | High |
| P-C-31 | 500 Server Error | `/500` | No | High |

**Total Customer Pages: 31**

---

### 6.2 Admin Pages

| Page ID | Page Name | URL Pattern | Auth Required |
|---|---|---|---|
| P-A-01 | Admin Login | `/admin/login` | No |
| P-A-02 | Admin Dashboard | `/admin` | Yes (Admin) |
| P-A-03 | Product List | `/admin/products` | Yes (Admin) |
| P-A-04 | Add Product | `/admin/products/new` | Yes (Admin) |
| P-A-05 | Edit Product | `/admin/products/[id]/edit` | Yes (Admin) |
| P-A-06 | Inventory Dashboard | `/admin/inventory` | Yes (Admin) |
| P-A-07 | Low Stock Alerts | `/admin/inventory/alerts` | Yes (Admin) |
| P-A-08 | Price Management | `/admin/pricing` | Yes (Admin) |
| P-A-09 | Bulk Price Update | `/admin/pricing/bulk` | Yes (Admin) |
| P-A-10 | Order List | `/admin/orders` | Yes (Admin) |
| P-A-11 | Order Detail | `/admin/orders/[id]` | Yes (Admin) |
| P-A-12 | Customer List | `/admin/customers` | Yes (Admin) |
| P-A-13 | Customer Detail | `/admin/customers/[id]` | Yes (Admin) |
| P-A-14 | Homepage Content | `/admin/content/homepage` | Yes (Admin) |
| P-A-15 | Category Banner Management | `/admin/content/banners` | Yes (Admin) |
| P-A-16 | Admin User Management | `/admin/settings/users` | Yes (Super Admin) |
| P-A-17 | Platform Settings | `/admin/settings/platform` | Yes (Super Admin) |
| P-A-18 | Audit Log | `/admin/settings/audit-log` | Yes (Super Admin) |

**Total Admin Pages: 18**

---

## 7. Feature Inventory

### 7.1 Customer Features

| Feature ID | Feature Name | Category | Priority |
|---|---|---|---|
| F-C-01 | Mandatory Opening Brand Video | Experience | Critical |
| F-C-02 | Homepage Hero Section | Content | Critical |
| F-C-03 | Category Navigation (6 categories) | Navigation | Critical |
| F-C-04 | Product Listing Grid with Filters | Catalogue | Critical |
| F-C-05 | Product Detail Page (full spec) | Catalogue | Critical |
| F-C-06 | Image Gallery with Zoom | Catalogue | Critical |
| F-C-07 | Size/Variant Selector | Catalogue | High |
| F-C-08 | Add to Cart | Commerce | Critical |
| F-C-09 | Cart Management | Commerce | Critical |
| F-C-10 | Promo / Coupon Code | Commerce | High |
| F-C-11 | Guest Checkout | Commerce | High |
| F-C-12 | Registered User Checkout | Commerce | Critical |
| F-C-13 | Multi-Address Checkout | Commerce | Medium |
| F-C-14 | Payment Gateway Integration (UPI, Card, Net Banking) | Commerce | Critical |
| F-C-15 | Order Confirmation Page + Email | Commerce | Critical |
| F-C-16 | Order Status Tracking | Commerce | High |
| F-C-17 | Customer Registration | Auth | Critical |
| F-C-18 | Customer Login / Logout | Auth | Critical |
| F-C-19 | Forgot / Reset Password | Auth | High |
| F-C-20 | Wishlist (Save for Later) | Account | High |
| F-C-21 | Order History | Account | High |
| F-C-22 | Address Book Management | Account | Medium |
| F-C-23 | Profile Settings | Account | Medium |
| F-C-24 | Global Search (real-time) | Discovery | High |
| F-C-25 | Related Products | Discovery | Medium |
| F-C-26 | New Arrivals Section (Homepage) | Discovery | High |
| F-C-27 | Featured Collections Section (Homepage) | Discovery | High |
| F-C-28 | Newsletter Sign-Up | Marketing | Medium |
| F-C-29 | SEO Meta Tags per Page | SEO | High |
| F-C-30 | Product Structured Data (JSON-LD) | SEO | High |
| F-C-31 | XML Sitemap | SEO | High |
| F-C-32 | Social Share on Product Pages | Marketing | Low |
| F-C-33 | Session Cookie (skip video on return visit) | Experience | Critical |
| F-C-34 | Stock Badge ("Only X left") | Catalogue | High |
| F-C-35 | Hallmark / Certification Display | Trust | High |
| F-C-36 | Mobile Responsive Design | Platform | Critical |
| F-C-37 | Sticky Navigation | UX | High |
| F-C-38 | Breadcrumb Navigation | UX | High |
| F-C-39 | Custom 404 / 500 Pages | Platform | High |
| F-C-40 | Contact Form | Support | Medium |

**Total Customer Features: 40**

---

### 7.2 Admin Features

| Feature ID | Feature Name | Category | Priority |
|---|---|---|---|
| F-A-01 | Admin Login with MFA Option | Auth | Critical |
| F-A-02 | Dashboard Overview Metrics | Analytics | Critical |
| F-A-03 | Add / Edit / Unpublish / Delete Products | Product | Critical |
| F-A-04 | Multi-Image Upload per Product | Product | Critical |
| F-A-05 | Product Draft / Published Status | Product | High |
| F-A-06 | Product Categorisation | Product | Critical |
| F-A-07 | Rich Text Product Description Editor | Product | High |
| F-A-08 | Inventory Stock Level Management | Inventory | Critical |
| F-A-09 | Low-Stock Threshold Alerts | Inventory | High |
| F-A-10 | Stock Adjustment Log | Inventory | Medium |
| F-A-11 | Base Price Update per Product | Pricing | Critical |
| F-A-12 | Sale Price / Discount Management | Pricing | High |
| F-A-13 | Bulk Price Update (CSV import) | Pricing | Medium |
| F-A-14 | Tax Class Assignment per Product | Pricing | High |
| F-A-15 | Order List with Status Filter | Orders | Critical |
| F-A-16 | Order Detail View | Orders | Critical |
| F-A-17 | Order Status Update | Orders | Critical |
| F-A-18 | Shipping Tracking Number Entry | Orders | High |
| F-A-19 | Refund / Cancellation Initiation | Orders | High |
| F-A-20 | Order Export (CSV) | Orders | Medium |
| F-A-21 | Customer List with Search | Customers | Critical |
| F-A-22 | Customer Profile View | Customers | High |
| F-A-23 | Customer Order History View | Customers | High |
| F-A-24 | Homepage Hero Banner Management | Content | Critical |
| F-A-25 | Opening Video Upload / Swap | Content | Critical |
| F-A-26 | Featured Collections Configuration | Content | High |
| F-A-27 | Promotional Banner Management | Content | High |
| F-A-28 | Category Hero Banner Management | Content | Medium |
| F-A-29 | Admin User Create / Deactivate | Admin Mgmt | Critical (Super Admin) |
| F-A-30 | Role Assignment (Admin / Super Admin) | Admin Mgmt | Critical (Super Admin) |
| F-A-31 | Audit Log View | Admin Mgmt | High (Super Admin) |
| F-A-32 | Platform Settings (Tax, Shipping, Currency) | Admin Mgmt | High (Super Admin) |
| F-A-33 | Session Timeout (30 min inactivity) | Security | Critical |

**Total Admin Features: 33**

---

## 8. Admin Requirements

### 8.1 Admin Login

- Dedicated URL at `/admin/login`, not linked from the customer-facing website.
- Email + password authentication.
- "Remember this device" option (extends session to 7 days on trusted devices).
- Failed login lockout: 5 failed attempts → 15-minute lockout.
- Password reset via email link.
- Optional: Time-based OTP (TOTP) two-factor authentication for Super Admin accounts.
- Session auto-expires after 30 minutes of inactivity.

### 8.2 Admin Dashboard Overview

The landing page after login. Displays:

- **Today's Orders:** count + value vs. yesterday.
- **Pending Orders:** orders awaiting processing.
- **Revenue This Month:** vs. last month, with trend indicator.
- **Low Stock Products:** count of products below threshold, with quick link.
- **New Customers (Last 7 Days):** count.
- **Quick Links:** Add Product, View Orders, Update Homepage.
- **Recent Orders Table:** Last 10 orders with status badges.

### 8.3 Product Management

**Product Data Model — fields required at creation:**

| Field | Type | Required | Notes |
|---|---|---|---|
| Product Name | Text | Yes | Max 120 chars |
| Category | Select | Yes | One of the 6 categories |
| SKU | Text | Yes | Auto-generated or manual, unique |
| Description | Rich Text | Yes | Supports headings, bullets, bold |
| Images | File Upload | Yes | Minimum 1, maximum 10. First = primary |
| Material | Select | Yes | Gold, Silver, Platinum, Rose Gold, etc. |
| Purity | Select | Conditional | 18KT, 22KT, 925, etc. |
| Stone Type | Multi-select | No | Diamond, Ruby, Emerald, Pearl, etc. |
| Weight (grams) | Decimal | Yes | |
| Size Options | Multi-input | No | For rings and bracelets |
| Base Price (₹) | Decimal | Yes | Exclusive of tax |
| Sale Price (₹) | Decimal | No | Must be < Base Price |
| Tax Class | Select | Yes | GST 3%, GST 5%, etc. |
| Stock Quantity | Integer | Yes | |
| Low Stock Threshold | Integer | Yes | Default: 5 |
| Status | Select | Yes | Draft / Published / Unpublished |
| Hallmark Certified | Boolean | No | Displays hallmark badge on PDP |
| Meta Title | Text | No | Defaults to Product Name |
| Meta Description | Text | No | Max 160 chars |

**Product List View:**

- Searchable by name, SKU.
- Filterable by category, status, stock level.
- Sortable by name, price, stock, date created.
- Bulk actions: Publish, Unpublish, Delete (with confirmation).
- Inline status toggle.

### 8.4 Inventory Management

- Stock levels visible per product with colour-coded status:
  - Green: In Stock (above threshold).
  - Amber: Low Stock (at or below threshold).
  - Red: Out of Stock (0 units).
- Admin can update stock quantity directly from the inventory dashboard.
- Each stock adjustment is logged with: timestamp, admin user, previous quantity, new quantity, reason (free text).
- Low Stock Alert panel: lists all products at or below their threshold.
- Out of Stock Alert: email notification to a configured admin email when any product reaches 0.

### 8.5 Price Management

- Dedicated pricing module separate from product editing (for quick price sweeps).
- Table view of all products with columns: Name, Category, Current Price, Sale Price, Tax Class.
- Inline edit: admin can update price or sale price without leaving the table.
- Sale Price validation: system prevents sale price being set higher than or equal to base price.
- Activate / deactivate sale pricing per product with a toggle.
- Bulk Price Update: upload a CSV with SKU and new prices to update in batch.
- Audit trail: all price changes logged with timestamp, admin user, old price, new price.

### 8.6 Customer Management

- Customer list: searchable by name, email, phone.
- Sortable by: registration date, total orders, total spend.
- Customer profile view:
  - Personal details: name, email, phone, registration date.
  - Address book entries.
  - Full order history with links to order detail.
  - Lifetime value (total spend to date).
- Admin can flag a customer account (e.g., for fraud investigation) which prevents new orders.
- Admin cannot edit customer passwords or payment details.

### 8.7 Order Management

**Order States:**

```
Pending Payment → Payment Confirmed → Processing → Shipped → Delivered
                                                           └── Cancelled (at any pre-Shipped stage)
                                                           └── Refund Requested → Refund Processed
```

**Order List View:**

- Filterable by: status, date range, payment method.
- Searchable by order ID, customer name, email.
- Exportable as CSV for accounting/reporting.
- Status badges colour-coded per state.

**Order Detail View:**

- Order ID, order date, customer details, delivery address.
- Line items: image, name, SKU, size, quantity, unit price, line total.
- Subtotal, discount applied, shipping charge, tax breakdown, total.
- Payment method and payment status.
- Order timeline: history of all status changes with timestamps and acting admin.
- Action panel:
  - Update status (dropdown, moves forward only, except cancellation).
  - Enter or update shipping tracking number + courier name.
  - Initiate refund: partial or full, with reason field.
  - Add internal note (visible only in admin, not to customer).

**Automated Customer Notifications (triggered by status changes):**

| Trigger | Email Sent |
|---|---|
| Payment Confirmed | Order Confirmation with order summary |
| Order Shipped | Shipping confirmation with tracking link |
| Order Delivered | Delivery confirmation + feedback invite |
| Refund Processed | Refund confirmation with amount and timeline |

### 8.8 Homepage Content Management

All homepage sections must be editable by the admin without a code deployment.

| Section | Editable Fields |
|---|---|
| Opening Video | Replace video file (MP4), configure skip delay (seconds) |
| Hero Banner | Background image/video, headline, subheadline, CTA text, CTA link |
| Featured Collections | Enable/disable each of the 6 categories, reorder them |
| New Arrivals | Select up to 8 products to feature, reorder them |
| Promotional Banner | Background image, text overlay, CTA text, CTA link, active/inactive toggle |
| Brand Story | Headline, body copy (rich text), image |

Changes should be previewable before publishing ("Save as Draft" and "Publish" workflow for content).

---

## 9. Future Scalability Requirements

The following capabilities are out of scope for V1 but the architecture and data model must not preclude them. Design decisions today should not require a rewrite to enable these tomorrow.

### 9.1 Phase 2 — Growth Features (Months 7–12)

| Feature | Description |
|---|---|
| Product Reviews and Ratings | Customer-submitted reviews with star ratings, admin moderation queue. |
| Loyalty and Rewards Programme | Points earned per ₹ spent, redeemable at checkout. |
| Referral Programme | Unique referral codes per customer, tracked conversion rewards. |
| Gift Wrapping Option | Selectable at checkout with a custom message field. |
| Personalisation / Engraving | Text input on select products for custom engraving at additional cost. |
| Live Chat / WhatsApp Integration | Click-to-chat button for pre-purchase queries. |
| Email Marketing Integration | Sync customer and order data with Klaviyo or Mailchimp. |
| Abandoned Cart Recovery | Automated email to users who leave with items in cart. |
| Push Notifications (PWA) | Browser push for restock alerts and promotions. |

### 9.2 Phase 3 — Scale Features (Year 2+)

| Feature | Description |
|---|---|
| Multi-Currency Support | USD, AED, GBP for international customers. |
| Multi-Language Support | English and Hindi at minimum. |
| International Shipping | Shipping zone configuration, customs documentation. |
| B2B / Wholesale Portal | Separate pricing tiers and account type for bulk buyers. |
| Advanced Analytics Dashboard | Revenue trends, product performance, customer lifetime value, cohort analysis. |
| AI-Powered Recommendations | "Customers also bought", personalised homepage based on browse history. |
| Subscription / Pre-Order | Reserve items before restock or launch. |
| Virtual Try-On (AR) | Augmented reality ring/earring try-on using device camera. |
| Marketplace Integration | Sell on Myntra, Amazon, or Nykaa Fashion via API sync. |
| Multi-Vendor Support | Onboard other jewellery brands as sellers on the Mahrea platform. |

### 9.3 Architectural Readiness Checklist

The V1 architecture must satisfy the following to avoid future rewrites:

- [ ] Product data model includes a `metadata` JSON field for extensible attributes (enables engraving, gift options).
- [ ] User model includes a `role` field and RBAC infrastructure (enables B2B and affiliate roles).
- [ ] All prices stored as integers (paise) with currency code stored alongside (enables multi-currency).
- [ ] All user-facing strings abstracted into a translation layer (enables multi-language).
- [ ] Image storage in a CDN-backed object store with transformations (enables WebP, thumbnails, and AR asset delivery).
- [ ] Order event system built with a publish-subscribe model (enables abandoned cart, loyalty triggers, marketing hooks).
- [ ] API-first backend (enables marketplace integrations, mobile app).
- [ ] Category taxonomy stored in the database, not hardcoded (enables adding new collections without deployment).

---

## 10. Risks and Assumptions

### 10.1 Risks

| Risk ID | Risk Description | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Opening video causes high bounce rate on mobile due to slow load | High | High | Serve video from CDN; use adaptive streaming (serve lower resolution on slow connections); implement fast skeleton → video transition. |
| R-02 | Payment gateway integration delays | Medium | High | Begin gateway integration (Razorpay recommended) in Sprint 1. Have a fallback (Cashfree or PayU) scoped if onboarding is delayed. |
| R-03 | Product image quality inconsistent across catalogue | High | High | Define and document image specification standards before photoshoots begin (resolution, aspect ratio, background, format). |
| R-04 | Admin content management is underused, causing stale homepage | Medium | Medium | Build frictionless CMS UI with preview-before-publish. Train admin users at launch. |
| R-05 | Inventory accuracy drift (physical vs. system) | Medium | High | Mandatory stock adjustment log with reason field. Schedule monthly physical inventory audit. |
| R-06 | Indian Ethnic Collection requires custom attribute fields not shared by other categories | Medium | Medium | Implement flexible product metadata (JSON field) to handle category-specific attributes without schema changes. |
| R-07 | SEO impact of SPA routing (if using client-side rendering) | Medium | High | Mandate SSR or static generation for all customer-facing product and category pages from day one. |
| R-08 | Jewellery size standardisation complexity (ring sizes vary by country) | Low | Medium | Implement a size guide modal; store size in a flexible text field, not a predefined enum, at V1. |
| R-09 | Regulatory: GST compliance for jewellery (3% on gold, 5% on diamonds) | High | High | Tax class per product; tax calculation at checkout, not at display. Engage a CA to confirm tax configuration before launch. |
| R-10 | Customer trust in purchasing high-value items online | High | High | Prioritise trust signals: BIS Hallmark badges, secure payment icons, clear returns policy, COD option for high-value orders. |
| R-11 | Admin misuse of bulk price update (accidental mass reprice) | Low | High | Require manual confirmation step with a preview of all changes before CSV bulk price update is applied. |
| R-12 | Opening video not supported by browser autoplay policies | High | Medium | Default to muted autoplay (browser-permitted); include a prominent unmute button; do not rely on audio for core brand communication. |

### 10.2 Assumptions

| Assumption ID | Assumption | If Wrong, Then... |
|---|---|---|
| A-01 | Customers will primarily access Mahrea on mobile (65%+ mobile traffic). | Desktop experience may need equal investment in design effort. |
| A-02 | The business operates with a single currency (INR) at launch. | Multi-currency architecture must be retrofitted — high rework cost. |
| A-03 | A single admin operator (or small team) manages the admin panel — not concurrent multi-admin workflows. | Conflict resolution for concurrent edits will be required as a feature. |
| A-04 | Product photography and brand video will be ready at least 4 weeks before the launch date. | Launch gate on content readiness, not engineering readiness. |
| A-05 | Razorpay (or equivalent) will be used as the payment gateway. | Different payment APIs may require backend service rewrites. |
| A-06 | Return and refund handling is manual (admin initiates refund via dashboard → payment gateway). | Automated refund rules and triggers will need to be engineered if volume demands it. |
| A-07 | There is no physical POS integration required at launch. | POS sync (inventory especially) becomes a significant engineering effort if added later. |
| A-08 | Product catalogue size at launch is under 500 SKUs. | Performance optimisations for large catalogues (search indexing, faceted filtering) may need to be prioritised earlier. |
| A-09 | Shipping is handled by a third-party logistics partner (Shiprocket, Delhivery). | In-house shipping will require a full logistics module. |
| A-10 | The opening brand video is a single global video — not personalised or A/B tested at launch. | A/B testing the video requires feature flag infrastructure not scoped for V1. |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| SKU | Stock Keeping Unit — a unique identifier for each distinct product variant. |
| PDP | Product Detail Page — the individual page for a single product. |
| PLP | Product Listing Page — a category or search results page showing multiple products. |
| CTA | Call to Action — a button or link prompting the user to take a specific step. |
| LCP | Largest Contentful Paint — a Core Web Vitals metric measuring perceived load speed. |
| TTI | Time to Interactive — time until the page is fully interactive. |
| CLS | Cumulative Layout Shift — measures visual stability (how much the page jumps around during load). |
| SSR | Server-Side Rendering — HTML is generated on the server for each request, improving SEO and initial load. |
| RBAC | Role-Based Access Control — permissions tied to a user's assigned role. |
| CDN | Content Delivery Network — geographically distributed servers for fast asset delivery. |
| TOTP | Time-Based One-Time Password — standard for two-factor authentication (e.g., Google Authenticator). |
| BIS | Bureau of Indian Standards — the body that certifies gold hallmarking in India. |
| GST | Goods and Services Tax — Indian indirect tax applied to jewellery sales. |

---

*Document prepared for Mahrea — Luxury Jewellery Platform. This PRD represents the V1 scope and is intended as the authoritative requirements reference for design, engineering, and QA teams.*
