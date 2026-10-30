import React, { useState } from 'react';
import { Program } from '../types/index.ts';
import { apiClient } from '../api/client.ts';
import {
  GraduationCap,
  Activity,
  Layers,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Lock,
  Info,
  Phone,
  Mail
} from 'lucide-react';

interface GetHelpPageProps {
  programs: Program[];
  initialCategory?: 'Education' | 'Healthcare' | 'Other Needs';
  onNavigate: (route: string) => void;
  onRefreshPrograms?: () => void;
}

export const GetHelpPage: React.FC<GetHelpPageProps> = ({
  programs,
  initialCategory = 'Education',
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Education' | 'Healthcare' | 'Other Needs'>(initialCategory);
  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');

  // Form State
  const [fullName, setFullName] = useState('');
  const [preferredContact, setPreferredContact] = useState<'phone' | 'whatsapp' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cityArea, setCityArea] = useState('');
  const [assistanceNeeded, setAssistanceNeeded] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Evidence File Upload State (Any form: image, PDF, docs)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceBase64, setEvidenceBase64] = useState<string>('');
  const [evidencePreview, setEvidencePreview] = useState<string>('');

  // Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceNumber: string;
    category: string;
    status: string;
    email: string;
    createdAt: string;
    instructions: string;
  } | null>(null);

  // Tracking State
  const [trackRef, setTrackRef] = useState('');
  const [trackPhone4, setTrackPhone4] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<any>(null);

  // Word counter helper
  const wordCount = assistanceNeeded.trim() ? assistanceNeeded.trim().split(/\s+/).filter(Boolean).length : 0;
  const isWordCountValid = wordCount >= 30 && wordCount <= 1000;

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('Evidence document must be under 15MB.');
      return;
    }

    setEvidenceFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setEvidenceBase64(res);
      if (file.type.startsWith('image/')) {
        setEvidencePreview(res);
      } else {
        setEvidencePreview('');
      }
    };
    reader.readAsDataURL(file);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Please provide a valid phone number for further verification and assistance.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please provide your valid email so our team can send you confirmation and approval updates.');
      return;
    }

    if (wordCount < 30) {
      setErrorMessage(`Description must be at least 30 words so our committee understands your situation (current: ${wordCount} words).`);
      return;
    }

    if (wordCount > 1000) {
      setErrorMessage(`Description cannot exceed 1000 words (current: ${wordCount} words).`);
      return;
    }

    if (!privacyConsent) {
      setErrorMessage('You must confirm consent to our confidential verification policy.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.submitApplication({
        category: selectedCategory,
        fullName: fullName.trim(),
        preferredContact,
        phone: phone.trim(),
        email: email.trim(),
        cityArea: cityArea.trim() || undefined,
        assistanceNeeded: assistanceNeeded.trim(),
        evidenceFileName: evidenceFile?.name,
        evidenceFileData: evidenceBase64 || undefined,
        evidenceFileType: evidenceFile?.type,
        privacyConsent
      });

      setSubmittedResult(res);
      // Reset form
      setFullName('');
      setPhone('');
      setEmail('');
      setCityArea('');
      setAssistanceNeeded('');
      setEvidenceFile(null);
      setEvidenceBase64('');
      setEvidencePreview('');
      setPrivacyConsent(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    setTrackResult(null);

    if (!trackRef.trim()) {
      setTrackError('Please enter your application reference number.');
      return;
    }

    try {
      setTrackingLoading(true);
      const res = await apiClient.trackApplication(trackRef.trim(), trackPhone4.trim() || undefined);
      setTrackResult(res);
    } catch (err: any) {
      setTrackError(err.message || 'Failed to locate reference records.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
          Confidential & Dignified Assistance
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#4A2C22] tracking-tight">
          I Need Help
        </h1>
        <p className="text-sm sm:text-base text-[#4A2C22]/85 max-w-2xl mx-auto leading-relaxed">
          Request support for Education, Healthcare, or Other Essential Needs. Every case is manually verified by authorized AWF staff, with decision notices sent directly to your email.
        </p>

        {/* Tab Switcher */}
        <div className="pt-4 flex items-center justify-center gap-2">
          <div className="p-1 bg-[#EBDCCD] rounded-lg inline-flex">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'apply'
                  ? 'bg-[#FAF5ED] text-[#4A2C22] shadow-xs'
                  : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
              }`}
            >
              Submit Help Request
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'track'
                  ? 'bg-[#FAF5ED] text-[#4A2C22] shadow-xs'
                  : 'text-[#4A2C22]/70 hover:text-[#4A2C22]'
              }`}
            >
              Check Existing Status
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'track' ? (
        /* Status Tracking Tool */
        <div className="max-w-xl mx-auto bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#9E4927]">
              <Search className="w-5 h-5" />
              <h2 className="text-xl font-serif font-bold text-[#4A2C22]">
                Track Your Application Status
              </h2>
            </div>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              Enter your tracking code (e.g., <code className="bg-[#EBDCCD] px-1 py-0.5 rounded text-[#4A2C22]">AWF-HELP-2026-XXXX</code>) and the last 4 digits of your phone number.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Reference Number *
              </label>
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value.toUpperCase())}
                placeholder="e.g. AWF-HELP-2026-A1B2"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Last 4 digits of contact phone (verification)
              </label>
              <input
                type="text"
                maxLength={4}
                value={trackPhone4}
                onChange={(e) => setTrackPhone4(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1234"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden font-mono"
              />
            </div>

            {trackError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{trackError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={trackingLoading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md transition-colors"
            >
              {trackingLoading ? 'Checking Records...' : 'Check Status'}
            </button>
          </form>

          {trackResult && (
            <div className="pt-4 border-t border-[#D8B99A]/50 space-y-4 animate-in fade-in">
              <div className="p-4 bg-[#F4EADB]/60 rounded-xl border border-[#D8B99A]/50 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#4A2C22]/70">Reference</span>
                  <span className="font-mono font-bold text-[#4A2C22]">{trackResult.referenceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A2C22]/70">Category</span>
                  <span className="font-semibold text-[#4A2C22]">{trackResult.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A2C22]/70">Review Status</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#FAF5ED] text-[#9E4927] border border-[#9E4927]/30">
                    {trackResult.status}
                  </span>
                </div>
                {trackResult.statusReason && (
                  <div className="pt-2 border-t border-[#D8B99A]/40 text-xs text-[#4A2C22]/85">
                    <span className="font-semibold block text-[#4A2C22]">Review Observation:</span>
                    <p className="mt-0.5 italic">{trackResult.statusReason}</p>
                  </div>
                )}
                <div className="text-[11px] text-[#4A2C22]/60 pt-1">
                  Submitted: {new Date(trackResult.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : submittedResult ? (
        /* Submission Confirmation */
        <div className="max-w-2xl mx-auto bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-8 space-y-6 text-center shadow-xs animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
              Assistance Application Received
            </h2>
            <p className="text-sm text-[#4A2C22]/85">
              Your request for <strong>{submittedResult.category}</strong> has been assigned to our review panel. A confirmation email has been logged to <strong>{submittedResult.email}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#F4EADB]/80 rounded-xl border border-[#D8B99A] max-w-md mx-auto text-left space-y-2">
            <div className="text-xs text-[#4A2C22]/70 uppercase font-semibold">
              Your Application Tracking Code
            </div>
            <div className="font-mono text-xl font-bold text-[#9E4927] select-all">
              {submittedResult.referenceNumber}
            </div>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed pt-1">
              Please save this tracking code. Our staff will manually review your uploaded evidence on the dashboard and reach out to you via your valid phone number and email.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedResult(null);
                setActiveTab('apply');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#4A2C22] border border-[#D8B99A] rounded-md hover:bg-[#F4EADB]"
            >
              Submit Another Request
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md shadow-xs"
            >
              Return to Foundation Home
            </button>
          </div>
        </div>
      ) : (
        /* APPLICATION FORM */
        <div className="space-y-8">
          {/* Category Selection (Education, Healthcare, Other Needs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Education' as const,
                label: 'Education',
                icon: GraduationCap,
                tagline: 'Tuition fees, academic books, matric / university support'
              },
              {
                id: 'Healthcare' as const,
                label: 'Healthcare',
                icon: Activity,
                tagline: 'Medical bills, life-saving medicines, urgent hospital treatments'
              },
              {
                id: 'Other Needs' as const,
                label: 'Other Needs',
                icon: Layers,
                tagline: 'Essential family sustenance, emergency rations, hardship relief'
              }
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#EBDCCD] border-[#9E4927] ring-1 ring-[#9E4927] shadow-xs'
                      : 'bg-[#FAF5ED] border-[#D8B99A] hover:bg-[#FAF5ED]/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#9E4927] text-[#FAF5ED]' : 'bg-[#F4EADB] text-[#4A2C22]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#4A2C22]">
                      {cat.label}
                    </h3>
                  </div>
                  <p className="text-xs text-[#4A2C22]/75 leading-relaxed">
                    {cat.tagline}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Form Container */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs">
            <div className="space-y-1 pb-4 border-b border-[#D8B99A]/50">
              <h2 className="text-2xl font-serif font-bold text-[#4A2C22]">
                Application Form — {selectedCategory} Assistance
              </h2>
              <p className="text-xs text-[#4A2C22]/80">
                Please provide accurate details, a sincere description of need (min 30 words), and upload any supporting evidence.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Applicant Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your legal or common name"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    placeholder="e.g. Gulshan-e-Iqbal, Karachi / Lahore"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Valid Phone Number & Email Address (MANDATORY) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                    Valid Phone Number * (For further assistance & verification)
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#4A2C22]/60" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[11px] text-[#4A2C22]/60 mt-1 block">
                    Our verification coordinator will contact this number directly.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                    Email Address * (For approval & confirmation notice)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#4A2C22]/60" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[11px] text-[#4A2C22]/60 mt-1 block">
                    Official confirmation & approval status will reach this email.
                  </span>
                </div>
              </div>

              {/* Description of Need with Min 30 Words & Max 1000 Words */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#4A2C22]">
                    Describe What You Need Help For * (Min 30 words, Max 1000 words)
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      wordCount < 30
                        ? 'text-amber-700 font-semibold'
                        : wordCount > 1000
                        ? 'text-red-700 font-bold'
                        : 'text-emerald-700 font-semibold'
                    }`}
                  >
                    {wordCount} / 1000 words {wordCount < 30 ? `(needs ${30 - wordCount} more)` : '✓'}
                  </span>
                </div>
                <textarea
                  rows={5}
                  required
                  value={assistanceNeeded}
                  onChange={(e) => setAssistanceNeeded(e.target.value)}
                  placeholder={
                    selectedCategory === 'Education'
                      ? 'Please describe your academic program, university or school name, current financial crisis, and exact tuition fee requirements...'
                      : selectedCategory === 'Healthcare'
                      ? 'Please describe the medical patient, diagnosed illness, required surgeries or medications, and hospital expense breakdown...'
                      : 'Please describe your family circumstances, breadwinner situation, urgent food or shelter crisis, and immediate required assistance...'
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden resize-y leading-relaxed"
                />
                <span className="text-[11px] text-[#4A2C22]/60 block">
                  A minimum of 30 words is required so our review committee can properly evaluate your request.
                </span>
              </div>

              {/* EVIDENCE UPLOAD BUTTON (Any Form: Bills, vouchers, prescriptions, reports) */}
              <div className="space-y-2 p-5 bg-white rounded-xl border border-[#D8B99A]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A2C22]">
                      Upload Supporting Evidence (Bills, Reports, Fee Vouchers, etc.)
                    </label>
                    <span className="text-[11px] text-[#4A2C22]/70">
                      Upload evidence in any form: Image (JPG, PNG), PDF, or scan (max 15MB).
                    </span>
                  </div>
                  <label className="px-3.5 py-2 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Evidence</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleEvidenceChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {evidenceFile && (
                  <div className="pt-3 border-t border-[#D8B99A]/40 flex items-center justify-between text-xs text-[#4A2C22]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#9E4927]" />
                      <span className="font-semibold">{evidenceFile.name}</span>
                      <span className="text-[11px] text-[#4A2C22]/60">
                        ({Math.round(evidenceFile.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEvidenceFile(null);
                        setEvidenceBase64('');
                        setEvidencePreview('');
                      }}
                      className="text-[11px] text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy & Truthfulness Declaration */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4A2C22]/85">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 rounded border-[#D8B99A] text-[#9E4927] focus:ring-[#9E4927]"
                  />
                  <span>
                    I confirm that the information provided is truthful, and I consent to Aban Welfare Foundation reviewing my details and contacting me via phone and email for manual verification.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || wordCount < 30 || wordCount > 1000}
                  className="w-full sm:w-auto px-8 py-3 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {submitting ? 'Submitting Application...' : 'Submit Application for Review'}
                  </span>
                </button>
                <p className="text-[11px] text-[#4A2C22]/60 mt-2">
                  Once submitted, your application reaches our admin dashboard for manual review, and approval updates will be delivered to your email.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
