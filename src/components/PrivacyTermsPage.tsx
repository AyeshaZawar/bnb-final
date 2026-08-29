import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface PrivacyTermsPageProps {
  title: string;
}

export function PrivacyTermsPage({ title }: PrivacyTermsPageProps) {
  return (
    <div className="min-h-screen bg-[#fcfbfa] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 shadow-xs">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#011c30] tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-slate-500 font-sans text-sm sm:text-base">
            Bucks n Bricks Talent Management Solutions
          </p>
        </div>

        {/* Card Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10 space-y-6 text-slate-700 font-sans leading-relaxed text-sm sm:text-base">
          <p>
            We value your privacy and are committed to protecting the personal information you share with us. Any information submitted through our website or job application forms will be used solely for legitimate recruitment, hiring, and related business purposes, including evaluating applications, communicating with candidates, and considering profiles for current or future employment opportunities where appropriate. We implement reasonable administrative and technical safeguards to protect your information and do not sell your personal data to third parties. By submitting an application, you confirm that the information provided is accurate and acknowledge that submission does not guarantee an interview or employment.
          </p>
          <p>
            Our website may use cookies and similar technologies to enhance user experience, improve website performance, maintain security, and analyze website traffic. These cookies help us provide a more efficient and reliable recruitment experience. By continuing to use our website, you consent to the use of cookies in accordance with this policy. You may manage or disable cookies through your browser settings; however, doing so may affect certain features and functionality of the website. We may update this Privacy & Cookie Policy from time to time, and continued use of our website constitutes acceptance of any revised terms.
          </p>
        </div>
      </div>
    </div>
  );
}
