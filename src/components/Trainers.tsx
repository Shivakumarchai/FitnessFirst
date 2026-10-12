import React from 'react';
import { Award, Clock, Mail, Phone, Edit3 } from 'lucide-react';
import { Trainer } from '../types';

interface TrainersProps {
  trainers: Trainer[];
  onTrainerInquiry: (trainer: Trainer) => void;
  onOpenAdmin: () => void;
}

export const Trainers: React.FC<TrainersProps> = ({
  trainers,
  onTrainerInquiry,
  onOpenAdmin,
}) => {
  return (
    <section id="trainers" className="py-24 sm:py-32 bg-[#080A08] border-t border-[#232A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-5 bg-[#C6FF3D]" />
              <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
                COACHING STAFF
              </span>
            </div>
            <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none">
              TRAINERS & COACHES
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#A7ADA2] hover:text-[#C6FF3D] bg-[#171B16] border border-[#232A22] rounded transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manage Coaches</span>
            </button>
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {trainers.map((coach) => (
            <div
              key={coach.id}
              className="group rounded-lg bg-[#171B16] border border-[#232A22] hover:border-[#C6FF3D]/40 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Coach Portrait */}
              <div className="sm:w-5/12 relative h-72 sm:h-auto overflow-hidden bg-[#111411]">
                <img
                  src={coach.imageUrl}
                  alt={`${coach.name} - ${coach.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#171B16] via-transparent to-transparent opacity-60" />
              </div>

              {/* Coach Info */}
              <div className="sm:w-7/12 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#C6FF3D] uppercase tracking-wider block mb-1">
                    {coach.title}
                  </span>
                  <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-[#F7F8F4] mb-2">
                    {coach.name}
                  </h3>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-[#C6FF3D]/90 mb-1">
                      Specialty: {coach.specialty}
                    </p>
                    <p className="text-xs text-[#A7ADA2] leading-relaxed">
                      {coach.bio}
                    </p>
                  </div>

                  {/* Certifications list */}
                  {coach.certifications && coach.certifications.length > 0 && (
                    <div className="space-y-1 mb-4">
                      {coach.certifications.map((cert) => (
                        <div key={cert} className="flex items-center gap-1.5 text-xs text-[#F7F8F4]">
                          <Award className="w-3.5 h-3.5 text-[#C6FF3D] shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Availability */}
                  {coach.schedule && (
                    <div className="flex items-center gap-1.5 text-xs text-[#A7ADA2] mb-4">
                      <Clock className="w-3.5 h-3.5 text-[#A7ADA2] shrink-0" />
                      <span>{coach.schedule}</span>
                    </div>
                  )}
                </div>

                {/* Inquiry Action */}
                <div className="pt-4 border-t border-[#232A22]">
                  <button
                    onClick={() => onTrainerInquiry(coach)}
                    className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-colors rounded text-center"
                  >
                    Inquire for Coaching
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
