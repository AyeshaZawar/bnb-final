
import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Phone, Mail, MapPin, ArrowUp, ChevronRight } from 'lucide-react';

const logoImg = '/assets/logo-main.png';

interface FooterProps {
  onPageChange?: (page: string) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const quickLinksCol1 = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'Our Story', href: '#ceo' },
    { label: 'Our Services', href: '#home' },
    { label: 'Executive Search', href: '#executive-search' },
    { label: 'Recruitment Solutions', href: '#recruitment-solution' },
  ];

  const quickLinksCol2 = [
    { label: 'HR Consulting', href: '#hr-consulting' },
    { label: 'Learning & Development', href: '#learning-development' },
    { label: 'Blog / Insights', href: '#blog' },
    { label: 'Careers', href: '#career' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Privacy Policy', href: '#privacy-policy' },
    { label: 'Terms', href: '#terms' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const standalonePages = [
      'career',
      'about',
      'executive-search',
      'recruitment-solution',
      'hr-consulting',
      'learning-development',
      'blog',
      'ceo',
      'impact',
      'privacy-policy',
      'terms'
    ];
    const pageName = href.replace('#', '');

    if (standalonePages.includes(pageName) && onPageChange) {
      onPageChange(pageName);
      window.scrollTo(0, 0);
    } else if (href === '#contact' && onPageChange) {
      onPageChange('home');
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else if (onPageChange) {
      onPageChange('home');
      if (href === '#home') {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <footer className="bg-[#02182b] text-white border-t border-slate-800/80 pt-14 pb-8 overflow-hidden text-left relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Logo & Company Paragraph */}
          <div className="lg:col-span-3 flex flex-col items-start pr-0 lg:pr-6 lg:border-r lg:border-slate-800/60">
            <div className="mb-5 flex items-center">
              <img
                src={logoImg}
                alt="Bucks n Bricks Logo"
                className="h-12 w-auto object-contain cursor-pointer brightness-110"
                onClick={() => {
                  onPageChange?.('home');
                  window.scrollTo(0, 0);
                }}
                onError={(e) => {
                  // Fallback logo if path differs
                  (e.target as HTMLImageElement).src = '/logo_main.png';
                }}
              />
            </div>
            <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed max-w-xs">
              Building high-performance teams for Pakistan's leading organizations and businesses worldwide.
            </p>
          </div>

          {/* Column 2: Quick Links (2-subcolumn list with '>' arrows) */}
          <div className="lg:col-span-4 flex flex-col items-start px-0 lg:px-6 lg:border-r lg:border-slate-800/60">
            <h4 className="font-bold font-display text-sm tracking-wide mb-5" style={{ color: '#89C7F5' }}>
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full">
              {/* Left List */}
              <ul className="flex flex-col gap-2.5">
                {quickLinksCol1.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-slate-300 hover:text-blue-400 font-sans text-xs sm:text-sm flex items-center gap-1.5 transition-colors group"
                    >
                      <ChevronRight size={13} className="text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Right List */}
              <ul className="flex flex-col gap-2.5">
                {quickLinksCol2.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-slate-300 hover:text-blue-400 font-sans text-xs sm:text-sm flex items-center gap-1.5 transition-colors group"
                    >
                      <ChevronRight size={13} className="text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Connect With Us */}
          <div className="lg:col-span-2.5 lg:col-span-3 flex flex-col items-start px-0 lg:px-6 lg:border-r lg:border-slate-800/60">
            <h4 className="font-bold font-display text-sm tracking-wide mb-5" style={{ color: '#89C7F5' }}>
              Connect With Us
            </h4>
            
            {/* LinkedIn Card Link */}
            <a
              href="https://www.linkedin.com/company/bucks-bricks/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mb-4 group"
            >
              <div className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Linkedin size={18} />
              </div>
              <span className="text-white hover:text-blue-300 font-sans text-sm font-semibold transition-colors">
                LinkedIn
              </span>
            </a>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Follow us for recruitment insights, industry updates, and career opportunities.
            </p>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="lg:col-span-2.5 lg:col-span-2 flex flex-col items-start pl-0 lg:pl-6">
            <h4 className="font-bold font-display text-sm tracking-wide mb-5" style={{ color: '#89C7F5' }}>
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400 flex-shrink-0" />
                <a href="tel:+923002167796" className="hover:text-blue-300 transition-colors">
                  +92 300 2167796
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <a href="mailto:arbab.wasi@bucksnbricks.com" className="hover:text-blue-300 transition-colors break-all">
                  arbab.wasi@bucksnbricks.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-400 flex-shrink-0" />
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 font-sans text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} Bucks n Bricks Talent Management Solutions. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-sans">
            <a
              href="#privacy-policy"
              onClick={(e) => handleLinkClick(e, '#privacy-policy')}
              className="hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="#terms"
              onClick={(e) => handleLinkClick(e, '#terms')}
              className="hover:text-blue-300 transition-colors"
            >
              Terms
            </a>
          </div>

          <motion.button
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScrollToTop}
            className="p-2.5 bg-slate-800/80 hover:bg-blue-600 border border-slate-700 text-slate-300 hover:text-white rounded-full shadow-sm cursor-pointer transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}

