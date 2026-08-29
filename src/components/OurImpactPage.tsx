import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { JourneyTimeline } from "./JourneyTimeline";
import { Contact } from "./Contact";
import { AnimatedHeading, AnimatedParagraph } from "./animations";
const globalRecruitmentNetwork = "/assets/Our_Impact-1.jpeg";

const springConfig = { damping: 20, stiffness: 120, mass: 0.8 };

function StatCounter({
  value,
  suffix = "",
  duration = 3.5,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * value);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {Math.floor(count)}
      {suffix}
    </span>
  );
}

interface ValueCardItem {
  id: string;
  title: string;
  subtitle: string;
}

export function OurImpactPage() {
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsSectionRef, {
    once: false,
    margin: "-10% 0px",
  });

  const valuesSectionRef = useRef<HTMLDivElement>(null);
  const isValuesInView = useInView(valuesSectionRef, {
    once: false,
    margin: "-100px",
  });
  const valuesContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [valueCards, setValueCards] = useState<ValueCardItem[]>([
    {
      id: "val-1",
      title: "Integrity",
      subtitle: "We build lasting relationships through honesty, transparency, and ethical business practices.",
    },
    {
      id: "val-2",
      title: "Excellence",
      subtitle: "We strive for quality in every search, every partnership, and every placement.",
    },
    {
      id: "val-3",
      title: "Partnership",
      subtitle: "We work as an extension of our clients' teams, understanding their business before recommending talent.",
    },
    {
      id: "val-4",
      title: "Innovation",
      subtitle: "We continuously embrace modern recruitment practices, market intelligence, and technology to deliver smarter hiring solutions.",
    },
    {
      id: "val-5",
      title: "People First",
      subtitle: "Whether serving organizations or professionals, we place people at the heart of every decision.",
    },
  ]);

  useEffect(() => {
    const html = document.documentElement;
    const originalBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.scrollTop = 0;
    if (document.body) {
      document.body.scrollTop = 0;
    }
    const timer = setTimeout(() => {
      html.style.scrollBehavior = originalBehavior;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const moveCard = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= valueCards.length || fromIndex === toIndex)
      return;
    const reordered = [...valueCards];
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);
    setValueCards(reordered);
  };

  const handleDragEnd = (index: number, event: any, info: any) => {
    if (!valuesContainerRef.current) return;

    const draggedX = info.point.x;
    const draggedY = info.point.y;

    let closestIndex = index;
    let minDistance = Infinity;

    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(
        draggedX - cardCenterX,
        draggedY - cardCenterY,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== index) {
      moveCard(index, closestIndex);
    }
  };

  const imageRevealVariants = {
    hidden: { clipPath: "inset(0 0 0 100%)", scale: 1.05 },
    visible: {
      clipPath: "inset(0 0 0 0%)",
      scale: 1,
      transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const statCardTopVariants = {
    hidden: { opacity: 0, y: -220 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 12,
        mass: 0.9,
        delay: 0.2,
      },
    },
  };

  const statCardBottomVariants = {
    hidden: { opacity: 0, y: 220 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 12,
        mass: 0.9,
        delay: 0.2,
      },
    },
  };

  // Safe Falling Entry Animation (y Offset reduced & opacity synced)
  const fallingCardVariants = {
    hidden: { opacity: 0, y: -120, rotate: -10, scale: 0.85 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        mass: 0.9,
        delay: index * 0.12,
      },
    }),
  };

  return (
    <div className="bg-[#f8fafc]">
      {/* 1. Hero Section */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <AnimatedHeading
            text="Our Impact"
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-[#011c30] tracking-tight text-center"
          />
          <AnimatedParagraph className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mt-4 max-w-xl text-center">
            Pioneering workforce architecture, accelerating organizational
            scale, and enabling direct global compliance through elite human
            resource frameworks.
          </AnimatedParagraph>
        </div>

        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 relative bg-[#0b132a] aspect-[16/9] md:aspect-[2.1/1] flex items-center justify-center">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            src={globalRecruitmentNetwork}
            alt="Our Impact Presentation Work Meeting"
            className="w-full h-full object-fit relative z-10"
          />
        </div>
      </section>

      {/* 2. Impact Statistics Section */}
      <section
        ref={statsSectionRef}
        className="py-20 sm:py-28 bg-white border-t border-b border-slate-50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg">
              Our Impact
            </span>
            <AnimatedHeading
              text="Driving Measurable Workforce Impact Across Pakistan"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight"
            />
            <AnimatedParagraph className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mt-6">
              Since 2011, Bucks & Bricks has been helping organizations build stronger teams through strategic recruitment, executive search, HR consulting, and learning & development solutions. What began as a recruitment consultancy has grown into a trusted HR partner serving leading industries across FMCG, Pharmaceuticals, Banking, Manufacturing, Engineering, Textile, Hospitality, and Technology.
            </AnimatedParagraph>
          </div>

          <div className="lg:col-span-6 w-full max-w-xl mx-auto grid grid-cols-2 gap-6 relative items-start">
            <div className="flex flex-col gap-6">
              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardTopVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={500} suffix="+" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Successful Placements
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardBottomVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={200} suffix="+" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Positions Closed
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardBottomVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={50} suffix="+" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Trusted Clients
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col gap-6 lg:translate-y-8">
              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardTopVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={10} suffix="+" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Industries Served
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardBottomVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={95} suffix="%" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Client Satisfaction
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={statCardBottomVariants}
                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left shadow-sm min-h-[150px]"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#011c30] tracking-tight mb-2">
                  <StatCounter value={72} suffix=" Hrs" />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans leading-snug">
                  Average Shortlisting Time
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Reused Journey Timeline Section */}
      <JourneyTimeline />

      {/* 4. Our Value Section - FIXED ENTRY ANIMATION + ALL 5 CARDS GUARANTEED */}
      <section
        ref={valuesSectionRef}
        className="py-20 sm:py-28 bg-[#f8fafc] relative overflow-visible border-t border-slate-100/80"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex justify-center w-full">
            <div
              ref={valuesContainerRef}
              className="grid grid-cols-2 gap-6 w-full max-w-xl items-center"
            >
              {valueCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  ref={(el) => {
                    cardsRef.current[idx] = el;
                  }}
                  custom={idx}
                  initial="hidden"
                  animate={isValuesInView ? "visible" : "hidden"}
                  variants={fallingCardVariants}
                  layout
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(event, info) => handleDragEnd(idx, event, info)}
                  whileDrag={{
                    scale: 1.03,
                    zIndex: 50,
                    boxShadow: "0 20px 30px rgba(0, 0, 0, 0.08)",
                    cursor: "grabbing",
                  }}
                  className={`p-6 sm:p-7 bg-white border border-slate-100/90 rounded-[24px] shadow-sm flex flex-col justify-center items-center text-center cursor-grab active:cursor-grabbing select-none relative min-h-[160px] hover:border-blue-100 transition-colors duration-200 w-full ${
                    idx === 4 ? "col-span-1" : ""
                  } ${idx % 2 === 1 ? "lg:translate-y-6" : ""}`}
                >
                  <h4 className="text-lg sm:text-xl font-bold font-display text-[#011c30] tracking-tight mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-normal text-slate-600 font-sans leading-relaxed">
                    {card.subtitle}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg">
              Our Core Values
            </span>
            <AnimatedHeading
              text="Guided by Principles That Create Lasting Value"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight"
            />
            <AnimatedParagraph className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mt-6">
              Behind every successful business are exceptional people — and they remain at the heart of everything we do. We work as an extension of our clients' teams, building long-term relationships based on honesty, transparency, quality, and modern recruitment practices.
            </AnimatedParagraph>
          </div>
        </div>
      </section>

      {/* 5. Industries We Serve Section (From PDF Page 3) */}
      <section className="py-16 sm:py-20 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
            Specialized Sectors
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-display text-[#011c30] tracking-tight mb-4">
            Industries We Serve
          </h3>
          <p className="text-slate-500 font-sans text-xs sm:text-sm max-w-xl mx-auto mb-10">
            Delivering tailored recruitment and HR solutions across Pakistan's leading economic sectors:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              'Textile & Apparel',
              'Manufacturing & Engineering',
              'Pharmaceuticals',
              'FMCG',
              'Banking & Financial Services',
              'Information Technology',
              'Supply Chain & Procurement',
              'Retail & Consumer Goods',
              'Sales & Marketing',
              'Hospitality & Services',
            ].map((industry, idx) => (
              <div key={idx} className="bg-white border border-slate-100/90 rounded-2xl p-4 text-center shadow-2xs hover:border-blue-200 transition-colors flex items-center justify-center min-h-[72px]">
                <span className="text-slate-800 font-display font-bold text-xs sm:text-sm leading-tight">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Looking Ahead Section (From PDF Page 2) */}
      <section className="py-16 sm:py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
            Looking Ahead
          </span>
          <h3 className="text-3xl sm:text-4xl font-bold font-display text-[#011c30] tracking-tight mb-4">
            Together, we're building the future of work.
          </h3>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            As workplaces continue to evolve, so do we. Bucks & Bricks remains committed to helping organizations build resilient, future-ready teams while enabling professionals to unlock opportunities that shape successful careers.
          </p>
        </div>
      </section>

      {/* 5. Contact Section */}
      <Contact />
    </div>
  );
}
