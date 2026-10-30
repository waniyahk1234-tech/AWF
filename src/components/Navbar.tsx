import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Menu, X, Heart, Shield } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isAdminLoggedIn = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Donate', route: 'donate' },
    { label: 'Get Help', route: 'get-help' },
    { label: 'About AWF', route: 'about' },
    { label: 'Transparency', route: 'transparency' },
    { label: 'Contact', route: 'contact' }
  ];

  const handleNavClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5ED]/95 backdrop-blur-md border-b border-[#D8B99A]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark & Emblem */}
          <div className="shrink-0">
            <BrandLogo size="md" onClick={() => handleNavClick('home')} />
          </div>

          {/* Zone 2: Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A2C22]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`relative py-1 whitespace-nowrap transition-colors hover:text-[#9E4927] ${
                    isActive ? 'text-[#9E4927] font-semibold' : 'text-[#4A2C22]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9E4927] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Desktop) + Admin Indicator */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="px-3.5 py-2 text-xs font-medium text-[#4A2C22] bg-[#EBDCCD] hover:bg-[#D8B99A] rounded-md transition-colors flex items-center gap-1.5"
                title="Go to Admin Management"
              >
                <Shield className="w-3.5 h-3.5 text-[#9E4927]" />
                <span>Admin Portal</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('donate')}
              className="px-5 py-2.5 text-sm font-medium text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] active:bg-[#702F15] rounded-md shadow-xs transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current text-[#FAF5ED]" />
              <span>Donate Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('donate')}
              className="px-3.5 py-1.5 text-xs font-medium text-[#FAF5ED] bg-[#9E4927] rounded-md shadow-xs"
            >
              Donate
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A2C22] hover:text-[#9E4927] focus:outline-hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF5ED] border-b border-[#D8B99A]/50 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors min-h-[44px] flex items-center justify-between ${
                    isActive
                      ? 'bg-[#EBDCCD] text-[#9E4927] font-semibold'
                      : 'text-[#4A2C22] hover:bg-[#F4EADB]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#9E4927]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#D8B99A]/40 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('get-help')}
              className="w-full py-3 px-4 text-center font-medium text-sm text-[#4A2C22] bg-[#FAF5ED] border border-[#D8B99A] rounded-md hover:bg-[#F4EADB]"
            >
              I Want Help (Welfare & Education)
            </button>
            <button
              onClick={() => handleNavClick('donate')}
              className="w-full py-3 px-4 text-center font-medium text-sm text-[#FAF5ED] bg-[#9E4927] rounded-md shadow-xs hover:bg-[#82381B]"
            >
              I Want to Donate
            </button>
            {isAdminLoggedIn && (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 px-4 text-center text-xs font-medium text-[#4A2C22] bg-[#EBDCCD] rounded-md hover:bg-[#D8B99A] flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#9E4927]" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
