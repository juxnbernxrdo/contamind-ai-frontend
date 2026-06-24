// Client-side simulation of NestJS Authentication API

export interface MockUser {
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  twoFAEnabled: boolean;
}

// In-memory mock session store that persists across navigation via sessionStorage
const STORAGE_KEY_USER = 'contamind_mock_user';
const STORAGE_KEY_SESSION = 'contamind_mock_session_active';
const STORAGE_KEY_LOCKED_UNTIL = 'contamind_mock_locked_until';

const setSessionCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const eraseSessionCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const getMockUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY_USER);
  return raw ? JSON.parse(raw) : null;
};

const setMockUser = (user: MockUser | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    sessionStorage.setItem(STORAGE_KEY_SESSION, 'true');
    setSessionCookie('contamind-refresh', 'mock-refresh-token');
  } else {
    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    eraseSessionCookie('contamind-refresh');
  }
};

export const getLockedUntil = (): number => {
  if (typeof window === 'undefined') return 0;
  const raw = sessionStorage.getItem(STORAGE_KEY_LOCKED_UNTIL);
  return raw ? parseInt(raw, 10) : 0;
};

export const setLockedUntil = (time: number) => {
  if (typeof window === 'undefined') return;
  if (time > 0) {
    sessionStorage.setItem(STORAGE_KEY_LOCKED_UNTIL, time.toString());
  } else {
    sessionStorage.removeItem(STORAGE_KEY_LOCKED_UNTIL);
  }
};

