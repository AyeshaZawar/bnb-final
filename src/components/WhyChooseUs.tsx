import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { AnimatedHeading, StaggerContainer, StaggerItem } from './animations';

const partnershipHandshake = '/assets/WhyChooseUs-1.jpg';

export function WhyChooseUs() {
  const points = [
    'Executive Search Expertise',
    'Industry-Specific Recruitment',
    'Extensive Talent Network',
    'Customized HR Solutions',
    'Faster Hiring Turnaround',
    'Confidential Search Process',
    'Long-Term Business Partnerships',
  ];

  return (
    <section id="why-choose-us" className="relative py-16 sm:py-24 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Side Image (Mobile: top order-1, Desktop: left order-1) */}
        <div className="lg:col-span-6 order-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl w-full aspect-[4/3] overflow-hidden shadow-xl border border-slate-200/50 relative bg-[#0b132a] select-none"
          >
            <img
              src={partnershipHandshake}
              alt="Why Bucks n Bricks"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>

        {/* Right Side Content (Mobile: bottom order-2, Desktop: right order-2) */}
        <div className="lg:col-span-6 order-2 flex flex-col justify-center items-start text-left">
          <span className="text-[11px] font-bold text-blue-600 font-sans tracking-widest uppercase mb-2">
            Our Key Advantages
          </span>

          <AnimatedHeading
            text="Why Bucks n Bricks?"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight mb-6"
          />

          {/* Clean Simple List Items without extra paragraphs or card wrappers */}
          <StaggerContainer className="flex flex-col gap-4 w-full">
            {points.map((point, idx) => (
              <StaggerItem key={idx} direction="up" className="w-full">
                <div className="flex items-center gap-3.5">
                  <div className="w-6 h-6 bg-blue-50 border border-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} className="stroke-[3]" />
                  </div>
                  <h4 className="text-[#011c30] font-bold font-display text-base leading-snug">
                    {point}
                  </h4>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

