import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const galleryItems = [
    {
      src: '/src/assets/images/gym_hero_cinematic_1791773981321.jpg',
      title: 'Heavy Barbell Deadlift Focus',
      category: 'Strength & Power'
    },
    {
      src: '/src/assets/images/gym_facility_equipment_1791774039394.jpg',
      title: 'Power Cages & Free Weight Arena',
      category: 'Facility'
    },
    {
      src: '/src/assets/images/program_strength_power_1791773998468.jpg',
      title: 'Chalked Iron & Olympic Plates',
      category: 'Equipment'
    },
    {
      src: '/src/assets/images/program_functional_athletic_1791774010834.jpg',
      title: 'Metabolic Battle Rope Conditioning',
      category: 'Functional'
    },
    {
      src: '/src/assets/images/trainer_lead_coach_1791774026774.jpg',
      title: 'Certified Coaching Floor Guidance',
      category: 'Coaching'
    },
    {
      src: '/src/assets/images/gym_hero_cinematic_1791773981321.jpg',
      title: 'Discipline & Purpose in Every Rep',
      category: 'Atmosphere'
    }
  ];

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#080A08] border-t border-[#232A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-5 bg-[#C6FF3D]" />
              <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
                INSIDE THE FACILITY
              </span>
            </div>
            <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none">
              TRAINING GALLERY
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#A7ADA2] max-w-md">
            Raw iron, professional equipment, and the focused atmosphere of FitnessFirst GYM in Mayadevi, Rupandehi.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImage(item.src)}
              className="group relative h-64 sm:h-72 rounded-lg overflow-hidden bg-[#171B16] border border-[#232A22] cursor-pointer hover:border-[#C6FF3D]/50 transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A08] via-[#080A08]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#C6FF3D] uppercase tracking-wider block mb-0.5">
                    {item.category}
                  </span>
                  <p className="text-sm font-bold text-[#F7F8F4] uppercase font-athletic">
                    {item.title}
                  </p>
                </div>
                <div className="p-1.5 rounded-full bg-[#080A08]/80 text-[#C6FF3D] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white bg-[#080A08]/80 hover:bg-[#C6FF3D] hover:text-[#080A08] rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="FitnessFirst GYM gallery preview"
              className="max-h-[85vh] max-w-full object-contain rounded-lg border border-[#232A22]"
            />
          </div>
        </div>
      )}
    </section>
  );
};
