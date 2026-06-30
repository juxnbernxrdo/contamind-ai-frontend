'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { BrainCircuit } from 'lucide-react';
import { useSpring, motion, useMotionValue, useTransform } from 'motion/react';

const SIDEBAR_KEY = 'contamind_sidebar_collapsed';
const COLLAPSED_W = 64;
const EXPANDED_W = 260;

const sidebarSpring = {
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animated sidebar width — drives Topbar left offset and main content padding
  const sidebarWidthMV = useMotionValue(EXPANDED_W);
  const animatedSidebarWidth = useSpring(sidebarWidthMV, sidebarSpring);
  const topbarLeft = useTransform(animatedSidebarWidth, (v) => v);
  const mainPadding = useTransform(animatedSidebarWidth, (v) => v);

  // Hydrate mounted flag
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Sync animated value with collapsed state
  useEffect(() => {
    sidebarWidthMV.set(collapsed ? COLLAPSED_W : EXPANDED_W);
  }, [collapsed, sidebarWidthMV]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth/login');
      }
    }
  }, [user, loading, router]);

  const handleToggle = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleMobileOpen = useCallback(() => {
    setMobileDrawerOpen(true);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  // Loading screen while hydrating
  if (loading || !mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--off-white)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <BrainCircuit
              size={32}
              className="animate-pulse text-[var(--accent)]"
            />
          </div>
          <p className="text-sm text-[var(--text-3)]">Cargando panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Sidebar (desktop + mobile drawer) */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileDrawerOpen}
        onMobileClose={handleMobileClose}
      />

      {/* Topbar — driven by same spring as sidebar */}
      <Topbar
        sidebarCollapsed={collapsed}
        onMobileMenuOpen={handleMobileOpen}
        animatedLeft={topbarLeft}
      />

      {/* Main content — driven by same spring as sidebar */}
      <motion.main
        className="pt-[48px] min-h-screen"
        style={{ paddingLeft: mainPadding }}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
