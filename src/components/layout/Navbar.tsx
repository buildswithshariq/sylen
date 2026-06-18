'use client';

import { useState, useEffect } from 'react';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePathname, useRouter } from 'next/navigation';
import { m as motion, AnimatePresence } from 'framer-motion';
import { useAssessment } from '@/hooks/useAssessment';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Resources', href: '/resources' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isComplete, isLoaded } = useAssessment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const ctaText = isLoaded ? (isComplete ? 'Retake Assessment' : 'Take Assessment') : 'Take Assessment';
  const ctaHref = '/assessment';

  const handleReAssessmentClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sylen-assessment');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isComplete) {
            e.preventDefault();
            const confirmRetake = window.confirm(
              "Are you sure you want to take a re-assessment? This will remove your previous record."
            );
            if (confirmRetake) {
              localStorage.removeItem('sylen-assessment');
              localStorage.removeItem('eco-score-cache');
              if (document.startViewTransition) {
                document.startViewTransition(() => router.push('/assessment?retake=true'));
              } else {
                router.push('/assessment?retake=true');
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <TransitionLink href="/" className="flex items-center gap-2 group">
                <span className="text-2xl transition-transform group-hover:scale-110">🌱</span>
                <span className="font-semibold text-xl tracking-tight text-stone-800">
                  Sy<span className="text-emerald-600">len</span>
                </span>
              </TransitionLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <TransitionLink
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-stone-600 hover:text-emerald-600'
                    }`}
                  >
                    {link.name}
                  </TransitionLink>
                );
              })}
              
              <TransitionLink
                href={ctaHref}
                onClick={handleReAssessmentClick}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {ctaText}
              </TransitionLink>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-stone-600 hover:text-stone-900 hover:bg-stone-100/50 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm"
          >
            <div className="absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-stone-200/50 shadow-xl pb-6 px-4 pt-4 rounded-b-3xl">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <TransitionLink
                      key={link.name}
                      href={link.href}
                      className={`block px-3 py-2 rounded-lg text-base font-medium ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-stone-700 hover:bg-stone-50 hover:text-emerald-600'
                      }`}
                    >
                      {link.name}
                    </TransitionLink>
                  );
                })}
                <div className="pt-4 border-t border-stone-200/50">
                  <TransitionLink
                    href={ctaHref}
                    onClick={handleReAssessmentClick}
                    className="flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  >
                    {ctaText}
                  </TransitionLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
