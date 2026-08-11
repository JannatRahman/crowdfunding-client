# 🚀 CrowdFund — Empower Ideas Through Community

> A full-stack crowdfunding platform where **creators** bring ideas to life and **supporters** fund the future.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
  - [Running the Client](#running-the-client)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Roles & Dashboards](#roles--dashboards)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

**CrowdFund** is a modern, full-stack crowdfunding web application built with **Next.js 16** on the frontend and **Express.js** on the backend. It enables:

- **Creators** to launch and manage fundraising campaigns.
- **Supporters** to discover, browse, and back campaigns with secure payments via Stripe.
- **Admins** to manage users, campaigns, and platform-wide settings.

---

## 🛠️ Tech Stack

### Frontend (`crowdfunding-client`)

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [HeroUI](https://heroui.com/) | Component library |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Better Auth](https://better-auth.com/) | Authentication (Google OAuth) |
| [Stripe.js](https://stripe.com/docs/js) | Secure payment processing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form validation |
| [Axios](https://axios-http.com/) | HTTP client |
| [Swiper](https://swiperjs.com/) | Touch sliders & carousels |
| [React Hot Toast](https://react-hot-toast.com/) | Notifications |

### Backend (`crowdfunding-server`)

| Technology | Purpose |
|---|---|
| [Node.js ≥ 20](https://nodejs.org/) | Runtime |
| [Express.js 5](https://expressjs.com/) | REST API framework |
| [MongoDB](https://www.mongodb.com/) | NoSQL database |
| [Stripe](https://stripe.com/) | Payment processing |
| [Helmet](https://helmetjs.github.io/) | HTTP security headers |
| [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) | Rate limiting |
| [Morgan](https://www.npmjs.com/package/morgan) | HTTP request logger |
| [CORS](https://www.npmjs.com/package/cors) | Cross-origin resource sharing |

---

## 📁 Project Structure

```
ASSIGNMENT-11/
├── crowdfunding-client/          # Next.js 16 frontend
│   ├── src/
│   │   ├── app/                  # App Router pages & API routes
│   │   │   ├── (auth)/           # Auth pages (login, register)
│   │   │   ├── campaigns/        # Campaign listing & detail pages
│   │   │   ├── dashboard/        # Role-based dashboards
│   │   │   │   ├── admin/        # Admin dashboard
│   │   │   │   ├── creator/      # Creator dashboard
│   │   │   │   └── supporter/    # Supporter dashboard
│   │   │   ├── payment/          # Stripe payment flow
│   │   │   └── api/              # Next.js API routes (auth, webhooks)
│   │   ├── components/           # Reusable UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Library config (auth, db, stripe)
│   │   ├── providers/            # React context providers
│   │   └── utils/                # Utility functions
│   ├── public/                   # Static assets
│   ├── .env.example              # Client environment variable template
│   └── package.json
│
└── crowdfunding-server/          # Express.js REST API
    ├── index.js                  # Entry point & all route handlers
    ├── ecosystem.config.js       # PM2 process config
    ├── .env.example              # Server environment variable template
    └── package.json
```

---

## ✨ Features

### Public
- 🏠 Landing page with featured campaigns & hero section
- 🔍 Browse & search campaigns by category
- 📄 Campaign detail pages with progress, backers & updates

### Authentication
- 🔐 Email/password registration & login
- 🌐 Google OAuth (via Better Auth)
- 🛡️ Protected routes by role (admin / creator / supporter)

### Creator Dashboard
- ➕ Create, edit, and delete campaigns
- 📊 View campaign analytics & contribution history
- 🖼️ Upload campaign images via ImgBB

### Supporter Dashboard
- 💳 Back campaigns with secure Stripe payments
- 📜 View contribution history & receipts
- ⭐ Save favourite campaigns

### Admin Dashboard
- 👥 Manage all users (roles, bans)
- 📁 Moderate campaigns (approve / reject / delete)
- 💰 View platform-wide payment & contribution data
- 📊 Site-wide analytics overview

### Payments
- 💳 Stripe Checkout integration
- 🔔 Stripe Webhook support for payment events
- 🔒 Server-side payment intent validation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **npm** v9+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Stripe](https://stripe.com/) account (test mode for development)
- A [Google Cloud](https://console.cloud.google.com/) OAuth 2.0 client
- An [ImgBB](https://imgbb.com/) API key (for image uploads)

---

### Clone the Repository

```bash
git clone <your-repo-url>
cd ASSIGNMENT-11
```

---

### Environment Variables

#### Server (`crowdfunding-server/.env`)

Copy the example file and fill in your values:

```bash
cd crowdfunding-server
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` \| `production` |
| `PORT` | Port for the Express server (default: `5000`) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_*` for dev) |

#### Client (`crowdfunding-client/.env.local`)

Copy the example file and fill in your values:

```bash
cd crowdfunding-client
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Random secret for Better Auth session signing |
| `BETTER_AUTH_URL` | URL of your Next.js app |
| `MONGODB_URI` | MongoDB Atlas URI (used by Better Auth adapter) |
| `AUTH_DB_NAME` | MongoDB database name |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express backend (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_*`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) |
| `IMGBB_API_KEY` | ImgBB API key (server-side) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB API key (client-side) |

---

### Running the Server

```bash
cd crowdfunding-server
npm install
npm run dev        # Development (with auto-reload)
# or
npm start          # Production
```

The API will be available at **http://localhost:5000**.

---

### Running the Client

```bash
cd crowdfunding-client
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📜 Available Scripts

### Client (`crowdfunding-client`)

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Server (`crowdfunding-server`)

| Script | Description |
|---|---|
| `npm run dev` | Start with `--watch` (auto-reload) |
| `npm start` | Start server normally |
| `npm run prod` | Start in production mode (`NODE_ENV=production`) |

---

## 🔌 API Overview

All endpoints are served from the Express backend at `http://localhost:5000`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/campaigns` | List all campaigns |
| `GET` | `/campaigns/:id` | Get a single campaign |
| `POST` | `/campaigns` | Create a campaign |
| `PATCH` | `/campaigns/:id` | Update a campaign |
| `DELETE` | `/campaigns/:id` | Delete a campaign |
| `GET` | `/contributions` | List contributions |
| `POST` | `/contributions` | Record a contribution |
| `POST` | `/create-payment-intent` | Stripe payment intent |
| `POST` | `/webhook` | Stripe webhook handler |
| `GET` | `/users` | List all users (admin) |
| `PATCH` | `/users/:id/role` | Update user role (admin) |

> **Note:** Protected routes require a valid session cookie issued by Better Auth.

---

## 👥 Roles & Dashboards

| Role | Access |
|---|---|
| **Guest** | Browse campaigns, view public pages |
| **Supporter** | Back campaigns, view contribution history |
| **Creator** | All supporter access + create/manage own campaigns |
| **Admin** | Full platform access — user & campaign management |

---

## 🌐 Deployment

### Client → Vercel

1. Push the `crowdfunding-client` folder to a GitHub repository.
2. Import the project on [Vercel](https://vercel.com).
3. Set all environment variables from `.env.example` in the Vercel dashboard.
4. Deploy.

### Server → Any Node.js Host (e.g. Render, Railway, VPS)

1. Set environment variables on your hosting platform.
2. Run `npm start` or use PM2 with the provided `ecosystem.config.js`:

```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

---

## 📄 License

This project is for educational purposes (Assignment 11). All rights reserved.
