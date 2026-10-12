import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';
import { Plan } from '../types';

interface PricingProps {
  plans: Record<string, Plan>;
  onSelectPlan: (planId: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ plans, onSelectPlan }) => {
  const planOrder = ['starter', 'pro', 'elite'];

  return (
    <section id="membership" className="py-24 sm:py-32 bg-[#111411] border-t border-[#232A22] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-[2px] w-5 bg-[#C6FF3D]" />
            <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
              TRANSPARENT RATES
            </span>
            <span className="h-[2px] w-5 bg-[#C6FF3D]" />
          </div>

          <h2 className="font-athletic text-4xl sm:text-6xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none mb-4">
            MEMBERSHIP PLANS
          </h2>
          <p className="text-sm sm:text-base text-[#A7ADA2]">
            Official rates validated server-side. Zero hidden registration surcharges. Pay securely via eSewa or Khalti.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {planOrder.map((key) => {
            const plan = plans[key];
            if (!plan) return null;
            const isFeatured = plan.isFeatured || key === 'pro';

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? 'bg-[#171B16] border-2 border-[#C6FF3D] lime-glow -translate-y-2'
                    : 'bg-[#171B16]/90 border border-[#232A22] hover:border-[#C6FF3D]/40 hover:-translate-y-1'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#C6FF3D] text-[#080A08] text-[11px] font-black uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                {/* Card Header & Price */}
                <div className="p-8">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h3 className="font-athletic text-3xl font-extrabold uppercase tracking-wide text-[#F7F8F4]">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7ADA2] min-h-[40px] mb-6">
                    {plan.description}
                  </p>

                  {/* Price Block */}
                  <div className="py-6 border-y border-[#232A22] mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs sm:text-sm font-semibold text-[#A7ADA2]">Rs.</span>
                      <span className="font-athletic text-5xl sm:text-6xl font-black text-[#F7F8F4] tracking-tight">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-[#A7ADA2]">/ month</span>
                    </div>
                    <span className="text-[11px] text-[#A7ADA2] flex items-center gap-1 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF3D]" />
                      Server-verified price in NPR
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#F7F8F4]">
                      Included in {plan.name}:
                    </p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#A7ADA2]">
                        <Check className="w-4 h-4 text-[#C6FF3D] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-8 pt-0">
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-4 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all duration-200 active:scale-95 ${
                      isFeatured
                        ? 'bg-[#C6FF3D] text-[#080A08] hover:bg-[#d4ff66] shadow-[0_0_18px_rgba(198,255,61,0.35)]'
                        : 'bg-[#111411] text-[#F7F8F4] hover:text-[#080A08] hover:bg-[#C6FF3D] border border-[#232A22]'
                    }`}
                  >
                    JOIN AS {plan.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
