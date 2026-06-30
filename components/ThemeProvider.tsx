'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Add no-transitions to prevent initial theme flash animation on mount
    document.documentElement.classList.add('no-transitions');

    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (newTheme: Theme) => {
      setTheme(newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    };

    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    // Remove no-transitions in the next frame
    const raf = requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-transitions');
    });

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
