import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function ConsentPopup() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      return !localStorage.getItem('privacy_consent_accepted');
    } catch {
      return true;
    }
  });
  const [isUnderstood, setIsUnderstood] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (isUnderstood) {
      try {
        localStorage.setItem('privacy_consent_accepted', 'true');
      } catch (err) {
        console.error('Failed to save consent preference:', err);
      }
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white text-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 p-6 sm:p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#011c30]">
            Privacy & Terms Consent
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans max-h-60 overflow-y-auto pr-2 border-y border-slate-100 py-3">
          <p>
            We value your privacy and are committed to protecting the personal information you share with us. Any information submitted through our website or job application forms will be used solely for legitimate recruitment, hiring, and related business purposes, including evaluating applications, communicating with candidates, and considering profiles for current or future employment opportunities where appropriate. We implement reasonable administrative and technical safeguards to protect your information and do not sell your personal data to third parties. By submitting an application, you confirm that the information provided is accurate and acknowledge that submission does not guarantee an interview or employment.
          </p>
          <p>
            Our website may use cookies and similar technologies to enhance user experience, improve website performance, maintain security, and analyze website traffic. These cookies help us provide a more efficient and reliable recruitment experience. By continuing to use our website, you consent to the use of cookies in accordance with this policy. You may manage or disable cookies through your browser settings; however, doing so may affect certain features and functionality of the website. We may update this Privacy & Cookie Policy from time to time, and continued use of our website constitutes acceptance of any revised terms.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              id="consent-understand"
              checked={isUnderstood}
              onChange={(e) => setIsUnderstood(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
              I Understand
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!isUnderstood}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
              isUnderstood
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
