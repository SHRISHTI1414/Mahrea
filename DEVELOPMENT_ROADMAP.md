# Mahrea — Development Roadmap

**Phase 1 Timeline:** 10–12 Working Days  
**Version:** 1.0 | June 2026  
**Clock Starts:** Day client provides all CRITICAL data from DATA_COLLECTION_REQUIREMENTS.md

---

## Phase Overview

| Phase | Feature Area | Days | Branch |
|---|---|---|---|
| Phase 0 | Project setup, documentation, git structure | Day 0 | `main` → `development` |
| Phase 1 | Authentication (Login, Signup, OTP, OAuth) | Day 1–2 | `feature/auth` |
| Phase 2 | Homepage (all sections, fully dynamic) | Day 3–5 | `feature/homepage` |
| Phase 3 | Category Pages (6 categories with filters) | Day 5–6 | `feature/categories` |
| Phase 4 | Product Detail Page | Day 6–7 | `feature/pdp` |
| Phase 5 | Cart & Checkout & Payment | Day 8–10 | `feature/cart`, `feature/checkout` |
| Phase 6 | Admin Dashboard | Day 10–11 | `feature/admin` |
| Phase 7 | QA, Testing, Deployment | Day 11–12 | `development` → `main` |

---

## Day-by-Day Plan

### Day 0 — Phase 0: Project Setup ✅

**Goal:** Repository ready, documentation complete, environment configured.

Tasks:
- [x] Initialize git repository
- [x] Create `main` and `development` branches
- [x] Create all feature branches
- [x] Create folder structure (Next.js + MongoDB layout)
- [x] Write README.md
- [x] Write PROJECT_SCOPE.md
- [x] Write PHASE_1_DELIVERY.md
- [x] Write ARCHITECTURE.md
- [x] Write DATA_COLLECTION_REQUIREMENTS.md
- [x] Write FEATURE_INVENTORY.md
- [x] Write DEVELOPMENT_ROADMAP.md
- [x] Write API_REQUIREMENTS.md
- [x] Write FIGMA_GAP_ANALYSIS.md
- [x] Push everything to GitHub

Deliverables: GitHub repository with all planning docs. No code.

---

### Day 1–2 — Phase 1: Authentication

**Branch:** `feature/auth`  
**Goal:** A user can register, log in, and get authenticated.

**Day 1 Tasks:**
- [ ] MongoDB connection setup (`lib/mongodb.ts`)
- [ ] User model (Mongoose schema with all fields)
- [ ] POST `/api/auth/register` — email/phone + password
- [ ] POST `/api/auth/login` — email/phone + password
- [ ] JWT sign/verify helpers (`lib/auth/jwt.ts`)
- [ ] httpOnly cookie set/clear helpers
- [ ] Login page UI (pixel-perfect from Figma)
- [ ] Signup page UI (pixel-perfect from Figma)

**Day 2 Tasks:**
- [ ] POST `/api/auth/otp/send` — msg91 OTP send
- [ ] POST `/api/auth/otp/verify` — validate OTP, issue JWT
- [ ] OTP verification screen UI
- [ ] NextAuth.js setup for Google OAuth
- [ ] NextAuth.js setup for Facebook OAuth
- [ ] POST `/api/auth/forgot-password` — email reset link
- [ ] Forgot password UI
- [ ] Next.js middleware — route protection for `/account/*` and `/admin/*`
- [ ] Auth state in Zustand store (`stores/ui.store.ts`)

**Commit milestones:**
```
feat(auth): add User model and MongoDB connection
feat(auth): implement email/password login and register APIs
feat(auth): add phone OTP send/verify via msg91
feat(auth): integrate Google and Facebook OAuth with NextAuth
feat(auth): build login and signup page UI
feat(auth): add route protection middleware
```

**Definition of Done:**
- User can register with email or phone
- User can log in with email/phone + password
- User can log in via phone OTP
- User can log in via Google
- User can log in via Facebook
- JWT stored in httpOnly cookie — not in localStorage
- Protected routes redirect to login when unauthenticated

---

### Day 3–5 — Phase 2: Homepage

**Branch:** `feature/homepage`  
**Goal:** Complete homepage, fully dynamic, all content editable from admin.

**Day 3 Tasks:**
- [ ] Content model (MongoDB) — flexible `key: data` document store
- [ ] Seed initial homepage content to MongoDB
- [ ] GET `/api/content/homepage` — serve all homepage sections
- [ ] Navbar component (desktop + mobile hamburger)
- [ ] Footer component
- [ ] Hero Slider component (auto-play, 3 slides, admin-driven images/text)

**Day 4 Tasks:**
- [ ] Shop by Mood section component
- [ ] Shop by Category section component (with starting prices from DB)
- [ ] Trending Collections component (horizontal scroll + nav arrows)
- [ ] Shop by Budget tiles component

