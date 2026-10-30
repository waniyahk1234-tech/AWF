import React from 'react';
import { Home, HandHeart, Heart, Info, MessageSquare } from 'lucide-react';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate
}) => {
  const handleNav = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5ED]/95 backdrop-blur-md border-t border-[#D8B99A]/50 px-2 py-1.5 shadow-[0_-4px_12px_rgba(74,44,34,0.06)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.375rem)' }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center">
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-lg transition-colors ${
            currentRoute === 'home'
              ? 'text-[#9E4927] font-semibold'
              : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Get Help */}
        <button
          onClick={() => handleNav('get-help')}
          className={`flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-lg transition-colors ${
            currentRoute === 'get-help'
              ? 'text-[#9E4927] font-semibold'
              : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
          }`}
        >
          <HandHeart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Get Help</span>
        </button>

        {/* 3. Donate (Center Prominent Action) */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => handleNav('donate')}
            className={`-mt-4 w-12 h-12 rounded-full bg-[#9E4927] hover:bg-[#82381B] active:bg-[#702F15] text-[#FAF5ED] flex items-center justify-center shadow-md ring-4 ring-[#FAF5ED] transition-transform active:scale-95 ${
              currentRoute === 'donate' ? 'ring-[#D8B99A]' : ''
            }`}
            aria-label="Donate via SadaPay"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
          <span className={`text-[10px] tracking-tight mt-0.5 font-medium ${
            currentRoute === 'donate' ? 'text-[#9E4927] font-semibold' : 'text-[#4A2C22]/80'
          }`}>
            Donate
          </span>
        </div>

        {/* 4. About */}
        <button
          onClick={() => handleNav('about')}
          className={`flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-lg transition-colors ${
            currentRoute === 'about'
              ? 'text-[#9E4927] font-semibold'
              : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
          }`}
        >
          <Info className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">About</span>
        </button>

        {/* 5. Contact */}
        <button
          onClick={() => handleNav('contact')}
          className={`flex flex-col items-center justify-center py-1 px-1 min-h-[48px] rounded-lg transition-colors ${
            currentRoute === 'contact'
              ? 'text-[#9E4927] font-semibold'
              : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Contact</span>
        </button>
      </div>
    </nav>
  );
};
