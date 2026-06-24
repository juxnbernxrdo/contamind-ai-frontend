'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  badge?: number;
  disabled?: boolean;
  soon?: boolean;
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  badge,
  disabled,
  soon,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  const content = (
    <span
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)]',
        disabled && 'pointer-events-none opacity-40',
        collapsed && 'justify-center px-2'
      )}
    >
      {/* Active left border indicator */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      )}

      {/* Icon */}
      <span
        className={cn(
          'relative flex-shrink-0 transition-transform duration-200',
          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-3)]',
          !disabled && !isActive && 'group-hover:translate-x-0.5'
        )}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
        {/* Notification badge on icon (collapsed) */}
        {badge !== undefined && badge > 0 && collapsed && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-bold text-white">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>

      {/* Label (hidden when collapsed) */}
      {!collapsed && (
        <span className="flex-1 truncate leading-none">{label}</span>
      )}

      {/* Badges — expanded */}
      {!collapsed && (
        <>
          {badge !== undefined && badge > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          {soon && (
            <span className="rounded-full bg-[var(--off-white)] border border-[var(--border-light)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
              Pronto
            </span>
          )}
        </>
      )}

      {/* Tooltip (collapsed only) */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-50 whitespace-nowrap rounded-lg border border-[var(--border-light)] bg-[var(--white)] px-3 py-1.5 text-xs font-medium text-[var(--text-1)] shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {label}
          {soon && <span className="ml-2 text-[var(--text-4)]">(Pronto)</span>}
        </span>
      )}
    </span>
  );

  if (disabled || soon) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return <Link href={href}>{content}</Link>;
}
