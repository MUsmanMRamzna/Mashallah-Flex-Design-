import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Sparkles, Layers, Maximize2, ExternalLink } from 'lucide-react';
import { PORTFOLIO_ITEMS, PortfolioItem } from '../data/businessData';

interface PortfolioProps {
  onRequestSimilar: (serviceId: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onRequestSimilar }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const tabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'flex', label: 'Flex Banners' },
    { id: 'branding', label: 'Brand Identity & Stationery' },
    { id: 'invitations', label: 'Wedding Invitations' },
    { id: 'social', label: 'Social Media' },
    { id: 'print', label: 'Stamps & Commercial' },
  ];

  const filteredItems =
    activeTab === 'all'
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeTab);

  // Keyboard accessibility for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section id="portfolio" className="py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-stone-700 bg-stone-100 border border-stone-200 mb-4">
              <span>Selected Portfolio Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-950 tracking-tight leading-tight">
              Crafted With Purpose. Printed For Scale.
            </h2>
          </div>
          <p className="text-stone-600 text-sm sm:text-base max-w-md leading-relaxed">
            Curated concept designs and sample productions showcasing color accuracy, typographic mastery, and material finish quality.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-100 rounded-xl mb-12 max-w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedProject(item)}
              className="group bg-stone-50 rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 cursor-pointer flex flex-col"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] bg-stone-200 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="bg-white/90 text-stone-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Inspect Details</span>
                  </div>
                </div>

                {/* Highlight Tag */}
                {item.highlightTag && (
                  <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xs backdrop-blur-none">
                    {item.highlightTag}
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-amber-700 mb-1.5">
                    {item.categoryLabel}
                  </div>
                  <h3 className="font-display font-bold text-lg text-stone-950 mb-2 leading-snug group-hover:text-amber-800 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Unboxed Metadata Specs */}
                <div className="pt-3 border-t border-stone-200/80 text-[11px] text-stone-500 font-mono">
                  {item.specs}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Inspector */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-xs"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Media */}
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full transition-colors cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                  <span>{selectedProject.categoryLabel}</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500 font-normal">Illustrative Showcase</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-stone-950 mb-4">
                  {selectedProject.title}
                </h3>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                  {selectedProject.description}
                </p>

                {/* Specifications Grid */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 mb-8">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Technical Specifications
                  </div>
                  <div className="text-sm font-medium text-stone-800">
                    {selectedProject.specs}
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-100">
                  <span className="text-xs text-stone-500">
                    Need a custom variation of this design?
                  </span>
                  <button
                    onClick={() => {
                      const sid = selectedProject.serviceId;
                      setSelectedProject(null);
                      onRequestSimilar(sid);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Request Similar Design</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
