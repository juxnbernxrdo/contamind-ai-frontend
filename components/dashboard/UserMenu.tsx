'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { 
  User, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown 
} from 'lucide-react';

interface UserMenuProps {
  align?: 'left' | 'right';
  className?: string;
}

export function UserMenu({ align = 'right', className }: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user.email.split('@')[0] || 'Usuario';

  const initials = user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase();

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/auth/login');
  };

  return (
    <div ref={menuRef} className={cn('relative inline-block', className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all hover:bg-[var(--off-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-soft)]"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-7 w-7 rounded-full object-cover ring-2 ring-[var(--border-light)]"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#5e5ce6] text-[11px] font-bold text-white shadow-sm">
            {initials}
          </div>
        )}
        <div className="hidden flex-col items-start md:flex">
          <span className="text-[12px] font-semibold leading-none text-[var(--text-1)]">
            {displayName}
          </span>
          <span className="text-[10px] leading-none text-[var(--text-4)] mt-0.5 uppercase tracking-wider font-semibold">
            {user.roles?.[0] || 'usuario'}
          </span>
        </div>
        <ChevronDown
          size={13}
          className={cn(
            'text-[var(--text-4)] transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 w-52 rounded-2xl border border-[var(--border-light)] bg-[var(--white)] py-1.5 shadow-[var(--shadow-prominent)] z-50 animate-in fade-in slide-in-from-top-1 duration-150',
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-[var(--border-light)] mb-1">
            <p className="text-[12px] font-semibold text-[var(--text-1)] truncate">{displayName}</p>
            <p className="text-[11px] text-[var(--text-4)] truncate mt-0.5">{user.email}</p>
          </div>

          {/* Links */}
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
          >
            <LayoutDashboard size={14} className="text-[var(--text-3)]" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
          >
            <User size={14} className="text-[var(--text-3)]" />
            Mi perfil
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
          >
            <Settings size={14} className="text-[var(--text-3)]" />
            Ajustes
          </Link>

          <div className="my-1.5 border-t border-[var(--border-light)]" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--red)] hover:bg-[var(--red-soft)] transition-colors text-left"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
