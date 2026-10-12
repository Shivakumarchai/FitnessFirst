import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Programs } from './components/Programs';
import { Trainers } from './components/Trainers';
import { Pricing } from './components/Pricing';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationModal';
import { MemberLookupModal } from './components/MemberLookupModal';
import { AdminModal } from './components/AdminModal';
import { Plan, Trainer, Membership } from './types';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const INITIAL_PLANS: Record<string, Plan> = {
  starter: {
    id: 'starter',
    name: 'STARTER',
    price: 1200,
    durationText: 'month',
    description: 'Suitable for members beginning their fitness journey.',
    features: [
      'Full Gym Floor & Free Weights Access',
      'Locker Room & Shower Amenities',
      'Equipment Orientation & Form Guidance',
      'Access During Standard Gym Hours (6 AM – 9 PM)',
    ],
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    price: 2000,
    durationText: 'month',
    description: 'For members looking for a more structured training experience.',
    isFeatured: true,
    features: [
      'All Starter Plan Benefits',
      'Personal Baseline Assessment & Progress Tracking',
      'Customized 4-Week Strength Routine',
      'Access to Functional Rig & Cardio Arena',
      '1 Complimentary Guest Pass Every Month',
    ],
  },
  elite: {
    id: 'elite',
    name: 'ELITE',
    price: 3000,
    durationText: 'month',
    description: 'For members who want the premium membership option.',
    features: [
      'All Pro Plan Benefits',
      'Dedicated Locker Storage Reservation',
      'Monthly 1-on-1 Certified Coach Check-in',
      'Personalized Nutrition & Protein Guidance',
      'Priority Equipment Reservation & Off-peak Access',
      'Unlimited Weekend Guest Passes',
    ],
  },
};

const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'coach-1',
    name: 'Shivaraj Achai',
    title: 'Head Strength & Conditioning Coach',
    specialty: 'Powerlifting, Functional Hypertrophy & Olympic Lifting',
    bio: 'Dedicated to building sustainable athletic strength and disciplined form. Believes proper biomechanics and progressive overload are the cornerstones of lasting physical change.',
    certifications: ['CSCS Certified Strength Specialist', 'CPR & First Aid Certified'],
    imageUrl: '/src/assets/images/trainer_lead_coach_1791774026774.jpg',
    schedule: 'Mon - Sat: 6:00 AM - 1:00 PM',
  },
  {
    id: 'coach-2',
    name: 'Performance Specialist',
    title: 'Functional Conditioning & Mobility Coach',
    specialty: 'Metabolic Conditioning, Core Stability & Injury Prevention',
    bio: 'Focuses on dynamic functional movement patterns, cardiovascular endurance, and athletic longevity for everyday lifters and competitive athletes.',
    certifications: ['Functional Movement Specialist', 'Sports Nutrition Certified'],
    imageUrl: '/src/assets/images/program_functional_athletic_1791774010834.jpg',
    schedule: 'Mon - Sat: 2:00 PM - 9:00 PM',
  },
];

export default function App() {
  const [plans, setPlans] = useState<Record<string, Plan>>(INITIAL_PLANS);
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);

  // Modals
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedPlanForRegistration, setSelectedPlanForRegistration] = useState<string>('pro');
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Banner for eSewa callback notifications
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'success' | 'failed' | 'pending';
    message: string;
    id?: string;
  } | null>(null);

  useEffect(() => {
    // Fetch live plans from server
    fetch('/api/plans')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setPlans(data);
        }
      })
      .catch((err) => console.log('Using default plans', err));

    // Fetch live trainers from server
    fetch('/api/trainers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setTrainers(data);
        }
      })
      .catch((err) => console.log('Using default trainers', err));

    // Check URL parameters for payment redirects (from eSewa callback)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('paymentStatus');
    const memberId = urlParams.get('id');
    const ref = urlParams.get('ref');

    if (paymentStatus === 'success') {
      setPaymentNotice({
        type: 'success',
        message: `eSewa payment verified successfully! Your Member ID is ${memberId || ''}. Reference: ${ref || ''}`,
        id: memberId || undefined,
      });
      // Clean query params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failed') {
      setPaymentNotice({
        type: 'failed',
        message: 'eSewa payment was not completed or failed. Please try again or select cash at front desk.',
        id: memberId || undefined,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStartMembership = () => {
    setSelectedPlanForRegistration('pro');
    setIsRegistrationOpen(true);
  };

  const handleExplorePrograms = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanForRegistration(planId);
    setIsRegistrationOpen(true);
  };

  const handleSelectProgramToJoin = (programName: string) => {
    setSelectedPlanForRegistration('pro');
    setIsRegistrationOpen(true);
  };

  const handleTrainerInquiry = (coach: Trainer) => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      // prefill program or scroll
    }
  };

  return (
    <div className="min-h-screen bg-[#080A08] text-[#F7F8F4] selection:bg-[#C6FF3D] selection:text-[#080A08]">
      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Payment Callback Notification Banner */}
      {paymentNotice && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[92%] p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            paymentNotice.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {paymentNotice.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-semibold">{paymentNotice.message}</p>
              {paymentNotice.id && (
                <button
                  onClick={() => setIsLookupOpen(true)}
                  className="mt-2 text-xs font-bold underline hover:text-white"
                >
                  View Digital Pass Now →
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setPaymentNotice(null)}
            className="p-1 rounded hover:bg-black/20"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3-Zone Sticky Navigation */}
      <Navbar
        onJoinClick={handleStartMembership}
        onLookupClick={() => setIsLookupOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* Cinematic Hero */}
        <Hero
          onStartMembership={handleStartMembership}
          onExplorePrograms={handleExplorePrograms}
        />

        {/* About Section */}
        <About />

        {/* Fitness Programs */}
        <Programs onSelectProgramToJoin={handleSelectProgramToJoin} />

        {/* Trainers Section */}
        <Trainers
          trainers={trainers}
          onTrainerInquiry={handleTrainerInquiry}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Membership Plans with Server-Side Validated Pricing */}
        <Pricing
          plans={plans}
          onSelectPlan={handleSelectPlan}
        />

        {/* Facility Gallery */}
        <Gallery />

        {/* Contact & Map */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Real Membership Registration & Payment Modal */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        plans={plans}
        initialPlanId={selectedPlanForRegistration}
      />

      {/* Member Pass Lookup Modal */}
      <MemberLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      {/* Management & Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        plans={plans}
        onPlansUpdated={(newPlans) => setPlans(newPlans)}
        trainers={trainers}
        onTrainersUpdated={(newTrainers) => setTrainers(newTrainers)}
      />
    </div>
  );
}
