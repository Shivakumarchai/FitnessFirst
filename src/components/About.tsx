import React from 'react';
import { Dumbbell, Target, ShieldCheck, Clock } from 'lucide-react';

export const About: React.FC = () => {
  const benefits = [
    {
      icon: Dumbbell,
      title: 'Dedicated Free Weights & Racks',
      description: 'Heavy calibrated iron, Olympic barbells, power racks, and precision dumbbells built for serious progressive overload.'
    },
    {
      icon: Target,
      title: 'Purpose-Driven Training',
      description: 'No gimmicks or wasted time. Structured training guidance focused on sustainable athletic strength and physical resilience.'
    },
    {
      icon: ShieldCheck,
      title: 'Disciplined & Welcoming Environment',
      description: 'A focused community where beginners and advanced lifters alike respect the process and support each other\'s progress.'
    },
    {
      icon: Clock,
      title: 'Consistent Daily Access',
      description: 'Open early mornings and late evenings Sunday through Friday to accommodate your work and life routines.'
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#080A08] border-t border-[#232A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Asset */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#232A22] group">
              <img
                src="/src/assets/images/gym_facility_equipment_1791774039394.jpg"
                alt="FitnessFirst GYM modern strength equipment and training floor"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A08] via-transparent to-transparent opacity-80" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded bg-[#171B16]/95 border border-[#232A22] backdrop-blur-sm">
                <p className="text-xs font-semibold text-[#C6FF3D] uppercase tracking-wider mb-1">
                  OFFICIAL LOCATION
                </p>
                <p className="text-sm font-medium text-[#F7F8F4]">
                  Mayadevi Rural Municipality–06, Rupandehi, Amuwa Road, Nepal
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-5 bg-[#C6FF3D]" />
              <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
                ABOUT OUR FACILITY
              </span>
            </div>

            <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none mb-6">
              MORE THAN A GYM. <br />
              <span className="text-[#C6FF3D]">A STRONGER WAY OF LIFE.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#A7ADA2] leading-relaxed mb-8">
              FitnessFirst GYM is a place to build strength, develop discipline, improve fitness, and work toward meaningful personal goals. Whether you're beginning your fitness journey or taking your training to the next level, our focus is on helping you train with purpose.
            </p>

            {/* Benefit-led statements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#232A22]">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="p-4 rounded bg-[#111411] border border-[#232A22]">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Icon className="w-4 h-4 text-[#C6FF3D] shrink-0" />
                      <h3 className="text-sm font-bold text-[#F7F8F4] uppercase tracking-wide">
                        {b.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#A7ADA2] leading-normal">
                      {b.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
