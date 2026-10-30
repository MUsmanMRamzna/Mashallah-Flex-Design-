import React, { useState } from 'react';
import { WhatsAppLogo } from './WhatsAppLogo';
import { BUSINESS_INFO } from '../data/businessData';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Label */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-stone-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-lg border border-stone-800 transition-all duration-200 pointer-events-none select-none ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2'
        }`}
      >
        <span>Chat with {BUSINESS_INFO.owner} on WhatsApp</span>
      </div>

      {/* Main Authentic WhatsApp Button */}
      <a
        href={BUSINESS_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:shadow-[#25D366]/40 flex items-center justify-center transition-all duration-300 transform hover:scale-108 active:scale-95 border-2 border-white focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/30 group cursor-pointer"
        title="Contact us on WhatsApp: +92 343 4758685"
      >
        <WhatsAppLogo className="w-7 h-7 fill-white transition-transform duration-300 group-hover:scale-105" />
      </a>
    </div>
  );
};
