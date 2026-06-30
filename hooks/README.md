# ContaMind AI — Custom React Hooks

Custom hooks for authentication, data fetching, and UI state management.

---

## Hook Catalog

| Hook | File | Purpose | Backend Endpoints |
|---|---|---|---|
| `useAuth` | `use-auth.tsx` | Auth state machine, login/logout, 2FA, cross-tab sync | `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/2fa/verify` |
| `useDashboardStats` | `use-dashboard-stats.ts` | Dashboard metrics | `/dashboard/stats` |
| `useAdminUsers` | `use-admin-users.ts` | User management with actions | `/auth-admin/users`, `/auth-admin/users/:id/*` |
| `useAuditLogs` | `use-audit-logs.ts` | Audit log retrieval | `/auth-admin/audit-logs`, `/auth-admin/audit-logs/verify` |
| `useComplianceReports` | `use-compliance-reports.ts` | Report generation/export | `/compliance/reports`, `/compliance/reports/generate` |
| `useSessions` | `use-sessions.ts` | Session management | `/auth/sessions`, `/auth/sessions/:id` |
| `useIsMobile` | `use-mobile.ts` | Responsive viewport detection | None (client-side) |

---

## Authentication Hook (`useAuth`)

### State Machine

```
IDLE -> HYDRATING -> AUTHENTICATED/IDLE
IDLE -> AUTH_PENDING -> AWAITING_2FA/AUTHENTICATED/IDLE
AWAITING_2FA -> AUTH_PENDING -> AUTHENTICATED/IDLE
AUTHENTICATED -> REFRESHING -> AUTHENTICATED/IDLE
AUTHENTICATED -> TERMINATED -> IDLE
```

### Methods

| Method | Parameters | Description |
|---|---|---|
| `login` | `{ email, password }` | Authenticate with credentials |
| `logout` | — | End session and broadcast to other tabs |
| `refresh` | `shouldBroadcast?` | Refresh access token |
| `verify2FA` | `code, isBackup?, userId?` | Verify TOTP or backup code |
| `setUser` | `user` | Update user state |
| `setAuthState` | `state` | Force auth state transition |

### Cross-Tab Synchronization

Uses `BroadcastChannel('contamind_auth_channel')` for state sync:

| Event | Behavior |
|---|---|
| `LOGIN` | Syncs session to other tabs |
| `SESSION_CHANGED` | Triggers refresh on other tabs |
| `LOGOUT` | Logs out all tabs |

### Token Management

- Access tokens stored in memory (not localStorage)
- Refresh tokens via HttpOnly cookies
- Automatic refresh with concurrency control via localStorage lock

---

## Data Fetching Hooks

All data hooks follow the pattern: `{ data, loading, error, refetch }`.

### useDashboardStats

Returns aggregated dashboard metrics: `activeSessions`, `devices`, `revenue`, `pendingInvoices`, `systemStatus`.

### useAdminUsers

Supports pagination, search, role filtering. Actions: `lockUser`, `unlockUser`, `disableUser`, `enableUser`, `revokeUserSessions`.

### useAuditLogs

Supports pagination and filtering by action/severity. Includes `verifyIntegrity()` for tamper detection.

### useComplianceReports

Supports filtering by report type and status. Actions: `generateReport(params)`, `exportReport(reportId, format)`.

### useSessions

Returns active sessions with `revokeSession(id)` and `revokeAll()` actions.

---

## UI Hooks

### useIsMobile

Detects viewport below 768px. Listens for resize events. Returns boolean.

---

## Usage Example

```tsx
'use client';
import { useAuth } from '@/hooks/use-auth';

export function ProtectedComponent() {
  const { user, loading, state, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (state === 'AWAITING_2FA') return <TwoFactorForm />;
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  return <LoginForm onSubmit={(dto) => login(dto)} />;
}
```

---

## Backend Integration

| Category | Endpoint | Method | Description |
|---|---|---|---|
| Auth | `/auth/login` | POST | User login |
| Auth | `/auth/logout` | POST | End session |
| Auth | `/auth/refresh` | POST | Refresh token |
| Auth | `/auth/2fa/verify` | POST | Verify 2FA |
| Auth | `/auth/sessions` | GET/DELETE | Session management |
| Dashboard | `/dashboard/stats` | GET | Aggregated metrics |
| Admin | `/auth-admin/users` | GET | List users |
| Admin | `/auth-admin/users/:id/*` | POST | User actions |
| Audit | `/auth-admin/audit-logs` | GET | Audit logs |
| Compliance | `/compliance/reports` | GET | List reports |
| Compliance | `/compliance/reports/generate` | POST | Generate report |