**Day 5 Tasks:**
- [ ] Why Trust Mahrea badges component
- [ ] Testimonials / Loved by Community component
- [ ] Newsletter signup section + POST `/api/newsletter/subscribe`
- [ ] Homepage page.tsx (ISR — 1h revalidation)
- [ ] `revalidatePath('/')` wired to admin content save

**Commit milestones:**
```
feat(homepage): add Content model and seed homepage data
feat(homepage): build Navbar and Footer components
feat(homepage): implement Hero Slider with dynamic content
feat(homepage): add Shop by Mood and Category sections
feat(homepage): add Trending Collections and Budget sections
feat(homepage): add Testimonials and Newsletter sections
feat(homepage): complete homepage page.tsx with ISR
```

**Definition of Done:**
- All homepage sections render from MongoDB — zero hardcoded text/images
- Changing content in MongoDB immediately revalidates the page
- Homepage loads in under 3 seconds on mobile 4G

---

### Day 5–6 — Phase 3: Category Pages

**Branch:** `feature/categories`  
**Goal:** All 6 category listing pages with products, filters, and sorting.

Tasks:
- [ ] Product model (Mongoose — full schema with variants, pricing, images)
- [ ] Category model (Mongoose)
- [ ] GET `/api/products` — with query params: category, metal, minPrice, maxPrice, sort, page
- [ ] GET `/api/categories` — all active categories
- [ ] Category hero banner from DB
- [ ] Product card component (image, name, price, wishlist heart)
- [ ] Product grid component (3 col desktop / 2 col mobile)
- [ ] Filter panel component (price range, metal type, metal colour)
- [ ] Sort dropdown component
- [ ] Pagination component
- [ ] `[category]/page.tsx` (ISR — 30 min revalidation)
- [ ] Dynamic metadata per category for SEO

**Commit milestones:**
```
feat(categories): add Product and Category Mongoose models
feat(categories): implement products listing API with filters
feat(categories): build ProductCard and ProductGrid components
feat(categories): add FilterPanel and SortDropdown
feat(categories): complete category page with ISR
```

**Definition of Done:**
- All 6 category URLs work: `/rings`, `/bracelets`, `/earrings`, `/pendants`, `/anklets`, `/indian-ethnic`
- Filters and sorting work with real products from MongoDB
- Pages are SEO-indexed with correct meta tags

---

### Day 6–7 — Phase 4: Product Detail Page

**Branch:** `feature/pdp`  
**Goal:** Full PDP — gallery, details, gift packaging, add to cart.

Tasks:
- [ ] GET `/api/products/[id]` — single product
- [ ] GET `/api/products/[id]/related` — up to 4 same-category products
- [ ] Image gallery component (swipe, zoom, thumbnail strip)
- [ ] Product info component (name, price, material, size selector)
- [ ] Stock status badge component
- [ ] Gift packaging add-on component ("Make it Special" +₹199)
- [ ] Add to Cart button + cart store update
- [ ] Add to Wishlist button
- [ ] Related Products section
- [ ] `[category]/[slug]/page.tsx` (ISR — 15 min)
- [ ] Product JSON-LD structured data
- [ ] Breadcrumb component

**Commit milestones:**
```
feat(pdp): implement product detail API endpoint
feat(pdp): build ImageGallery component with zoom
feat(pdp): add ProductInfo, SizeSelector, StockBadge
feat(pdp): implement gift packaging add-on
feat(pdp): wire add-to-cart and wishlist to Zustand store
feat(pdp): complete PDP page with ISR and structured data
```

---

### Day 8 — Phase 5a: Cart

**Branch:** `feature/cart`  
**Goal:** Cart works for guests and logged-in users.

Tasks:
- [ ] Cart model (MongoDB — userId or guestId)
- [ ] POST `/api/cart` — add item (stock check)
- [ ] GET `/api/cart` — fetch cart
- [ ] PATCH `/api/cart/[itemId]` — update quantity
- [ ] DELETE `/api/cart/[itemId]` — remove item
- [ ] POST `/api/cart/merge` — merge guest cart on login
- [ ] Cart drawer component (slide-in from right)
- [ ] Full cart page `/cart`
- [ ] Cart Zustand store synced with API
- [ ] Gift packaging charge included in cart total

**Commit milestones:**
```
feat(cart): add Cart model and cart API endpoints
feat(cart): implement CartDrawer component
feat(cart): build full cart page with summary
feat(cart): sync guest cart on user login
```

---

### Day 9–10 — Phase 5b: Checkout & Payment

**Branch:** `feature/checkout`  
**Goal:** Customer can pay and receive order confirmation.

