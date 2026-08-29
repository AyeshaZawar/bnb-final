import React from "react";
import { motion } from "motion/react";
import {
  AnimatedHeading,
  AnimatedParagraph,
  ImageReveal,
  StaggerContainer,
  StaggerItem,
} from "./animations";

const execSearchIcon = "/assets/excutive_cards-1.png";
const recruitSolIcon = '/assets/Recruitment_cards-1.png';
const hrConsultingIcon = "/assets/consulting_cards-1.png";
const learningDevIcon = "/assets/learning_cards-1.png";
const candidateSourcing = "/assets/candidateSourcing-1.jpeg";


interface ServicesProps {
  onServiceSelect?: (
    serviceType:
      | "executive-search"
      | "recruitment-solution"
      | "hr-consulting"
      | "learning-development",
  ) => void;
}

export function Services({ onServiceSelect }: ServicesProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: -240,
      rotate: -10,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 70,
        mass: 1.1,
      },
    },
  };

  const hoverAnimation = {
    y: -10,
    scale: 1.03,
    borderColor: "rgba(2, 132, 199, 0.4)",
    boxShadow: "0 20px 40px rgba(2, 132, 199, 0.08)",
    transition: { type: "spring", stiffness: 350, damping: 15 },
  };

  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 bg-[#ffffff] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedHeading
            text="Our Services"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight mb-4 text-center"
          />
          <AnimatedParagraph className="text-slate-600 font-sans text-sm sm:text-base md:text-lg leading-relaxed">
            Finding exceptional talent requires more than simply filling vacancies. It requires
            understanding business strategy, organizational culture, and future workforce needs.
            Our comprehensive talent solutions help organizations attract, assess, hire, and
            develop professionals who create measurable business value.
          </AnimatedParagraph>
        </div>

        {/* 4-Column Service Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24 relative px-4"
        >
          {/* Card 1: Recruitment Solutions */}
          <motion.div
            variants={cardVariants}
            whileHover={hoverAnimation}
            onClick={() => onServiceSelect?.("recruitment-solution")}
            className="group flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 cursor-pointer hover:shadow-blue-100/50 hover:border-blue-300 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

            <img
              src={recruitSolIcon}
              alt="Recruitment Solutions"
              className="w-16 h-16 object-contain mb-6 group-hover:scale-110 transition-transform duration-300 rounded-2xl"
            />

            <h3 className="text-[#011c30] font-bold font-display text-lg mb-3">
              Recruitment Solutions
            </h3>
            <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed">
              End-to-end recruitment support for junior, mid-level, and senior
              positions across multiple industries.
            </p>
          </motion.div>

          {/* Card 2: Executive Search */}
          <motion.div
            variants={cardVariants}
            whileHover={hoverAnimation}
            onClick={() => onServiceSelect?.("executive-search")}
            className="group flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 cursor-pointer hover:shadow-emerald-100/50 hover:border-emerald-300 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

            <img
              src={execSearchIcon}
              alt="Executive Search"
              className="w-16 h-16 object-contain mb-6 group-hover:scale-110 transition-transform duration-300 rounded-2xl"
            />

            <h3 className="text-[#011c30] font-bold font-display text-lg mb-3">
              Executive Search
            </h3>
            <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed">
              Confidential headhunting and leadership hiring for critical
              management and executive roles.
            </p>
          </motion.div>

          {/* Card 3: HR Consulting */}
          <motion.div
            variants={cardVariants}
            whileHover={hoverAnimation}
            onClick={() => onServiceSelect?.("hr-consulting")}
            className="group flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 cursor-pointer hover:shadow-purple-100/50 hover:border-purple-300 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

            <img
              src={hrConsultingIcon}
              alt="HR Consulting"
              className="w-16 h-16 object-contain mb-6 group-hover:scale-110 transition-transform duration-300 rounded-2xl"
            />

            <h3 className="text-[#011c30] font-bold font-display text-lg mb-3">
              HR Consulting
            </h3>
            <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed">
              Customized HR solutions including process development, HR audits,
              policy development, and organizational effectiveness.
            </p>
          </motion.div>

          {/* Card 4: Learning & Development */}
          <motion.div
            variants={cardVariants}
            whileHover={hoverAnimation}
            onClick={() => onServiceSelect?.("learning-development")}
            className="group flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-300 cursor-pointer hover:shadow-sky-100/50 hover:border-sky-300 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

            <div className="w-16 h-16 bg-[#e0f7fa] border border-[#b2ebf2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 p-2.5">
              <img
                src={learningDevIcon}
                alt="Learning & Development"
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-[#011c30] font-bold font-display text-lg mb-3">
              Learning & Development
            </h3>
            <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed">
              Corporate training programs, leadership development workshops,
              competency assessments, and learning interventions.
            </p>
          </motion.div>
        </motion.div>

        {/* About Bucks & Bricks Section */}
        <div id="about-home" className="pt-12 border-t border-slate-100">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="text-[11px] font-bold text-blue-600 font-sans tracking-widest uppercase mb-2 inline-block">
              Who We Are
            </span>
            <AnimatedHeading
              text="About Bucks & Bricks"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight text-center"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <ImageReveal
                src={candidateSourcing}
                alt="About Bucks & Bricks"
                className="rounded-3xl aspect-[1.3] w-full shadow-lg object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center text-left">
              <StaggerContainer className="flex flex-col gap-4 text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
                <StaggerItem direction="up">
                  <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base">
                    At Bucks n Bricks, we believe that every successful organization is built by exceptional people. Since our inception, we have partnered with businesses to solve their most critical talent challenges by connecting them with professionals who create lasting value.
                  </p>
                </StaggerItem>

                <StaggerItem direction="up">
                  <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base">
                    As a trusted Talent Management Solutions firm, we specialize in Executive Search, Recruitment Solutions, HR Consulting, and Learning & Development, helping organizations build high-performing teams while enabling professionals to advance meaningful careers.
                  </p>
                </StaggerItem>

                <StaggerItem direction="up">
                  <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base">
                    Our approach extends beyond recruitment. We work closely with every client to understand their business strategy, organizational culture, and long-term objectives, allowing us to deliver talent solutions that create measurable impact.
                  </p>
                </StaggerItem>

                <StaggerItem direction="up">
                  <p className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base">
                    From leadership hiring and workforce planning to organizational development, we remain committed to building partnerships founded on trust, integrity, and excellence.
                  </p>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
