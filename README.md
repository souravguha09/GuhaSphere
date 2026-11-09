# Guhasphere

**A full-stack fashion and lifestyle marketplace built with the MERN stack.**

Guhasphere is an original e-commerce portfolio project inspired by the breadth of modern fashion marketplaces: editorial discovery, category-led shopping, product filters, wishlists, a persistent bag, customer accounts and order management. It has its own brand, styling, catalogue structure and page layouts; it is not a logo-only reskin of Bewakoof or AJIO.

> **Project status:** portfolio / learning project. The checkout supports Cash on Delivery and a clearly labelled demo-prepaid option. No real payment gateway, shipping provider, email service or production returns workflow is connected.

## Preview

The UI uses a warm neutral palette, a high-contrast editorial serif, a lime accent, collection photography and compact product cards. Product photography currently loads from Unsplash URLs in the seed catalogue; replace these with assets you own or are licensed to use before a commercial deployment.

## Features

### Storefront
- Responsive storefront, editorial hero, campaign/category tiles and featured/new-arrival shelves.
- Multi-category catalogue: clothing, footwear, accessories, beauty and home.
- Product search, category, department, brand, colour, size, price and customer-rating filters, plus sorting.
- Product detail page with image switching, colour/size selection, quantity control and related products.
- Persistent shopping bag and wishlist using browser local storage.
- Cart summary, free-shipping threshold, sample `SPHERE10` promo and responsive checkout.

### Customer experience
- Account registration and sign-in with bcrypt password hashing and JWT sessions.
- Account overview and order history.
- Checkout address validation, Cash on Delivery and a clearly marked demo payment choice.
- Server-side order pricing and promo validation, product stock validation and stock decrement/restoration on cancellation.

### API / admin foundation
- Express REST API with MongoDB and Mongoose.
- Protected customer and administrator routes.
- Admin product create/update/archive endpoints and order status management endpoints.
- Helmet security headers, CORS configuration, JSON payload limit and auth rate limiting.
- Seed script for a sample catalogue and optional first administrator.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Lucide React, custom responsive CSS |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Security / middleware | Helmet, CORS, express-rate-limit, Morgan |

## Getting started

### Requirements

- Node.js 20 or newer
- npm 10 or newer
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/guhasphere.git
cd guhasphere
```

### 2. Configure the API

```bash
cp server/.env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item server/.env.example server/.env
```

Edit `server/.env` and set:

- `MONGO_URI` to your MongoDB connection string.
- `JWT_SECRET` to a long, random secret (at least 32 characters).
- `CLIENT_ORIGIN` to the frontend origin, normally `http://localhost:5173`.
- `SEED_ADMIN_PASSWORD` to a strong local development password if you want the seed script to create an admin account.

Never commit `.env` files or real secrets.

### 3. Install dependencies

```bash
npm run install:all
```

### 4. Seed sample products

```bash
npm run seed
```

The script upserts sample catalogue products. It creates an admin only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are set and no account with that email already exists. The seeded admin role is suitable for local development; change credentials and review account provisioning before deploying.

### 5. Start frontend and backend

```bash
npm run dev
```

Open **http://localhost:5173**. The API runs on **http://localhost:5000**. The Vite dev server proxies `/api` requests to the API.

### Production build

```bash
npm run build
npm start
```

For a separate frontend host, set `VITE_API_URL` at build time to the API base URL (for example, `https://api.example.com/api`) and set `CLIENT_ORIGIN` on the API to your deployed frontend origin. Configure your host to serve the SPA's `index.html` for client-side routes.

## Repository structure

```text
guhasphere/
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── components/       # Header, footer, product cards and reusable UI
│   │   ├── context/          # Auth, cart, wishlist and toast state
│   │   ├── pages/            # Home, shop, product, bag, checkout, account
│   │   ├── services/         # Axios API client
│   │   └── styles/           # Responsive design system
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/           # MongoDB connection
│   │   ├── controllers/      # Auth, product and order logic
│   │   ├── middleware/       # JWT and admin guards
│   │   ├── models/           # User, Product and Order schemas
│   │   ├── routes/           # REST endpoints
│   │   ├── utils/
│   │   └── seed.js
│   └── .env.example
├── docs/
│   └── API.md
├── LICENSE                 # MIT License
├── .env.example
└── package.json
```

## API overview

Base URL during local development: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API health check |
| POST | `/auth/register` | Public | Register a customer |
| POST | `/auth/login` | Public | Sign in |
| GET | `/auth/me` | Customer | Current account |
| GET | `/products` | Public | Search / filter / sort catalogue |
| GET | `/products/:slug` | Public | Product and related products |
| POST | `/products` | Admin | Create a product |
| PATCH | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Archive a product |
| POST | `/orders` | Customer | Place an order |
| GET | `/orders/mine` | Customer | Current customer's orders |
| GET | `/orders` | Admin | List all orders |
| PATCH | `/orders/:id/status` | Admin | Update order status |

Protected requests use `Authorization: Bearer <token>`. Query options for `GET /products` include `q`, `category`, `gender`, `brand`, `color`, `size`, `rating`, `minPrice`, `maxPrice`, `tag`, `sort`, `page` and `limit`.

See [docs/API.md](docs/API.md) for request examples.

## GitHub setup

Create an empty repository on GitHub named `guhasphere`, then run:

```bash
git init
git add .
git commit -m "feat: build Guhasphere fashion marketplace"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guhasphere.git
git push -u origin main
```

The repository includes an MIT license. Keep the `LICENSE` file in the repository when you publish or redistribute the project.

## Before a real-world launch

This repository is a strong full-stack portfolio foundation, not a ready-to-take-real-payments retail platform. Before production use, add a real payment provider with verified webhooks, email/SMS notifications, image upload/storage, server-side validation and sanitization for every admin field, CSRF strategy if switching to cookies, safer production session storage, robust inventory transactions, password reset, audit logging, shipping integrations, policy pages, monitoring, backups and tests. Review security headers, rate limits, CORS, secrets, database indexes and deployment settings for your environment.

## Credits and inspiration

The project uses common e-commerce interaction patterns and was developed as an independent Guhasphere implementation. It is not affiliated with Bewakoof, AJIO, Reliance Retail or any referenced brand. Product photos are remotely loaded from Unsplash; refer to Unsplash's terms and the individual asset licenses before commercial use.

## License

Distributed under the [MIT License](LICENSE).
