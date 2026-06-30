import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('contamind-refresh');

  // Rutas protegidas que requieren autenticación
  const isProtectedRoute = pathname.startsWith('/dashboard');

  if (isProtectedRoute && !sessionCookie) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
