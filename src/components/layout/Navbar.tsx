'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong shadow-sm'
          : isHome
          ? 'bg-transparent'
          : 'glass-subtle'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">🌿</span>
            <span className="font-semibold text-stone-800 group-hover:text-emerald-700 transition-colors">
              EcoPilot
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
              Carbon Intelligence
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {!isHome && (
              <>
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800 
                    rounded-lg hover:bg-white/40 transition-all"
                >
                  Home
                </Link>
                <Link
                  href="/assessment"
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    pathname === '/assessment'
                      ? 'text-emerald-700 bg-emerald-50/60'
                      : 'text-stone-600 hover:text-stone-800 hover:bg-white/40'
                  }`}
                >
                  Assessment
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    pathname === '/dashboard'
                      ? 'text-emerald-700 bg-emerald-50/60'
                      : 'text-stone-600 hover:text-stone-800 hover:bg-white/40'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}

            <Link
              href="/assessment"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 
                rounded-xl hover:bg-emerald-700 transition-colors shadow-sm 
                hover:shadow-md active:scale-[0.98]"
            >
              {isHome ? 'Start Assessment' : 'Retake'}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
