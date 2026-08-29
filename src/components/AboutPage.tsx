
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AnimatedHeading, AnimatedParagraph, StaggerContainer, StaggerItem } from './animations';
import { Team } from './Team';
import { JourneyTimeline } from './JourneyTimeline';
import { Contact } from './Contact';
const officeCollaboration = '/assets/About_details-1.jpeg';
const heroBannerImg = '/assets/About_us-1.jpeg';
const digitalWorkplace = '/assets/our_mission-1.jpg';

export function AboutPage() {
  useEffect(() => {
    // Reset page scroll position to top instantly on mount
    const html = document.documentElement;
    const originalBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
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

  return (
    <div id="about" className="pt-24 pb-12 bg-[#f8fafc]">
      {/* 1. Hero Section of the About Us Page */}
      <section id="about-hero" className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        <div className="relative z-10">
          {/* Centered Heading */}
          <AnimatedHeading
            text="ABOUT US"
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-[#011c30] tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto text-center"
            as="h1"
          />

          {/* About Us Introductory Paragraphs */}
          <div className="max-w-4xl mx-auto text-left sm:text-center space-y-4 mb-12 text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              At Bucks n Bricks, we believe that every successful organization is built by exceptional people. Since our inception, we have partnered with businesses to solve their most critical talent challenges by connecting them with professionals who create lasting value.
            </p>
            <p>
              As a trusted Talent Management Solutions firm, we specialize in Executive Search, Recruitment Solutions, HR Consulting, and Learning & Development, helping organizations build high-performing teams while enabling professionals to advance meaningful careers.
            </p>
            <p>
              Our approach extends beyond recruitment. We work closely with every client to understand their business strategy, organizational culture, and long-term objectives, allowing us to deliver talent solutions that create measurable impact.
            </p>
            <p>
              From leadership hiring and workforce planning to organizational development, we remain committed to building partnerships founded on trust, integrity, and excellence.
            </p>
          </div>

          {/* Centered Image with left-to-right banner opening animation */}
          <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-100 mb-8">
            {/* Banner slide overlay (opening left-to-right) */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              style={{ originX: 1 }}
              className="absolute inset-0 bg-[#0b132a] z-10"
            />
            {/* Image with subtle zoom-out scale */}
            <motion.img
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
              src={heroBannerImg}
              alt="About Bucks n Bricks"
              className="w-full h-full object-fit"
            />
          </div>
        </div>
      </section>

      {/* 2. Strategic Solutions Section */}
      <section id="about-details" className="relative py-16 sm:py-24 bg-white overflow-hidden border-t border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Centered Section Title */}
          <div className="mb-16 text-center">
            <AnimatedHeading
              text="Strategic Solutions"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight text-center"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left Column: Image */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -30 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: false, margin: '-10% 0px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl aspect-[4/3] w-full overflow-hidden shadow-xl border border-slate-200/50 bg-[#0b132a] relative flex items-center justify-center"
              >
                <img
                  src={officeCollaboration}
                  alt="Strategic Solutions"
                  className="w-full h-full object-fit"
                />
              </motion.div>
            </div>

            {/* Right Column: Strategic Solutions Paragraphs */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <StaggerContainer className="flex flex-col gap-6 w-full">
                <StaggerItem direction="up" className="w-full">
                  <div className="border-b border-slate-100 pb-6">
                    <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                      For over a decade, Bucks n Bricks has partnered with organizations across Pakistan and international markets to solve complex hiring challenges and strengthen their workforce. We combine industry expertise, strategic insight, and an extensive talent network to deliver recruitment solutions that align with business objectives.
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem direction="up" className="w-full">
                  <div className="pb-2">
                    <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                      Whether supporting executive leadership hiring or large-scale recruitment initiatives, our focus remains the same, finding the right people who create lasting business impact.
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Mission & Our Vision Section */}
      <section id="about-pillars" className="relative py-16 sm:py-24 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          {/* Centered Heading */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <AnimatedHeading
              text="Driven by Passion, Focused on Excellence"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight text-center"
            />
          </div>

          {/* 3-Column Grid for Mission, Image, Vision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Our Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#0b132a] text-white p-8 rounded-3xl flex flex-col items-start text-left shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/10 border border-slate-800"
            >
              {/* Badge Number 01 */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white mb-8 group-hover:scale-110 transition-transform duration-300">
                01
              </div>
              <h3 className="font-bold font-display text-xl mb-4" style={{ color: '#89C7F5' }}>
                Our Mission
              </h3>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                To empower organizations by connecting them with exceptional talent while enabling professionals to build rewarding careers through innovative, ethical, and strategic talent management solutions.
              </p>
            </motion.div>

            {/* Card 2: Keyboard Typing Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/50 aspect-[4/3] md:aspect-auto md:h-full relative bg-[#0b132a] group transition-all duration-300 hover:shadow-2xl flex items-center justify-center"
            >
              <img
                src={digitalWorkplace}
                alt="Our Mission & Vision"
                className="w-full h-full object-fit transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>

            {/* Card 3: Our Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-[#0b132a] text-white p-8 rounded-3xl flex flex-col items-start text-left shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/10 border border-slate-800"
            >
              {/* Badge Number 02 */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white mb-8 group-hover:scale-110 transition-transform duration-300">
                02
              </div>
              <h3 className="font-bold font-display text-xl mb-4" style={{ color: '#89C7F5' }}>
                Our Vision
              </h3>
              <p className="text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                To become the region's most trusted talent management partner, recognized for transforming businesses through people, innovation, and long-term strategic partnerships
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Professional Core Members Grid (Reused from Team) */}
      <Team />

      {/* 5. Milestone Journey Wave Timeline (Reused from JourneyTimeline) */}
      <JourneyTimeline />

      {/* 6. Custom Form & Support Panel (Reused from Contact) */}
      <Contact />
    </div>
  );
}
