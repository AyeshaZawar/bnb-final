import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Team } from './Team';
import { Contact } from './Contact';
import { JourneyTimeline } from './JourneyTimeline';
import { AnimatedHeading, AnimatedParagraph, AnimatedButton } from './animations';

const professionalHandshake = '/assets/Ceo.jpeg';
const digitalWorkplace = '/assets/Our_vision-1.jpg';

// Smooth spring animation config for luxury feel
const springConfig = { damping: 30, stiffness: 120, mass: 0.8 };

// Slowly counting decimal component
function Counter({ target, duration = 3.5, decimals = 1, suffix = '' }: { target: number; duration?: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Premium easeOutQuart easing for extra-slow, elegant deceleration near the end
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(easeProgress * target);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
}

export function CEOPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Scroll Parallax Hooks
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Soft Parallax Scroll Offsets (Text moves up slightly, image shifts down slightly)
  const textScrollY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const imageScrollY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Mouse Spotlight Positions
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const heroRectRef = useRef<DOMRect | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRectRef.current && heroRef.current) {
      heroRectRef.current = heroRef.current.getBoundingClientRect();
    }
    if (!heroRectRef.current) return;
    const rect = heroRectRef.current;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Image 3D Tilt Mouse Transforms
  const imageX = useMotionValue(0);
  const imageY = useMotionValue(0);

  // Very gentle 3D rotations (maximum 4 degrees for premium, professional aesthetic)
  const rotateY = useTransform(imageX, [-250, 250], [-4, 4]);
  const rotateX = useTransform(imageY, [-250, 250], [4, -4]);

  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    imageX.set(e.clientX - centerX);
    imageY.set(e.clientY - centerY);
  };

  const handleImageMouseLeave = () => {
    imageX.set(0);
    imageY.set(0);
  };

  // Scroll to top or to section on mount
  useEffect(() => {
    if (window.location.hash === '#our-story') {
      const timer = setTimeout(() => {
        const el = document.getElementById('our-story');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
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
    <div className="pt-24 pb-12 bg-white overflow-hidden">
      {/* 1. Founder Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center py-16 px-6 overflow-hidden bg-white select-none"
      >
        {/* Soft interactive spotlight following cursor */}
        <motion.div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.05), transparent 80%)`,
          }}
        />

        {/* Soft slowly floating animated ambient gradient circles in background */}
        <motion.div
          style={{ y: bgScrollY }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-sky-150/20 rounded-full blur-[100px] pointer-events-none z-0"
        />

        <motion.div
          style={{ y: bgScrollY }}
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.92, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-blue-150/20 rounded-full blur-[110px] pointer-events-none z-0"
        />

        {/* Hero content grid */}
        <div className="relative z-20 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image with Increased Height */}
          <div className="md:col-span-5 flex justify-center">
            <motion.div
              style={{ y: imageScrollY }}
              className="w-full max-w-[440px]"
            >
              {/* Soft floating animation */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                ref={imgContainerRef}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                style={{
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  transformStyle: 'preserve-3d',
                }}
                /* 
                  - aspect-[4/5] set kiya hai (square aspect-square ki jagah)
                  - h-[480px] sm:h-[540px] explicit height di hai vertical height badhane ke liye
                */
                className="relative aspect-[4/5] h-[480px] sm:h-[540px] w-full rounded-[32px] overflow-hidden shadow-2xl bg-[#0b132a] group cursor-grab active:cursor-grabbing border border-slate-200/40 flex items-center justify-center"
              >
                {/* Clean, high-contrast styled image */}
                <img
                  src={professionalHandshake}
                  alt="Arbab Wasi"
                  className="w-full h-full object-cover contrast-[1.05] transition-transform duration-500"
                />
                
                {/* Corner light reflection mask for extra luxury finish */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Exact image text content */}
          <motion.div
            style={{ y: textScrollY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 flex flex-col items-start text-left"
          >
            {/* Header Title with underline line underneath like in the image */}
            <div className="w-full pb-3 mb-4 border-b-2 border-blue-600/70">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-[#011c30] tracking-tight">
                Meet Our Founder
              </h1>
            </div>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-lg italic font-sans text-slate-600 mb-6 font-medium">
              Leading with Vision. Building with Purpose.
            </p>

            {/* Main Paragraph Content */}
            <div className="space-y-4 text-slate-700 font-sans text-sm sm:text-base leading-relaxed mb-6">
              <p>
                At Bucks n Bricks, our journey has always been driven by one belief: great organizations are built by great people. This philosophy is at the heart of everything we do.
              </p>

              <p>
                Founded by Arbab Wasi, Bucks n Bricks was established with a clear purpose to redefine talent management by helping organizations attract exceptional professionals while creating meaningful career opportunities for individuals.
              </p>

              <p>
                With years of experience in executive search, strategic recruitment, HR consulting, and organizational development, Arbab has worked closely with businesses across diverse industries, understanding that every hiring decision shapes an organization's future.
              </p>

              <p>
                Under his leadership, Bucks n Bricks has evolved from a boutique recruitment firm into a trusted Talent Management Solutions partner, serving organizations across Pakistan while expanding its reach into the Kingdom of Saudi Arabia and the United Arab Emirates.
              </p>

              <p>
                His leadership is built on collaboration, integrity, and a genuine commitment to creating value for both clients and candidates. Rather than focusing solely on filling vacancies, he believes in building long-term partnerships that contribute to sustainable business growth.
              </p>

              <p>
                Today, Bucks n Bricks continues to help organizations strengthen their workforce through strategic hiring, leadership acquisition, HR consulting, and workforce development, remaining committed to delivering talent solutions that create lasting impact.
              </p>
            </div>

            {/* Counting blocks */}
            <div className="grid grid-cols-2 gap-5 w-full max-w-md">
              {/* Followers Block */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 text-left flex flex-col justify-center shadow-sm">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mb-1">
                  <Counter target={1.1} duration={4.0} decimals={1} suffix="M+" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Followers
                </span>
              </div>

              {/* Likes Block */}
              <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 text-left flex flex-col justify-center shadow-sm">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight mb-1">
                  <Counter target={2.5} duration={4.2} decimals={1} suffix="M" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Likes
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Our Story Section */}
      <section id="our-story" className="py-16 sm:py-24 bg-[#f8fafc] border-t border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 mb-3 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
            Our Beginnings
          </span>
          <AnimatedHeading
            text="Our Story"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight mb-8 text-center"
          />

          <div className="space-y-4 text-slate-600 font-sans text-sm sm:text-base leading-relaxed text-left sm:text-center max-w-3xl mx-auto mb-10">
            <p>
              Since 2011, Bucks & Bricks has been helping organizations build stronger teams through strategic recruitment, executive search, HR consulting, and learning & development solutions.
            </p>
            <p>
              What began as a recruitment consultancy has grown into a trusted HR partner for businesses across Pakistan, serving industries including FMCG, Pharmaceuticals, Banking, Manufacturing, Engineering, Textile, Hospitality, and Technology.
            </p>
            <p>
              We believe recruitment is more than filling vacancies — it's about creating lasting partnerships, empowering people, and helping businesses achieve sustainable growth.
            </p>
            <p>
              Today, we continue to connect exceptional talent with forward-thinking organizations, delivering customized workforce solutions that create measurable impact.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Driven by Passion, Focused on Excellence Section (Our Mission & Our Vision) */}
      <section id="mission-vision" className="relative py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
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

            {/* Card 2: Workplace Image Card */}
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
                alt="Digital Workplace Collaboration"
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

      {/* 4. Journey Timeline Section */}
      <JourneyTimeline />

      {/* 5. Reused Team Section */}
      <Team />

      {/* 6. Reused Contact Section */}
      <Contact />
    </div>
  );
}