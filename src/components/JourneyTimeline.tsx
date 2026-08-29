import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const logoImg = '/assets/logo-main.png';
const journeyImg = '/assets/journey.jpeg'; 

interface YearDetail {
  year: string;
  text: string;
}

interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  yearDetails: YearDetail[];
}

export function JourneyTimeline() {
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);

  const milestones: TimelineMilestone[] = [
    {
      id: '1',
      year: '2009',
      title: 'Foundations & Early Milestones',
      yearDetails: [
        {
          year: '2009',
          text: 'Our journey started with just two clients, laying the foundation through successful recruitment partnerships built on trust, quality, and long-term relationships rather than one-time placements.',
        },
        {
          year: '2011',
          text: 'Bucks n Bricks was formally established as a Talent Management Solutions firm, transforming early success into a structured business focused on helping organizations attract, hire, and retain exceptional talent.',
        },
        {
          year: '2012',
          text: 'We achieved a significant milestone by successfully placing two General Managers and one Director-level executive within the FMCG and Manufacturing sectors, strengthening our reputation in executive hiring.',
        },
      ],
    },
    {
      id: '2',
      year: '2015',
      title: 'Expansion & Regional Reach',
      yearDetails: [
        {
          year: '2015',
          text: 'Our client portfolio expanded to 8–10 active organizations, reflecting the confidence businesses placed in our consultative approach and our ability to identify high-impact talent.',
        },
        {
          year: '2018',
          text: 'Our recruitment capabilities extended across multiple sectors, including Information Technology, Automotive, Pharmaceuticals, Textiles, FMCG, and Manufacturing, allowing us to deliver specialized talent solutions across diverse industries.',
        },
        {
          year: '2021',
          text: 'We celebrated our first international placement, marking an important milestone in our journey toward becoming a globally connected talent partner.',
        },
        {
          year: '2023',
          text: 'Our presence expanded into the Kingdom of Saudi Arabia and the United Arab Emirates, including Dubai, enabling us to connect organizations with exceptional professionals across regional markets.',
        },
      ],
    },
    {
      id: '3',
      year: '2026',
      title: 'Global Growth & Strategic Impact',
      yearDetails: [
        {
          year: '2026',
          text: 'Today, Bucks n Bricks continues to strengthen its presence across Pakistan and international markets, partnering with leading organizations to deliver strategic talent solutions, executive search, HR consulting, and workforce development services that drive sustainable business growth.',
        },
      ],
    },
  ];

  const activeMilestoneData = milestones.find((m) => m.id === activeMilestone);
  const activeIdx = milestones.findIndex((m) => m.id === activeMilestone);

  const svgPath = 'M 100 320 C 130 350, 160 380, 200 380 C 250 380, 320 260, 370 260 C 420 260, 470 310, 515 310 C 580 310, 660 120, 730 120 C 780 120, 850 120, 920 120';

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2.2, delay: 0.5, ease: 'easeInOut' },
    },
  };

  const bgNumVariants = (delay: number) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.05,
      transition: { duration: 1.0, delay },
    },
  });

  const nodeVariants = (delay: number) => ({
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15, delay },
    },
  });

  return (
    <section id="journey" className="relative py-16 sm:py-24 bg-[#f8fafc] overflow-hidden w-full">
      {/* Mobile Modal Overlay */}
      <AnimatePresence>
        {activeMilestoneData && (
          <div className="lg:hidden fixed inset-0 z-[99998] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setActiveMilestone(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-sm bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-4 sm:p-5 z-[99999] text-left max-h-[82vh] flex flex-col my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2 pr-2">
                  <span className="w-1.5 h-6 bg-[#0b1c24] rounded-full shrink-0" />
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#011c30] tracking-tight leading-snug">
                    {activeMilestoneData.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <img src={logoImg} alt="Bucks & Bricks Logo" className="h-6 w-auto object-contain" />
                  <button
                    onClick={() => setActiveMilestone(null)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto pr-1 space-y-3.5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-300 touch-pan-y max-h-[52vh] flex-1">
                {activeMilestoneData.yearDetails.map((detail, index) => (
                  <div key={index} className="flex flex-col gap-1 border-l-2 border-blue-500/40 pl-3 py-1 bg-slate-50/60 rounded-r-lg">
                    <span className="font-display font-bold text-xs sm:text-sm text-[#011c30] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                      {detail.year}
                    </span>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{detail.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 shrink-0 select-none">
                {activeIdx > 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMilestone(milestones[activeIdx - 1].id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                    aria-label="Previous milestone card"
                  >
                    <ChevronLeft size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                    <span>{milestones[activeIdx - 1].year}</span>
                  </button>
                ) : (
                  <div className="w-16" />
                )}

                <span className="text-[11px] font-semibold text-slate-400">
                  {activeIdx + 1} / {milestones.length}
                </span>

                {activeIdx < milestones.length - 1 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMilestone(milestones[activeIdx + 1].id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                    aria-label="Next milestone card"
                  >
                    <span>{milestones[activeIdx + 1].year}</span>
                    <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                  </button>
                ) : (
                  <div className="w-16" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="relative w-full"
        >
          {/* Mobile and Tablet Header Layout (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8 lg:hidden">
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-sans mb-2 bg-blue-50 px-3 py-1 rounded-md">
                Our Story
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#011c30] tracking-tight mb-2">
                Our Journey
              </h2>
              <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed">
                Every successful business starts with a vision. Ours began with a simple belief, that the right people have the power to transform organizations. What started as a small recruitment initiative has evolved into a trusted Talent Management Solutions partner serving businesses across Pakistan and international markets.
              </p>
            </div>

            <div className="w-full h-44 sm:h-56 rounded-xl overflow-hidden shadow-sm border border-slate-200/80">
              <img
                src={journeyImg}
                alt="Our Journey"
                className="w-full h-full object-fit"
              />
            </div>
          </div>

          {/* Timeline Container */}
          <div className="relative w-full aspect-[1000/550] min-h-[380px] sm:min-h-[480px] lg:min-h-[550px]">
            {/* SVG Wave Line */}
            <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 520" fill="none" preserveAspectRatio="none">
                <defs>
                  <filter id="wave-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#0b1c24" floodOpacity="0.12" />
                  </filter>
                </defs>

                <path
                  d={svgPath}
                  stroke="#0b1c24"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.04"
                />

                <motion.path
                  d={svgPath}
                  stroke="#0b1c24"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  filter="url(#wave-shadow)"
                  variants={pathVariants}
                />
              </svg>
            </div>

            {/* Desktop Only Text Header (Absolute Positioned over SVG) */}
            <div className="hidden lg:flex absolute left-0 top-0 z-30 max-w-sm flex-col items-start text-left pointer-events-auto">
              <motion.span
                variants={fadeInUp}
                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-sans mb-3 bg-blue-50 px-3 py-1 rounded-md"
              >
                Our Story
              </motion.span>

              <motion.h2
                variants={fadeInUp}
                className="font-display font-extrabold text-3xl sm:text-4xl text-[#011c30] tracking-tight mb-2"
              >
                Our Journey
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-slate-600 font-sans text-xs lg:text-sm leading-relaxed mb-4 lg:mb-8"
              >
                Every successful business starts with a vision. Ours began with a simple belief, that the right people have the power to transform organizations. What started as a small recruitment initiative has evolved into a trusted Talent Management Solutions partner serving businesses across Pakistan and international markets. Every milestone reflects our commitment to building lasting relationships, delivering exceptional talent, and creating meaningful business impact.
              </motion.p>
            </div>

            {/* Desktop Only Bottom Image */}
            <motion.div
              variants={fadeInUp}
              style={{ left: '63%', top: '48%', width: '35%', height: '48%' }}
              className="hidden lg:block absolute z-10 pointer-events-auto rounded-2xl overflow-hidden shadow-lg border border-slate-200/60 bg-white"
            >
              <img
                src={journeyImg}
                alt="Journey Illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Numbers */}
            <motion.div
              variants={bgNumVariants(1.0)}
              style={{ left: '30%', top: '75%' }}
              className="absolute text-[120px] sm:text-[180px] font-black font-display text-slate-400 select-none pointer-events-none -z-10 leading-none -translate-x-1/2 -translate-y-1/2"
            >
              1
            </motion.div>

            <motion.div
              variants={bgNumVariants(1.6)}
              style={{ left: '61.5%', top: '61.5%' }}
              className="absolute text-[120px] sm:text-[180px] font-black font-display text-slate-400 select-none pointer-events-none -z-10 leading-none -translate-x-1/2 -translate-y-1/2"
            >
              2
            </motion.div>

            <motion.div
              variants={bgNumVariants(2.2)}
              style={{ left: '83%', top: '25%' }}
              className="absolute text-[120px] sm:text-[180px] font-black font-display text-slate-400 select-none pointer-events-none -z-10 leading-none -translate-x-1/2 -translate-y-1/2"
            >
              3
            </motion.div>

            {/* Node 1 */}
            <div
              style={{ left: '20%', top: '73.08%' }}
              className={`absolute flex flex-col items-start -ml-[22px] -mt-[22px] pointer-events-auto transition-all ${
                activeMilestone === '1' ? 'z-[9999]' : 'z-20'
              }`}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  setActiveMilestone('1');
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  if (activeMilestone === '1') setActiveMilestone(null);
                }
              }}
            >
              <div className="relative mb-3">
                <motion.button
                  variants={nodeVariants(1.0)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMilestone(activeMilestone === '1' ? null : '1');
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View 2009 milestone details"
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-white border flex items-center justify-center transition-all duration-300 z-30 relative shadow-[0_8px_22px_rgba(11,28,36,0.06)] hover:border-slate-400 ${
                    activeMilestone === '1' ? 'border-slate-900 ring-4 ring-blue-500/20 shadow-xl' : 'border-slate-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 ${
                    activeMilestone === '1' ? 'bg-[#89c7f5]' : 'bg-[#89c7f5]/40'
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {activeMilestone === '1' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-[9999] bg-white border border-slate-200/90 shadow-2xl p-5 rounded-2xl w-[400px] bottom-16 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -bottom-1.5" />
                      
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-7 bg-[#0b1c24] rounded-full" />
                          <h3 className="font-display font-bold text-xl text-[#011c30] tracking-tight">{milestones[0].title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={logoImg} alt="Bucks & Bricks Logo" className="h-7 w-auto object-contain" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMilestone(null); }}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
                            aria-label="Close"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5 pt-1 text-sm text-slate-600 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-300">
                        {milestones[0].yearDetails.map((detail, index) => (
                          <div key={index} className="flex flex-col gap-1 border-l-2 border-blue-500/30 pl-3 py-0.5">
                            <span className="font-display font-bold text-sm text-[#011c30] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                              {detail.year}
                            </span>
                            <p className="text-slate-600 text-sm leading-relaxed">{detail.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 shrink-0 select-none">
                        {activeIdx > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx - 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <ChevronLeft size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                            <span>{milestones[activeIdx - 1].year}</span>
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}

                        <span className="text-[11px] font-semibold text-slate-400">
                          {activeIdx + 1} / {milestones.length}
                        </span>

                        {activeIdx < milestones.length - 1 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx + 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <span>{milestones[activeIdx + 1].year}</span>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                variants={fadeInUp}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMilestone(activeMilestone === '1' ? null : '1');
                }}
                className="px-1 flex flex-col items-start text-left cursor-pointer group"
              >
                <span className={`font-display font-bold text-xs sm:text-sm mb-1 transition-colors ${
                  activeMilestone === '1' ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {milestones[0].year}
                </span>
              </motion.div>
            </div>

            {/* Node 2 */}
            <div
              style={{ left: '51.5%', top: '59.62%' }}
              className={`absolute flex flex-col items-start -ml-[22px] -mt-[22px] pointer-events-auto transition-all ${
                activeMilestone === '2' ? 'z-[9999]' : 'z-20'
              }`}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  setActiveMilestone('2');
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  if (activeMilestone === '2') setActiveMilestone(null);
                }
              }}
            >
              <div className="relative mb-3">
                <motion.button
                  variants={nodeVariants(1.6)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMilestone(activeMilestone === '2' ? null : '2');
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View milestone details"
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-white border flex items-center justify-center transition-all duration-300 z-30 relative shadow-[0_8px_22px_rgba(11,28,36,0.06)] hover:border-slate-400 ${
                    activeMilestone === '2' ? 'border-slate-900 ring-4 ring-blue-500/20 shadow-xl' : 'border-slate-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 ${
                    activeMilestone === '2' ? 'bg-[#89c7f5]' : 'bg-[#89c7f5]/40'
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {activeMilestone === '2' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-[9999] bg-white border border-slate-200/90 shadow-2xl p-5 rounded-2xl w-[400px] bottom-16 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -bottom-1.5" />
                      
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-7 bg-[#0b1c24] rounded-full" />
                          <h3 className="font-display font-bold text-xl text-[#011c30] tracking-tight">{milestones[1].title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={logoImg} alt="Bucks & Bricks Logo" className="h-7 w-auto object-contain" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMilestone(null); }}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
                            aria-label="Close"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5 pt-1 text-sm text-slate-600 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-300">
                        {milestones[1].yearDetails.map((detail, index) => (
                          <div key={index} className="flex flex-col gap-1 border-l-2 border-blue-500/30 pl-3 py-0.5">
                            <span className="font-display font-bold text-sm text-[#011c30] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                              {detail.year}
                            </span>
                            <p className="text-slate-600 text-sm leading-relaxed">{detail.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 shrink-0 select-none">
                        {activeIdx > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx - 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <ChevronLeft size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                            <span>{milestones[activeIdx - 1].year}</span>
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}

                        <span className="text-[11px] font-semibold text-slate-400">
                          {activeIdx + 1} / {milestones.length}
                        </span>

                        {activeIdx < milestones.length - 1 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx + 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <span>{milestones[activeIdx + 1].year}</span>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                variants={fadeInUp}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMilestone(activeMilestone === '2' ? null : '2');
                }}
                className="px-1 flex flex-col items-start text-left cursor-pointer group"
              >
                <span className={`font-display font-bold text-xs sm:text-sm mb-1 transition-colors ${
                  activeMilestone === '2' ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {milestones[1].year}
                </span>
              </motion.div>
            </div>

            {/* Node 3 */}
            <div
              style={{ left: '73%', top: '23.08%' }}
              className={`absolute flex flex-col items-start -ml-[22px] -mt-[22px] pointer-events-auto transition-all ${
                activeMilestone === '3' ? 'z-[9999]' : 'z-20'
              }`}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  setActiveMilestone('3');
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  if (activeMilestone === '3') setActiveMilestone(null);
                }
              }}
            >
              <div className="relative mb-3">
                <motion.button
                  variants={nodeVariants(2.2)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMilestone(activeMilestone === '3' ? null : '3');
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View milestone details"
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-white border flex items-center justify-center transition-all duration-300 z-30 relative shadow-[0_8px_22px_rgba(11,28,36,0.06)] hover:border-slate-400 ${
                    activeMilestone === '3' ? 'border-slate-900 ring-4 ring-blue-500/20 shadow-xl' : 'border-slate-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-colors duration-300 ${
                    activeMilestone === '3' ? 'bg-[#89c7f5]' : 'bg-[#89c7f5]/40'
                  }`} />
                </motion.button>

                <AnimatePresence>
                  {activeMilestone === '3' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 z-[9999] bg-white border border-slate-200/90 shadow-2xl p-5 rounded-2xl w-[400px] top-16 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-slate-200 rotate-45 -top-1.5" />
                      
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-7 bg-[#0b1c24] rounded-full" />
                          <h3 className="font-display font-bold text-xl text-[#011c30] tracking-tight">{milestones[2].title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={logoImg} alt="Bucks & Bricks Logo" className="h-7 w-auto object-contain" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMilestone(null); }}
                            className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
                            aria-label="Close"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-[250px] overflow-y-auto pr-2 space-y-3.5 pt-1 text-sm text-slate-600 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-300">
                        {milestones[2].yearDetails.map((detail, index) => (
                          <div key={index} className="flex flex-col gap-1 border-l-2 border-blue-500/30 pl-3 py-0.5">
                            <span className="font-display font-bold text-sm text-[#011c30] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                              {detail.year}
                            </span>
                            <p className="text-slate-600 text-sm leading-relaxed">{detail.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 shrink-0 select-none">
                        {activeIdx > 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx - 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <ChevronLeft size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                            <span>{milestones[activeIdx - 1].year}</span>
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}

                        <span className="text-[11px] font-semibold text-slate-400">
                          {activeIdx + 1} / {milestones.length}
                        </span>

                        {activeIdx < milestones.length - 1 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMilestone(milestones[activeIdx + 1].id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group"
                          >
                            <span>{milestones[activeIdx + 1].year}</span>
                            <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
                          </button>
                        ) : (
                          <div className="w-16" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                variants={fadeInUp}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMilestone(activeMilestone === '3' ? null : '3');
                }}
                className="px-1 flex flex-col items-start text-left cursor-pointer group"
              >
                <span className={`font-display font-bold text-xs sm:text-sm mb-1 transition-colors ${
                  activeMilestone === '3' ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                }`}>
                  {milestones[2].year}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}