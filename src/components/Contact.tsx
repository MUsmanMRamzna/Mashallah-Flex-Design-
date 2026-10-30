import React, { useState } from 'react';
import { Phone, Mail, ArrowUpRight, Sparkles, Send, MapPin } from 'lucide-react';
import { WhatsAppLogo } from './WhatsAppLogo';
import { BUSINESS_INFO } from '../data/businessData';

interface ContactProps {
  onScrollToOrder: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onScrollToOrder }) => {
  const [quickName, setQuickName] = useState('');
  const [quickMsg, setQuickMsg] = useState('');

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    const text = `Hi Attique Bhatti, my name is ${quickName.trim()}. ${quickMsg.trim()}`;
    const url = `https://wa.me/${BUSINESS_INFO.phoneClean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-24 bg-[#18181b] text-white relative overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Direct Contacts & Elegant 'Let's Talk' Element (7 cols) */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-6">
              <span>Start A Project</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight mb-6 text-balance">
              Let's Bring Your Next Idea to Life.
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-normal">
              Whether you need large outdoor promotional banners for an upcoming retail launch, elegant custom wedding cards, or complete corporate stationery, we are ready to assist.
            </p>

            {/* Direct Contact & Location Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {/* WhatsApp Card */}
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 hover:bg-stone-850 transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <WhatsAppLogo className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    WhatsApp Chat
                  </span>
                  <span className="font-semibold text-stone-100 text-sm flex items-center gap-1 group-hover:text-emerald-400 transition-colors">
                    <span>{BUSINESS_INFO.phone}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>

              {/* Confirmed Business Location Card (Clickable Google Maps link) */}
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 transition-all flex flex-col justify-between"
                title="View on Google Maps"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Studio Location · Lahore
                  </span>
                  <span className="font-medium text-stone-200 text-xs leading-relaxed block group-hover:text-amber-400 transition-colors">
                    {BUSINESS_INFO.location}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="group p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-sky-500/50 hover:bg-stone-850 transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Direct Email
                  </span>
                  <span className="font-semibold text-stone-100 text-xs truncate block group-hover:text-sky-400 transition-colors">
                    {BUSINESS_INFO.email}
                  </span>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${BUSINESS_INFO.phoneClean}`}
                className="group p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-850 transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                    Voice Call
                  </span>
                  <span className="font-semibold text-stone-100 text-sm flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                    <span>Direct Line</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            </div>

            {/* Circular 'Let's Talk' Element (Required in Prompt) */}
            <div className="flex items-center gap-6">
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-28 h-28 rounded-full border border-stone-700 hover:border-amber-500 flex items-center justify-center transition-all group cursor-pointer"
              >
                {/* Subtle continuous rotation animation */}
                <div
                  className="absolute inset-0 rounded-full border border-dashed border-amber-500/30 group-hover:border-amber-500 animate-spin"
                  style={{ animationDuration: '14s' }}
                />
                <div className="text-center group-hover:scale-110 transition-transform">
                  <div className="text-xs font-display font-extrabold uppercase tracking-widest text-amber-400">
                    LET'S
                  </div>
                  <div className="text-xs font-display font-extrabold uppercase tracking-widest text-white">
                    TALK
                  </div>
                </div>
              </a>

              <div className="text-xs text-stone-400 max-w-xs leading-normal">
                Click the talk orb or submit the quick briefing message to initiate immediate WhatsApp discussion.
              </div>
            </div>
          </div>

          {/* Right Column: Quick Message Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-stone-900/90 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Quick Message</h3>
                  <p className="text-xs text-stone-400">Directly routed to {BUSINESS_INFO.owner}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleQuickSend} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800 text-sm text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    What are you looking to design or print?
                  </label>
                  <textarea
                    rows={4}
                    value={quickMsg}
                    onChange={(e) => setQuickMsg(e.target.value)}
                    placeholder="e.g. Need a 20x5 ft shop banner and 1000 embossed business cards..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800 text-sm text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onScrollToOrder}
                    className="text-xs text-stone-400 hover:text-white transition-colors underline cursor-pointer"
                  >
                    Need to specify dimensions & materials? Use full order calculator
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
