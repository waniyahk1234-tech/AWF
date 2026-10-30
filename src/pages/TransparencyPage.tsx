import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client.ts';
import { Building, FileCheck } from 'lucide-react';

interface TransparencyPageProps {
  onNavigate: (route: string) => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient
      .getTransparency()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load transparency disclosures:', err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
          Ethical Disclosures
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A2C22] tracking-tight">
          Transparency & Disclosures
        </h1>
        <p className="text-sm sm:text-base text-[#4A2C22]/85 max-w-xl mx-auto leading-relaxed">
          Honoring Aban Khan requires total honesty. We provide factual disclosures regarding our early-stage registration and legal status.
        </p>
      </div>

      {/* Disclosures Grid */}
      <div className="space-y-6">
        {/* Registration & Legal Status */}
        <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#D8B99A]/40 pb-3">
            <div className="w-10 h-10 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#4A2C22]">
                Legal Entity & Registration Status
              </h2>
              <span className="text-[11px] text-[#9E4927] font-medium">Founding Trust Phase</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4A2C22]/85 leading-relaxed">
            {data?.registrationNote ||
              'Aban Welfare Foundation is an independent charitable trust established in Karachi, Pakistan in memory of Aban Khan. Legal trust registration filings are currently in progress with relevant regulatory bodies.'}
          </p>
          <div className="p-3.5 bg-[#F4EADB]/80 rounded-xl text-xs text-[#4A2C22]/80 border border-[#D8B99A]/40">
            <strong>Disclosure:</strong> AWF does not fabricate registration license numbers or unverified certifications. Official registration details will be published once issued by regulatory authorities.
          </div>
        </div>

        {/* Tax Deductibility & Zakat Status */}
        <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#D8B99A]/40 pb-3">
            <div className="w-10 h-10 rounded-lg bg-[#4A2C22]/10 flex items-center justify-center text-[#4A2C22]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#4A2C22]">
                Tax Exemption & Status
              </h2>
              <span className="text-[11px] text-[#4A2C22]/70 font-medium">Regulatory Compliance</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#4A2C22]/85 leading-relaxed">
            {data?.taxDeductibilityDisclosure ||
              'Tax deductibility and formal 2(36) tax exemption status are pending formal regulatory approval. AWF does not represent donations as tax-exempt until authorized certificates are issued.'}
          </p>
          <div className="p-3.5 bg-[#F4EADB]/80 rounded-xl text-xs text-[#4A2C22]/80 border border-[#D8B99A]/40">
            <strong>Disclosure:</strong> Contributions are accepted as voluntary charitable donations (<em>Sadaqah</em>). We do not claim tax exemptions that have not been legally finalized.
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#4A2C22] hover:bg-[#351F18] rounded-md transition-colors shadow-xs"
        >
          Send an Inquiry &rarr;
        </button>
      </div>
    </div>
  );
};
