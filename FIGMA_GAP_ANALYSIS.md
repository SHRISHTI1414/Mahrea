# Mahrea — Figma Design Gap Analysis

**Source:** MahRea.fig (v2 — June 9, 2026, 102MB)  
**Cross-referenced against:** PRD v1.0 + PHASE_1_DELIVERY.md  
**Version:** 2.0 | Updated with full Figma screenshots

---

## 1. Design System (Confirmed)

The Figma file contains a complete design system:

| Element | Details |
|---|---|
| Primary colour | Deep maroon/wine (~#6B1040) — used for navbar, footer, section headers |
| Accent colour | Hot pink/magenta (~#C4215A or similar) — used for CTA buttons, active inputs, highlights |
| Background | Cream/blush (~#FDF5EE) — page backgrounds |
| Gold | Used in logo, trust icons, ornamental details |
| Typography — Headings | Serif font (appears to be Playfair Display or similar) |
| Typography — Body | Sans-serif font (appears to be DM Sans, Inter, or similar) |
| Logo | MR pendant monogram + "MAHREA / SPARKLE EVERYDAY" in gold |
| Icon set | Custom bronze/brown line icons — search, account, wishlist, cart, delivery, gift, leaf, sparkle |
| CTA Buttons | Filled magenta (primary) + outlined maroon (secondary) |
| Input fields | Rounded, light pink background with magenta focus state |

---

## 2. Screens Fully Designed in Figma ✅

| Screen | Status | Notes |
|---|---|---|
| **Design System** | ✅ Complete | Colours, typography, icon set, component states |
| **Login Page** | ✅ Complete | "Welcome Back!" — email/phone + password + Forgot password + Login button + Google + Facebook |
| **Signup Page** | ✅ Complete | "Welcome!" — email/phone + password + Sign Up button + Google + Facebook |
| **Homepage** | ✅ Complete | All 9 sections designed (see Section 3 below) |
| **Rings Category Page** | ✅ Complete | Product grid + filters + sorting + footer |
| **Bracelets Category Page** | ✅ Complete | Same layout as Rings |
| **Earrings Category Page** | ✅ Complete | Same layout |
| **Pendants Category Page** | ✅ Complete | Same layout |
| **Anklets Category Page** | ✅ Complete | Same layout |
| **Indian Ethnic Jewellery Page** | ✅ Complete | Same layout |
| **Product Detail Page** | ✅ Complete | Gallery, info, gift packaging add-on, related products |
| **Cart Page** | ✅ Complete | "Your Jewellery Cart" — items, quantity, summary, Compare to your look |

**Total fully designed screens: 12**

---

## 3. Homepage Sections (All Designed)

| Section | Designed | Content |
|---|---|---|
| Navigation Bar | ✅ | Logo + NEW IN, SHOP, COLLECTIONS, GIFTS, WEDDING LITE, ANTI TARNISH JEWELLERY + icons |
| Hero Slider | ✅ | 3-slide carousel with model photo, headline, subtext, two CTA buttons, slide dots |
| Shop by Mood | ✅ | 6 tiles: Everyday Minimal, Office Luxe, Date Night Glow, Wedding Light, Party Glam, Gift Edit |
| Shop by Category | ✅ | 6 category tiles on maroon background with "Start from ₹X,XXX" prices + arrow |
| Trending Collections | ✅ | 4 named collections (Milan Muse, Wild Edit, Golden Hour, Summer Crochet) with left/right navigation |
| Shop by Budget | ✅ | 4 tiles: Under ₹199, Under ₹399, Under ₹599, Gift Ready |
| Why Trust Mahrea | ✅ | 6 trust badges: Anti-tarnish, Premium Quality, 5 Day Easy Returns, Lifetime Exchange Value, Free Insured Delivery, Secure Payments |
| Loved by Our Community | ✅ | 5 testimonials with customer photos, 5-star rating, name, short quote |
| Newsletter Section | ✅ | "GET 10% OFF ON YOUR FIRST ORDER" with email input + Subscribe button |
| Footer | ✅ | Logo + tagline + 5 link columns (SHOP, COLLECTIONS, HELP, ABOUT, CONNECT WITH US) + social icons |

---

## 4. New Assets in Updated Figma (v2)

| Asset | Description |
|---|---|
| Gift Packaging Component | "Make it Special — Premium Vine-woven Gift Packaging +₹199" with Mahrea branded maroon gift box — used on PDP |
| Auth Background — Pink | Blush pink background with soft pink jewellery + petals (used for Signup) |
| Auth Background — Dark | Same with ruby pendant set and deeper tones (used for Login) |
| Category hero banners (all 5+) | Bracelets, Earrings, Pendants, Anklets, Indian Ethnic — wide format with title + tagline |

---

## 5. Navigation Structure (Confirmed from Design)

**Desktop Navbar:**
```
[MR Logo + MAHREA] | NEW IN  SHOP  COLLECTIONS  GIFTS  WEDDING LITE  ANTI TARNISH JEWELLERY | [Search] [Account] [Wishlist] [Cart]
```

**Key observations:**
- "NEW IN" replaces "HOME" in the primary nav — different from typical e-commerce patterns
- "ANTI TARNISH JEWELLERY" is a standalone nav item (brand USP as a nav link)
- "WEDDING LITE" is a collection/filter, not a category
- Navigation is **wider than the 6 categories** — includes cross-cutting collections

---

## 6. Screens Missing from Figma ❌

### Customer-Facing — Missing

| Screen | Priority | Notes |
|---|---|---|
| OTP Verification Screen | 🔴 CRITICAL | Not in Figma. Login/Signup exist but no OTP step screen |
| Forgot Password Page | 🔴 CRITICAL | Linked from Login but not designed |
| Reset Password Page | 🔴 CRITICAL | Required for forgot password flow |
| Checkout — Address Step | 🔴 CRITICAL | Cart designed but Checkout flow is not |
| Checkout — Payment Step | 🔴 CRITICAL | Razorpay modal integration screen not shown |
| Order Confirmation Page | 🔴 CRITICAL | Not in Figma |
| Wishlist Page | 🟡 IMPORTANT | Wishlist icon visible in nav — full page not designed |
| My Account — Overview | 🟡 IMPORTANT | Not in Figma |
| My Orders Page | 🟡 IMPORTANT | Not in Figma |
| Order Detail Page | 🟡 IMPORTANT | Not in Figma |
| Address Book Page | 🟡 IMPORTANT | Not in Figma |
| Profile Settings Page | 🟡 IMPORTANT | Not in Figma |
| About Us | 🟢 LOW | Not in Figma — standard page |
| Contact Us | 🟢 LOW | Not in Figma |
| Privacy Policy | 🟢 LOW | Static text page — no design needed |
| Terms & Conditions | 🟢 LOW | Static text page |
| Search Results Page | 🟡 IMPORTANT | Search icon visible but results page not designed |
| 404 Not Found Page | 🟡 IMPORTANT | Not in Figma |

### Admin Pages — All Missing

| Screen | Priority |
|---|---|
| Admin Login | 🔴 CRITICAL |
| Admin Dashboard Overview | 🔴 CRITICAL |
| Product List | 🔴 CRITICAL |
| Add / Edit Product Form | 🔴 CRITICAL |
| Category Management | 🔴 CRITICAL |
| Inventory Management | 🟡 IMPORTANT |
| Order List | 🔴 CRITICAL |
| Order Detail (Admin view) | 🔴 CRITICAL |
| Customer List | 🟡 IMPORTANT |
| Customer Profile (Admin view) | 🟡 IMPORTANT |
| Homepage Content Editor | 🔴 CRITICAL |
| Banner Management | 🟡 IMPORTANT |

**No admin screens exist in the Figma at all.**

---

## 7. Mobile Screens — All Missing

The Figma contains **zero mobile designs.** Every screen shown is desktop.

| Mobile Screen Needed | Priority | Key Mobile Difference |
|---|---|---|
| Homepage (mobile) | 🔴 CRITICAL | Stacked hero, 2-col mood tiles, horizontal scroll for categories |
| All 6 category pages (mobile) | 🔴 CRITICAL | 2-column grid, bottom-sheet filters |
| Product Detail Page (mobile) | 🔴 CRITICAL | Full-width image swipe, sticky "Add to Cart" bottom bar |
| Cart (mobile) | 🔴 CRITICAL | Full-screen layout, fixed CTA |
| Login / Signup (mobile) | 🔴 CRITICAL | Full-screen form, larger tap targets |
| Checkout (mobile) | 🔴 CRITICAL | Single-column form, keyboard handling |
| Navigation (mobile) | 🔴 CRITICAL | Hamburger → full-screen overlay |

---

## 8. Component Gaps

Figma has designed page layouts but several reusable components are implicit or absent:

| Component | In Figma | Status |
|---|---|---|
| Logo | ✅ | Designed |
| Custom icon set | ✅ | Complete |
| Hero slider with dots | ✅ | Designed |
| Product card (image + name + price + heart) | ✅ | Designed |
| Category tile (image + label + price + arrow) | ✅ | Designed |
| Testimonial card | ✅ | Designed |
| Budget tile | ✅ | Designed |
| Trust badge strip | ✅ | Designed |
| Gift packaging add-on UI | ✅ | Designed |
| Auth page inputs (pink, rounded) | ✅ | Designed |
| Desktop navigation | ✅ | Designed |
| Footer | ✅ | Designed |
| Filter panel | ❌ | Visible in categories but no close-up component design |
| Pagination | ❌ | Not designed |
| Mobile hamburger menu / overlay | ❌ | Not designed |
| Cart drawer (slide-in) | ❌ | Not designed — only full cart page |
| OTP input fields | ❌ | Not designed |
| Toast / notification | ❌ | Not designed |
| Breadcrumb | ❌ | Not designed |
| Empty state (empty cart, empty wishlist) | ❌ | Not designed |
| Loading skeleton | ❌ | Not designed |
| Admin sidebar | ❌ | Not designed |
| Admin data table | ❌ | Not designed |
| Admin form inputs | ❌ | Not designed |
| Order status badge | ❌ | Not designed |

---

## 9. Design Decisions Required Before Development

These are unresolved design questions that will block development if not answered:

| # | Question | Affects |
|---|---|---|
| 1 | What is the mobile navigation pattern? Hamburger → full-screen overlay, or bottom tab bar? | Every mobile page |
| 2 | Does the sticky "Add to Cart" bottom bar appear on mobile PDP? | PDP mobile |
| 3 | What is the filter UX on mobile category pages? Bottom sheet drawer, or inline? | Category pages mobile |
| 4 | What does the OTP screen look like? Single input or 6 separate boxes? | Auth flow |
| 5 | Is there a cart drawer (slide-in) or do we always navigate to the full cart page? | Cart UX |
| 6 | What is the admin panel visual style? Match the customer site or plain/functional? | Admin dashboard |
| 7 | The nav has "WEDDING LITE" and "ANTI TARNISH JEWELLERY" — are these categories, collection filters, or landing pages? | Navigation + routing |
| 8 | What does "Compare to your look" do in the cart? | Cart feature |

---

## 10. Summary

| Metric | Count |
|---|---|
| Screens fully designed | 12 |
| Screens partially designed (sections/components only) | 3 |
| Screens required by Phase 1 — not in Figma | 18+ |
| Admin screens required — not in Figma | 12 |
| Mobile screens designed | 0 |
| Mobile screens required for Phase 1 | 10+ |
| UI components designed | 14 |
| UI components required — not designed | 15+ |

**Design coverage: ~35% of Phase 1 screens have a desktop design. 0% mobile. 0% admin.**

### Recommended Action
The 12 designed screens are sufficient to begin Phase 1 development. For missing screens, the dev team will build using the established design system (colours, typography, components) extracted from the Figma. The client should review and approve missing screen designs at each phase milestone before that phase goes into development.
