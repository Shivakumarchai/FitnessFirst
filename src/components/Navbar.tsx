import React, { useState, useEffect } from 'react';
import { Menu, X, Ticket } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onLookupClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onLookupClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Membership', href: '#membership' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080A08]/90 backdrop-blur-md border-b border-[#232A22] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="flex items-center gap-2 group whitespace-nowrap shrink-0 text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C6FF3D]"
          >
            <span className="font-athletic text-2xl sm:text-3xl font-extrabold tracking-wider text-[#F7F8F4] uppercase">
              FITNESS<span className="text-[#C6FF3D] group-hover:text-white transition-colors">FIRST</span>
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#C6FF3D] text-[#080A08] uppercase tracking-widest hidden sm:inline-block">
              GYM
            </span>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#A7ADA2]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative py-1 hover:text-[#C6FF3D] transition-colors whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6FF3D]"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C6FF3D] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Member Pass Lookup */}
            <button
              onClick={onLookupClick}
              title="Lookup active membership pass"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#A7ADA2] hover:text-[#F7F8F4] bg-[#171B16] hover:bg-[#232A22] border border-[#232A22] rounded transition-colors whitespace-nowrap"
            >
              <Ticket className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>My Pass</span>
            </button>

            {/* Primary Action: JOIN NOW */}
            <button
              onClick={onJoinClick}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] transition-all duration-150 rounded shadow-[0_0_15px_-3px_rgba(198,255,61,0.3)] hover:shadow-[0_0_22px_0px_rgba(198,255,61,0.5)] active:scale-95 whitespace-nowrap"
            >
              JOIN NOW
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#F7F8F4] hover:text-[#C6FF3D] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080A08]/98 border-b border-[#232A22] px-6 pt-4 pb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-lg font-medium text-[#F7F8F4] hover:text-[#C6FF3D] py-1 border-b border-[#171B16] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLookupClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#F7F8F4] bg-[#171B16] border border-[#232A22] rounded"
            >
              <Ticket className="w-4 h-4 text-[#C6FF3D]" />
              <span>Lookup Membership Pass</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinClick();
              }}
              className="w-full py-3 text-sm font-bold uppercase tracking-wider text-[#080A08] bg-[#C6FF3D] hover:bg-[#d4ff66] rounded shadow-[0_0_15px_-3px_rgba(198,255,61,0.4)]"
            >
              JOIN NOW
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
