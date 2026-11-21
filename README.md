# FixMate — Smart Device & Home Appliance Repair

FixMate connects people who need something fixed with verified repair technicians. A customer books a repair, follows the job step by step (Requested → Accepted → In Progress → Completed) and pays with Stripe **only after the work is done**. Technicians publish services that an admin approves, and the admin manages users, services, bookings and payments.

- **Live site:** https://fixmate-client-lac.vercel.app
- **API server:** https://fixmate-server-sage.vercel.app ([server repo](https://github.com/Istiak0614/fixmate-server))

## Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixmate.com` | `Admin123` |
| Technician (Pro) | `rafi.tech@fixmate.demo` | `Demo123` |
| Technician (Free, at the 3-service limit) | `tanvir.tech@fixmate.demo` | `Demo123` |
| Customer | `nusrat@fixmate.demo` | `Demo123` |

Stripe is in test mode: pay with card `4242 4242 4242 4242`, any future date and any CVC.
The seeded data includes approved services and bookings in every status, so every flow can be checked right away.

## Key features

**Customers**
- Browse approved services with server-side **search, category, service mode and price-range filters, sorting and pagination**
- Request a repair (phone, address, preferred date, problem description) with full validation
- **Job Timeline Tracker** for every booking; cancel while it is still "Requested"
- **Pay Now** with Stripe Checkout once the job is completed (the amount comes from the server, never the browser)
- Payment history with a downloadable **PDF invoice**
- **Rate & review** a paid job once; ratings show on cards and service pages

**Technicians**
- Add, edit, pause and delete services (image upload to ImgBB); edited services go back to admin review
- Accept / reject requests and move jobs through the status pipeline; set the final amount on completion
- **Pro Technician Plan** ($9.99/month Stripe subscription): unlimited services and a **Verified Pro** badge; the Free plan allows 3 services; cancel any time

**Admin**
- Overview stats and charts (users, technicians, pending services, revenue for the last 6 months)
- Manage users and change roles (never their own), approve or reject services (pending first)
- All bookings (read-only, status filter) and all transactions with total revenue

**Everywhere**
- Email/password and **Google** sign-in with BetterAuth; nobody can sign up as admin
- Role-protected pages (Next.js proxy) and API routes (JWT in an HttpOnly cookie + role middlewares)
- Stripe **webhook** saves each payment exactly once and keeps the Pro plan in sync
- Dark / light mode, responsive layouts, reduced-motion support, friendly 404, loading and error pages

## Tech stack & npm packages

| Area | Packages |
|---|---|
| Framework | `next` (App Router), `react`, `react-dom`, `typescript` |
| UI | `tailwindcss`, shadcn/ui (`radix-ui`, `clsx`, `tailwind-merge`), `lucide-react`, `framer-motion`, `next-themes`, `sonner` |
| Charts & PDF | `recharts`, `jspdf`, `jspdf-autotable` |
| Auth | `better-auth` (MongoDB adapter), `mongodb`, `server-only` |

Server: Express 5, native MongoDB driver, `jsonwebtoken`, `cookie-parser`, `cors`, `stripe` (see the server README).

## Run locally

```bash
git clone https://github.com/Istiak0614/fixmate-client.git
cd fixmate-client
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000 (start the server on :5000 first)
```

### Environment variables (`.env.local`)

| Name | What it is |
|---|---|
| `SERVER_URL` | Express API URL (`http://localhost:5000` locally); `/api/*` is forwarded there |
| `MONGODB_URI`, `DB_NAME` | MongoDB Atlas connection used by BetterAuth (same database as the server) |
| `BETTER_AUTH_SECRET` | Random secret for BetterAuth sessions |
| `BETTER_AUTH_URL` | This site's URL (`http://localhost:3000` or the production domain) |
| `TRUSTED_ORIGINS` | Comma-separated allowed origins (local + production) |
| `IMGBB_API_KEY` | ImgBB key, used only on the server side of Next.js (`/api/upload`) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth client for "Continue with Google" |

Real `.env.local` files are git-ignored; only `.env.example` is committed.