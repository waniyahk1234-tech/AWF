import React from 'react';
import { Program } from '../types/index.ts';
import { Heart, HandHeart, GraduationCap, ArrowRight, ShieldCheck, Activity, Layers, Building } from 'lucide-react';

interface HomePageProps {
  programs: Program[];
  onNavigate: (route: string, extra?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ programs, onNavigate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:py-24 bg-gradient-to-b from-[#FAF5ED] via-[#F4EADB]/50 to-[#FAF5ED] border-b border-[#D8B99A]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs tracking-wider uppercase text-[#9E4927] font-medium border border-[#9E4927]/20 rounded-full bg-[#FAF5ED]">
            <span>In memory of Aban Khan</span>
            <span aria-hidden="true">&middot;</span>
            <span>NED University Graduate</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#4A2C22] tracking-tight leading-[1.15] text-balance">
            A cause for your akhirah.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#4A2C22]/85 leading-relaxed">
            Aban Welfare Foundation (AWF) carries forward the compassion and generosity of Aban Khan—supporting people in need through Healthcare, Education, and Essential Needs.
          </p>

          {/* DUAL PROMINENT ACTION CARDS (Equally prominent, easy to find, accessible) */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
            {/* Card 1: I want to donate */}
            <div
              onClick={() => onNavigate('donate')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('donate')}
              className="group p-6 sm:p-8 bg-[#FAF5ED] rounded-xl border border-[#D8B99A] hover:border-[#9E4927] shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927] group-hover:bg-[#9E4927] group-hover:text-[#FAF5ED] transition-colors">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
                  I want to donate
                </h2>
                <p className="text-sm text-[#4A2C22]/80 leading-relaxed">
                  Support Education, Healthcare, or Other Needs. Transfer via official SadaPay and upload your payment screenshot for verified confirmation.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-2 text-sm font-semibold text-[#9E4927] group-hover:translate-x-1 transition-transform">
                <span>Donate via SadaPay</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2: I want help */}
            <div
              onClick={() => onNavigate('get-help')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('get-help')}
              className="group p-6 sm:p-8 bg-[#FAF5ED] rounded-xl border border-[#D8B99A] hover:border-[#9E4927] shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-[#4A2C22]/10 flex items-center justify-center text-[#4A2C22] group-hover:bg-[#4A2C22] group-hover:text-[#FAF5ED] transition-colors">
                  <HandHeart className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
                  I need help
                </h2>
                <p className="text-sm text-[#4A2C22]/80 leading-relaxed">
                  Confidential, dignified assistance for Healthcare, Education, or Other Essential Needs. Upload your evidence and receive manual review updates by email.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-2 text-sm font-semibold text-[#4A2C22] group-hover:translate-x-1 transition-transform">
                <span>Submit Assistance Request</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction to AWF */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex justify-center">
            <div className="relative p-3 bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl shadow-sm max-w-xs w-full">
              <img
                src="/assets/aistudio/Aban_Welfare_Foundation_e2c55029.png"
                alt="Aban Welfare Foundation Logo and Tree Emblem"
                className="w-full h-auto rounded-xl object-contain"
              />
              <div className="text-center pt-3 pb-1">
                <p className="text-xs text-[#9E4927] font-medium tracking-wide">
                  Established in Karachi, Pakistan
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
              About the Foundation
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#4A2C22]">
              Compassion, Dignity, and Sustainable Uplift
            </h2>
            <p className="text-sm sm:text-base text-[#4A2C22]/85 leading-relaxed">
              Aban Welfare Foundation is an independent charitable initiative created in loving memory of <strong>Aban Khan</strong>, an Electrical Engineering graduate of NED University of Engineering and Technology. Aban was deeply cherished for his humility, warmth, and relentless dedication to quietly helping others.
            </p>
            <p className="text-sm text-[#4A2C22]/80 leading-relaxed">
              We concentrate our efforts across three essential areas: urgent Healthcare treatments, Educational scholarships and fee support, and Essential Needs for families facing acute distress.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="text-sm font-semibold text-[#9E4927] hover:underline flex items-center gap-1.5"
              >
                <span>Read Aban Khan's memorial tribute</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* THE THREE PROGRAM CATEGORIES: Healthcare, Education, Essential Needs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
            Our Three Pillars of Service
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A2C22]">
            Targeted Support Where Impact Matters Most
          </h2>
          <p className="text-sm text-[#4A2C22]/80">
            Every application is manually evaluated with strict confidentiality, and every donation is directed directly to verified beneficiaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Education */}
          <div className="bg-[#FAF5ED] rounded-xl border border-[#D8B99A]/80 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A2C22]">
                1. Educational Support
              </h3>
              <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
                In memory of Aban Khan's engineering journey at NED University, we fund school, college, and university tuition fees, examination dues, and academic materials for deserving students.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8B99A]/40 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate('get-help', { selectedCategory: 'Education' })}
                className="font-semibold text-[#9E4927] hover:underline"
              >
                Apply for Aid &rarr;
              </button>
              <button
                onClick={() => onNavigate('donate', { defaultCategory: 'Education' })}
                className="text-[#4A2C22]/70 hover:underline"
              >
                Donate
              </button>
            </div>
          </div>

          {/* Pillar 2: Healthcare */}
          <div className="bg-[#FAF5ED] rounded-xl border border-[#D8B99A]/80 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-[#4A2C22]/10 flex items-center justify-center text-[#4A2C22]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A2C22]">
                2. Healthcare
              </h3>
              <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
                Direct medical assistance covering emergency hospital treatments, surgeries, diagnostic testing, and critical chronic disease medicines for patients in acute financial distress.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8B99A]/40 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate('get-help', { selectedCategory: 'Healthcare' })}
                className="font-semibold text-[#4A2C22] hover:underline"
              >
                Apply for Aid &rarr;
              </button>
              <button
                onClick={() => onNavigate('donate', { defaultCategory: 'Healthcare' })}
                className="text-[#4A2C22]/70 hover:underline"
              >
                Donate
              </button>
            </div>
          </div>

