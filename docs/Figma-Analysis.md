# Mahrea — Figma Design Analysis
**Cross-referenced against PRD v1.0**  
**Date:** June 2026

---

## 1. Complete Page List

### What is designed in Figma

| # | Page / Section | Status |
|---|---|---|
| 1 | Homepage — Hero section | Designed |
| 2 | Homepage — Brand Story section | Designed |
| 3 | Bracelets — Category hero banner | Designed |
| 4 | Earrings — Category hero banner | Designed |
| 5 | Pendants — Category hero banner | Designed |
| 6 | Anklets — Category hero banner | Designed |
| 7 | Indian Ethnic Jewellery — Category hero banner | Designed |
| 8 | Product Detail Page — Image gallery component | Designed (partial) |
| 9 | Design System — Logo, icons, colour swatches | Designed |

**Total: 9 screens / sections. Only 2 full pages are substantially designed (Homepage hero, Brand Story). The rest are isolated section-level assets, not complete page layouts.**

---

### What the PRD requires vs. what is in Figma

| Category | PRD Requires | In Figma | Gap |
|---|---|---|---|
| Customer pages | 31 pages | ~2 full pages | **29 pages missing** |
| Admin pages | 18 pages | 0 | **18 pages missing** |
| Mobile screens | ~15 key flows | 0 | **All missing** |

---

## 2. Reusable UI Components

### Confirmed in Figma (built or partially built)

| Component | Notes |
|---|---|
| **Logo** | Full lockup: MR pendant monogram + "MAHREA / SPARKLE EVERYDAY" in gold |
| **Category hero banner** | Reusable layout — breadcrumb + title + tagline (cream bg, product image right). Used for 5 categories, same template |
| **Product card — image state** | Ring image with BESTSELLER badge overlay + heart/wishlist icon top-right |
| **PDP image gallery** | Hero image with badge, left/right navigation arrows |
| **Brand story section** | Split layout — editorial photo left, copy right |
| **Ornamental divider** | Gold floral horizontal rule — brand decoration |
| **Icon set (bronze/brown)** | Search, user/account, heart, resize arrows — line style, consistent stroke |
| **Icon set (gold)** | Delivery truck, gift box, leaf, sparkle stars — same line style, gold tone |
| **CTA buttons** | Visible as "SHOP NEW IN" and "EXPLORE COLLECTIONS" in hero (outlined dark style) |
| **Sparkle decoration** | 4-point star cluster — used as brand motif |

### Components required by PRD — NOT in Figma

| Component | Where Needed |
|---|---|
| Navigation bar (desktop) | All customer pages |
| Hamburger menu (mobile) | All mobile pages |
| Footer | All customer pages |
| Product grid layout | All category listing pages |
| Filter panel / sidebar | Category listing pages |
| Sort dropdown | Category listing pages |
| Pagination / infinite scroll | Category listing pages |
| Product card — full (image + name + price + CTA) | Category listing, New Arrivals |
| Cart drawer | Persistent across site |
| Cart page layout | Checkout flow |
| Checkout step indicator | Checkout (3 steps) |
| Form inputs (text, select, radio) | Login, Register, Checkout |
| Address form | Checkout, Address book |
| Payment method selector | Checkout |
| Order summary panel | Checkout, Order Confirmation |
| Order status badge / chip | My Orders, Admin orders |
| Breadcrumb | Category, PDP, Account pages |
| Alert / toast notification | Cart add, errors, success states |
| Modal / dialog | Confirmations, size guide, image zoom |
| Stock status badge ("Only X left") | PDP |
| Tab component | PDP (Description / Care / Certifications) |
| Admin sidebar navigation | All admin pages |
| Admin data table | Orders, Products, Customers, Inventory |
| Admin form layout | Add/Edit Product |
| Admin stat card | Dashboard overview |
| Admin status dropdown | Order status update |
| Image upload widget | Product management |
| Rich text editor (display) | Product description on PDP |
| Wishlist page layout | Account section |
| Account navigation (sidebar) | All account pages |
| Newsletter sign-up strip | Homepage footer area |

---

## 3. Missing Screens

### Customer-Facing (29 screens missing from Figma)