// Simulated network delay helper
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleMockRequest = async (url: string, method: string, data?: any): Promise<any> => {
  await delay(800); // Realistic network latency

  const normalizedUrl = url.replace(/^\/?api/, '').split('?')[0];

  // 1. Check account lock status
  const lockedUntil = getLockedUntil();
  if (lockedUntil > Date.now() && normalizedUrl !== '/auth/unlock') {
    throw {
      response: {
        status: 403,
        data: {
          message: 'Cuenta bloqueada temporalmente por exceso de intentos fallidos. Intente más tarde.',
          lockedUntil
        }
      }
    };
  }

  // 2. Routing requests
  switch (normalizedUrl) {
    case '/auth/login': {
      const { email, password } = data || {};
      
      // Case-by-case simulation inputs
      if (email === 'locked@contamind.com') {
        const unlockTime = Date.now() + 60 * 1000; // 1 minute lock
        setLockedUntil(unlockTime);
        throw {
          response: {
            status: 403,
            data: {
              message: 'Tu cuenta ha sido bloqueada temporalmente por 60 segundos debido a múltiples intentos de inicio de sesión fallidos.',
              lockedUntil: unlockTime
            }
          }
        };
      }

      if (email === 'error@contamind.com') {
        throw {
          response: {
            status: 500,
            data: { message: 'Internal Server Error. La base de datos de auditoría no respondió.' }
          }
        };
      }

      if (email === '2fa@contamind.com' && password === 'password123') {
        return {
          data: {
            requires2FA: true,
            userId: 'user_2fa_mock_id'
          }
        };
      }

      if (password !== 'password123') {
        throw {
          response: {
            status: 401,
            data: { message: 'Credenciales inválidas. Por favor verifique el correo y la contraseña.' }
          }
        };
      }

      // Default successful login
      const mockUser: MockUser = {
        id: 'mock_user_123',
        email: email || 'usuario@empresa.com',
        roles: ['Admin'],
        tenantId: 'tenant_ecuador_999',
        twoFAEnabled: false
      };
      setMockUser(mockUser);

      return {
        data: {
          success: true,
          accessToken: 'mock_jwt_access_token_header_secret',
          user: mockUser,
          securityWarnings: ['Has iniciado sesión desde un dispositivo nuevo (Linux OS)']
        }
      };
    }

    case '/auth/register': {
      const { email } = data || {};
      if (email === 'taken@contamind.com') {
        throw {
          response: {
            status: 400,
            data: { message: 'El correo electrónico ingresado ya se encuentra registrado.' }
          }
        };
      }
      return {
        data: {
          success: true,
          message: 'Registro exitoso. Se ha enviado un correo de verificación.'
        }
      };
    }

    case '/auth/refresh': {
      const activeUser = getMockUser();
      if (!activeUser) {
        throw {
          response: {
            status: 401,
            data: { message: 'Sesión expirada o inválida' }
          }
        };
      }
      return {
        data: {
          accessToken: 'mock_jwt_refreshed_token',
          user: activeUser
        }
      };
    }

    case '/auth/logout': {
      setMockUser(null);
      return {
        data: { success: true }
      };
    }

    case '/auth/2fa/verify': {
      const { totpToken, userId } = data || {};
      if (totpToken === '123456') {
        const mockUser: MockUser = {
          id: userId || 'user_2fa_mock_id',
          email: '2fa@contamind.com',
          roles: ['Admin'],
          tenantId: 'tenant_ecuador_999',
          twoFAEnabled: true
        };
        setMockUser(mockUser);
        return {
          data: {
            accessToken: 'mock_jwt_access_token_header_secret_2fa',
            user: mockUser
          }
        };
      } else {
        throw {
          response: {
            status: 400,
            data: { message: 'Código de verificación 2FA incorrecto. Asegúrese de ingresar el token actual de su app.' }
          }
        };
      }
    }

    case '/auth/setup-2fa': {
      return {
        data: {
          qrCodeUrl: 'https://picsum.photos/200/200',
          secret: 'KVKVE43VOB2W4Y3V'
        }
      };
    }

    case '/auth/setup-2fa/verify': {
      const { token } = data || {};
      if (token === '123456') {
        const currentUser = getMockUser();
        if (currentUser) {
          currentUser.twoFAEnabled = true;
          setMockUser(currentUser);
        }
        return {
          data: {
            success: true,
            recoveryCodes: [
              'ABCD-1234-EFGH',
              'IJKL-5678-MNOP',
              'QRST-9012-UVWX',
              'YZAB-3456-CDEF',
              'GHIJ-7890-KLMN',
              'OPQR-1234-STUV',
              'WXYZ-5678-ABCD',
              'EFGH-9012-IJKL'
            ]
          }
        };
      } else {
        throw {
          response: {
            status: 400,
            data: { message: 'Código de confirmación incorrecto.' }
          }
        };
      }
    }

    case '/auth/forgot-password': {
      const { email } = data || {};
      if (email === 'nonexistent@contamind.com') {
        throw {
          response: {
            status: 404,
            data: { message: 'No se encontró ninguna cuenta asociada a este correo electrónico.' }
          }
        };
      }
      return {
        data: { success: true }
      };
    }

    case '/auth/reset-password': {
      return {
        data: { success: true }
      };
    }

    case '/auth/verify-email': {
      const { token } = data || {};
      if (token === 'invalid-token') {
        throw {
          response: {
            status: 400,
            data: { message: 'El enlace de verificación es inválido o ha expirado.' }
          }
        };
      }
      return {
        data: { success: true }
      };
    }

    case '/auth/reauth': {
      const { password } = data || {};
      if (password === 'password123') {
        return {
          data: {
            reauthToken: 'mock_reauth_security_token_valid'
          }
        };
      } else {
        throw {
          response: {
            status: 401,
            data: { message: 'Contraseña incorrecta. Reautenticación fallida.' }
          }
        };
      }
    }

    case '/auth/passkeys/register': {
      return {
        data: {
          challenge: 'mock_passkey_creation_challenge',
          rp: { name: 'ContaMind AI' },
          user: { id: 'mock_user_123', name: 'usuario@empresa.com', displayName: 'Usuario ContaMind' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }]
        }
      };
    }

    case '/auth/passkeys/verify': {
      const currentUser = getMockUser() || {
        id: 'mock_user_123',
        email: 'passkey@contamind.com',
        roles: ['Admin'],
        tenantId: 'tenant_ecuador_999',
        twoFAEnabled: false
      };
      setMockUser(currentUser);
      return {
        data: {
          success: true,
          accessToken: 'mock_passkey_jwt_token',
          user: currentUser
        }
      };
    }

    case '/dashboard/stats': {
      return {
        data: {
          activeSessions: 3,
          devices: 2,
          revenue: 47820,
          pendingInvoices: 8,
          systemStatus: 'Operando con normalidad'
        }
      };
    }

    default:
      throw {
        response: {
          status: 404,
          data: { message: `Endpoint mock no encontrado: ${normalizedUrl}` }
        }
      };
  }
};
