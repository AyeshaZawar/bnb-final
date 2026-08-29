
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatedButton } from './animations';
const logoImg = '/assets/logo-main.png';

interface NavbarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export function Navbar({ currentPage = 'home', onPageChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopNavItems = [
    { label: 'Home', href: '#home', page: 'home', sectionId: 'home' },
    { label: 'About Us', href: '#about', page: 'about', sectionId: 'about' },
    { label: 'Our Service', href: '#services', page: 'services', sectionId: 'services' },
    { label: 'Founder', href: '#ceo', page: 'ceo', sectionId: 'ceo' },
   
    { label: 'Careers', href: '#career', page: 'career', sectionId: 'career' },
    { label: 'Blog', href: '#blog', page: 'blog', sectionId: 'blog' },
  ];

  const serviceSubItems = [
    { label: 'Executive Search', href: '#executive-search', page: 'executive-search', sectionId: 'executive-search' },
    { label: 'Recruitment Solutions', href: '#recruitment-solution', page: 'recruitment-solution', sectionId: 'recruitment-solution' },
    { label: 'HR Consulting', href: '#hr-consulting', page: 'hr-consulting', sectionId: 'hr-consulting' },
    { label: 'Learning & Development', href: '#learning-development', page: 'learning-development', sectionId: 'learning-development' },
  ];

  const isActive = (itemPage: string) => {
    if (currentPage === itemPage) return true;
    if (itemPage === 'ceo' && (currentPage === 'founder' || currentPage === 'ceo')) return true;
    if (itemPage === 'services' && ['executive-search', 'recruitment-solution', 'hr-consulting', 'learning-development'].includes(currentPage)) {
      return true;
    }
    return false;
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { label: string; href: string; page: string; sectionId: string }
  ) => {
    e.preventDefault();
    if (!onPageChange) return;

    const standalonePages = [
      'about',
      'ceo',
      'impact',
      'blog',
      'career',
      'executive-search',
      'recruitment-solution',
      'hr-consulting',
      'learning-development',
    ];

    if (standalonePages.includes(item.page)) {
      onPageChange(item.page);
      window.scrollTo(0, 0);
    } else if (item.page === 'home') {
      onPageChange('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.page === 'services') {
      if (currentPage === 'home') {
        const element = document.getElementById('services');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        onPageChange('home');
        setTimeout(() => {
          const element = document.getElementById('services');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } else if (item.page === 'contact') {
      if (currentPage === 'home') {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        onPageChange('home');
        setTimeout(() => {
          const element = document.getElementById('contact');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 0.8,
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (onPageChange) {
                onPageChange('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center group"
          >
            <img
              src={logoImg}
              alt="BucksnBricks Logo"
              className="h-11 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {desktopNavItems.map((item) => {
              if (item.page === 'services') {
                return (
                  <div
                    key={item.label}
                    className="relative flex items-center"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setServicesDropdownOpen(!servicesDropdownOpen);
                      }}
                      className={`font-sans text-xs xl:text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap flex items-center gap-1 cursor-pointer py-2 ${
                        isActive(item.page) ? 'text-blue-500' : 'text-slate-600 hover:text-blue-500'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-blue-500' : 'text-slate-400 group-hover:text-blue-500'
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                          isActive(item.page) ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </button>

                    {/* Services Dropdown */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                        >
                          <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Our Services</span>
                            <a
                              href="#services"
                              onClick={(e) => {
                                e.preventDefault();
                                setServicesDropdownOpen(false);
                                handleLinkClick(e, item);
                              }}
                              className="text-[11px] font-semibold text-blue-600 hover:underline"
                            >
                              Overview
                            </a>
                          </div>
                          {serviceSubItems.map((subItem) => (
                            <a
                              key={subItem.page}
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault();
                                setServicesDropdownOpen(false);
                                if (onPageChange) {
                                  onPageChange(subItem.page);
                                  window.scrollTo(0, 0);
                                }
                              }}
                              className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all mx-1.5 ${
                                currentPage === subItem.page
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                              }`}
                            >
                              <span>{subItem.label}</span>
                              <ChevronRight size={13} className="text-slate-400" />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item)}
                  className={`font-sans text-xs xl:text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap ${
                    isActive(item.page) ? 'text-blue-500' : 'text-slate-600 hover:text-blue-500'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-[-4px] left-0 h-0.5 bg-blue-500 transition-all duration-300 ${
                      isActive(item.page) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <AnimatedButton
              onClick={() => {
                if (currentPage === 'home') {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                } else if (onPageChange) {
                  onPageChange('home');
                  setTimeout(() => {
                    const element = document.getElementById('contact');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }
              }}
              className="bg-[#052842] hover:bg-white hover:text-[#052842] border border-[#052842] text-white font-sans text-xs xl:text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer shadow-sm"
            >
              Contact Us
            </AnimatedButton>
          </div>

          {/* Mobile Hamburguer Icon */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-800 hover:text-blue-500 p-1.5 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Sliding Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />

            {/* Sidebar drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl p-6 flex flex-col lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                {/* Logo inside sidebar */}
                <div className="flex items-center">
                  <img
                    src={logoImg}
                    alt="BucksnBricks Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 focus:outline-none transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links inside sidebar */}
              <div className="flex flex-col gap-2 my-2 overflow-y-auto">
                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#home"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Home', href: '#home', page: 'home', sectionId: 'home' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('home') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Home
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#about"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'About Us', href: '#about', page: 'about', sectionId: 'about' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('about') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  About Us
                </motion.a>

                {/* Our Service Accordion */}
                <div className="flex flex-col border-b border-slate-50 py-1">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex items-center justify-between w-full font-sans text-sm font-semibold py-1.5 text-slate-700 hover:text-blue-500 transition-colors"
                  >
                    <span className={isActive('services') ? 'text-blue-500' : ''}>Our Service</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col pl-3 gap-1 overflow-hidden my-1 border-l-2 border-blue-100"
                      >
                        {serviceSubItems.map((subItem) => (
                          <a
                            key={subItem.page}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              setIsOpen(false);
                              if (onPageChange) {
                                onPageChange(subItem.page);
                                window.scrollTo(0, 0);
                              }
                            }}
                            className={`text-xs font-medium py-1.5 px-2.5 rounded-md transition-colors ${
                              currentPage === subItem.page
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-slate-600 hover:text-blue-500'
                            }`}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#impact"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Our Impact', href: '#impact', page: 'impact', sectionId: 'impact' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('impact') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Our Impact
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#blog"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Blog', href: '#blog', page: 'blog', sectionId: 'blog' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('blog') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Blog
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#ceo"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Founder', href: '#ceo', page: 'ceo', sectionId: 'ceo' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('ceo') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Founder
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#career"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Careers', href: '#career', page: 'career', sectionId: 'career' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('career') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Careers
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  href="#contact"
                  onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, { label: 'Contact Us', href: '#contact', page: 'contact', sectionId: 'contact' });
                  }}
                  className={`font-sans text-sm font-semibold py-1.5 border-b border-slate-50 transition-colors ${
                    isActive('contact') ? 'text-blue-500' : 'text-slate-700 hover:text-blue-500'
                  }`}
                >
                  Contact Us
                </motion.a>
              </div>

              {/* CTA inside sidebar */}
              <div className="mt-auto pt-4 shrink-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatedButton
                    onClick={() => {
                      setIsOpen(false);
                      if (currentPage === 'home') {
                        const element = document.getElementById('contact');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      } else if (onPageChange) {
                        onPageChange('home');
                        setTimeout(() => {
                          const element = document.getElementById('contact');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }
                    }}
                    delay={0.2}
                    className="w-full bg-[#052842] hover:bg-white hover:text-[#052842] border border-[#052842] text-white font-sans text-sm font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer"
                  >
                    <span>Contact Us</span>
                    <ArrowRight size={18} />
                  </AnimatedButton>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

