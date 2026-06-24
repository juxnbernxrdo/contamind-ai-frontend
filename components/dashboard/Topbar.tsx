'use client';

import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/components/ThemeProvider';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Bell,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { UserMenu } from '@/components/dashboard/UserMenu';

// Build breadcrumb label from pathname
function useBreadcrumbs(pathname: string) {
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    security: 'Seguridad',
    sessions: 'Sesiones',
    devices: 'Dispositivos',
    audit: 'Auditoría',
    profile: 'Mi Perfil',
    '2fa': 'Autenticador',
    passkeys: 'Passkeys',
    settings: 'Ajustes',
    compliance: 'Cumplimiento',
    reports: 'Reportes',
  };

  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, idx) => ({
    label: labelMap[part] || part,
    href: '/' + parts.slice(0, idx + 1).join('/'),
    isLast: idx === parts.length - 1,
  }));
}

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export function Topbar({ sidebarCollapsed }: TopbarProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-50 flex h-[48px] items-center border-b border-[var(--border-light)]',
        'glass transition-all duration-300',
        sidebarCollapsed ? 'left-[64px]' : 'left-[240px]'
      )}
      style={{ backdropFilter: 'blur(20px) saturate(180%)', backgroundColor: 'var(--nav-bg)' }}
    >
      {/* Breadcrumbs */}
      <div className="flex flex-1 items-center gap-1.5 px-5 overflow-hidden">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {idx > 0 && (
              <span className="text-[var(--text-4)] text-[11px]">/</span>
            )}
            {crumb.isLast ? (
              <span className="text-[13px] font-semibold text-[var(--text-1)] truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[13px] text-[var(--text-3)] hover:text-[var(--text-1)] truncate transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 pr-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-3)] transition-all hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notificaciones"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-3)] transition-all hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >
          <Bell size={16} />
        </button>

        {/* Separator */}
        <div className="mx-2 h-5 w-px bg-[var(--border-light)]" />

        {/* Avatar dropdown */}
        <UserMenu align="right" />
      </div>
    </header>
  );
}
