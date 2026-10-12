import React from 'react';
import { ChevronRight, ArrowDownRight, MapPin } from 'lucide-react';

interface HeroProps {
  onStartMembership: () => void;
  onExplorePrograms: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartMembership, onExplorePrograms }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#080A08]">
      {/* Background Cinematic Image with Depth Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/gym_hero_cinematic_1791773981321.jpg"
          alt="Athlete training with barbell and chalk at FitnessFirst GYM"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-110 select-none scale-105 transform animate-fade-in"
        />
        {/* Measured dark scrim gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A08] via-[#080A08]/60 to-[#080A08]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A08]/90 via-[#080A08]/40 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 w-full">
        <div className="max-w-3xl">
          {/* 1. Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <span className="h-[2px] w-6 bg-[#C6FF3D]" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#C6FF3D] uppercase">
              FITNESSFIRST GYM · MAYADEVI, RUPANDEHI
            </span>
          </div>

          {/* 2. Headline */}
          <h1 className="font-athletic text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#F7F8F4] leading-[0.95] mb-6 sm:mb-8">
            BUILD YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7F8F4] via-[#F7F8F4] to-[#C6FF3D]">
              STRONGEST SELF.
            </span>
          </h1>

          {/* 3. Supporting Text */}
          <p className="text-lg sm:text-xl text-[#A7ADA2] max-w-xl font-normal leading-relaxed mb-8 sm:mb-10">
            Train with purpose. Push your limits. Become stronger every day.
          </p>

          {/* 4. CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12 sm:mb-14">
            <button
              onClick={onStartMembership}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-sm sm:text-base font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-all duration-200 rounded shadow-[0_0_20px_-4px_rgba(198,255,61,0.4)] hover:shadow-[0_0_28px_0px_rgba(198,255,61,0.6)] active:scale-95"
            >
              <span>START YOUR MEMBERSHIP</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExplorePrograms}
              className="flex items-center justify-center gap-2 px-7 py-4 text-sm sm:text-base font-semibold uppercase tracking-wider text-[#F7F8F4] hover:text-[#C6FF3D] bg-[#171B16]/90 hover:bg-[#232A22] border border-[#232A22] hover:border-[#C6FF3D]/40 transition-all duration-200 rounded"
            >
              <span>EXPLORE OUR PROGRAMS</span>
              <ArrowDownRight className="w-4 h-4 text-[#A7ADA2]" />
            </button>
          </div>

          {/* 5. Trust Statement & Location Strip */}
          <div className="pt-6 border-t border-[#232A22] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-[#A7ADA2]">
            <p className="font-medium text-[#F7F8F4] tracking-wide">
              Your goals. Your discipline. Your transformation.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A7ADA2]">
              <MapPin className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>Amuwa Road, Mayadevi-06, Rupandehi, Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
