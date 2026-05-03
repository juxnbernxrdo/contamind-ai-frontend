'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, BrainCircuit, ChevronDown } from 'lucide-react';

export function Navbar({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-[20px] backdrop-saturate-[180%] bg-[var(--nav-bg)] border-b border-[var(--border-light)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-medium text-[var(--text-1)]">
          <BrainCircuit className="text-[var(--accent)]" size={22} />
          <span className="font-semibold tracking-tight text-[1.1rem]">ContaMind</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[0.93rem] font-medium text-[var(--text-3)]">
          <Link href="/caracteristicas" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/caracteristicas' ? 'text-[var(--text-1)]' : ''}`}>Características</Link>
          <Link href="/precios" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/precios' ? 'text-[var(--text-1)]' : ''}`}>Precios</Link>
          <Link href="/clientes" className={`hover:text-[var(--text-1)] transition-colors ${pathname === '/clientes' ? 'text-[var(--text-1)]' : ''}`}>Casos de Éxito</Link>
          
          <div className="relative group flex items-center h-16">
            <span className={`hover:text-[var(--text-1)] transition-colors cursor-pointer flex items-center gap-1 ${['/blog', '/documentacion', '/api-docs'].includes(pathname) ? 'text-[var(--text-1)]' : ''}`}>
              Recursos <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </span>
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 bg-[var(--white)] border border-[var(--border-light)] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
              <Link href="/blog" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Blog</Link>
              <Link href="/documentacion" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Ayuda</Link>
              <Link href="/api-docs" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">API Docs</Link>
            </div>
          </div>
          
          <div className="relative group flex items-center h-16">
            <span className={`hover:text-[var(--text-1)] transition-colors cursor-pointer flex items-center gap-1 ${['/nosotros', '/contacto', '/seguridad', '/roadmap'].includes(pathname) ? 'text-[var(--text-1)]' : ''}`}>
              Compañía <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </span>
            <div className="absolute top-[60px] left-1/2 -translate-x-1/2 w-48 bg-[var(--white)] border border-[var(--border-light)] rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
              <Link href="/nosotros" className="px-3 py-2 hover:bg-[var(--off-white)] rounded-[8px] text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Nosotros</Link>
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

          <button className="bg-[var(--accent)] text-white px-[20px] lg:px-[28px] py-[10px] lg:py-[12px] rounded-[24px] text-[0.9rem] font-medium hover:bg-[var(--accent-hover)] transition-all">
            Ingresar
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[var(--white)] border-t border-[var(--border-light)] py-[60px] px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 font-medium text-[var(--text-1)] mb-4">
            <BrainCircuit className="text-[var(--accent)]" size={24} />
            <span className="font-bold tracking-tight text-[1.2rem]">ContaMind</span>
          </div>
          <p className="text-[0.95rem] text-[var(--text-3)] max-w-sm mb-6">
            Inteligencia made simple. Automatiza tu contabilidad y enfócate en crecer.
          </p>
          <a href="mailto:sales@contamind.ai" className="text-[var(--accent)] font-medium text-[0.9rem] hover:underline">
            sales@contamind.ai
          </a>
        </div>
        
        <div>
          <h4 className="font-semibold text-[0.9rem] text-[var(--text-1)] mb-4">Producto</h4>
          <ul className="space-y-3 text-[0.9rem] text-[var(--text-3)]">
            <li><Link href="/caracteristicas" className="hover:text-[var(--text-1)] transition-colors">Funcionalidades</Link></li>
            <li><Link href="/precios" className="hover:text-[var(--text-1)] transition-colors">Precios</Link></li>
            <li><Link href="/clientes" className="hover:text-[var(--text-1)] transition-colors">Casos de Éxito</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-[0.9rem] text-[var(--text-1)] mb-4">Compañía</h4>
          <ul className="space-y-3 text-[0.9rem] text-[var(--text-3)]">
            <li><Link href="/nosotros" className="hover:text-[var(--text-1)] transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/blog" className="hover:text-[var(--text-1)] transition-colors">Blog & Recursos</Link></li>
            <li><Link href="/seguridad" className="hover:text-[var(--text-1)] transition-colors">Seguridad</Link></li>
            <li><Link href="/contacto" className="hover:text-[var(--text-1)] transition-colors">Contacto</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-[60px] pt-8 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-4 text-[0.85rem] text-[var(--text-4)]">
        <p>© 2026 ContaMind Inc. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <Link href="/legal" className="hover:text-[var(--text-1)] transition-colors">Términos y Privacidad</Link>
          <span className="text-[var(--border-light)]">|</span>
          <Link href="/documentacion" className="hover:text-[var(--text-1)] transition-colors">Ayuda</Link>
          <span className="text-[var(--border-light)]">|</span>
          <Link href="/api-docs" className="hover:text-[var(--text-1)] transition-colors">API</Link>
          <span className="text-[var(--border-light)]">|</span>
          <Link href="/roadmap" className="hover:text-[var(--text-1)] transition-colors">Roadmap</Link>
        </div>
      </div>
    </footer>
  );
}

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (isDarkTheme: boolean) => {
      setIsDark(isDarkTheme);
      if (isDarkTheme) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    };

    if (savedTheme) {
      applyTheme(savedTheme === 'dark');
    } else {
      applyTheme(mediaQuery.matches);
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    const themeStr = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', themeStr);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  if (isDark === null) return null;

  return (
    <div className="min-h-screen bg-[var(--white)] font-sans text-[var(--text-2)] overflow-x-hidden selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] transition-colors duration-300">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="min-h-[calc(100vh-400px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
