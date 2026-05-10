import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Building2, User, Mail, Shield, Activity, TrendingUp, FileText, Clock } from 'lucide-react'

interface UserData {
  id: string
  email: string
  full_name?: string
  companies?: Array<{ id: string; name: string; ruc?: string }>
  roles?: string[]
  created_at?: string
}

async function getBackendUser(token: string): Promise<UserData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (res.ok) return res.json()
    return null
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Obtener la sesión para el access_token
  const { data: { session } } = await supabase.auth.getSession()
  const userData = session ? await getBackendUser(session.access_token) : null

  const displayName = userData?.full_name ?? user.email ?? 'Usuario'
  const companies = userData?.companies ?? []
  const roles = userData?.roles ?? []

  const stats = [
    { label: 'Facturas este mes', value: '—', icon: FileText, color: '#0071e3' },
    { label: 'Ingresos del mes', value: '—', icon: TrendingUp, color: '#34c759' },
    { label: 'Gastos del mes', value: '—', icon: Activity, color: '#ff9f0a' },
    { label: 'Transacciones', value: '—', icon: Clock, color: '#bf5af2' },
  ]

  return (
    <div style={{ maxWidth: '960px' }}>
      {/* Welcome header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-1, #1d1d1f)',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}
        >
          Bienvenido, {displayName.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-3, #6e6e73)', fontSize: '15px', margin: 0 }}>
          Aquí tienes un resumen de tu actividad contable.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--border-light, #e5e7eb)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={18} color={color} />
            </div>
            <div>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--text-1, #1d1d1f)',
                  margin: '0 0 2px',
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-4, #aeaeb2)', margin: 0 }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column info section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* User profile card */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-light, #e5e7eb)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <User size={16} color="var(--accent, #0071e3)" />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1, #1d1d1f)', margin: 0 }}>
              Tu perfil
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Row icon={<Mail size={14} />} label="Email" value={user.email ?? '—'} />
            <Row icon={<Shield size={14} />} label="Roles" value={roles.length > 0 ? roles.join(', ') : 'Sin rol asignado'} />
            <Row icon={<Activity size={14} />} label="Estado backend" value={userData ? '✅ Conectado' : '⚠️ Sin conexión'} />
          </div>
        </div>

        {/* Companies card */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-light, #e5e7eb)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Building2 size={16} color="var(--accent, #0071e3)" />
            <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1, #1d1d1f)', margin: 0 }}>
              Empresas
            </h2>
          </div>
          {companies.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {companies.map((c) => (
                <li
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'var(--off-white, #f5f5f7)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ fontWeight: 500, color: 'var(--text-1, #1d1d1f)' }}>{c.name}</span>
                  {c.ruc && (
                    <span style={{ color: 'var(--text-4, #aeaeb2)', fontSize: '12px' }}>
                      RUC {c.ruc}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--text-4, #aeaeb2)', margin: 0 }}>
              {userData
                ? 'Sin empresas asociadas. Contacta al administrador.'
                : 'Backend no disponible. Verifica la conexión.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ color: 'var(--text-4, #aeaeb2)' }}>{icon}</span>
      <span style={{ fontSize: '12px', color: 'var(--text-4, #aeaeb2)', minWidth: '60px' }}>{label}</span>
      <span style={{ fontSize: '13px', color: 'var(--text-1, #1d1d1f)', fontWeight: 500, wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  )
}
