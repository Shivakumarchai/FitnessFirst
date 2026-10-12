import React, { useState } from 'react';
import { ChevronRight, Dumbbell, Flame, HeartPulse, Activity, Zap, UserCheck, X } from 'lucide-react';

interface ProgramsProps {
  onSelectProgramToJoin: (programName: string) => void;
}

interface ProgramDetail {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  fullOverview: string;
  focus: string[];
  image: string;
}

export const Programs: React.FC<ProgramsProps> = ({ onSelectProgramToJoin }) => {
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramDetail | null>(null);

  const programsList: ProgramDetail[] = [
    {
      id: 'strength',
      name: 'Strength Training',
      icon: Dumbbell,
      description: 'Progressive barbell, dumbbell, and compound lifting designed to maximize physical force, tendon density, and raw power.',
      fullOverview: 'Focus on multi-joint barbell movements including the squat, bench press, deadlift, and overhead press. Emphasizes structured progressive overload, lifting safety, and technical mastery.',
      focus: ['Compound Lifts', 'Barbell Mechanics', 'Progressive Overload', 'Structural Density'],
      image: '/src/assets/images/program_strength_power_1791773998468.jpg'
    },
    {
      id: 'hypertrophy',
      name: 'Muscle Building',
      icon: Flame,
      description: 'Volume-targeted resistance routines, hypertrophy splits, and focused isolation training for balanced muscle growth.',
      fullOverview: 'Combines mechanical tension with metabolic stress across science-backed muscle splits (push/pull/legs or upper/lower). Emphasizes full range of motion and time-under-tension.',
      focus: ['Hypertrophy Splits', 'Mind-Muscle Connection', 'Time Under Tension', 'Recovery Management'],
      image: '/src/assets/images/gym_hero_cinematic_1791773981321.jpg'
    },
    {
      id: 'functional',
      name: 'Functional Training',
      icon: Zap,
      description: 'Dynamic athletic movement, kettlebell drills, core stability, and agility work that enhances real-world physical performance.',
      fullOverview: 'Develop three-dimensional athletic mobility, rotational power, and reactive strength utilizing kettlebells, battle ropes, pull-up rigs, and bodyweight conditioning.',
      focus: ['Kettlebell Complexes', 'Rotational Power', 'Agility & Coordination', 'Core Stability'],
      image: '/src/assets/images/program_functional_athletic_1791774010834.jpg'
    },
    {
      id: 'weight-management',
      name: 'Weight Management',
      icon: Activity,
      description: 'High-efficiency metabolic conditioning combined with lean mass preservation to safely support sustainable body composition goals.',
      fullOverview: 'Combines high-intensity interval conditioning with resistance training to elevate caloric expenditure while preserving active muscle tissue.',
      focus: ['Metabolic Conditioning', 'Caloric Burn', 'Lean Muscle Retention', 'Endurance Pacing'],
      image: '/src/assets/images/gym_facility_equipment_1791774039394.jpg'
    },
    {
      id: 'general-fitness',
      name: 'General Fitness',
      icon: HeartPulse,
      description: 'Comprehensive physical conditioning to improve heart health, daily stamina, joint mobility, and overall vitality.',
      fullOverview: 'Ideal for those seeking sustainable health, increased day-to-day energy, stress relief, and functional joint mobility without extreme specialization.',
      focus: ['Cardiovascular Health', 'Full-Body Stamina', 'Joint Mobility', 'Longevity'],
      image: '/src/assets/images/trainer_lead_coach_1791774026774.jpg'
    },
    {
      id: 'personal-training',
      name: 'Personal Training',
      icon: UserCheck,
      description: 'One-on-one coaching with form correction, tailored session planning, accountability, and individualized programming.',
      fullOverview: 'Direct 1-on-1 coaching with customized biomechanical assessment, goal-specific microcycles, technique correction, and continuous feedback.',
      focus: ['Custom Programming', 'Direct Form Correction', 'Accountability', 'Measurable Benchmarks'],
      image: '/src/assets/images/gym_hero_cinematic_1791773981321.jpg'
    }
  ];

  return (
    <section id="programs" className="py-24 sm:py-32 bg-[#111411] border-t border-[#232A22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[2px] w-5 bg-[#C6FF3D]" />
              <span className="text-xs font-bold tracking-widest text-[#C6FF3D] uppercase">
                TRAINING PILLARS
              </span>
            </div>
            <h2 className="font-athletic text-4xl sm:text-5xl font-black uppercase text-[#F7F8F4] tracking-tight leading-none">
              FITNESS PROGRAMS
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#A7ADA2] max-w-md">
            Built on proven exercise science, structured discipline, and progressive physical adaptation for all fitness levels.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programsList.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className="group rounded-lg bg-[#171B16] border border-[#232A22] hover:border-[#C6FF3D]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Program Card Visual */}
                <div className="relative h-48 overflow-hidden bg-[#080A08]">
                  <img
                    src={prog.image}
                    alt={`${prog.name} at FitnessFirst GYM`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171B16] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2 rounded bg-[#080A08]/85 border border-[#232A22] text-[#C6FF3D]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-athletic text-2xl font-bold uppercase text-[#F7F8F4] group-hover:text-[#C6FF3D] transition-colors mb-3">
                      {prog.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A7ADA2] leading-relaxed mb-6">
                      {prog.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#232A22] flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveModalProgram(prog)}
                      className="text-xs font-semibold text-[#A7ADA2] hover:text-[#F7F8F4] transition-colors focus:outline-none"
                    >
                      Learn More
                    </button>
                    <button
                      onClick={() => onSelectProgramToJoin(prog.name)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-colors rounded"
                    >
                      <span>Join Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program Detail Modal */}
      {activeModalProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-lg bg-[#171B16] border border-[#232A22] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProgram(null)}
              className="absolute top-5 right-5 p-1.5 text-[#A7ADA2] hover:text-[#F7F8F4] rounded-full bg-[#111411]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded bg-[#080A08] border border-[#232A22] text-[#C6FF3D]">
                <activeModalProgram.icon className="w-6 h-6" />
              </div>
              <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-[#F7F8F4]">
                {activeModalProgram.name}
              </h3>
            </div>

            <p className="text-sm text-[#A7ADA2] leading-relaxed mb-6">
              {activeModalProgram.fullOverview}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-[#C6FF3D] tracking-wider mb-3">
                Core Program Focus
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalProgram.focus.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium px-2.5 py-1 rounded bg-[#111411] border border-[#232A22] text-[#F7F8F4]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#232A22] flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalProgram(null)}
                className="px-4 py-2 text-xs font-medium text-[#A7ADA2] hover:text-[#F7F8F4]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const pName = activeModalProgram.name;
                  setActiveModalProgram(null);
                  onSelectProgramToJoin(pName);
                }}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded"
              >
                Start Training
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
