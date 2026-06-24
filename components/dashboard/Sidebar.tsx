'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MonitorSmartphone,
  Shield,
  ClipboardList,
  Settings,
  BookOpen,
  Receipt,
  ShoppingCart,
  Wallet,
  FileText,
  Package,
  Users2,
  FileStack,
  BrainCircuit,
  Plug,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Activity,
  KeyRound,
} from 'lucide-react';
import { SidebarNavItem } from './SidebarNavItem';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Navigation structure — only real backend capabilities
const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      {
        href: '/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        exact: true,
      },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      {
        href: '/dashboard/security/sessions',
        icon: MonitorSmartphone,
        label: 'Sesiones Activas',
      },
      {
        href: '/dashboard/security/devices',
        icon: Shield,
        label: 'Dispositivos',
      },
      {
        href: '/dashboard/security/audit',
        icon: ClipboardList,
        label: 'Auditoría',
      },
    ],
  },
  {
    label: 'Mi Cuenta',
    items: [
      {
        href: '/dashboard/profile',
        icon: UserCircle,
        label: 'Perfil',
      },
      {
        href: '/dashboard/profile/2fa',
        icon: KeyRound,
        label: 'Autenticador 2FA',
      },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      {
        href: '/dashboard/accounting',
        icon: BookOpen,
        label: 'Contabilidad',
        soon: true,
      },
      {
        href: '/dashboard/invoicing',
        icon: Receipt,
        label: 'Facturación',
        soon: true,
      },
      {
        href: '/dashboard/purchasing',
        icon: ShoppingCart,
        label: 'Compras',
        soon: true,
      },
      {
        href: '/dashboard/treasury',
        icon: Wallet,
        label: 'Tesorería',
        soon: true,
      },
      {
        href: '/dashboard/taxes',
        icon: FileText,
        label: 'Impuestos SRI',
        soon: true,
      },
    ],
  },
  {
    label: 'Operaciones',
    items: [
      {
        href: '/dashboard/inventory',
        icon: Package,
        label: 'Inventario',
        soon: true,
      },
      {
        href: '/dashboard/payroll',
        icon: Users2,
        label: 'Nómina & RRHH',
        soon: true,
      },
    ],
  },
  {
    label: 'Inteligencia',
    items: [
      {
        href: '/dashboard/compliance',
        icon: Activity,
        label: 'Cumplimiento',
      },
      {
        href: '/dashboard/documents',
        icon: FileStack,
        label: 'Documentos',
        soon: true,
      },
      {
        href: '/dashboard/ai',
        icon: BrainCircuit,
        label: 'IA & Automatización',
        soon: true,
      },
    ],
  },
  {
    label: 'Configuración',
    items: [
      {
        href: '/dashboard/integrations',
        icon: Plug,
        label: 'Integraciones',
        soon: true,
      },
      {
        href: '/dashboard/settings',
        icon: Settings,
        label: 'Ajustes',
      },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'fixed left-0 top-[48px] z-40 flex h-[calc(100vh-48px)] flex-col border-r border-[var(--border-light)] bg-[var(--white)] transition-all duration-300',
        collapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        className={cn(
          'absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--white)] text-[var(--text-3)] shadow-sm transition-all duration-200 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
        )}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <p className="mb-1 px-4 pt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
                {section.label}
              </p>
            )}
            {collapsed && <div className="mb-1 mt-3 mx-3 border-t border-[var(--border-light)]" />}
            <ul className="space-y-0.5 px-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <SidebarNavItem
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    collapsed={collapsed}
                    soon={(item as any).soon}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className={cn(
        'border-t border-[var(--border-light)] p-3 transition-all',
        collapsed ? 'flex justify-center' : ''
      )}>
        <div className={cn(
          'flex items-center gap-3 rounded-xl p-2',
          !collapsed && 'hover:bg-[var(--off-white)]'
        )}>
          {/* Avatar */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#5e5ce6] text-xs font-bold text-white shadow-sm">
            {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--text-1)]">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ''}`.trim()
                  : user?.email?.split('@')[0]}
              </p>
              <p className="truncate text-[10px] text-[var(--text-4)]">
                {user?.roles?.[0]?.toLowerCase() || 'usuario'}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
