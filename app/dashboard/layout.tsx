'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Topbar } from '@/components/dashboard/Topbar';
import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';

const SIDEBAR_KEY = 'contamind_sidebar_collapsed';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate sidebar state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_KEY);
      if (saved !== null) {
        Promise.resolve().then(() => {
          setCollapsed(JSON.parse(saved));
        });
      }
    } catch {}
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.twoFAEnabled && !user.is2FAVerified) {
        router.push(`/auth/2fa?userId=${user.id}`);
      }
    }
  }, [user, loading, router]);

  const handleToggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Loading screen while hydrating
  if (loading || !mounted || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--white)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <BrainCircuit
              size={36}
              className="text-[var(--accent)] animate-pulse"
            />
          </div>
          <p className="text-[13px] text-[var(--text-4)]">Cargando ContaMind AI…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />

      {/* Topbar */}
      <Topbar sidebarCollapsed={collapsed} />

      {/* Main content */}
      <main
        className={cn(
          'pt-[48px] min-h-screen transition-all duration-300',
          collapsed ? 'pl-[64px]' : 'pl-[240px]'
        )}
      >
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
