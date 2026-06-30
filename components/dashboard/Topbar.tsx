'use client';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Bell,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { motion, type MotionValue } from 'motion/react';

// Route segment → human-readable label map (extend as more routes are added)
const LABEL_MAP: Record<string, string> = {
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
  activity: 'Actividad',
  tasks: 'Tareas',
  notifications: 'Notificaciones',
  calendar: 'Calendario',
  ai: 'IA Empresarial',
  chat: 'Chat IA',
  agents: 'Agentes IA',
  automations: 'Automatizaciones',
  workflows: 'Flujos de Trabajo',
  templates: 'Plantillas',
  prompts: 'Prompts',
  knowledge: 'Conocimiento',
  memory: 'Memoria',
  accounting: 'Contabilidad',
  invoicing: 'Facturación',
  treasury: 'Tesorería',
  taxes: 'Impuestos',
  finance: 'Finanzas',
  crm: 'CRM',
  sales: 'Ventas',
  purchasing: 'Compras',
  inventory: 'Inventario',
  hr: 'RRHH',
  projects: 'Proyectos',
  documents: 'Documentos',
  analytics: 'Analytics',
  integrations: 'Integraciones',
  admin: 'Administración',
  platform: 'Plataforma',
  support: 'Soporte',
};

// Build breadcrumb trail from pathname
function useBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, idx) => ({
    label: LABEL_MAP[part] || part,
    href: '/' + parts.slice(0, idx + 1).join('/'),
    isLast: idx === parts.length - 1,
  }));
}

interface TopbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuOpen?: () => void;
  animatedLeft: MotionValue<number>;
}

export function Topbar({ sidebarCollapsed, onMobileMenuOpen, animatedLeft }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs(pathname);

  return (
    <motion.header
      className={cn(
        'fixed top-0 right-0 z-50 flex h-[48px] items-center border-b border-[var(--border-light)]',
        'glass'
      )}
      style={{
        left: animatedLeft,
        backdropFilter: 'blur(20px) saturate(180%)',
        backgroundColor: 'var(--nav-bg)',
      }}
    >
      {/* Mobile hamburger (hidden on md+) */}
      <button
        onClick={onMobileMenuOpen}
        aria-label="Abrir menú de navegación"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-3)] transition-all hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] ml-3 md:hidden flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumbs */}
      <div className="flex flex-1 items-center gap-1.5 px-3 md:px-5 overflow-hidden">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-1.5 min-w-0">
            {idx > 0 && (
              <span className="text-[var(--text-4)] text-[10px]">/</span>
            )}
            {crumb.isLast ? (
              <span className="truncate text-[12px] font-medium text-[var(--text-1)]">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="truncate text-[12px] text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 pr-4 flex-shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
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
          {/* Notification indicator dot (replace with real count when available) */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        </button>
      </div>
    </motion.header>
  );
}
