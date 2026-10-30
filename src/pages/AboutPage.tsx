import React from 'react';
import { Heart, GraduationCap, HandHeart, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Title & Introduction */}
      <div className="text-center space-y-4">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
          About Aban Welfare Foundation
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#4A2C22] tracking-tight">
          In Loving Memory of Aban Khan
        </h1>
        <p className="text-base sm:text-lg text-[#4A2C22]/85 max-w-2xl mx-auto italic font-serif">
          "A cause for your akhirah."
        </p>
      </div>

      {/* Tribute Card */}
      <div className="bg-[#FAF5ED] rounded-2xl border border-[#D8B99A] p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#4A2C22] pb-2 border-b border-[#D8B99A]/40">
            A Legacy of Quiet Generosity
          </h2>
          <div className="text-sm sm:text-base text-[#4A2C22]/85 leading-relaxed space-y-4">
            <p>
              Aban Welfare Foundation (AWF) was conceived and founded by family members, mentors, and close friends to preserve and honor the living memory of <strong>Aban Khan</strong>.
            </p>
            <p>
              Aban was an alumnus of the prestigious <strong>NED University of Engineering and Technology</strong> in Karachi, where he earned his degree in <strong>Electrical Engineering</strong>. Throughout his academic years and early professional life, he distinguished himself not merely through his intellect, but through his immense empathy, humility, and willingness to assist anyone facing hardship.
            </p>
            <p>
              He possessed that rare, noble quality of giving without expecting recognition, extending help quietly so that the recipient never felt diminished or obligated. Following his passing, those whose lives he touched resolved that his spirit of altruism must continue through an enduring, accountable charitable vehicle.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F4EADB]/60 border border-[#D8B99A]/40 space-y-1">
            <h4 className="text-sm font-serif font-bold text-[#4A2C22]">
              Sadaqah Jariyah
            </h4>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Every initiative launched by AWF serves as perpetual charity in Aban's name, dedicated to serving Allah's creation and bringing ongoing blessings to his soul.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F4EADB]/60 border border-[#D8B99A]/40 space-y-1">
            <h4 className="text-sm font-serif font-bold text-[#4A2C22]">
              Preserving Dignity
            </h4>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              We reject exploitative imagery or guilt-based appeals. Asking for assistance is an honorable human reality that we treat with absolute confidentiality.
            </p>
          </div>
        </div>
      </div>

      {/* Focus Areas (Three Pillars) */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
            Our Three Focus Pillars
          </h2>
          <p className="text-sm text-[#4A2C22]/80">
            To ensure direct accountability and maximum impact, AWF concentrates its resources across three vital pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A2C22]/10 flex items-center justify-center text-[#4A2C22]">
              <HandHeart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
              1. Healthcare
            </h3>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Medical assistance for patients needing urgent diagnostic tests, life-saving medicines, hospital surgeries, and specialized chronic care treatments.
            </p>
          </div>

          <div className="p-6 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
              2. Education
            </h3>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Reflecting Aban's educational journey at NED University, this program sponsors promising students through school, college, and engineering degree tuition support.
            </p>
          </div>

          <div className="p-6 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
              3. Essential Needs
            </h3>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Crucial relief for basic family sustenance, food rations, and urgent crises for impoverished households, widows, and orphans.
            </p>
          </div>
        </div>
      </div>

      {/* Foundation Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
          Our Operating Standards
        </h2>

        <div className="space-y-4">
          <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A]/50 rounded-xl space-y-1">
            <h4 className="text-sm font-semibold text-[#4A2C22]">
              1. Direct Institution & Vendor Disbursements
            </h4>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Where feasible, educational fees are paid directly to verified academic institutions, and emergency welfare supplies are procured directly, preventing loss and ensuring funds reach their intended destination.
            </p>
          </div>

          <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A]/50 rounded-xl space-y-1">
            <h4 className="text-sm font-semibold text-[#4A2C22]">
              2. Zero Fabricated Claims
            </h4>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              We do not invent statistics, inflated beneficiary counts, or unverified regulatory claims. What we report on our website and dashboards reflects verified records.
            </p>
          </div>

          <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A]/50 rounded-xl space-y-1">
            <h4 className="text-sm font-semibold text-[#4A2C22]">
              3. Complete Applicant Privacy
            </h4>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Applicant names, addresses, and hardships are never published or displayed as marketing material. Every application is encrypted and restricted to authorized review staff.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 border-t border-[#D8B99A]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('transparency')}
          className="text-xs font-semibold text-[#9E4927] hover:underline flex items-center gap-1.5"
        >
          <span>View Transparency & Legal Status</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('get-help')}
            className="px-4 py-2 text-xs font-medium text-[#4A2C22] border border-[#D8B99A] rounded-md hover:bg-[#F4EADB]"
          >
            I Want Help
          </button>
          <button
            onClick={() => onNavigate('donate')}
            className="px-4 py-2 text-xs font-medium text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md shadow-xs"
          >
            I Want to Donate
          </button>
        </div>
      </div>
    </div>
  );
};
