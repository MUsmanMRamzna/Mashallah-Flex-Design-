import React from 'react';
import { WORKFLOW_STEPS, BUSINESS_INFO } from '../data/businessData';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onStartOrder: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onStartOrder }) => {
  return (
    <section id="process" className="py-24 bg-stone-50/70 border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-stone-700 bg-white border border-stone-200 mb-4 shadow-xs">
            <span>Production Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-stone-950 tracking-tight leading-tight mb-4">
            From Initial Dimensions to Finished Print
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Our streamlined process ensures that every banner hem, card foil emboss, and stamp impression meets rigorous clarity and durability standards.
          </p>
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="relative bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Clean Editorial Number */}
                <div className="text-3xl font-display font-black text-amber-600/90 mb-4">
                  {step.step}.
                </div>

                {/* Step Title */}
                <h3 className="font-display font-bold text-lg text-stone-950 mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Progress connector indicator */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-stone-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Phase {idx + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>

        {/* Process Banner Callout */}
        <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-2">
              Ready to submit your specifications?
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
              Use our interactive order calculator below or start a direct conversation on WhatsApp with {BUSINESS_INFO.owner} for immediate assistance.
            </p>
          </div>
          <button
            onClick={onStartOrder}
            className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Fill Order Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