          {/* Pillar 3: Essential Needs / Other Needs */}
          <div className="bg-[#FAF5ED] rounded-xl border border-[#D8B99A]/80 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#4A2C22]">
                3. Essential Needs (Other Needs)
              </h3>
              <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
                Emergency household survival, monthly nutritional rations for impoverished families, widow/orphan assistance, and urgent crisis relief in Karachi and regional areas.
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8B99A]/40 flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigate('get-help', { selectedCategory: 'Other Needs' })}
                className="font-semibold text-[#9E4927] hover:underline"
              >
                Apply for Aid &rarr;
              </button>
              <button
                onClick={() => onNavigate('donate', { defaultCategory: 'Other Needs' })}
                className="text-[#4A2C22]/70 hover:underline"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Respectful Tribute to Aban Khan */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl relative shadow-xs">
          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
              Memorial & Inspiration
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A2C22]">
              Continuing the Spirit of Aban Khan
            </h2>
            <div className="text-sm sm:text-base text-[#4A2C22]/85 leading-relaxed space-y-3">
              <p>
                Those who shared time with Aban Khan remember his modesty and gentle disposition. A talented Electrical Engineer from NED University, his true distinction was his eagerness to extend a helping hand without seeking recognition.
              </p>
              <p>
                AWF was founded to transform our remembrance into ongoing light (<em>Sadaqah Jariyah</em>). By ensuring that people suffering from illness receive care, promising students attain education, and distressed families find sustenance, Aban's legacy endures.
              </p>
            </div>
            <div className="pt-2 text-xs text-[#9E4927] font-medium italic">
              "A cause for your akhirah — may every life touched in his memory bring everlasting peace."
            </div>
          </div>
        </div>
      </section>

      {/* SadaPay Transfer Transparency Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 bg-[#F4EADB]/60 rounded-xl border border-[#D8B99A] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#9E4927]">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
                Manual Verification & Complete Accountability
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#4A2C22]/80 leading-relaxed">
              Donations are received via our official SadaPay receiving account and manually verified against transaction screenshots before approval. All applicant requests undergo thorough verification to ensure funds reach authentic cases.
            </p>
          </div>

          <button
            onClick={() => onNavigate('transparency')}
            className="px-4 py-2.5 text-xs font-semibold text-[#4A2C22] bg-[#FAF5ED] border border-[#D8B99A] hover:bg-[#EBDCCD] rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Review Governance & Disclosures
          </button>
        </div>
      </section>
    </div>
  );
};