**Core Commerce**
- Opening video / entry screen (skip button, fade transition — unique to Mahrea, no design exists)
- Homepage — full layout (New Arrivals grid, Featured Collections, Promotional Banner, Newsletter, Footer)
- Rings — category hero banner (only category without a banner designed)
- Category listing page — full (product grid + filters + sort + pagination)
- Product Detail Page — full (tabs, material info, size selector, stock status, related products, trust badges)
- Search results page
- Cart page / cart drawer
- Checkout — Step 1: Delivery address
- Checkout — Step 2: Shipping method + order review
- Checkout — Step 3: Payment
- Order confirmation page

**Customer Account**
- Login page
- Register page
- Forgot password page
- Reset password page
- My Account — overview / dashboard
- My Orders — list
- Order detail page
- Wishlist page
- Address book page
- Profile settings page

**Content / Support**
- About Us
- Contact Us
- Privacy Policy
- Terms and Conditions
- Returns and Refund Policy
- Shipping Policy
- 404 Not Found
- 500 Server Error

---

### Admin (18 screens — none designed)

- Admin Login
- Admin Dashboard (overview metrics)
- Product List
- Add Product form
- Edit Product form
- Inventory Dashboard
- Low Stock Alerts panel
- Price Management table
- Bulk Price Update (CSV upload)
- Order List
- Order Detail + status update
- Customer List
- Customer Profile view
- Homepage Content Management
- Category Banner Management
- Admin User Management (Super Admin)
- Platform Settings (Super Admin)
- Audit Log (Super Admin)

---

## 4. Mobile Screens Required

The Figma has **zero mobile screens**. The PRD targets 65%+ mobile traffic. The following mobile screens are needed before development begins.

### Priority 1 — Critical Path (must design before build)

| Screen | Key Mobile Difference from Desktop |
|---|---|
| Homepage (mobile) | Stacked hero, horizontal scroll for collections, collapsed footer |
| Category listing (mobile) | 2-column grid, filter as bottom drawer, sticky sort bar |
| Product Detail Page (mobile) | Full-width image swipe gallery, sticky "Add to Cart" bottom bar |
| Cart (mobile) | Full-screen cart, bottom CTA fixed |
| Checkout — all 3 steps (mobile) | Single-column form, large tap targets, persistent order summary toggle |
| Order confirmation (mobile) | |
| Navigation — hamburger menu (mobile) | Full-screen overlay with all 6 categories |

### Priority 2 — Account Flows

| Screen | Key Mobile Difference |
|---|---|
| Login / Register (mobile) | Full-screen forms, social login spacing |
| My Orders (mobile) | Card-based list view |
| Order detail (mobile) | Collapsed sections with accordions |
| Wishlist (mobile) | 2-column grid, swipe-to-remove |
| Address book (mobile) | |
| Profile settings (mobile) | |

### Priority 3 — Content Pages

- About Us (mobile)
- Contact Us (mobile)
- Search results (mobile)
- 404 page (mobile)

### Mobile Design Rules to establish before execution

1. **Opening video** — must play correctly on iOS Safari (muted autoplay). Design the skip button at 44×44px minimum tap target.
2. **Navigation icons** — search, wishlist, cart, account in a bottom nav bar (mobile-native pattern) vs. top nav on desktop. Decide this pattern before any screen is built.
3. **PDP sticky bar** — price + "Add to Cart" fixed at the bottom of the screen on mobile. This is a separate component not in the desktop design.
4. **Filter drawer** — category filters become a bottom sheet on mobile, not a left sidebar. Needs its own design.
5. **Checkout forms** — keyboard avoidance, input type attributes (numeric for phone/card, email for email). Design must annotate these.

---

## Summary

| Item | Count |
|---|---|
| Pages designed (full layout) | ~2 |
| Pages designed (partial / banner only) | 7 |
| Pages required by PRD | 49 |
| **Pages still to design** | **~40** |
| Reusable components built | 10 |
| Reusable components still needed | ~30 |
| Mobile screens designed | 0 |
| Mobile screens needed (critical path) | 15+ |

**Immediate next step:** Before any page-level design begins, the component library must be completed — specifically the navigation bar, product card, filter panel, form system, and footer. Every other page depends on these.
