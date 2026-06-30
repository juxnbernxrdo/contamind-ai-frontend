# ContaMind AI — Library Utilities

Core utilities, API client, and mock authentication system.

---

## API Client (`lib/api-client.ts`)

Centralized Axios instance with JWT-based authentication.

### Configuration

- **Base URL**: `NEXT_PUBLIC_API_URL` environment variable
- **Credentials**: `withCredentials: true` for cookie-based refresh tokens
- **XSRF**: Cookie `XSRF-TOKEN` sent as `X-XSRF-TOKEN` header

### JWT Handling

Access tokens are stored in memory and injected via request interceptor:

```typescript
import { setAccessToken } from '@/lib/api-client';
setAccessToken(newAccessToken);
```

### 401 Response Handling

Automatic token refresh with concurrency control:

1. Detects 401 errors on protected routes
2. Queues concurrent requests during refresh
3. Refreshes token via `POST /auth/refresh`
4. Retries original request with new token
5. Redirects to `/auth/login` on failure

---

## Mock Auth System (`lib/mock-auth.ts`)

Client-side simulation of the NestJS authentication API for frontend development without a backend.

### How to Enable

```typescript
// lib/api-client.ts
const USE_MOCK = true;
```

### Simulated Routes

| Route | Method | Behavior |
|---|---|---|
| `/auth/login` | POST | Validates credentials, returns JWT |
| `/auth/logout` | POST | Clears session |
| `/auth/refresh` | POST | Refreshes token |
| `/auth/2fa/verify` | POST | Verifies TOTP codes |
| `/auth/sessions` | GET/DELETE | Session management |
| `/auth-admin/users` | GET | User list |
| `/auth-admin/audit-logs` | GET | Audit logs |

### Test Accounts

| Email | Behavior |
|---|---|
| `locked@contamind.com` | Account lockout simulation |
| `expired@contamind.com` | Expired session |
| `twofa@contamind.com` | Requires 2FA verification |
| `backup@contamind.com` | Backup code flow |

### Session Persistence

Uses `sessionStorage` for mock state:
- `contamind_mock_user`: User data
- `contamind_mock_session_active`: Session flag
- `contamind_mock_locked_until`: Lock timestamp

---

## Utilities (`lib/utils.ts`)

### `cn()` Function

Combines `clsx` and `tailwind-merge` for conditional class names:

```typescript
import { cn } from '@/lib/utils';
const className = cn('base', isActive && 'active', isDisabled && 'opacity-50');
```

---

## Security Considerations

| Concern | Implementation |
|---|---|
| Token storage | Access tokens in memory, refresh tokens in HttpOnly cookies |
| XSRF protection | Backend sets `XSRF-TOKEN` cookie; frontend sends `X-XSRF-TOKEN` header |
| No sensitive data in URLs | All auth data sent via headers or request body |
| Mock mode | Uses `sessionStorage`, tokens are not cryptographic |
