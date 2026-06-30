'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, BrainCircuit, ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Avatar } from './ui/Avatar';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';

import { useAuth } from '@/hooks/use-auth';
import { UserMenu } from './dashboard/UserMenu';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const initials = user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-[20px] backdrop-saturate-[180%] bg-[var(--nav-bg)] border-b border-[var(--border-light)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo size={22} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-[0.93rem] font-medium text-[var(--text-3)]">
          <Link href="/caracteristicas" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/caracteristicas' ? 'text-[var(--text-1)]' : ''}`}>Características</Link>
          <Link href="/precios" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/precios' ? 'text-[var(--text-1)]' : ''}`}>Precios</Link>
          <Link href="/clientes" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/clientes' ? 'text-[var(--text-1)]' : ''}`}>Casos de Éxito</Link>
          
          <div className="relative group flex items-center h-16">
            <span className={`hover:text-[var(--text-1)] transition-colors cursor-pointer flex items-center gap-1 ${['/blog', '/documentacion', '/api-docs'].includes(pathname) ? 'text-[var(--text-1)]' : ''}`}>
              Recursos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </span>
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 bg-[var(--white)] border border-[var(--border-light)] rounded-[12px] shadow-[var(--shadow-prominent)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
              <Link href="/blog" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Blog</Link>
              <Link href="/documentacion" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Ayuda</Link>
              <Link href="/api-docs" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">API Docs</Link>
            </div>
          </div>
          
          <div className="relative group flex items-center h-16">
            <span className={`hover:text-[var(--text-1)] transition-colors cursor-pointer flex items-center gap-1 ${['/nosotros', '/contacto', '/seguridad', '/roadmap'].includes(pathname) ? 'text-[var(--text-1)]' : ''}`}>
              Compañía <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </span>
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 bg-[var(--white)] border border-[var(--border-light)] rounded-[12px] shadow-[var(--shadow-prominent)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
              <Link href="/nosotros" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Sobre Nosotros</Link>
              <Link href="/contacto" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Contacto</Link>
              <Link href="/seguridad" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Seguridad</Link>
              <Link href="/roadmap" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Roadmap</Link>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--accent-soft)] transition-colors text-[var(--text-3)] hover:text-[var(--text-1)]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Guest CTA Buttons or Logged User Profile Dropdown */}
          {user ? (
            <div className="hidden md:block">
              <UserMenu align="right" />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3.5">
              <Link 
                href="/auth/login" 
                className="text-[0.93rem] font-semibold text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors py-2 px-3"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-[var(--accent)] text-white text-[0.88rem] font-semibold px-4 py-2.5 rounded-[24px] hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-sm hover:shadow-[0_2px_12px_rgba(0,113,227,0.15)]"
              >
                Comenzar gratis
              </Link>
            </div>
          )}

          <button 
            className="md:hidden p-2 text-[var(--text-1)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-16 left-0 w-full bg-[var(--white)] z-40 overflow-hidden border-b border-[var(--border-light)] shadow-xl"
          >
            <nav className="flex flex-col p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <Link href="/caracteristicas" onClick={() => setIsMenuOpen(false)} className={`text-xl font-medium ${pathname === '/caracteristicas' ? 'text-[var(--accent)]' : 'text-[var(--text-1)]'}`}>Características</Link>
              <Link href="/precios" onClick={() => setIsMenuOpen(false)} className={`text-xl font-medium ${pathname === '/precios' ? 'text-[var(--accent)]' : 'text-[var(--text-1)]'}`}>Precios</Link>
              <Link href="/clientes" onClick={() => setIsMenuOpen(false)} className={`text-xl font-medium ${pathname === '/clientes' ? 'text-[var(--accent)]' : 'text-[var(--text-1)]'}`}>Casos de Éxito</Link>
              
              <div className="pt-4 border-t border-[var(--border-light)]">
                <p className="text-xs font-bold text-[var(--text-4)] uppercase tracking-[0.2em] mb-4">Recursos</p>
                <div className="flex flex-col gap-4 pl-2">
                  <Link href="/blog" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/blog' ? 'text-[var(--accent)]' : ''}`}>Blog</Link>
                  <Link href="/documentacion" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/documentacion' ? 'text-[var(--accent)]' : ''}`}>Ayuda</Link>
                  <Link href="/api-docs" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/api-docs' ? 'text-[var(--accent)]' : ''}`}>API Docs</Link>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-light)]">
                <p className="text-xs font-bold text-[var(--text-4)] uppercase tracking-[0.2em] mb-4">Compañía</p>
                <div className="flex flex-col gap-4 pl-2">
                  <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/nosotros' ? 'text-[var(--accent)]' : ''}`}>Sobre Nosotros</Link>
                  <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/contacto' ? 'text-[var(--accent)]' : ''}`}>Contacto</Link>
                  <Link href="/seguridad" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/seguridad' ? 'text-[var(--accent)]' : ''}`}>Seguridad</Link>
                  <Link href="/roadmap" onClick={() => setIsMenuOpen(false)} className={`text-[var(--text-2)] font-medium ${pathname === '/roadmap' ? 'text-[var(--accent)]' : ''}`}>Roadmap</Link>
                </div>
              </div>

              {/* Dynamic user menu / guest buttons in Mobile */}
              {user ? (
                <div className="pt-6 border-t border-[var(--border-light)] flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <Avatar
                      src={user.avatarUrl}
                      alt="Avatar"
                      initials={initials}
                      size="lg"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[var(--text-1)]">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email.split('@')[0]}
                      </span>
                      <span className="text-xs text-[var(--text-4)] truncate max-w-[200px]">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 pl-2 text-[0.95rem]">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-2)] font-medium py-1">Dashboard</Link>
                    <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-2)] font-medium py-1">Mi perfil</Link>
                    <Link href="/dashboard/settings" onClick={() => setIsMenuOpen(false)} className="text-[var(--text-2)] font-medium py-1">Ajustes</Link>
                    <button 
                      onClick={() => { setIsMenuOpen(false); logout(); }} 
                      className="text-[var(--red)] font-semibold py-1 text-left flex items-center gap-1.5"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-[var(--border-light)] flex flex-col gap-3">
                  <Link 
                    href="/auth/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-center font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] py-2 border border-[var(--border-light)] rounded-[20px] transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    href="/auth/register" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="text-center bg-[var(--accent)] text-white font-semibold py-2.5 rounded-[20px] transition-all hover:bg-[var(--accent-hover)]"
                  >
                    Comenzar gratis
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--white)] border-t border-[var(--border-light)] py-[80px] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-6">
            <Logo size={24} textClassName="text-[1.3rem]" />
          </Link>
          <p className="text-[1.05rem] text-[var(--text-3)] max-w-sm mb-8 leading-relaxed">
            Inteligencia made simple. Automatiza tu contabilidad y enfócate en lo que realmente importa: tu negocio.
          </p>
          <a href="mailto:sales@contamind.ai" className="text-[var(--accent)] font-semibold text-[0.95rem] hover:text-[var(--accent-hover)] transition-colors">
            sales@contamind.ai
          </a>
        </div>
        
        <div>
          <h4 className="font-bold text-[0.9rem] text-[var(--text-1)] uppercase tracking-wider mb-6">Producto</h4>
          <ul className="space-y-4 text-[0.95rem] text-[var(--text-3)]">
            <li><Link href="/caracteristicas" className="hover:text-[var(--text-1)] transition-colors">Funcionalidades</Link></li>
            <li><Link href="/precios" className="hover:text-[var(--text-1)] transition-colors">Precios</Link></li>
            <li><Link href="/clientes" className="hover:text-[var(--text-1)] transition-colors">Casos de Éxito</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-[0.9rem] text-[var(--text-1)] uppercase tracking-wider mb-6">Compañía</h4>
          <ul className="space-y-4 text-[0.95rem] text-[var(--text-3)]">
            <li><Link href="/nosotros" className="hover:text-[var(--text-1)] transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/blog" className="hover:text-[var(--text-1)] transition-colors">Blog & Recursos</Link></li>
            <li><Link href="/seguridad" className="hover:text-[var(--text-1)] transition-colors">Seguridad</Link></li>
            <li><Link href="/contacto" className="hover:text-[var(--text-1)] transition-colors">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-[80px] pt-8 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-6 text-[0.85rem] text-[var(--text-4)]">
        <p>© 2026 ContaMind Inc. Hecho con ❤️ en Ecuador para el mundo.</p>
        <div className="flex items-center gap-6">
          <Link href="/legal" className="hover:text-[var(--text-1)] transition-colors">Términos y Privacidad</Link>
          <span className="hidden md:inline text-[var(--border-light)]">|</span>
          <Link href="/documentacion" className="hover:text-[var(--text-1)] transition-colors">Ayuda</Link>
          <span className="hidden md:inline text-[var(--border-light)]">|</span>
          <Link href="/api-docs" className="hover:text-[var(--text-1)] transition-colors">API</Link>
          <span className="hidden md:inline text-[var(--border-light)]">|</span>
          <Link href="/roadmap" className="hover:text-[var(--text-1)] transition-colors">Roadmap</Link>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--white)] font-sans text-[var(--text-2)] overflow-x-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] transition-colors duration-300">
      <Navbar />
      <main className="min-h-[calc(100vh-400px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
