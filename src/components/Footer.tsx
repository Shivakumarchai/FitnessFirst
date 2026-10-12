import React from 'react';
import { MapPin, Phone, Mail, Navigation, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLookup }) => {
  return (
    <footer className="bg-[#080A08] border-t border-[#232A22] text-[#A7ADA2] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <span className="font-athletic text-2xl font-extrabold tracking-wider text-[#F7F8F4] uppercase block">
              FITNESS<span className="text-[#C6FF3D]">FIRST</span> GYM
            </span>
            <p className="text-xs leading-relaxed text-[#A7ADA2]">
              A sanctuary for disciplined athletic training, raw strength, and progressive personal transformation in Mayadevi, Rupandehi, Nepal.
            </p>
            <p className="text-xs font-semibold text-[#F7F8F4]">
              Train with purpose. Push your limits.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F8F4]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-[#C6FF3D] transition-colors">
                  About the Facility
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-[#C6FF3D] transition-colors">
                  Fitness Programs
                </a>
              </li>
              <li>
                <a href="#trainers" className="hover:text-[#C6FF3D] transition-colors">
                  Certified Trainers
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-[#C6FF3D] transition-colors">
                  Membership Plans
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#C6FF3D] transition-colors">
                  Facility Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C6FF3D] transition-colors">
                  Location & Hours
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F8F4]">
              Official Location
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C6FF3D] shrink-0 mt-0.5" />
                <span>Mayadevi Rural Municipality–06, Rupandehi, Amuwa Road, Nepal</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C6FF3D] shrink-0" />
                <a href="tel:+9779807404088" className="hover:text-[#C6FF3D]">
                  +977-9807404088
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C6FF3D] shrink-0" />
                <a href="mailto:shivarajachai@gmail.com" className="hover:text-[#C6FF3D]">
                  shivarajachai@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Member Services & Staff Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F8F4]">
              Member Services
            </h4>
            <p className="text-xs">
              Look up an existing pass or verify your eSewa or Khalti payment status.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenLookup}
                className="w-full text-left py-2 px-3 text-xs font-semibold text-[#F7F8F4] bg-[#111411] hover:bg-[#171B16] border border-[#232A22] rounded transition-colors"
              >
                Lookup Digital Member Pass →
              </button>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 py-1.5 text-[11px] text-[#A7ADA2] hover:text-[#C6FF3D] transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Management Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#232A22] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} FitnessFirst GYM. All rights reserved. Mayadevi, Rupandehi, Nepal.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://www.google.com/maps?q=27.5190771,83.3925082"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C6FF3D] transition-colors inline-flex items-center gap-1"
            >
              <Navigation className="w-3 h-3 text-[#C6FF3D]" />
              <span>Google Maps (27.5190771, 83.3925082)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
