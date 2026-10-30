import React, { useState } from 'react';
import { apiClient } from '../api/client.ts';
import { MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.sendContactInquiry({
        category,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim()
      });
      setSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to transmit message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="text-xs font-semibold tracking-wider uppercase text-[#9E4927]">
          Connect with AWF
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A2C22] tracking-tight">
          Get in Touch
        </h1>
        <p className="text-sm sm:text-base text-[#4A2C22]/85 max-w-xl mx-auto leading-relaxed">
          Have a question or wish to correspond with Aban Welfare Foundation? Submit your message directly through this form.
        </p>
      </div>

      <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8B99A]/40 pb-4">
          <h2 className="text-xl font-serif font-bold text-[#4A2C22]">
            Send an Inquiry
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-[#4A2C22]/80">
            <MapPin className="w-3.5 h-3.5 text-[#9E4927]" />
            <span>Karachi, Sindh, Pakistan</span>
          </div>
        </div>

        {success ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-emerald-900">
              Message Transmitted
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
              Thank you for contacting Aban Welfare Foundation. Your inquiry has been routed to our staff coordinator.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 text-xs font-semibold text-[#9E4927] hover:underline"
            >
              Send another message &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Inquiry Topic *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              >
                <option value="general">General Foundation Inquiry</option>
                <option value="donation">Donation Question</option>
                <option value="healthcare">Healthcare Inquiry</option>
                <option value="education">Educational Support Inquiry</option>
                <option value="essential_needs">Essential Needs Inquiry</option>
                <option value="volunteering">Volunteering & Community Service</option>
                <option value="partnership">Institutional Partnership</option>
                <option value="other">Other Foundation Matters</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Phone / WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you?"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
