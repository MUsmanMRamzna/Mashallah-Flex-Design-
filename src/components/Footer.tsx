import React from 'react';
import { BUSINESS_INFO, SERVICES } from '../data/businessData';
import { ArrowUp, MapPin, Mail, Phone } from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onSelectService: (serviceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectService }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand & Location Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-stone-950 flex items-center justify-center font-display font-bold text-xs tracking-wider">
                {BUSINESS_INFO.monogram}
              </div>
              <span className="font-display font-bold text-lg text-white">
                {BUSINESS_INFO.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Premium graphic design, wide-format flex printing, bespoke corporate stationery, wedding suites, and advertising solutions managed by creative director <strong className="text-stone-300">{BUSINESS_INFO.owner}</strong>.
            </p>

            {/* Confirmed Details including Location */}
            <div className="pt-2 text-xs space-y-2">
              {/* Clickable Location with Pin */}
              <div className="flex items-start gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <a
                  href={BUSINESS_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors leading-relaxed"
                  title="Open location in Google Maps"
                >
                  {BUSINESS_INFO.location}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-stone-300 hover:text-white transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-2">
                <WhatsAppLogo className="w-4 h-4 fill-[#25D366] shrink-0" />
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  {BUSINESS_INFO.phone} (WhatsApp)
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-4 font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'home', label: 'Home Overview' },
                { id: 'about', label: 'About the Studio' },
                { id: 'services', label: 'Printing & Design Services' },
                { id: 'portfolio', label: 'Selected Works' },
                { id: 'process', label: 'Production Process' },
                { id: 'order', label: 'Order Inquiry & Calculator' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Services (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-4 font-mono">
              Specialized Services
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {SERVICES.slice(0, 8).map((srv) => (
                <button
                  key={srv.id}
                  onClick={() => onSelectService(srv.id)}
                  className="hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  {srv.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Owner: {BUSINESS_INFO.owner}</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
