# ContaMind AI — Components

Reusable UI components organized by domain. All components use `"use client"` directives, Tailwind CSS for styling, and follow the design system tokens defined in `app/globals.css`.

---

## Design System Primitives (`components/ui/`)

| Component | File | Description |
|---|---|---|
| `Avatar` | `ui/Avatar.tsx` | Avatar with image or initials fallback, status indicator (online/offline), three sizes (sm/md/lg) |
| `NavButton` | `ui/NavButton.tsx` | Shared navigation button with active states, icon animation, badge rendering, collapsed tooltip, suffix slot |

---

## Dashboard Shell (`components/dashboard/`)

| Component | File | Description |
|---|---|---|
| `Sidebar` | `dashboard/Sidebar.tsx` | Collapsible sidebar (64px-260px) with spring animation, hover-expand, search, RBAC filtering, mobile drawer, user dropdown footer |
| `SidebarNavItem` | `dashboard/SidebarNavItem.tsx` | Thin wrapper around `NavButton` for sidebar navigation items |
| `Topbar` | `dashboard/Topbar.tsx` | Fixed top bar with breadcrumbs (auto-generated from pathname), theme toggle, notification bell, glass morphism |
| `UserMenu` | `dashboard/UserMenu.tsx` | Navbar user dropdown with avatar, profile links, and logout |
| `UnderConstruction` | `dashboard/UnderConstruction.tsx` | Placeholder for unbuilt modules with contextual breadcrumbs and backend hints |
| `nav-config` | `dashboard/nav-config.ts` | Centralized navigation tree: 20+ sections, 150+ items, RBAC filtering, `soon`/`isNew` flags |

---

## Authentication (`components/auth/`)

| Component | File | Description |
|---|---|---|
| `AuthNotification` | `auth/AuthNotification.tsx` | Alert banner for errors, success, warnings, and info messages with icon variants |
| `CooldownTimer` | `auth/CooldownTimer.tsx` | Countdown timer component + `useCooldown` hook with localStorage persistence |
| `EmailSentCard` | `auth/EmailSentCard.tsx` | Email-sent confirmation card with resend button and cooldown timer |
| `VerificationStatus` | `auth/VerificationStatus.tsx` | Verification state indicator: loading spinner, success checkmark, error state with animations |
| `PasswordStrength` | `auth/PasswordStrength.tsx` | Password strength meter with 5 criteria, progress bar, and checklist |
| `PlanSelector` | `auth/PlanSelector.tsx` | Plan selection with digital certificate upload (.p12/.pfx) |

---

## Landing & Marketing (`components/landing/`)

| Component | File | Description |
|---|---|---|
| `HeroSection` | `landing/HeroSection.tsx` | Hero with animated text rotation and dual CTA buttons |
| `FeaturesSection` | `landing/FeaturesSection.tsx` | 6-feature grid with icons and descriptions |
| `PricingSection` | `landing/PricingSection.tsx` | 3-tier pricing cards (Starter/Professional/Enterprise) |
| `AppMockupSection` | `landing/AppMockupSection.tsx` | Interactive app mockup with tab switching, invoice list, bar charts |
| `animations` | `landing/animations.ts` | Shared motion variants (`fadeIn`, `staggerContainer`) |

---

## Shared Components

| Component | File | Description |
|---|---|---|
| `ThemeProvider` | `ThemeProvider.tsx` | Dark/light theme context with localStorage persistence, system preference detection, FOUC prevention |
| `MarketingLayout` | `MarketingLayout.tsx` | Marketing page wrapper with responsive Navbar (dropdown menus, auth-aware) and Footer |
| `Logo` | `Logo.tsx` | Brand logo with BrainCircuit icon + "ContaMindAI" text, configurable size |

---

## Component Architecture

```
app/layout.tsx
├── ThemeProvider
├── AuthProvider
└── {children}

app/page.tsx (Marketing)
└── MarketingLayout
    ├── Navbar
    ├── {children}
    └── Footer

app/dashboard/layout.tsx (Dashboard)
├── Sidebar (animated, collapsible)
├── Topbar (glass morphism, breadcrumbs)
└── motion.main {children}
```

---

## Design System Integration

All components reference CSS custom properties from `app/globals.css`:

- **Colors**: `var(--accent)`, `var(--text-1)` through `var(--text-4)`, `var(--border-light)`
- **Radius**: `var(--radius-lg)` (18px), `var(--radius-md)` (14px), `var(--radius-sm)` (10px)
- **Shadows**: `var(--shadow-subtle)`, `var(--shadow-default)`, `var(--shadow-prominent)`
- **Typography**: `var(--font-instrument)` (serif), `var(--font-geist)` (sans)

---

## Adding New Components

1. Place in the appropriate domain directory (`ui/`, `dashboard/`, `auth/`, `landing/`).
2. Use `"use client"` directive for client-side interactivity.
3. Accept className prop for composition via `cn()` utility.
4. Reference design tokens (CSS variables) instead of hardcoded values.
5. Export as named export from an `index.ts` barrel file when grouping.
