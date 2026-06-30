# ContaMind AI — Frontend

AI-powered accounting platform for Ecuadorian SMEs. Built with Next.js 16, React 19, and Tailwind CSS 4.

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.2.6 |
| UI Library | React | 19.2.6 |
| Language | TypeScript | 6.0.3 |
| CSS | Tailwind CSS | 4.2.4 |
| Forms | React Hook Form | 7.75.0 |
| Validation | Zod | 4.4.3 |
| HTTP Client | Axios | 1.16.1 |
| Icons | Lucide React | 1.16.0 |
| Animations | Motion | 12.38.0 |
| Toasts | Sonner | 2.0.7 |
| AI SDK | Google GenAI | 2.0.0 |
| WebAuthn | SimpleWebAuthn | 13.3.0 |
| E2E Testing | Playwright | 1.60.0 |
| Linting | ESLint (Next) | 9.39.4 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- NestJS backend running (default: `http://localhost:3001`)

### Installation

```bash
git clone <repository-url>
cd contamind-ai-frontend
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (NestJS) | `http://localhost:3001` |
| `GEMINI_API_KEY` | Google Gemini AI API key | — |
| `APP_URL` | Application base URL | — |

### Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

---

## Project Structure

```
contamind-ai-frontend/
├── app/
│   ├── auth/                  # Auth flows (login, register, 2FA, etc.)
│   ├── dashboard/             # Dashboard shell (protected)
│   │   ├── admin/users/       # Admin user management
│   │   ├── audit/             # Audit logs
│   │   ├── compliance/        # Compliance reports
│   │   ├── profile/           # User profile
│   │   ├── security/          # Security settings, sessions, devices
│   │   ├── settings/          # App settings
│   │   └── [...slug]/         # Catch-all for unbuilt modules
│   ├── blog/                  # Blog section
│   ├── caracteristicas/       # Features page
│   ├── clientes/              # Clients page
│   ├── contacto/              # Contact page
│   ├── documentacion/         # Documentation page
│   ├── legal/                 # Legal pages
│   ├── nosotros/              # About page
│   ├── precios/               # Pricing page
│   ├── roadmap/               # Roadmap page
│   ├── seguridad/             # Security page
│   ├── globals.css            # Global styles and design tokens
│   ├── layout.tsx             # Root layout (fonts, ThemeProvider, AuthProvider)
│   └── page.tsx               # Landing page (homepage)
├── components/
│   ├── auth/                  # Auth form components
│   ├── dashboard/             # Dashboard shell (Sidebar, Topbar, nav-config)
│   ├── landing/               # Landing page sections (Hero, Features, Pricing)
│   ├── ui/                    # Reusable UI primitives (Avatar, NavButton)
│   ├── Logo.tsx               # Brand logo
│   ├── MarketingLayout.tsx    # Marketing page layout wrapper
│   └── ThemeProvider.tsx      # Dark/light theme provider
├── hooks/                     # Custom React hooks (auth, data, UI)
├── lib/                       # API client, mock auth, utilities
├── tests/e2e/                 # Playwright end-to-end tests
└── proxy.ts                   # Route protection middleware
```

---

## Architecture Overview

### App Router

Next.js App Router with clear separation between public marketing pages and protected dashboard routes. Marketing pages use a `MarketingLayout` wrapper. Dashboard routes are nested under `/dashboard` with a sidebar-based shell layout.

### Authentication

JWT-based auth with refresh token rotation. Access tokens are held in memory and injected via Axios request interceptors. Refresh tokens are managed server-side via HttpOnly cookies. The API client (`lib/api-client.ts`) handles 401 responses with automatic token refresh and concurrent request queuing. WebAuthn passkey support is integrated via SimpleWebAuthn.

### Design System

A component-driven design system following Apple Human Interface Guidelines. Tokens, typography, colors, spacing, shadows, and component patterns are documented in `contamind-design-prd.md`. Key principles: flat color palette, generous whitespace, Instrument Serif for headlines, Geist Sans for UI, and minimal motion.

### API Client

Centralized Axios instance at `lib/api-client.ts` with automatic JWT injection, 401 response handling with token refresh, concurrent request queuing during refresh, XSRF cookie/header support, and configurable backend URL via `NEXT_PUBLIC_API_URL`.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint .` | Run ESLint |
| `clean` | `next clean` | Clean build artifacts |

---

## Testing

End-to-end tests use Playwright. Tests are located in `tests/e2e/` and run against Chromium.

```bash
npx playwright install chromium
npx playwright test
```

---

## Deployment

The application is configured for standalone output (`next.config.ts`), producing a self-contained build suitable for Docker containers.

---

## Documentation

| File | Description |
|---|---|
| `contamind-design-prd.md` | Design system reference: colors, typography, spacing, components, motion |
| `contamind-frontend-prd.md` | Frontend product specification: stack, architecture, modules |
| `ContaMind_AI_PRD_v2.md` | Full product requirements document: vision, architecture, AI agents, ERP modules |
