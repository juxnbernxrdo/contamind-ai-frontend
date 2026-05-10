import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que no requieren sesión
const PUBLIC_ROUTES = /^\/(auth|caracteristicas|precios|clientes|blog|documentacion|api-docs|nosotros|contacto|seguridad|roadmap|legal)(\/.*)?$/

// Rutas que SÍ requieren AAL2 (2FA completado)
const REQUIRES_AAL2 = /^\/app\/(configuracion\/seguridad|billing)(\/.*)?$/

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No intercalar código entre createServerClient y getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublicRoute = pathname === '/' || PUBLIC_ROUTES.test(pathname)

  // 1. Sin sesión → redirigir a /auth/login (excepto rutas públicas)
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 2. Sesión activa → verificar nivel de seguridad AAL para rutas críticas
  if (user && REQUIRES_AAL2.test(pathname)) {
    const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    const currentLevel = aalData?.currentLevel
    const nextLevel = aalData?.nextLevel

    if (nextLevel === 'aal2' && currentLevel !== 'aal2') {
      // Token no tiene AAL2 — redirigir a verificación 2FA
      const url = request.nextUrl.clone()
      url.pathname = '/auth/2fa'
      return NextResponse.redirect(url)
    }
  }

  // 3. Usuario autenticado accediendo a rutas de auth → redirigir al dashboard
  if (user && pathname.startsWith('/auth/') && !pathname.startsWith('/auth/signout')) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
