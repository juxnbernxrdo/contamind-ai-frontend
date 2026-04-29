'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, FileText, Landmark, Wallet, Box, Users, ShieldAlert, Sparkles, Settings, LogOut, Menu, X, BrainCircuit, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/ventas', label: 'Ventas & CRM', icon: ArrowUpRight },
  { href: '/dashboard/compras', label: 'Compras', icon: ArrowDownRight },
  { href: '/dashboard/contabilidad', label: 'Contabilidad', icon: Landmark },
  { href: '/dashboard/facturacion', label: 'Facturación SRI', icon: FileText },
  { href: '/dashboard/tesoreria', label: 'Tesorería', icon: Wallet },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Box },
  { href: '/dashboard/nomina', label: 'Nómina', icon: Users },
  { href: '/dashboard/impuestos', label: 'Impuestos & ATS', icon: ShieldAlert },
  { href: '/dashboard/ia', label: 'ContaMind IA', icon: Sparkles, isSpecial: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[var(--off-white)] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--white)] border-b border-[var(--border-light)] sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2 font-medium text-[var(--text-1)]">
          <BrainCircuit className="text-[var(--accent)]" size={24} />
          <span className="text-[1.1rem]">ContaMind</span>
        </Link>
        <button onClick={toggleMenu} className="p-2 text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={`
              fixed md:sticky top-0 left-0 h-screen w-[260px] bg-[var(--white)] border-r border-[var(--border-light)] z-40
              flex flex-col
              ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
            `}
          >
            <div className="p-6 hidden md:flex items-center gap-2 font-medium text-[var(--text-1)] shrink-0">
              <BrainCircuit className="text-[var(--accent)]" size={24} />
              <span className="text-[1.3rem] font-serif tracking-tight">ContaMind</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
              <div className="mb-4 px-3">
                <p className="text-[0.65rem] uppercase tracking-wider font-bold text-[var(--text-4)]">Menú Principal</p>
              </div>
              
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[0.93rem] font-medium transition-all group
                      ${isActive 
                        ? (item.isSpecial ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'bg-[var(--off-white)] text-[var(--text-1)]') 
                        : 'text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)]'}
                    `}
                  >
                    <Icon 
                      size={18} 
                      className={item.isSpecial ? 'text-[var(--accent)]' : (isActive ? 'text-[var(--text-1)]' : 'text-[var(--text-3)] group-hover:text-[var(--text-2)]')} 
                    />
                    {item.label}
                    {item.isSpecial && <span className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[var(--border-light)] shrink-0 space-y-1">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[0.93rem] font-medium text-[var(--text-2)] hover:bg-[var(--off-white)] hover:text-[var(--text-1)] transition-colors">
                <Settings size={18} className="text-[var(--text-3)]" />
                Configuración
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[0.93rem] font-medium text-[var(--text-2)] hover:bg-[var(--red)]/10 hover:text-[var(--red)] transition-colors group">
                <LogOut size={18} className="text-[var(--text-3)] group-hover:text-[var(--red)] transition-colors" />
                Cerrar Sesión
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[var(--off-white)] custom-scrollbar">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[var(--text-1)]/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
