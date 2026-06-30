'use client';

import { NavButton } from '@/components/ui/NavButton';
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
  icon,
  label,
  collapsed,
  badge,
  disabled,
  soon,
}: SidebarNavItemProps) {
  return (
    <NavButton
      href={href}
      icon={icon}
      label={label}
      badge={badge}
      disabled={disabled}
      soon={soon}
      collapsed={collapsed}
    />
  );
}
