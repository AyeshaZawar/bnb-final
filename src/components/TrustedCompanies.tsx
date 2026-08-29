
import React from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Pill,
  Landmark,
  Factory,
  Shirt,
  Wrench,
  Laptop,
  Hotel,
} from 'lucide-react';

/* ==========================================================================
   Webflow & Relume Logo Components 
   ========================================================================== */
/*
function WebflowBrand() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.3 5.4c-.1-.3-.4-.4-.7-.4h-3.4c-.3 0-.6.2-.7.5l-2.6 8.7-2.6-8.7c-.1-.3-.4-.5-.7-.5H7.5c-.3 0-.6.2-.7.5L4.2 13.7 1.6 5.4c-.1-.3-.4-.4-.7-.4H.3c-.2 0-.3.1-.3.3 0 .1 0 .2.1.2l3.8 12.8c.1.3.4.5.7.5H8c.3 0 .6-.2.7-.5l2.6-8.7 2.6 8.7c.1.3.4.5.7.5h3.4c.3 0 .6-.2.7-.5l3.8-12.8c0-.1.1-.2.1-.3 0-.2-.1-.3-.3-.3z" />
      </svg>
      <span className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">
        Webflow
      </span>
    </div>
  );
}

function RelumeBrand() {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 7v10M12 12v10M22 7v10" />
      </svg>
      <span className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">
        Relume
      </span>
    </div>
  );
}
*/

/* ==========================================================================
   Trusted Companies Component 
   ========================================================================== */
export function TrustedCompanies() {
  // Sectors strictly listed in PDF with dedicated Lucide icons
  const pdfSectors = [
    { name: 'FMCG', icon: ShoppingBag, color: 'text-blue-400' },
    { name: 'Pharma', icon: Pill, color: 'text-teal-400' },
    { name: 'Banking', icon: Landmark, color: 'text-amber-400' },
    { name: 'Manufacturing', icon: Factory, color: 'text-orange-400' },
    { name: 'Textile', icon: Shirt, color: 'text-indigo-400' },
    { name: 'Engineering', icon: Wrench, color: 'text-sky-400' },
    { name: 'Technology', icon: Laptop, color: 'text-purple-400' },
    { name: 'Hospitality', icon: Hotel, color: 'text-rose-400' },
  ];

  // Extended for continuous seamless infinite loop animation
  const extendedSectors = [...pdfSectors, ...pdfSectors, ...pdfSectors, ...pdfSectors];

  return (
    <section className="relative bg-[#020817] py-14 md:py-16 overflow-hidden z-20 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 text-center mb-8">
        <p className="text-slate-300 font-sans text-sm sm:text-base font-semibold tracking-wide">
          Trusted by organizations across FMCG, Pharma, Banking, Manufacturing, Textile, Engineering, and Technology sectors.
        </p>
      </div>

      {/* Infinite Horizontal Loop Animation*/}
      <div className="flex overflow-hidden relative select-none w-full py-2">
        {/* Soft dark blur edge blending */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-[#020817] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-[#020817] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, '-25%'] }}
          style={{ willChange: 'transform' }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            },
          }}
          className="flex gap-8 sm:gap-12 whitespace-nowrap min-w-max items-center px-4"
        >
          {extendedSectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <div
                key={index}
                className="inline-flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 rounded-full px-5 py-2.5 hover:border-slate-700 transition-colors duration-300"
              >
                <Icon className={`w-4 h-4 ${sector.color}`} />
                <span className="font-sans font-bold text-sm sm:text-base text-white tracking-tight">
                  {sector.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
