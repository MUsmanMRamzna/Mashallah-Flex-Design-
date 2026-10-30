import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';
import { BUSINESS_INFO } from '../data/businessData';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'process', label: 'Process' },
    { id: 'order', label: 'Contact / Order' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 border-b border-stone-200/80 shadow-xs backdrop-blur-none py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand with Monogram AB */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-display font-bold text-sm tracking-wider shadow-xs transition-transform group-hover:scale-105">
              {BUSINESS_INFO.monogram}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg text-stone-950 tracking-tight whitespace-nowrap">
                {BUSINESS_INFO.shortName}
              </span>
              <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap hidden sm:block">
                Design & Advertising Studio
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-medium transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Quick WhatsApp */}
          <div className="flex items-center gap-2.5">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              title="Quick WhatsApp Discussion"
            >
              <WhatsAppLogo className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigate('order')}
              className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Start Order</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg border border-stone-200 bg-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Complies with 15% sticky height rule) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-5 shadow-lg">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-stone-100 text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5"
              >
                <WhatsAppLogo className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>+92 343 4758685</span>
              </a>
              <span className="text-xs text-stone-500">{BUSINESS_INFO.owner}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
