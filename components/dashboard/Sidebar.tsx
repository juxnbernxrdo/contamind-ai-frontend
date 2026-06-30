'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  LogOut,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  X,
  BarChart3,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { NavButton } from '@/components/ui/NavButton';
import {
  NAV_SECTIONS,
  filterNavByRoles,
  type NavSection,
  type NavItem,
  type SubNavItem,
} from './nav-config';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLAPSED_W = 64;
const EXPANDED_W = 260;
const HOVER_DELAY_MS = 80;

// ─── Motion Variants ──────────────────────────────────────────────────────────

const sidebarVariants = {
  open:   { width: EXPANDED_W },
  closed: { width: COLLAPSED_W },
};

const sidebarTransition = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

const labelVariants = {
  open:   { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -8 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Individual sub-nav item (nested under a parent item) */
function SubNavItemRow({
  item,
  isExpanded,
}: {
  item: SubNavItem;
  isExpanded: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  if (item.soon) {
    return (
      <div
        className={cn(
          'relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px]',
          'cursor-not-allowed text-[var(--text-4)]',
          isExpanded && 'ml-7'
        )}
      >
        <span className="w-1 h-1 rounded-full bg-[var(--border)] flex-shrink-0" />
        <span className="truncate">{item.label}</span>
        <span className="ml-auto rounded-full bg-[var(--off-white)] border border-[var(--border-light)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
          Pronto
        </span>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-150',
        isExpanded && 'ml-7',
        isActive
          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
          : 'text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)]'
      )}
    >
      <span className="w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-60" />
      <span className="truncate">{item.label}</span>
      {item.isNew && (
        <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
          Nuevo
        </span>
      )}
    </Link>
  );
}

/** Individual nav item with icon, label, badge, tooltip, subitems */
function NavItemRow({
  item,
  isCollapsed,
  searchQuery,
}: {
  item: NavItem;
  isCollapsed: boolean;
  searchQuery: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
    (item.subItems?.some(
      (sub) => pathname === sub.href || pathname.startsWith(sub.href + '/')
    ) ?? false);

  const hasSubItems = (item.subItems?.length ?? 0) > 0;
  const [prevIsActive, setPrevIsActive] = useState(isActive);
  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);

  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    setUserToggledOpen(null);
  }

  const subOpen = searchQuery && hasSubItems
    ? true
    : (userToggledOpen !== null ? userToggledOpen : (isActive && hasSubItems));

  const handleToggle = () => {
    setUserToggledOpen((v) => (v !== null ? !v : !subOpen));
  };

  const isDisabled = !!item.soon;

  return (
    <div>
      {/* Main item — uses shared NavButton */}
      <NavButton
        href={isDisabled || hasSubItems ? undefined : item.href}
        icon={item.icon}
        label={item.label}
        isActive={isActive}
        onClick={hasSubItems ? handleToggle : undefined}
        badge={item.badge}
        soon={item.soon}
        isNew={item.isNew}
        disabled={isDisabled}
        collapsed={isCollapsed}
        suffix={hasSubItems && !isCollapsed ? (
          <ChevronDown
            size={12}
            className={cn(
              'text-[var(--text-4)] transition-transform duration-200',
              subOpen && 'rotate-180'
            )}
          />
        ) : undefined}
      />

      {/* Sub-items */}
      {hasSubItems && !isCollapsed && (
        <AnimatePresence initial={false}>
          {subOpen && (
            <motion.div
              key="subitems"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-0.5 space-y-0.5">
                {item.subItems!.map((sub) => (
                  <SubNavItemRow
                    key={sub.id}
                    item={sub}
                    isExpanded={!isCollapsed}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/** Collapsible section group */
function NavSectionGroup({
  section,
  isCollapsed,
  searchQuery,
}: {
  section: NavSection;
  isCollapsed: boolean;
  searchQuery: string;
}) {
  const pathname = usePathname();
  const hasActive = useMemo(
    () =>
      section.items.some(
        (item) =>
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
      ),
    [pathname, section.items]
  );

  const [prevHasActive, setPrevHasActive] = useState(hasActive);
  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);

  if (hasActive !== prevHasActive) {
    setPrevHasActive(hasActive);
    setUserToggledOpen(null);
  }

  const open = searchQuery
    ? true
    : (userToggledOpen !== null ? userToggledOpen : (hasActive || (section.defaultOpen ?? false)));

  const handleToggle = () => {
    setUserToggledOpen((v) => (v !== null ? !v : !open));
  };

  return (
    <div className="mb-1">
      {/* Section header (visible only expanded) */}
      {!isCollapsed && (
        <button
          onClick={handleToggle}
          className="flex w-full items-center justify-between px-3 pb-1 pt-4 group"
          aria-expanded={open}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-4)] group-hover:text-[var(--text-3)] transition-colors">
            {section.label}
          </span>
          <ChevronDown
            size={11}
            className={cn(
              'text-[var(--text-4)] transition-transform duration-200 group-hover:text-[var(--text-3)]',
              open && 'rotate-180'
            )}
          />
        </button>
      )}

      {/* Collapsed divider */}
      {isCollapsed && (
        <div className="mx-3 mt-3 mb-1 border-t border-[var(--border-light)]" />
      )}

      {/* Items */}
      <AnimatePresence initial={false}>
        {(open || isCollapsed) && (
          <motion.ul
            key="section-items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden space-y-0.5 px-2"
            role="menu"
            aria-label={section.label}
          >
            {section.items.map((item) => (
              <li key={item.id}>
                <NavItemRow
                  item={item}
                  isCollapsed={isCollapsed}
                  searchQuery={searchQuery}
                />
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** User footer dropdown */
function SidebarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'Usuario';

  const initials =
    user?.firstName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  const role = user?.roles?.[0] || 'usuario';

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div
      className="border-t border-[var(--border-light)] p-2"
      ref={menuRef}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menú de usuario"
        className={cn(
          'group flex w-full items-center rounded-xl p-2 transition-all duration-150 hover:bg-[var(--off-white)]',
          isCollapsed && 'justify-center'
        )}
      >
        {/* Avatar */}
        <Avatar
          src={user?.avatarUrl}
          alt={displayName}
          initials={initials}
          size="sm"
          showStatus
          status="online"
        />

        {/* Name + role (expanded only) */}
        {!isCollapsed && (
          <div className="ml-2.5 min-w-0 flex-1 text-left">
            <p className="truncate text-[12px] font-semibold text-[var(--text-1)] leading-none">
              {displayName}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-4)] leading-none">
              {role}
            </p>
          </div>
        )}

        {!isCollapsed && (
          <ChevronDown
            size={12}
            className={cn(
              'flex-shrink-0 text-[var(--text-4)] transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="user-dropdown"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-[70] mb-2 w-56 rounded-2xl border border-[var(--border-light)] bg-[var(--white)] py-1.5 shadow-[var(--shadow-prominent)]',
              isCollapsed ? 'bottom-16 left-[68px]' : 'bottom-20 left-4'
            )}
            role="menu"
          >
            {/* User header */}
            <div className="px-3.5 pb-2.5 pt-2 border-b border-[var(--border-light)] mb-1">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={user?.avatarUrl}
                  alt={displayName}
                  initials={initials}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-[var(--text-1)]">
                    {displayName}
                  </p>
                  <p className="truncate text-[11px] text-[var(--text-4)]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            {[
              {
                href: '/dashboard/profile',
                icon: User,
                label: 'Mi Perfil',
              },
              {
                href: '/dashboard/settings',
                icon: Settings,
                label: 'Preferencias',
              },
              {
                href: '/dashboard/settings',
                icon: CreditCard,
                label: 'Facturación & Suscripción',
              },
              {
                href: '/dashboard/analytics/usage',
                icon: BarChart3,
                label: 'Uso & Consumo',
              },
              {
                href: '/dashboard/support',
                icon: HelpCircle,
                label: 'Ayuda & Soporte',
              },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
              >
                <Icon size={14} className="text-[var(--text-3)] flex-shrink-0" />
                {label}
              </Link>
            ))}

            <div className="my-1 border-t border-[var(--border-light)]" />

            {/* Logout */}
            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--red)] hover:bg-[var(--red-soft)] transition-colors text-left"
            >
              <LogOut size={14} className="flex-shrink-0" />
              Cerrar Sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SidebarSearch({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="px-2 pb-2 pt-1">
      <div className="relative flex items-center">
        <Search
          size={13}
          className="absolute left-2.5 text-[var(--text-4)] pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar módulo…"
          className="w-full rounded-xl border border-[var(--border-light)] bg-[var(--off-white)] py-1.5 pl-7 pr-7 text-[12px] text-[var(--text-2)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] focus:bg-[var(--white)] focus:ring-1 focus:ring-[var(--accent-soft)] transition-all"
          aria-label="Buscar módulos de navegación"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2.5 text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The sidebar is "visually expanded" when pinned open OR when hovering while pinned closed
  const isExpanded = !collapsed || isHovered;
  // Collapsed visually means the sidebar is narrow (icon-only mode)
  const isCollapsed = !isExpanded;

  const handleMouseEnter = useCallback(() => {
    if (collapsed) {
      hoverTimer.current = setTimeout(() => setIsHovered(true), HOVER_DELAY_MS);
    }
  }, [collapsed]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovered(false);
  }, []);

  // RBAC: filter sections based on user roles
  const filteredSections = useMemo(
    () => filterNavByRoles(NAV_SECTIONS, user?.roles ?? []),
    [user?.roles]
  );

  // Search filter: show only items matching query
  const searchedSections = useMemo(() => {
    if (!searchQuery.trim()) return filteredSections;
    const q = searchQuery.toLowerCase();
    return filteredSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            section.label.toLowerCase().includes(q) ||
            item.subItems?.some((sub) => sub.label.toLowerCase().includes(q))
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [filteredSections, searchQuery]);

  return (
    <>
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <motion.aside
        className={cn(
          'fixed left-0 top-[48px] z-40 hidden h-[calc(100vh-48px)] flex-col',
          'border-r border-[var(--border-light)] bg-[var(--white)]',
          'md:flex'
        )}
        initial={false}
        animate={isExpanded ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={sidebarTransition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Navegación principal de ContaMind AI"
      >
        {/* Toggle pin button */}
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          className={cn(
            'absolute -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border',
            'border-[var(--border)] bg-[var(--white)] text-[var(--text-3)] shadow-sm',
            'transition-all duration-200 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)]',
            collapsed ? 'top-5' : 'top-6',
            // Hide when hovered-expanded but not pinned
            isHovered && collapsed && 'opacity-0 pointer-events-none'
          )}
        >
          {collapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronLeft size={12} />
          )}
        </button>

        <SidebarInner
          isCollapsed={isCollapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchedSections={searchedSections}
        />
      </motion.aside>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            key="mobile-drawer"
            initial={{ x: -EXPANDED_W - 20 }}
            animate={{ x: 0 }}
            exit={{ x: -EXPANDED_W - 20 }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
            style={{ width: EXPANDED_W }}
            className={cn(
              'fixed left-0 top-0 z-50 flex h-full flex-col',
              'border-r border-[var(--border-light)] bg-[var(--white)] shadow-[var(--shadow-prominent)]',
              'md:hidden'
            )}
            role="navigation"
            aria-label="Menú de navegación móvil"
          >
            {/* Mobile drawer header */}
            <div className="flex h-12 items-center justify-between border-b border-[var(--border-light)] px-4">
              <Link
                href="/dashboard"
                onClick={onMobileClose}
                aria-label="Ir al Dashboard"
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <Logo size={20} showText={true} />
              </Link>
              <button
                onClick={onMobileClose}
                aria-label="Cerrar menú"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <SidebarInner
              isCollapsed={false}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchedSections={searchedSections}
              onNavClick={onMobileClose}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Inner Sidebar Content (shared between desktop + mobile) ──────────────────

function SidebarInner({
  isCollapsed,
  searchQuery,
  setSearchQuery,
  searchedSections,
  onNavClick,
}: {
  isCollapsed: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchedSections: NavSection[];
  onNavClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Header: Logo ── */}
      <div className="relative flex h-12 items-center border-b border-[var(--border-light)] px-3 flex-shrink-0">
        <Link
          href="/dashboard"
          aria-label="ContaMind AI — Ir al Dashboard"
          className="relative flex items-center cursor-pointer overflow-hidden"
          style={{ width: isCollapsed ? COLLAPSED_W - 24 : EXPANDED_W - 24 }}
          onClick={onNavClick}
        >
          {/* Icon — always positioned at start, scales smoothly */}
          <motion.div
            className="flex-shrink-0 flex items-center justify-center"
            animate={{
              x: isCollapsed ? (COLLAPSED_W - 24 - 20) / 2 : 0,
            }}
            transition={{ ...sidebarTransition, mass: 0.6 }}
          >
            <Logo
              size={20}
              showText={false}
              iconClassName="flex-shrink-0"
            />
          </motion.div>

          {/* Text — fades in/out with smooth opacity, no horizontal slide */}
          <motion.span
            className="absolute left-[36px] font-semibold tracking-tight text-[1.05rem] text-[var(--text-1)] whitespace-nowrap"
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              pointerEvents: isCollapsed ? ('none' as const) : ('auto' as const),
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            ContaMind<span className="text-[var(--accent)]">AI</span>
          </motion.span>
        </Link>
      </div>

      {/* ── Search Bar (expanded only) ── */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            key="search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden flex-shrink-0"
          >
            <SidebarSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scrollable Nav ── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar"
        aria-label="Módulos del sistema"
      >
        {searchQuery && searchedSections.length === 0 ? (
          /* Empty state for search */
          <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
            <Search size={24} className="text-[var(--text-4)]" />
            <p className="text-[12px] font-medium text-[var(--text-3)]">
              Sin resultados
            </p>
            <p className="text-[11px] text-[var(--text-4)]">
              Intenta con otro término
            </p>
          </div>
        ) : (
          searchedSections.map((section) => (
            <NavSectionGroup
              key={section.id}
              section={section}
              isCollapsed={isCollapsed}
              searchQuery={searchQuery}
            />
          ))
        )}
      </nav>

      {/* ── Footer: User Menu ── */}
      <div className="relative flex-shrink-0">
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
