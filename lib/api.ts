import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function fetchFromBackend(endpoint: string, companyId: string, options: RequestInit = {}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("No active session")
  }

  const defaultHeaders: Record<string, string> = {
    'Authorization': `Bearer ${session.access_token}`,
    'X-Company-ID': companyId,
    'Content-Type': 'application/json'
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    }
  })

  if (!response.ok) {
    if (response.status === 401) {
      redirect('/auth/login')
    }
    
    if (response.status === 403) {
      if (response.headers.get('X-2FA-Required') === 'true') {
        // Redirigir a la pantalla de verificación 2FA para elevar AAL
        redirect('/auth/2fa')
      }
      throw new Error('Forbidden: Insufficient permissions')
    }
    
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}
