import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('contamind-refresh');

  // Rutas protegidas que requieren autenticación
  const isProtectedRoute = pathname.startsWith('/dashboard');

  // Rutas de autenticación (no accesibles si ya se está logueado)
  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/2fa');

  if (isProtectedRoute && !sessionCookie) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && sessionCookie) {
    // Redirigir al dashboard si ya está autenticado
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/2fa',
  ],
};
