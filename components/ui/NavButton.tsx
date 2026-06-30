'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  /** Navigation href. When provided, renders as a Link. */
  href?: string;
  icon: LucideIcon;
  label: string;
  /** Override active state (for tab-style navigation without URL matching). */
  isActive?: boolean;
  /** Render as a plain button (no Link, no URL matching). onClick required. */
  onClick?: () => void;
  /** Badge count shown on the label side. */
  badge?: number;
  /** Shows "Pronto" badge. */
  soon?: boolean;
  /** Shows "Nuevo" badge. */
  isNew?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Collapsed mode — centers icon, hides label, shows tooltip. */
  collapsed?: boolean;
  /** Optional tooltip text override (defaults to label). */
  tooltip?: string;
  /** Additional classes for the outermost element. */
  className?: string;
  /** Optional suffix element rendered in the badge area (e.g., ChevronDown). */
  suffix?: React.ReactNode;
}

/**
 * Shared navigation button used by both the Dashboard Sidebar and
 * the Settings page tab navigation. Single source of truth for:
 * - Active/inactive visual states
 * - Hover interactions
 * - Icon sizing and animation
 * - Active left indicator bar
 * - Badge rendering
 * - Collapsed tooltip
 */
export function NavButton({
  href,
  icon: Icon,
  label,
  isActive: isActiveProp,
  onClick,
  badge,
  soon,
  isNew,
  disabled = false,
  collapsed = false,
  tooltip,
  className,
  suffix,
}: NavButtonProps) {
  const pathname = usePathname();

  // When isActiveProp is provided, use it directly (Settings tabs).
  // Otherwise, derive from URL (Sidebar navigation).
  const isActive =
    isActiveProp !== undefined
      ? isActiveProp
      : href
        ? pathname === href || pathname.startsWith(href + '/')
        : false;

  const content = (
    <span
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-150',
        isActive
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)]',
        disabled && 'pointer-events-none opacity-40',
        collapsed && 'justify-center px-2',
        className
      )}
    >
      {/* Active left indicator bar */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent)]" />
      )}

      {/* Icon */}
      <span
        className={cn(
          'relative flex-shrink-0 transition-transform duration-200',
          isActive ? 'text-[var(--accent)]' : 'text-[var(--text-3)]',
          !disabled && !isActive && !collapsed && 'group-hover:translate-x-0.5'
        )}
      >
        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
        {/* Badge on icon when collapsed */}
        {badge !== undefined && badge > 0 && collapsed && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-bold text-white">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>

      {/* Label (hidden when collapsed) */}
      {!collapsed && <span className="flex-1 truncate leading-none">{label}</span>}

      {/* Badges — expanded */}
      {!collapsed && (
        <span className="flex items-center gap-1.5">
          {badge !== undefined && badge > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          {isNew && (
            <span className="rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
              Nuevo
            </span>
          )}
          {soon && (
            <span className="rounded-full bg-[var(--off-white)] border border-[var(--border-light)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
              Pronto
            </span>
          )}
          {suffix}
        </span>
      )}

      {/* Tooltip (collapsed only) */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 z-[60] whitespace-nowrap rounded-xl border border-[var(--border-light)] bg-[var(--white)] px-3 py-2 text-[12px] font-medium text-[var(--text-1)] shadow-[var(--shadow-prominent)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {tooltip || label}
          {soon && <span className="ml-2 text-[var(--text-4)]">(Pronto)</span>}
        </span>
      )}
    </span>
  );

  // Disabled / soon → non-interactive wrapper
  if (disabled || soon) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  // Button mode (Settings tabs, or explicit onClick)
  if (onClick && !href) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  // Link mode (Sidebar)
  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
