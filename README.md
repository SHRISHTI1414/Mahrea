# Mahrea — Sparkle Everyday

Premium anti-tarnish jewellery platform. 6 categories: Earrings, Bracelets, Pendants, Anklets, Indian Ethnic, Rings.

---

## Structure

```
Mahrea/
├── frontend/   # Next.js 15 App Router (TypeScript + Tailwind CSS v4)
└── backend/    # Express 4 REST API (MongoDB + Mongoose)
```

---

## Tech Stack

| | |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Playfair Display + DM Sans |
| Backend | Express 4, Mongoose 8, JWT auth |
| Database | MongoDB Atlas |
| Payment | Razorpay (UPI, Cards) |
| Hosting | Vercel (frontend) + Railway/Render (backend) |

---

## Getting Started

**Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                         # → http://localhost:3000
```

**Backend**
```bash
cd backend
npm install
cp .env.example .env               # set MONGODB_URI, JWT_SECRET, ADMIN_JWT_SECRET
npm run dev                         # → http://localhost:5000
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, category grid, brand story, New In, gift packaging |
| `/category/[slug]` | Category listing with banner and product grid |
| `/product/[slug]` | Product detail — gallery, gift wrap add-on, add to cart |
| `/cart` | Cart with qty controls and order summary |
| `/new-in` | New arrivals grid |
| `/search` | Live debounced search |
| `/login` | Customer login |
| `/register` | Customer registration |

## API Routes

| Prefix | Description |
|---|---|
| `/api/auth` | Register, login, me |
| `/api/products` | List (filters: category, featured, newIn, q) + get by slug |
| `/api/categories` | List + get by slug |
| `/api/cart` | Guest cart keyed by `x-guest-id` header |
| `/api/orders` | Create order, my orders |
| `/api/admin` | Admin login + full CRUD (products, categories, orders) |

---

## Configuration

All editable content lives in one file — [`frontend/src/lib/config.ts`](frontend/src/lib/config.ts):

- Site name and tagline
- Navigation links
- All 6 categories (label, slug, banner image, tagline)
- API URL

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production |
| `feature/admin` | Active development |
