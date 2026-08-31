

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Quote } from 'lucide-react';
import { AnimatedHeading, AnimatedParagraph, AnimatedButton } from './animations';
import { Testimonial } from '../types';

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      quote: "Working with Buck & Bricks over the past 12 years has been an exceptional experience. As a business leader, finding the right executive talent is critical, and they have consistently delivered highest-quality candidate data and insights. Their precision and thorough approach make our hiring process seamless, efficient, and genuinely engaging. When it comes to critical leadership searches, Buck & Bricks is a trusted strategic partner I rely on without hesitation.",
      author: 'Muhammad Zeeshan Asif',
      role: 'General Manager HR',
      company: 'Pakistan Beverage Limited',
      avatar: '',
    },
    {
      id: '2',
      quote: "Working with Buck & Bricks over the past 12 years has been an exceptional experience. As a business leader, finding the right executive talent is critical, and they have consistently delivered highest-quality candidate data and insights. Their precision and thorough approach make our hiring process seamless, efficient, and genuinely engaging. When it comes to critical leadership searches, Buck & Bricks is a trusted strategic partner I rely on without hesitation.",
      author: 'Muhammad Zeeshan Asif',
      role: 'General Manager HR',
      company: 'Pakistan Beverage Limited',
      avatar: '',
    },
    {
      id: '3',
      quote: "Working with Buck & Bricks over the past 12 years has been an exceptional experience. As a business leader, finding the right executive talent is critical, and they have consistently delivered highest-quality candidate data and insights. Their precision and thorough approach make our hiring process seamless, efficient, and genuinely engaging. When it comes to critical leadership searches, Buck & Bricks is a trusted strategic partner I rely on without hesitation.",
      author: 'Muhammad Zeeshan Asif',
      role: 'General Manager HR',
      company: 'Pakistan Beverage Limited',
      avatar: '',
    },
    {
      id: '4',
      quote: "Working with Buck & Bricks over the past 12 years has been an exceptional experience. As a business leader, finding the right executive talent is critical, and they have consistently delivered highest-quality candidate data and insights. Their precision and thorough approach make our hiring process seamless, efficient, and genuinely engaging. When it comes to critical leadership searches, Buck & Bricks is a trusted strategic partner I rely on without hesitation.",
      author: 'Muhammad Zeeshan Asif',
      role: 'General Manager HR',
      company: 'Pakistan Beverage Limited',
      avatar: '',
    },
  ];

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection('forward');
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleNext = () => {
    setDirection('forward');
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    resetAutoplay();
  };

  const handlePrev = () => {
    setDirection('backward');
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    resetAutoplay();
  };

  // Custom slide animations with professional cubic-bezier easing and scale transitions
  const slideVariants = {
    initial: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      y: dir === 'forward' ? 40 : -40,
      scale: 0.97,
    }),
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: 'forward' | 'backward') => ({
      opacity: 0,
      y: dir === 'forward' ? -40 : 40,
      scale: 0.97,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Badge styled as plain text exactly like original image */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-4 text-left"
          >
            <span className="text-[11px] font-bold text-slate-800 font-sans tracking-tight uppercase">
              Testimonials
            </span>
          </motion.div>

          <AnimatedHeading
            text="Happy Customers"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-none mb-6"
          />

          <AnimatedParagraph className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            Discover how our solutions have transformed businesses worldwide. Join the growing list of our satisfied clients.
          </AnimatedParagraph>

          <AnimatedButton
            href="#contact"
            delay={0.4}
            className="inline-flex items-center justify-center bg-black text-white font-sans text-xs font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 uppercase tracking-wider mt-4"
          >
            Hear from our customer
          </AnimatedButton>
        </div>

        {/* Right Testimonial Slider Column */}
        <div className="lg:col-span-7 flex items-center justify-between gap-6 relative min-h-[220px] w-full">
          
          {/* Testimonial Active Card Wrapper */}
          <div className="flex-1 overflow-hidden relative min-h-[200px] flex items-center">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ willChange: 'transform, opacity' }}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex gap-5 items-start text-left w-full shadow-sm"
              >
                {/* Profile Pic / Blank Placeholder */}
                {testimonials[activeIndex].avatar ? (
                  <img
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].author}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white shadow-md shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200 border-2 border-white shadow-md shrink-0"
                    aria-hidden="true"
                  />
                )}

                {/* Testimonial Quote */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                      <h4 className="text-[#011c30] font-bold font-display text-sm sm:text-base leading-snug">
                        {testimonials[activeIndex].author}
                      </h4>
                      <p className="text-slate-500 font-medium text-xs tracking-tight mt-0.5">
                        {testimonials[activeIndex].role}
                      </p>
                      {testimonials[activeIndex].company && (
                        <p className="text-slate-400 font-medium text-[11px] tracking-tight mt-0.5">
                          {testimonials[activeIndex].company}
                        </p>
                      )}
                    </div>
                    <Quote size={24} className="text-[#89c7f5] shrink-0 fill-current" />
                  </div>
                  
                  <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed italic pr-4">
                    {testimonials[activeIndex].quote}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Up/Down Arrow Navigation Buttons on the Right Side */}
          <div className="flex flex-col gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1, y: -3, backgroundColor: '#18181b' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-3 bg-black text-white rounded-full shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center"
              aria-label="Previous Testimonial"
            >
              <ChevronUp size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, y: 3, backgroundColor: '#18181b' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 bg-black text-white rounded-full shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center"
              aria-label="Next Testimonial"
            >
              <ChevronDown size={18} />
            </motion.button>
          </div>

        </div>

      </div>
    </section>
  );
}
