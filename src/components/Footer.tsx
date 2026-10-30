import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { ShieldCheck, HeartHandshake, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (route: string) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#4A2C22] text-[#FAF5ED] pt-16 pb-12 border-t border-[#351F18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Foundation Profile & Memory */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-[#FAF5ED] p-2.5 rounded-lg inline-block">
              <BrandLogo size="sm" showText={false} />
            </div>
            <h3 className="text-lg font-serif font-semibold text-[#FAF5ED]">
              Aban Welfare Foundation
            </h3>
            <p className="text-xs text-[#D8B99A] italic">
              "A cause for your akhirah."
            </p>
            <p className="text-xs leading-relaxed text-[#FAF5ED]/80">
              Established in loving memory of Aban Khan, a NED University Electrical Engineering graduate remembered for his compassion, kindness, and quiet service to humanity.
            </p>
          </div>

          {/* Focus Areas (Three Pillars: Healthcare, Education, Essential Needs) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8B99A]">
              Three Pillars of Service
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF5ED]/80">
              <li>
                <button
                  onClick={() => handleNav('get-help')}
                  className="hover:text-[#D8B99A] text-left transition-colors flex items-center gap-1.5"
                >
                  <span>Healthcare Assistance</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('get-help')}
                  className="hover:text-[#D8B99A] text-left transition-colors flex items-center gap-1.5"
                >
                  <span>Educational Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('get-help')}
                  className="hover:text-[#D8B99A] text-left transition-colors flex items-center gap-1.5"
                >
                  <span>Essential Needs (Other Needs)</span>
                </button>
              </li>
              <li className="pt-1 text-[11px] text-[#D8B99A]/70 leading-normal">
                Direct manual verification and SadaPay receipt reconciliation.
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8B99A]">
              Public Pathways
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF5ED]/80">
              <li>
                <button onClick={() => handleNav('donate')} className="hover:text-[#D8B99A] transition-colors">
                  I Want to Donate (PKR)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('get-help')} className="hover:text-[#D8B99A] transition-colors">
                  I Want Help (Confidential)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-[#D8B99A] transition-colors">
                  About Aban Khan & Foundation Story
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('transparency')} className="hover:text-[#D8B99A] transition-colors">
                  Transparency & Legal Status
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#D8B99A] transition-colors">
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy Statement */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#D8B99A]">
              Ethics & Trust
            </h4>
            <p className="text-xs text-[#FAF5ED]/80 leading-relaxed">
              We uphold the dignity of every applicant with strict confidentiality. Applications and donor records are securely managed server-side without public disclosure.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs">
              <button
                onClick={() => handleNav('policies')}
                className="text-left text-[#D8B99A] hover:underline"
              >
                Privacy Notice & Confidentiality Charter
              </button>
              <button
                onClick={() => handleNav('policies')}
                className="text-left text-[#D8B99A] hover:underline"
              >
                Donation Terms & Refund Policy
              </button>
            </div>
          </div>
        </div>

        {/* Hairline Divider & Bottom Bar */}
        <div className="pt-8 border-t border-[#FAF5ED]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF5ED]/60">
          <div>
            &copy; {new Date().getFullYear()} Aban Welfare Foundation (AWF). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Karachi, Pakistan</span>
            <span aria-hidden="true">&middot;</span>
            <button
              onClick={() => handleNav('admin')}
              className="hover:text-[#FAF5ED] transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[#D8B99A]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
