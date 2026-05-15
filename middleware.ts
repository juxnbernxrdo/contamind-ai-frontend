import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de protección de rutas.
 * Verifica la existencia de la cookie de sesión antes de permitir el acceso
 * a rutas privadas como /dashboard o /profile.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('contamind-refresh');

  // Rutas que requieren estar logueado
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/profile') ||
    pathname.startsWith('/api/proxy'); // si tuviéramos un proxy

  // Rutas que solo se pueden ver si NO estás logueado (login/register)
  const isAuthRoute = 
    pathname.startsWith('/auth/login') || 
    pathname.startsWith('/auth/register');

  if (isProtectedRoute && !sessionCookie) {
    // Redirigir al login si intenta entrar a dashboard sin sesión
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && sessionCookie) {
    // Redirigir al dashboard si ya está logueado e intenta ir al login
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configuración de rutas a interceptar
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/login',
    '/auth/register',
  ],
};
