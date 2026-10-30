import React, { useState, useEffect } from 'react';
import { DonationRecord, DonationCategory, SadaPaySettings } from '../types/index.ts';
import { apiClient } from '../api/client.ts';
import {
  Heart,
  Copy,
  Check,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  Building,
  GraduationCap,
  Activity,
  Layers
} from 'lucide-react';

interface DonatePageProps {
  defaultCategory?: DonationCategory;
  onNavigate: (route: string) => void;
}

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000, 50000];

export const DonatePage: React.FC<DonatePageProps> = ({
  defaultCategory = 'Education',
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory>(defaultCategory);
  const [amountType, setAmountType] = useState<'preset' | 'custom'>('preset');
  const [presetAmount, setPresetAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Donor fields
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // SadaPay Info & Copy state
  const [sadaPayInfo, setSadaPayInfo] = useState<SadaPaySettings | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Screenshot Upload State (Mandatory)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');

  // Flow State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<DonationRecord | null>(null);

  useEffect(() => {
    apiClient
      .getSadaPayInfo()
      .then((data) => setSadaPayInfo(data))
      .catch((err) => console.error('Failed to load SadaPay info:', err));
  }, []);

  const getEffectiveAmount = (): number => {
    if (amountType === 'preset') return presetAmount;
    const parsed = parseInt(customAmount, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size must be under 15MB.');
      return;
    }

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setScreenshotBase64(result);
      if (file.type.startsWith('image/')) {
        setScreenshotPreview(result);
      } else {
        setScreenshotPreview('');
      }
    };
    reader.readAsDataURL(file);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const effAmount = getEffectiveAmount();
    if (effAmount < 100) {
      setErrorMessage('Please specify a donation amount of at least PKR 100.');
      return;
    }

    if (!donorEmail.trim()) {
      setErrorMessage('Please provide your email address so we can send you your official confirmation email.');
      return;
    }

    if (!isAnonymous && !donorName.trim()) {
      setErrorMessage('Please enter your name or select the anonymous donation option.');
      return;
    }

    if (!screenshotBase64 || !screenshotFile) {
      setErrorMessage('Uploading your transfer screenshot is mandatory before pressing Submit.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiClient.submitDonationProof({
        amount: effAmount,
        category: selectedCategory,
        donorName: isAnonymous ? 'Anonymous Donor' : donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim() || undefined,
        isAnonymous,
        screenshotFileName: screenshotFile.name,
        screenshotFileData: screenshotBase64,
        screenshotFileType: screenshotFile.type
      });
      setSubmittedRecord(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit donation proof.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedRecord(null);
    setScreenshotFile(null);
    setScreenshotBase64('');
    setScreenshotPreview('');
    setCustomAmount('');
    setErrorMessage(null);
  };

  const hasConfiguredAccount = Boolean(sadaPayInfo?.iban && sadaPayInfo.iban.trim());

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#4A2C22] tracking-tight">
          Donate to AWF
        </h1>
        <p className="text-xs sm:text-sm text-[#4A2C22]/80 leading-relaxed max-w-md mx-auto">
          Choose a category, transfer to SadaPay, and upload your payment screenshot. We will manually verify your transfer and send a confirmation to your email.
        </p>
      </div>

      {submittedRecord ? (
        /* Confirmation Screen */
        <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-xs animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#4A2C22]">
              Transfer Proof Submitted
            </h2>
            <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
              JazakAllah Khair. Your payment screenshot has reached our admin dashboard. A confirmation receipt has been dispatched to <strong>{submittedRecord.donorEmail}</strong>.
            </p>
          </div>

          <div className="p-4 bg-[#F4EADB]/80 rounded-xl border border-[#D8B99A] text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-[#D8B99A]/40 pb-1.5">
              <span className="text-[#4A2C22]/70">Reference Code</span>
              <span className="font-mono font-bold text-[#4A2C22]">{submittedRecord.referenceNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#D8B99A]/40 pb-1.5">
              <span className="text-[#4A2C22]/70">Amount</span>
              <span className="font-bold text-[#9E4927]">
                PKR {submittedRecord.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8B99A]/40 pb-1.5">
              <span className="text-[#4A2C22]/70">Category</span>
              <span className="font-semibold text-[#4A2C22]">{submittedRecord.category}</span>
            </div>
            <div className="flex justify-between border-b border-[#D8B99A]/40 pb-1.5">
              <span className="text-[#4A2C22]/70">Status</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-[11px]">
                Pending Manual Verification
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#4A2C22] border border-[#D8B99A] rounded-md hover:bg-[#F4EADB]"
            >
              Submit Another Donation
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md shadow-xs"
            >
              Return Home
            </button>
          </div>
        </div>
      ) : (
        /* DONATION SUBMISSION FORM - Mobile First */
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Category Selection */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E4927]">
              1. Select Category *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'Education' as DonationCategory, label: 'Education', icon: GraduationCap },
                { id: 'Healthcare' as DonationCategory, label: 'Healthcare', icon: Activity },
                { id: 'Other Needs' as DonationCategory, label: 'Other Needs', icon: Layers }
              ].map((c) => {
                const isSelected = selectedCategory === c.id;
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all min-h-[48px] flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#EBDCCD] border-[#9E4927] ring-1 ring-[#9E4927]'
                        : 'bg-white border-[#D8B99A]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#9E4927] shrink-0" />
                    <span className="text-sm font-semibold text-[#4A2C22]">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Amount (PKR) */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E4927]">
              2. Donation Amount (PKR) *
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = amountType === 'preset' && presetAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmountType('preset');
                      setPresetAmount(amt);
                    }}
                    className={`py-2.5 px-2 rounded-lg border text-center transition-all min-h-[44px] ${
                      isSelected
                        ? 'bg-[#9E4927] border-[#9E4927] text-[#FAF5ED] font-bold shadow-xs'
                        : 'bg-white border-[#D8B99A] text-[#4A2C22] font-medium'
                    }`}
                  >
                    <span className="text-[10px] block" style={{ color: isSelected ? '#FAF5ED' : '#9E4927' }}>
                      PKR
                    </span>
                    <span className="text-xs sm:text-sm font-semibold">{amt.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1">
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#9E4927]">
                  PKR
                </span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  placeholder="Or enter custom amount (min PKR 100)"
                  value={amountType === 'custom' ? customAmount : ''}
                  onChange={(e) => {
                    setAmountType('custom');
                    setCustomAmount(e.target.value);
                  }}
                  className={`w-full pl-14 pr-4 py-2.5 text-xs bg-white border rounded-md focus:outline-hidden min-h-[44px] ${
                    amountType === 'custom' ? 'border-[#9E4927] ring-1 ring-[#9E4927]' : 'border-[#D8B99A]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* STEP 3: SADAPAY RECEIVING ACCOUNT DETAILS (NO FAKE DATA) */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#9E4927]">
              <Building className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-serif font-bold text-[#4A2C22]">
                3. SadaPay Account for Donations
              </h3>
            </div>

            {hasConfiguredAccount ? (
              <div className="space-y-3 text-xs">
                {sadaPayInfo?.accountTitle && (
                  <div className="p-3 bg-white rounded-xl border border-[#D8B99A] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#4A2C22]/60 uppercase block">Account Title</span>
                      <span className="font-bold text-[#4A2C22] text-sm">{sadaPayInfo.accountTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(sadaPayInfo.accountTitle, 'title')}
                      className="p-2 text-[#9E4927] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Copy Account Title"
                    >
                      {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {sadaPayInfo?.iban && (
                  <div className="p-3 bg-white rounded-xl border border-[#D8B99A] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#4A2C22]/60 uppercase block">SadaPay IBAN</span>
                      <span className="font-mono font-bold text-[#4A2C22] text-xs sm:text-sm break-all">
                        {sadaPayInfo.iban}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(sadaPayInfo.iban, 'iban')}
                      className="px-3 py-1.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] rounded flex items-center gap-1 shrink-0 ml-2 min-h-[40px]"
                    >
                      {copiedField === 'iban' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {sadaPayInfo?.accountNumber && (
                  <div className="p-3 bg-white rounded-xl border border-[#D8B99A] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#4A2C22]/60 uppercase block">Account Number</span>
                      <span className="font-mono font-bold text-[#4A2C22] text-sm">{sadaPayInfo.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(sadaPayInfo.accountNumber, 'acc')}
                      className="p-2 text-[#9E4927] min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Copy Number"
                    >
                      {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-white border border-[#D8B99A] rounded-xl text-xs text-[#4A2C22] space-y-1">
                <span className="font-bold block text-sm">Receiving Account: SadaPay</span>
                <p className="text-[#4A2C22]/80 leading-relaxed text-[11px]">
                  Please transfer your donation to the official Aban Welfare Foundation SadaPay account. (If you need the direct IBAN details, please reach out via the Contact page or ask the administration).
                </p>
              </div>
            )}
          </div>

          {/* STEP 4: Donor Details (Email mandatory for confirmation) */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E4927]">
              4. Donor Details
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#4A2C22] min-h-[36px]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[#D8B99A] text-[#9E4927] focus:ring-[#9E4927] w-4 h-4"
                />
                <span className="font-semibold">Donate anonymously</span>
              </label>

              {!isAnonymous && (
                <div>
                  <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required={!isAnonymous}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden min-h-[44px]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                  Your Email Address * (For Confirmation)
                </label>
                <input
                  type="email"
                  required
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* STEP 5: MANDATORY SCREENSHOT UPLOAD */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9E4927]">
              5. Upload Transfer Screenshot * (Mandatory)
            </label>
            <p className="text-[11px] text-[#4A2C22]/70">
              Upload the screenshot of your completed SadaPay transfer receipt before pressing Submit.
            </p>

            <div className="border-2 border-dashed border-[#D8B99A] rounded-xl p-4 sm:p-6 text-center bg-white space-y-3">
              {screenshotPreview ? (
                <div className="space-y-3">
                  <div className="max-w-[200px] mx-auto max-h-48 overflow-hidden rounded-lg border border-[#D8B99A]">
                    <img
                      src={screenshotPreview}
                      alt="Transfer Screenshot"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="text-xs text-[#4A2C22]">
                    <span className="font-semibold block truncate">{screenshotFile?.name}</span>
                  </div>
                  <label className="inline-block px-3 py-2 text-xs font-semibold text-[#9E4927] bg-[#EBDCCD] rounded cursor-pointer min-h-[40px]">
                    <span>Change Screenshot</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : screenshotFile ? (
                <div className="space-y-2">
                  <FileText className="w-8 h-8 text-[#9E4927] mx-auto" />
                  <span className="text-xs font-semibold block">{screenshotFile.name}</span>
                  <label className="inline-block px-3 py-2 text-xs font-semibold text-[#9E4927] bg-[#EBDCCD] rounded cursor-pointer min-h-[40px]">
                    <span>Change File</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <Upload className="w-8 h-8 text-[#9E4927] mx-auto" />
                  <p className="text-xs font-semibold text-[#4A2C22]">
                    Attach Payment Screenshot
                  </p>
                  <label className="inline-block px-4 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md cursor-pointer transition-colors shadow-xs min-h-[44px]">
                    <span>Select Screenshot</span>
                    <input
                      type="file"
                      required
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 text-sm font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 min-h-[48px]"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>
                {submitting
                  ? 'Submitting Proof...'
                  : `Submit Donation Proof (PKR ${getEffectiveAmount().toLocaleString()})`}
              </span>
            </button>
            <p className="text-[11px] text-[#4A2C22]/60 mt-2">
              Our team manually verifies every transfer on the admin dashboard.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
