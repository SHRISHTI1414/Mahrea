# Mahrea — Project Scope

**Phase:** 1  
**Timeline:** 10–12 Working Days  
**Version:** 1.0 | June 2026

---

## Phase 1 Goal

Launch a fully functional, mobile-responsive Mahrea website with:
- A complete customer shopping experience from discovery to payment
- A powerful admin panel giving the Mahrea team full control without developer involvement
- All homepage and product content editable from admin — zero hardcoded content

---

## In Scope — Phase 1

### Customer Website

| Feature | Detail |
|---|---|
| Login | Email/phone + password, Google OAuth, Facebook OAuth |
| Signup | Email/phone + password, Google OAuth, Facebook OAuth |
| OTP Verification | Phone OTP via SMS (msg91 or Fast2SMS) |
| Homepage | Hero slider, Shop by Mood, Shop by Category, Trending Collections, Shop by Budget, Trust badges, Testimonials, Newsletter, Footer |
| Category Pages | Rings, Bracelets, Earrings, Pendants, Anklets, Indian Ethnic — each with product grid, filters, sorting |
| Product Detail Page | Image gallery, name, price, description, material, size selector, gift packaging add-on, add to cart, related products |
| Wishlist | Save products, view and manage saved items |
| Cart | Add/remove items, quantity update, price summary, coupon field |
| Checkout | Shipping address, order summary, payment |
| Payment | UPI, Debit/Credit Cards via Razorpay — No COD |
| Order Confirmation | Order summary page + email confirmation |
| Returns | Return requests redirect to WhatsApp — no in-app return flow |
| About Us | Brand story page |
| Contact Us | Enquiry form + contact details |
| Privacy Policy | Static legal page (content from client) |
| Terms & Conditions | Static legal page (content from client) |

### Admin Dashboard

| Module | Capabilities |
|---|---|
| Product Management | Create, edit, delete products; upload images; set price, category, material, stock |
| Category Management | Add, rename, reorder, show/hide categories |
| Inventory Management | Update stock levels per product/variant; view low-stock alerts |
| Homepage Management | Update hero banners, collections, testimonials, budget sections |
| Banner Management | Upload and replace homepage and category banners |
| Order Management | View all orders, update status, view customer details |
| Customer Management | View profiles, order history, contact information |

---

## Out of Scope — Phase 1

These are intentionally deferred. Do not build any of these in Phase 1.

| Feature | Planned For |
|---|---|
| Coupons and discount codes | Phase 2 |
| Loyalty / rewards programme | Phase 2 |
| Product reviews and ratings | Phase 2 |
| Abandoned cart email recovery | Phase 2 |
| Analytics dashboard | Phase 2 |
| Multi-currency support | Phase 3 |
| International shipping | Phase 3 |
| AR virtual try-on | Phase 3 |
| AI-powered recommendations | Phase 3 |
| B2B / wholesale portal | Phase 3 |
| Blog | Phase 2 |
| In-app return flow | Phase 2 |
| COD (Cash on Delivery) | Not planned |
| Opening brand video | Phase 2 |
| SMS order notifications | Phase 2 |

---

## Technical Constraints

- **No microservices.** Single Next.js application handles frontend and API.
- **No separate backend server.** All API logic lives in Next.js Route Handlers.
- **No hardcoded content.** Every customer-visible text, image, and price is database-driven.
- **Payment: Razorpay only.** UPI and Cards. No COD.
- **Returns: WhatsApp redirect only.** No return portal in Phase 1.
- **Social login: Google + Facebook.** No Apple Sign-In in Phase 1.
- **MongoDB Atlas free tier** is sufficient for launch; upgrade path is clear.
- **Vercel free/pro tier** for hosting — no custom server setup.

---

## Success Criteria for Phase 1

Phase 1 is complete when all of the following are true:

- [ ] A customer can browse all 6 category pages and view product details
- [ ] A customer can register, log in with email/phone/Google/Facebook
- [ ] A customer can add products to cart and complete a payment via UPI or card
- [ ] A customer receives an order confirmation email
- [ ] An admin can add a new product with images and it appears on the website without a deployment
- [ ] An admin can change the homepage hero banner without touching code
- [ ] An admin can view and update the status of customer orders
- [ ] The website is fully responsive on mobile (375px) and desktop (1440px)
- [ ] All pages load in under 3 seconds on a 4G mobile connection
- [ ] The site passes a basic security check (no exposed API secrets, JWT in httpOnly cookies)

---

## Assumptions

1. Client provides all product data, images, and brand assets within 2 working days of kickoff.
2. Razorpay merchant account is active and API keys are available before checkout development begins.
3. SMS OTP gateway (msg91 or Fast2SMS) account is set up before auth development begins.
4. Google and Facebook OAuth app credentials are provided by the client.
5. Final legal content (Privacy Policy, T&C) may be provided as late as go-live day.
6. All product photography is at minimum 800×800px.
7. The client has a domain name available for deployment.
8. MongoDB Atlas account is available (free tier is fine for launch).
