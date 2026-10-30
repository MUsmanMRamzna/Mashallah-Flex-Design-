import React from 'react';
import { CheckCircle2, ArrowRight, Printer, Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData';

interface AboutProps {
  onExploreServices: () => void;
  onStartOrder: () => void;
}

export const About: React.FC<AboutProps> = ({ onExploreServices, onStartOrder }) => {
  return (
    <section id="about" className="py-24 bg-white border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story, Philosophy & Principles (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 mb-4">
              <span>About Mashallah Printing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-950 tracking-tight leading-tight mb-6">
              Creative Design Meets Quality Printing.
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed text-base sm:text-lg mb-8">
              <p>
                At <strong className="text-stone-900 font-semibold">{BUSINESS_INFO.name}</strong>, we bridge the gap between creative visual conceptualization and physical manufacturing. Led by creative director <strong className="text-stone-900 font-semibold">{BUSINESS_INFO.owner}</strong>, we provide tailored design and printing services for individuals, commercial shops, retail businesses, celebratory events, and advertising campaigns.
              </p>
              <p>
                We believe that a banner or a business card is not merely ink on vinyl or paper—it is the physical ambassador of your brand. That is why every project receives individualized typographic care, vector precision, color profiling, and high-durability media selection before production.
              </p>
            </div>

            {/* Core Commitments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Color-Accurate Large Format</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  Heavy 440gsm to 510gsm frontlit and star flex media with high-density UV and solvent inks that resist sun fade.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70">
                <div className="flex items-center gap-2 font-display font-bold text-stone-900 text-sm mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Luxury Stationery Craft</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">
                  Hot foil stamping, velvet touch coatings, carbonless bill books, laser-cut wedding stationery, and self-inking stamps.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreServices}
                className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onStartOrder}
                className="px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dimensional Designer Profile / Business Card Showcase (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] relative">
              {/* Backing Dimensional Tilt Shadow Card */}
              <div className="absolute inset-0 bg-stone-900 rounded-3xl transform rotate-3 translate-x-2 translate-y-3 -z-10 opacity-15" />

              {/* Main Designer Card */}
              <div className="bg-[#18181b] text-white rounded-3xl p-7 border border-stone-800 shadow-2xl relative overflow-hidden">
                {/* Gold Foil Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-display font-bold text-amber-400 text-lg">
                      {BUSINESS_INFO.monogram}
                    </div>
                    <div>
                      <div className="font-display font-bold text-lg text-white">Attique Bhatti</div>
                      <div className="text-xs text-amber-400/90 font-medium">Designer & Master Printer</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 border border-stone-800 px-2 py-1 rounded-md">
                    OFFICIAL
                  </span>
                </div>

                {/* Studio Wordmark */}
                <div className="mb-6 pb-6 border-b border-stone-800">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">Business Identity</p>
                  <p className="font-display font-semibold text-stone-100 text-base">
                    {BUSINESS_INFO.name}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    Graphic Design · Flex Banner Printing · Advertising
                  </p>
                </div>

                {/* Direct Contact Points */}
                <div className="space-y-3 text-xs mb-6">
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-stone-800/60 hover:bg-stone-800 transition-colors text-stone-300 hover:text-white"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">WhatsApp & Call</span>
                      <span className="font-medium text-stone-200">{BUSINESS_INFO.phone}</span>
                    </div>
                  </a>

                  <a
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-stone-800/60 hover:bg-stone-800 transition-colors text-stone-300 hover:text-white"
                  >
                    <div className="w-7 h-7 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Email Inquiries</span>
                      <span className="font-medium text-stone-200 truncate">{BUSINESS_INFO.email}</span>
                    </div>
                  </a>

                  <a
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-stone-800/60 hover:bg-stone-800 transition-colors text-stone-300 hover:text-white group"
                  >
                    <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-stone-400 block text-[10px] uppercase font-mono">Location</span>
                      <span className="font-medium text-stone-200 block truncate group-hover:text-amber-400 transition-colors">
                        {BUSINESS_INFO.location}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Footer Stamp / Guarantee Note */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-800/80 text-[11px] text-stone-400">
                  <span>Authentic Direct Consultation</span>
                  <span className="text-amber-400 font-semibold">100% Vector Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
