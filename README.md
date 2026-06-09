# Mahrea — Premium Jewellery Platform

> Fine jewellery inspired by global trends, crafted for the now. Sparkle Everyday.

---

## What is Mahrea?

Mahrea is a premium D2C jewellery e-commerce platform offering rings, earrings, bracelets, pendants, anklets, and Indian ethnic jewellery. Built for customers who want beautiful, anti-tarnish jewellery with a seamless online shopping experience.

This repository contains the complete codebase for:
- **Customer Website** — Discovery, browsing, cart, checkout, and orders
- **Admin Dashboard** — Full operational control over products, content, orders, and inventory

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT (httpOnly cookies) |
| Media | Cloudinary (images + video) |
| Payment | Razorpay (UPI, Cards) |
| Email | Resend + React Email |
| Hosting | Vercel + MongoDB Atlas |

---

## Project Status

| Phase | Scope | Status |
|---|---|---|
| Phase 0 | Project setup, documentation, git structure | ✅ Complete |
| Phase 1 | Auth | 🔜 Next |
| Phase 2 | Homepage | ⏳ Pending |
| Phase 3 | Category Pages | ⏳ Pending |
| Phase 4 | Product Detail Page | ⏳ Pending |
| Phase 5 | Cart & Checkout | ⏳ Pending |
| Phase 6 | Admin Dashboard | ⏳ Pending |

---

## Repository Structure

```
mahrea/
├── src/
│   ├── app/
│   │   ├── (customer)/         # Customer-facing pages
│   │   ├── (auth)/             # Login, Signup, OTP
│   │   ├── (admin)/            # Admin dashboard
│   │   └── api/                # Route Handlers (API layer)
│   ├── components/             # React components
│   ├── lib/                    # Business logic, utilities
│   ├── models/                 # Mongoose data models
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand client state
│   └── types/                  # TypeScript types
├── public/                     # Static assets
├── docs/                       # Architecture and analysis docs
└── [Planning Documents]        # PRD, scope, roadmap
```

---

## Key Documents

| Document | Purpose |
|---|---|
| [PROJECT_SCOPE.md](PROJECT_SCOPE.md) | What is and is not in Phase 1 |
| [PHASE_1_DELIVERY.md](PHASE_1_DELIVERY.md) | Client-facing delivery plan |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical architecture |
| [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | 10–12 day delivery timeline |
| [FEATURE_INVENTORY.md](FEATURE_INVENTORY.md) | Complete feature list by phase |
| [API_REQUIREMENTS.md](API_REQUIREMENTS.md) | All API endpoints |
| [DATA_COLLECTION_REQUIREMENTS.md](DATA_COLLECTION_REQUIREMENTS.md) | Assets needed from client |
| [docs/Figma-Analysis.md](docs/Figma-Analysis.md) | Design gap analysis |
| [docs/PRD.md](docs/PRD.md) | Full product requirements |

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — only merged from `development` |
| `development` | Integration branch — all features merge here |
| `feature/auth` | Login, Signup, OTP |
| `feature/homepage` | Homepage + all sections |
| `feature/categories` | 6 category listing pages |
| `feature/pdp` | Product Detail Page |
| `feature/cart` | Cart functionality |
| `feature/checkout` | Checkout + Razorpay payment |
| `feature/admin` | Admin dashboard |

---

## Development Rules

1. One feature branch per phase — never mix feature work
2. Commit after every major task with a clean, descriptive message
3. Push after every commit — no local-only work
4. Update documentation after each feature is complete
5. Request approval before moving to the next phase
6. No hardcoded content — everything editable from admin

---

## Contact

Built for Mahrea by the founding engineering team.
