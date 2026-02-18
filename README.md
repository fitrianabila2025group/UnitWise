# UnitWise – Free Online Unit Converter Hub

A production-ready, SEO-optimized, ad-friendly unit converter website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**. Designed for programmatic SEO at scale with 150–300+ converter pages generated from the database.

**Live:** [https://unitwise.online](https://unitwise.online)

---

## Features

- **250+ Conversion Rules** across 12 categories (length, weight, temperature, area, volume, speed, time, data, pressure, energy, power, fuel economy)
- **Programmatic SEO** – every conversion gets its own optimised page with unique meta, JSON-LD schema (BreadcrumbList, WebPage, SoftwareApplication, FAQPage), and FAQ
- **Full Admin Panel** – manage conversions, categories, SEO pages, FAQs, internal links, ads, users, and site settings
- **Ad Network Support** – Google AdSense, Adsterra, Monetag, HilltopAds, or custom HTML; per-slot control from admin
- **GDPR Cookie Consent** – built-in cookie banner with CMP-compatible toggle
- **XML Sitemaps** – sitemap index with separate sitemaps for conversions, categories, and static pages
- **robots.txt & ads.txt** – dynamically generated from database
- **Docker Compose** – one-command deployment with PostgreSQL, ready for PhalaCloud

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Framework      | Next.js 15 (App Router)           |
| Language       | TypeScript (strict)                |
| Styling        | Tailwind CSS + shadcn/ui           |
| Database       | PostgreSQL 16                      |
| ORM            | Prisma 6                           |
| Auth           | NextAuth v4 (Credentials + JWT)    |
| Ads            | AdSense / Adsterra / Monetag / Custom |
| Deployment     | Docker Compose (PhalaCloud-ready)  |
| Testing        | Jest + ts-jest                     |

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm

### 1. Clone & Install

```bash
git clone https://github.com/your-org/unitwise.git
cd unitwise
cp .env.example .env
npm install
```

### 2. Configure Environment

Edit `.env`:

```dotenv
DATABASE_URL="postgresql://unitwise:password@localhost:5432/unitwise?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
ADMIN_EMAIL="admin@unitwise.online"
ADMIN_PASSWORD="Admin@123456"
```

### 3. Setup Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Production Deployment (Docker Compose)

> **PhalaCloud note:** This setup does NOT rely on `.env` files. All configuration is passed via `docker-compose.yml` environment variables.

### 1. Build & Start

```bash
docker compose up -d --build
```

This will:
1. Start PostgreSQL 16 with a health check
2. Wait for the DB to be healthy
3. Run `prisma migrate deploy` and `prisma db seed`
4. Start the Next.js production server on port 3000

### 2. Customise

Edit the `environment` section in `docker-compose.yml`:

```yaml
environment:
  DATABASE_URL: "postgresql://unitwise:your_password@db:5432/unitwise?schema=public"
  NEXTAUTH_URL: "https://unitwise.online"
  NEXTAUTH_SECRET: "a-real-random-secret"
  ADMIN_EMAIL: "admin@unitwise.online"
  ADMIN_PASSWORD: "YourStrongPassword!"
```

### 3. Reverse Proxy (Nginx / Caddy)

Place behind a reverse proxy with SSL. Example Caddy:

```
unitwise.online {
  reverse_proxy localhost:3000
}
```

---

## Admin Panel

Access the admin panel at `/admin/login`.

**Default credentials** (set via environment variables):
- Email: `admin@unitwise.online` (or `ADMIN_EMAIL`)
- Password: `Admin@123456` (or `ADMIN_PASSWORD`)

### Admin Pages

| Route                      | Description                        |
| -------------------------- | ---------------------------------- |
| `/admin`                   | Dashboard with stats               |
| `/admin/conversions`       | Manage conversion rules            |
| `/admin/categories`        | Manage categories                  |
| `/admin/pages`             | SEO pages editor                   |
| `/admin/faqs`              | FAQ management                     |
| `/admin/internal-links`    | Internal link blocks               |
| `/admin/ads`               | Full ads manager (tabbed UI)       |
| `/admin/users`             | User management                    |
| `/admin/site-settings`     | Site name, URL, tagline, etc.      |

---

## Ads Management

The admin ads panel (`/admin/ads`) supports:

1. **General** – select provider (AdSense/Adsterra/Monetag/HilltopAds/Custom), enable/disable, GDPR mode
2. **Slots** – enable/disable and configure HTML for each ad slot (top banner, sidebar, in-content, footer, mobile sticky)
3. **AdSense** – client ID and publisher ID fields
4. **Global Codes** – inject custom `<head>` and `<body>` HTML
5. **Verification** – readiness checklist

### ads.txt

The `ads.txt` file is served dynamically at `/ads.txt` from the database setting `ads.adsTxtContent`. Update it from the admin panel.

---

## SEO Endpoints

| Endpoint                        | Description                    |
| ------------------------------- | ------------------------------ |
| `/sitemap.xml`                  | Sitemap index                  |
| `/sitemaps/conversions.xml`     | All conversion page URLs       |
| `/sitemaps/categories.xml`      | All category page URLs         |
| `/sitemaps/pages.xml`           | Static/policy page URLs        |
| `/robots.txt`                   | Dynamically generated          |
| `/ads.txt`                      | From DB, AdSense-ready         |
| `/api/health`                   | Health check endpoint          |

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover:
- LINEAR conversions (kg↔lb, m↔ft, km↔mi, sqm↔sqft)
- AFFINE conversions (°C↔°F, °C↔K)
- Edge cases (zero, negative, large/small numbers)
- `generateExamples()` helper

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Full data model
│   └── seed.ts                # Idempotent seed (250+ rules)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (ads head, consent, toaster)
│   │   ├── page.tsx           # Homepage
│   │   ├── convert/
│   │   │   ├── page.tsx       # All converters hub
│   │   │   └── [slug]/page.tsx # Dynamic converter page
│   │   ├── categories/[slug]/ # Category pages
│   │   ├── admin/             # Full admin panel
│   │   ├── api/               # API routes
│   │   └── (policy pages)     # about, privacy, terms, etc.
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── converter-widget.tsx
│   │   ├── ad-slot.tsx
│   │   └── ...
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── conversion.ts      # convert() + generateExamples()
│       ├── auth.ts            # requireAdmin helper
│       ├── settings.ts        # Cached site/ad settings
│       └── utils.ts           # cn() helper
├── tests/
│   └── conversion.test.ts
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
└── package.json
```

---

## Environment Variables

| Variable         | Required | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `DATABASE_URL`   | Yes      | PostgreSQL connection string             |
| `NEXTAUTH_URL`   | Yes      | Public URL of the app                    |
| `NEXTAUTH_SECRET`| Yes      | Random secret for JWT signing            |
| `ADMIN_EMAIL`    | Yes      | Initial admin email (used by seed)       |
| `ADMIN_PASSWORD` | Yes      | Initial admin password (used by seed)    |

---

## License

Private – All rights reserved.