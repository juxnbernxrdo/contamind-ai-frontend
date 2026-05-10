import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
} from 'lucide-react'

const navLinks = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/contabilidad', label: 'Contabilidad', icon: BookOpen },
  { href: '/app/facturas', label: 'Facturas', icon: FileText },
  { href: '/app/clientes', label: 'Clientes', icon: Users },
  { href: '/app/configuracion', label: 'Configuración', icon: Settings },
]

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userInitial = user.email?.charAt(0).toUpperCase() ?? 'U'
  const userEmail = user.email ?? ''

  return (
    <div className="flex h-screen bg-[var(--bg-app,#f5f5f7)] overflow-hidden">
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: '240px',
          minWidth: '240px',
          background: 'var(--sidebar-bg, #ffffff)',
          borderRight: '1px solid var(--border-light, #e5e7eb)',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid var(--border-light, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent, #0071e3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building2 size={18} color="white" />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--text-1, #1d1d1f)',
              letterSpacing: '-0.3px',
            }}
          >
            ContaMind
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    color: 'var(--text-2, #3a3a3c)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  className="app-nav-link"
                >
                  <Icon size={17} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info / Logout */}
        <div
          style={{
            padding: '12px 10px',
            borderTop: '1px solid var(--border-light, #e5e7eb)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'var(--off-white, #f5f5f7)',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'var(--accent, #0071e3)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-1, #1d1d1f)',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userEmail}
              </p>
            </div>
          </div>

          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '10px',
                color: 'var(--text-3, #6e6e73)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background 0.15s, color 0.15s',
              }}
              className="app-nav-link"
            >
              <LogOut size={17} />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header bar */}
        <header
          style={{
            height: '56px',
            borderBottom: '1px solid var(--border-light, #e5e7eb)',
            background: 'var(--sidebar-bg, #ffffff)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'var(--text-4, #aeaeb2)', fontSize: '13px' }}>ContaMind</span>
          <ChevronRight size={14} color="var(--text-4, #aeaeb2)" />
          <span style={{ color: 'var(--text-2, #3a3a3c)', fontSize: '13px', fontWeight: 500 }}>
            App
          </span>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </div>
      </main>

      <style>{`
        .app-nav-link:hover {
          background: var(--off-white, #f5f5f7) !important;
          color: var(--text-1, #1d1d1f) !important;
        }
      `}</style>
    </div>
  )
}
