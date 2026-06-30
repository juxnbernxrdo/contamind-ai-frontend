# ContaMind AI — Dashboard Module

Main application shell for authenticated users. Provides the layout, navigation, KPI summaries, user profile management, settings, and a catch-all route for unbuilt business modules.

---

## Routes

| Route | File | Description |
|---|---|---|
| `/dashboard` | `page.tsx` | Home -- KPI cards, quick actions, account status |
| `/dashboard/profile` | `profile/page.tsx` | User profile management |
| `/dashboard/settings` | `settings/page.tsx` | Preferences, security, privacy |
| `/dashboard/[...slug]` | `[...slug]/page.tsx` | Catch-all for unbuilt modules |

---

## Dashboard Layout

`app/dashboard/layout.tsx` wraps every dashboard page:

- **Auth guard**: Redirects to `/auth/login` if unauthenticated
- **Loading state**: Pulsing `BrainCircuit` icon while auth hydrates
- **Animated sidebar**: Spring physics (stiffness: 350, damping: 30, mass: 0.8)
- **Topbar**: Driven by the same spring as sidebar width
- **Content area**: `motion.main` with padding driven by sidebar spring

```
+------+
| Side |  +--Topbar (animated left)--+
| bar  |  |                          |
| 64-  |  |   Content Area           |
| 260  |  |   (max-w-1400px)         |
|  px  |  |                          |
+------+  +--------------------------+
```

---

## Sidebar Architecture

| Feature | Detail |
|---|---|
| Width | Collapsed: 64px / Expanded: 260px |
| Animation | `useSpring` with stiffness 350, damping 30, mass 0.8 |
| Collapse state | Persisted in `localStorage` (`contamind_sidebar_collapsed`) |
| Hover expand | Expands on hover when collapsed (desktop only) |
| Mobile | Full drawer overlay with backdrop |
| Search | Built-in search for navigation items |
| RBAC | Navigation filtered by user roles via `nav-config.ts` |

---

## Dashboard Home

Displays time-based greeting, KPI stat cards (transactions, documents, active users, health score), quick action shortcuts, and account status information. Data sourced from `useDashboardStats()` hook.

---

## Profile Page

| Feature | Detail |
|---|---|
| Avatar upload | File input with preview and API upload |
| Field editing | First name, last name, username -- inline editable |
| Password change | Current + new password with confirmation |
| 2FA management | Enable/disable two-factor authentication |
| Session list | View active sessions with device info |
| Account deletion | Destructive action with reauth confirmation |

---

## Settings Page

Three-tab layout:

| Tab | Content |
|---|---|
| Preferences | Timezone, language, inactivity timeout, remember-me toggle |
| Security | Password change, passkey management, trusted devices, sessions |
| Privacy | Data export (GDPR), account deletion, consent management |

---

## Under Construction

`app/dashboard/[...slug]/page.tsx` catches all unimplemented routes. Renders `UnderConstruction` component with auto-generated breadcrumbs from URL segments and contextual backend hints based on module prefix.

---

## Navigation Configuration

`components/dashboard/nav-config.ts` defines:

- **20+ sections** grouped by domain (Contabilidad, Facturacion, CRM, RRHH, etc.)
- **150+ items** with `label`, `icon`, `href`, and optional `roles` for RBAC
- **`soon` flag** for modules not yet built
- **`isNew` flag** for recently added features

Items are filtered client-side based on `user.roles` from the auth context.

---

## Backend Integration

| Endpoint | Method | Purpose |
|---|---|---|
| `/users/profile` | GET | Fetch user profile |
| `/users/profile` | PATCH | Update profile fields |
| `/users/profile/avatar` | POST | Upload avatar |
| `/dashboard/stats` | GET | Aggregated dashboard statistics |
| `/auth/sessions` | GET/DELETE | Session management |
| `/auth/webauthn/register/options` | POST | Passkey registration |
