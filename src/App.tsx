import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ThreeStudio } from './components/ThreeStudio';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Process } from './components/Process';
import { OrderForm } from './components/OrderForm';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Sparkles, Eye } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('flex-banner');

  // ScrollSpy to update active nav state smoothly
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['home', 'about', 'studio', 'services', 'portfolio', 'process', 'order', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i] === 'studio' ? 'services' : sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const handleSelectServiceAndOrder = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToSection('order');
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 selection:bg-stone-900 selection:text-white flex flex-col font-sans">
      {/* Sticky Top Navigation */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onExploreServices={() => scrollToSection('services')}
          onStartOrder={() => scrollToSection('order')}
        />

        {/* 2. About the Designer & Business */}
        <About
          onExploreServices={() => scrollToSection('services')}
          onStartOrder={() => scrollToSection('order')}
        />

        {/* Interactive 3D Print Craft Studio Inspection Section */}
        <section id="studio" className="py-20 bg-stone-100/60 border-t border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200/60 mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Real-Time 3D Print Inspector</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-stone-950 tracking-tight leading-tight mb-2">
                Inspect Physical Print Dimensions & Finishes
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Interact with our 3D procedural models to preview banner stands, gold foil business cards, self-inking stamps, and tri-fold brochures before production. Drag to rotate 360°, inspect textures, and switch surface finishes.
              </p>
            </div>

            {/* 3D Studio WebGL Component */}
            <ThreeStudio onSelectService={handleSelectServiceAndOrder} />
          </div>
        </section>

        {/* 3. Interactive Services Section */}
        <Services onSelectService={handleSelectServiceAndOrder} />

        {/* 4. Portfolio & Creative Projects */}
        <Portfolio onRequestSimilar={handleSelectServiceAndOrder} />

        {/* 5. Production Workflow / Process */}
        <Process onStartOrder={() => scrollToSection('order')} />

        {/* 6. Customer Order Form */}
        <OrderForm
          selectedServiceId={selectedServiceId}
          onServiceChange={setSelectedServiceId}
        />

        {/* 7. Distinctive Contact Section */}
        <Contact onScrollToOrder={() => scrollToSection('order')} />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onSelectService={handleSelectServiceAndOrder}
      />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsApp />
    </div>
  );
}
