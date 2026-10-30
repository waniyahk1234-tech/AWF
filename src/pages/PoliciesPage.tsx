import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
          Legal & Ethical Framework
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#4A2C22] tracking-tight">
          Foundation Policies & Charters
        </h1>
        <p className="text-sm sm:text-base text-[#4A2C22]/85 max-w-2xl mx-auto leading-relaxed">
          Transparent guidelines protecting both generous donors and dignified beneficiaries of Aban Welfare Foundation.
        </p>
      </div>

      {/* Section 1: Privacy Notice & Confidentiality Charter */}
      <section className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#D8B99A]/50 pb-4">
          <div className="w-10 h-10 rounded-lg bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A2C22]">
              1. Privacy Notice & Beneficiary Confidentiality Charter
            </h2>
            <span className="text-xs text-[#9E4927] font-medium">Effective October 2026</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#4A2C22]/85 space-y-4 leading-relaxed">
          <p>
            Aban Welfare Foundation considers privacy an inviolable ethical duty. When an individual in distress reaches out for Welfare Assistance or Educational Support, their personal story is held in complete, sacred confidence.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            A. Data Collection Minimization
          </h3>
          <p>
            We collect only the minimal information required to determine need and deliver assistance: name, preferred contact method, contact number/email, location, and a sincere description of need. We do not ask for unnecessary government biometric details or sensitive bank information in initial intake forms.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            B. Prohibition of Exploitative Media
          </h3>
          <p>
            AWF strictly prohibits photographing beneficiaries receiving food packages, emergency rations, or fee vouchers for marketing purposes. No recipient will ever be pressured into video testimonials or public displays of hardship.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            C. Server-Side Data Protection
          </h3>
          <p>
            All submitted applications are stored in encrypted, access-controlled backend databases. They are never exposed to search engines, public directories, client bundles, or third-party tracking services. Access is restricted exclusively to authorized AWF reviewers with verifiable administrative credentials.
          </p>
        </div>
      </section>

      {/* Section 2: Donation Terms & Refund Policy */}
      <section className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#D8B99A]/50 pb-4">
          <div className="w-10 h-10 rounded-lg bg-[#4A2C22]/10 flex items-center justify-center text-[#4A2C22]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A2C22]">
              2. Donation Terms, Restrictions & Refund Policy
            </h2>
            <span className="text-xs text-[#9E4927] font-medium">Effective October 2026</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-[#4A2C22]/85 space-y-4 leading-relaxed">
          <p>
            Donations made to Aban Welfare Foundation represent voluntary, irrevocable contributions (<em>Sadaqah</em>) dedicated to humanitarian relief and educational empowerment.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            A. Unrestricted vs. Restricted Program Contributions
          </h3>
          <p>
            Donors may designate gifts to the General Fund (unrestricted), the Welfare Assistance Fund, or the Educational Support Fund. Designated funds are ring-fenced and disbursed exclusively in accordance with the specified program charter.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            B. Verification & Official Receipts
          </h3>
          <p>
            Transactions are only considered successful and recorded in our verified financial ledger once confirmed through official payment provider webhooks or authorized bank statement reconciliation. An electronic transaction reference is generated upon verified completion.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            C. Refund & Error Correction Policy
          </h3>
          <p>
            Because funds are promptly allocated to critical student tuition vouchers, medical assistance, and emergency relief, donations are generally non-refundable once disbursed. In the event of an accidental duplicate transfer or payment error, donors should reach out through the official Contact page within 7 business days with their transaction reference number for administrative review.
          </p>

          <h3 className="font-serif font-bold text-base text-[#4A2C22] pt-2">
            D. Processing Fees
          </h3>
          <p>
            Standard payment provider interchange fees (typically 1.5% - 2.5% depending on debit/credit card or bank transfer channel) may be deducted by the acquiring financial institution. AWF does not assess any internal processing surcharge.
          </p>
        </div>
      </section>
    </div>
  );
};
