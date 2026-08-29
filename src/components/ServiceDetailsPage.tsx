import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Briefcase, Award, Building2, BookOpen } from 'lucide-react';
import { AnimatedHeading, StaggerContainer, StaggerItem } from './animations';
import { Vacancies } from './Vacancies';
import { Contact } from './Contact';

const executiveSearchHeroImg = '/assets/executiveSearchHeroImg-1.jpg';
const executiveSearchDetailImg = '/assets/executiveSearchDetailImg-1.jpeg';

const recruitmentSolutionHeroImg = '/assets/recruitmentSolutionHeroImg-1.jpeg';
const recruitmentSolutionDetailImg = '/assets/recruitmentSolutionDetailImg-1.jpeg';

const hrConsultingHeroImg = '/assets/hrConsultingHeroImg-1.jpeg';
const hrConsultingDetailImg = '/assets/hrConsultingDetailImg-1.jpeg';

const learningDevelopmentHeroImg = '/assets/candidateSourcing-1.jpeg';
const learningDevelopmentDetailImg = '/assets/About_details-1.jpeg';

interface ContentGroup {
  groupTitle: string;
  items: string[];
}

interface ServiceDetailsPageProps {
  serviceType: 'executive-search' | 'recruitment-solution' | 'hr-consulting' | 'learning-development';
}

export function ServiceDetailsPage({ serviceType }: ServiceDetailsPageProps) {
  useEffect(() => {
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
  }, [serviceType]);

  let title = '';
  let description = '';
  let heroImg = '';
  let detailImg = '';
  let contentGroups: ContentGroup[] = [];

  switch (serviceType) {
    case 'executive-search':
      title = 'Executive Search';
      description =
        'Leadership shapes the future of every business. Our Executive Search practice specializes in identifying, assessing, and attracting senior executives who possess the expertise, vision, and leadership capabilities needed to accelerate organizational growth.';
      heroImg = executiveSearchHeroImg;
      detailImg = executiveSearchDetailImg;
      contentGroups = [
        {
          groupTitle: 'Why Our Executive Search?',
          items: [
            'Confidential Hiring',
            'Leadership Assessment',
            'Executive Market Mapping',
            'Industry Expertise',
            'Comprehensive Candidate Evaluation',
          ],
        },
      ];
      break;

    case 'recruitment-solution':
      title = 'Recruitment Solutions';
      description =
        'Recruitment is about building teams that contribute to long-term business success. Our Recruitment Solutions help organizations hire permanent, contractual, and project-based professionals across diverse industries.';
      heroImg = recruitmentSolutionHeroImg;
      detailImg = recruitmentSolutionDetailImg;
      contentGroups = [
        {
          groupTitle: 'Positions We Recruit',
          items: [
            'Chief Executive Officers (CEO)',
            'Chief Financial Officers (CFO)',
            'Chief Operating Officers (COO)',
            'Chief Human Resources Officers (CHRO)',
            'Directors',
            'General Managers',
            'Functional Heads',
          ],
        },
      ];
      break;

    case 'hr-consulting':
      title = 'HR Consulting';
      description =
        'Strong organizations are built on strong HR foundations. Our HR consulting services help businesses optimize their workforce through practical, scalable, and business-focused HR strategies.';
      heroImg = hrConsultingHeroImg;
      detailImg = hrConsultingDetailImg;
      contentGroups = [
        {
          groupTitle: 'Services Include',
          items: [
            'HR Strategy',
            'Organizational Development',
            'HR Policies & Procedures',
            'Job Evaluation & Descriptions',
            'Performance Management Systems',
            'Compensation Benchmarking',
            'Workforce Planning',
            'HR Audits',
          ],
        },
      ];
      break;

    case 'learning-development':
      title = 'Learning & Development';
      description =
        'Investing in people is investing in business success. Our customized learning solutions help organizations strengthen leadership capabilities, improve employee performance, and prepare teams for future challenges.';
      heroImg = learningDevelopmentHeroImg;
      detailImg = learningDevelopmentDetailImg;
      contentGroups = [
        {
          groupTitle: 'Training Programs',
          items: [
            'Leadership Development',
            'Team Building',
            'Communication Skills',
            'Emotional Intelligence',
            'Performance Coaching',
            'Conflict Resolution',
            'Manager Development',
            'Interview Skills',
          ],
        },
      ];
      break;

    default:
      title = 'Our Services';
      description =
        'Our comprehensive talent solutions help organizations attract, assess, hire, and develop professionals who create measurable business value.';
      heroImg = recruitmentSolutionHeroImg;
      detailImg = recruitmentSolutionDetailImg;
  }

  return (
    <div className="pt-24 pb-12 bg-[#f8fafc]">
      {/* Top Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <AnimatedHeading
            text={title}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-[#011c30] tracking-tight leading-[1.1] mb-6 text-center"
            as="h1"
          />

          <p className="text-slate-600 font-sans text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 text-center">
            {description}
          </p>

          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-100 mb-12">
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              style={{ originX: 1 }}
              className="absolute inset-0 bg-[#0b132a] z-10"
            />
            <motion.img
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
              src={heroImg}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Existing Layout Split Section (Image on Left, Content on Right) */}
      <section className="relative py-16 sm:py-24 bg-[#f8fafc] overflow-hidden border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -30 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: false, margin: '-10% 0px' }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl aspect-[4/3] w-full overflow-hidden shadow-xl border border-slate-200/50 bg-[#0b132a] relative flex items-center justify-center"
              >
                <img
                  src={detailImg}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Right Side Content Groups replacing Case Study */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <StaggerContainer className="flex flex-col gap-8 w-full">
                {contentGroups.map((group, groupIdx) => (
                  <StaggerItem key={groupIdx} direction="up" className="w-full">
                    <div className="bg-white border border-slate-200/70 rounded-3xl p-6 sm:p-7 shadow-sm">
                      <h3 className="text-[#011c30] font-bold font-display text-xl sm:text-2xl mb-4 flex items-center gap-2.5 pb-3 border-b border-slate-100">
                        {groupIdx === 0 ? (
                          <Briefcase size={22} className="text-blue-600 shrink-0" />
                        ) : (
                          <Award size={22} className="text-amber-500 shrink-0" />
                        )}
                        {group.groupTitle}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {group.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/70 hover:bg-blue-50/50 border border-slate-100 transition-colors"
                          >
                            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                            <span className="text-slate-700 font-sans font-medium text-xs sm:text-sm">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      <Vacancies />
      <Contact />
    </div>
  );
}
