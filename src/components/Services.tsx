import React, { useState } from 'react';
import {
  Printer,
  Sparkles,
  CreditCard,
  Stamp,
  Share2,
  FileText,
  Heart,
  FolderOpen,
  Receipt,
  Megaphone,
  ArrowRight,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/businessData';

interface ServicesProps {
  onSelectService: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'printing', label: 'Large Format & Printing' },
    { id: 'corporate', label: 'Corporate Stationery & Stamps' },
    { id: 'design', label: 'Digital & Brand Design' },
    { id: 'events', label: 'Matrimonial & Events' },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'flex-banner':
        return <Printer className="w-5 h-5 text-amber-600" />;
      case 'business-cards':
        return <CreditCard className="w-5 h-5 text-sky-600" />;
      case 'logo-design':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'stamp-printing':
        return <Stamp className="w-5 h-5 text-red-600" />;
      case 'social-media-post':
        return <Share2 className="w-5 h-5 text-pink-600" />;
      case 'brochures':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'wedding-invitations':
        return <Heart className="w-5 h-5 text-amber-600" />;
      case 'letterheads':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'bill-books':
        return <Receipt className="w-5 h-5 text-purple-600" />;
      case 'file-covers':
        return <FolderOpen className="w-5 h-5 text-teal-600" />;
      case 'advertising-materials':
      default:
        return <Megaphone className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-stone-50/70 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-stone-700 bg-white border border-stone-200 mb-4 shadow-xs">
            <span>Specialized Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-950 tracking-tight leading-tight mb-4">
            Comprehensive Design & Printing Solutions
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Every medium demands dedicated craft. From weather-proof outdoor vinyl to hand-inspected luxury cards, discover our primary production specialties.
          </p>
        </div>

        {/* Functional Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl mb-12 max-w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon & Material Specs */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center transition-transform group-hover:scale-105">
                    {getServiceIcon(service.id)}
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    {service.hasDimensions ? 'Custom Dimensions' : 'Standard Spec'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                  {service.shortDesc}
                </p>

                {/* Unboxed Metadata (Zero-Pill Rule) */}
                <div className="text-xs text-stone-500 mb-6 flex flex-wrap items-center gap-1.5 leading-tight">
                  <span className="font-medium text-stone-700">{service.materials[0]}</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span>{service.features[0]}</span>
                  {service.materials[1] && (
                    <>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span>{service.materials[1]}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Card Footer: Pricing Note & Action */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Quote on Specs
                </span>
                <button
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <span>Order This Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
