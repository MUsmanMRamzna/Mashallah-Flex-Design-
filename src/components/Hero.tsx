import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, Printer, Layers, Compass } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

interface HeroProps {
  onExploreServices: () => void;
  onStartOrder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices, onStartOrder }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 2;
    const y = ((clientY - top) / height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#fcfbfa] via-[#faf8f5] to-[#f5f3ef]"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Studio Identity Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-stone-700 bg-stone-100/90 border border-stone-200/80">
                <Printer className="w-3.5 h-3.5 text-amber-600" />
                <span>Mashallah Flex Printing & Advertising</span>
              </span>
              <span className="text-xs text-stone-400 font-medium hidden sm:inline">·</span>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">By Attique Bhatti</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold text-stone-950 tracking-tight leading-[1.08] mb-6 text-balance">
              Designing Ideas.{' '}
              <span className="inline-block relative text-stone-950">
                Printing Impact.
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2.5 text-amber-500/70"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,8 Q50,0 100,6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Value Proposition Prose */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mb-8 font-normal">
              From heavy-duty outdoor billboard flex banners and sharp business identity cards to regal wedding invitation suites and high-precision laser stamps. Led by designer and master printer{' '}
              <strong className="text-stone-900 font-semibold">{BUSINESS_INFO.owner}</strong>, we transform raw concepts into tactile, high-grade printed reality.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreServices}
                className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Services</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={onStartOrder}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-sm border border-stone-300 shadow-xs hover:border-stone-400 transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Start Your Order</span>
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
              </button>
            </div>

            {/* Editorial Feature Strip */}
            <div className="pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-4 max-w-xl">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Printing Media</p>
                <p className="text-sm font-semibold text-stone-800">Flex, Vinyl & Cards</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Direct Proofing</p>
                <p className="text-sm font-semibold text-stone-800">Vector & 3D Mockup</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Direct Support</p>
                <p className="text-sm font-semibold text-stone-800">WhatsApp Fast Connect</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Portrait (5 cols) - Restored Original Photo Presentation */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[400px] sm:max-w-[430px] transition-transform duration-200 ease-out"
              style={{
                transform: prefersReducedMotion
                  ? 'none'
                  : `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
              }}
            >
              {/* Decorative Subtle Geometry Backdrop */}
              <div className="absolute inset-0 -m-3 rounded-3xl bg-linear-to-tr from-amber-100/40 via-stone-100/30 to-sky-100/20 transform -rotate-1 -z-10 border border-stone-200/60 shadow-sm" />

              {/* Portrait Container - Original High-Resolution Photo */}
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xl group">
                <img
                  src="/assets/images/ati_bhatti_portrait.png"
                  alt="Attique Bhatti - Creative Designer & Master Printer"
                  className="w-full h-auto aspect-[3/4] object-cover object-top select-none transition-transform duration-500 group-hover:scale-102"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle Gradient Scrim at Bottom of Image for Readability */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent p-5 pt-12 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg tracking-tight">Attique Bhatti</h3>
                      <p className="text-xs text-stone-300 font-medium">Designer & Master Printer</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Tangible Card: Verified Contact Chip */}
              <div
                className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 rounded-xl p-3 border border-stone-200 shadow-lg text-xs flex items-center gap-3 transition-transform duration-150 z-20"
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)`,
                }}
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200/70 shrink-0">
                  <Compass className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">Direct Consultation</div>
                  <div className="text-[11px] text-stone-500">{BUSINESS_INFO.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 lg:mt-16 flex justify-center">
          <button
            onClick={onExploreServices}
            className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer group"
            aria-label="Scroll to explore services"
          >
            <span className="text-[11px] font-semibold tracking-widest uppercase">Scroll Down</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-stone-400 group-hover:text-stone-700" />
          </button>
        </div>
      </div>
    </section>
  );
};