**Day 9 Tasks:**
- [ ] Order model (MongoDB — full schema with payment snapshot)
- [ ] POST `/api/checkout/create-order` — validate cart + create Razorpay order
- [ ] Razorpay SDK setup (`lib/razorpay.ts`)
- [ ] Checkout address page + address form
- [ ] Checkout payment page + Razorpay modal integration

**Day 10 Tasks:**
- [ ] POST `/api/webhooks/razorpay` — verify signature, confirm payment, decrement stock
- [ ] Order confirmation page `/order/confirmation/[id]`
- [ ] Order confirmation email (Resend + React Email template)
- [ ] Wishlist model + GET/POST/DELETE `/api/wishlist`
- [ ] Wishlist page

**Commit milestones:**
```
feat(checkout): add Order model and Razorpay integration
feat(checkout): implement checkout address and payment flow
feat(checkout): add Razorpay webhook handler
feat(checkout): build order confirmation page and email
feat(cart): add wishlist functionality
```

**Definition of Done:**
- End-to-end payment tested with Razorpay test mode
- Order created in MongoDB on payment.captured webhook
- Stock decremented only after payment confirmed
- Customer receives order confirmation email

---

### Day 10–11 — Phase 6: Admin Dashboard

**Branch:** `feature/admin`  
**Goal:** Mahrea team can manage everything without developer involvement.

**Day 10 Tasks:**
- [ ] Admin login page + admin JWT middleware
- [ ] Admin layout (sidebar navigation)
- [ ] Dashboard overview (order count, revenue, low-stock alerts)
- [ ] Product list page (searchable, filterable)
- [ ] Add product form (all fields + Cloudinary image upload)
- [ ] Edit product form
- [ ] Publish / unpublish toggle

**Day 11 Tasks:**
- [ ] Category management page (add, rename, reorder, toggle visibility)
- [ ] Inventory management page (stock level table + adjust)
- [ ] Order list + order detail + status update
- [ ] Customer list + customer profile view
- [ ] Homepage content editor (all 8 sections)
- [ ] Banner upload for homepage + categories
- [ ] POST `/api/admin/upload/sign` (Cloudinary signed upload)
- [ ] Revalidation triggers on all admin saves

**Commit milestones:**
```
feat(admin): admin login, layout, and dashboard overview
feat(admin): product management (create, edit, delete, image upload)
feat(admin): category and inventory management
feat(admin): order and customer management
feat(admin): homepage and banner content management
```

**Definition of Done:**
- Admin can create a product with images and it appears live on the site
- Admin can change hero banner and see it update on homepage without a deployment
- Admin can update order status

---

### Day 11–12 — Phase 7: QA, Testing & Deployment

**Goal:** Live, tested, production-deployed Mahrea website.

Tasks:
- [ ] Full end-to-end test: browse → add to cart → checkout → payment → order email
- [ ] Mobile responsiveness test on iPhone SE (375px) and iPhone 14 Pro (393px)
- [ ] Payment test in Razorpay live mode (small real transaction)
- [ ] Cross-browser test: Chrome, Safari, Firefox
- [ ] Page speed test (Google PageSpeed Insights — target 85+ on mobile)
- [ ] SEO check: meta tags, sitemap, robots.txt, structured data
- [ ] Security check: no API secrets in client bundle, JWT in httpOnly cookies
- [ ] Set all environment variables in Vercel production
- [ ] Run Prisma... (Mongoose seed in production)
- [ ] Deploy to production domain
- [ ] Admin walkthrough recording for client

**Commit milestones:**
```
chore: production environment configuration
chore: deploy to mahrea.in
docs: update README with production URL
```

---

## Git Branch Rules

```
main ←── development ←── feature/auth
                     ←── feature/homepage
                     ←── feature/categories
                     ←── feature/pdp
                     ←── feature/cart
                     ←── feature/checkout
                     ←── feature/admin
```

- Feature branches merge to `development` only after the phase is complete and tested
- `main` only receives merges from `development` at major milestones (after auth, after homepage, after full Phase 1 QA)
- No direct commits to `main`
- Commit messages follow: `feat(scope): description` / `fix(scope): description` / `chore: description`

---

## Risk Calendar

| Risk | Impact Day | Mitigation |
|---|---|---|
| Client delays product data | Day 5 (category pages) | Begin with placeholder data; real data slot-in without code change |
| Razorpay onboarding delay | Day 9 | Use Razorpay test mode throughout; live mode only needed for go-live |
| msg91 OTP template approval | Day 1 | Submit template on Day 0; approval takes 24–48h |
| Google/Facebook OAuth credentials missing | Day 2 | Build email/password auth first; OAuth added when credentials arrive |
| Product images not ready | Day 5 | Use placeholder product shots; real images swapped via admin upload |
| Domain not available | Day 12 | Deploy to `mahrea.vercel.app` as staging; switch when domain is ready |
