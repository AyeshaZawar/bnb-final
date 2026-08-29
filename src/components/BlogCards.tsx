import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Calendar, ArrowUpRight, X, BookOpen, Clock } from 'lucide-react';
import { AnimatedHeading, AnimatedParagraph } from './animations';
import { BlogPost } from '../types';

const blogImg1 = '/assets/blogImg1-1.jpg';
const blogImg2 = '/assets/Prometeo y Fiskil impulsan la implementación de Open Finance en Latinoamérica-1.jpg';
const blogImg3 = '/assets/blogImg3-1.jpg';

export interface DetailedBlogPost extends BlogPost {
  content: string[];
}

export const PDF_BLOG_POSTS: DetailedBlogPost[] = [
  {
    id: '1',
    category: 'Trends & Tech',
    date: 'August 2026',
    title: 'The Future of Recruitment: Trends Shaping Talent Acquisition',
    image: blogImg1,
    content: [
      "The recruitment landscape is evolving faster than ever before. Organizations are no longer competing solely on products and services, they are competing for talent. As workforce expectations shift and technology continues to transform hiring practices, businesses must rethink how they attract, engage, and retain exceptional professionals.",
      "Artificial Intelligence (AI) has become an integral part of modern recruitment. From resume screening and candidate sourcing to interview scheduling and predictive analytics, AI enables recruiters to make hiring more efficient while allowing them to focus on building meaningful relationships with candidates. However, technology should enhance not replace the human element of recruitment. Successful hiring still depends on understanding people, culture, and organizational fit.",
      "Another significant shift is the move toward skills-based hiring. Rather than focusing exclusively on degrees or years of experience, employers are increasingly evaluating candidates based on practical skills, adaptability, and their ability to contribute to business goals. This approach broadens talent pools and promotes more inclusive hiring practices.",
      "Candidate experience has also become a key differentiator. Top professionals often have multiple opportunities available, making communication, transparency, and a seamless hiring journey essential. Organizations that provide timely feedback and a positive recruitment experience strengthen their employer brand and improve offer acceptance rates.",
      "At Bucks n Bricks, we believe the future of recruitment lies in combining innovative technology with strategic human expertise. Organizations that embrace modern hiring practices while maintaining a people-first approach will be best positioned to attract and retain exceptional talent."
    ]
  },
  {
    id: '2',
    category: 'Executive Search',
    date: 'August 2026',
    title: 'Executive Search vs. Traditional Recruitment: Which Is Right for Your Business?',
    image: blogImg2,
    content: [
      "Every hiring requirement is unique, and selecting the right recruitment approach can significantly influence business success. While traditional recruitment is ideal for many operational and mid-level positions, executive search is specifically designed for leadership and highly specialized roles.",
      "Traditional recruitment focuses on attracting active job seekers through job advertisements, databases, and professional networks. It is an efficient solution for organizations looking to fill vacancies within a relatively short timeframe.",
      "Executive search, on the other hand, is a highly strategic and confidential process. It involves identifying, approaching, and engaging senior professionals who are often not actively seeking new opportunities. These individuals require a personalized and consultative approach that goes beyond conventional hiring methods.",
      "Leadership appointments directly influence organizational culture, business strategy, employee engagement, and long-term growth. A poor executive hiring decision can have substantial financial and operational consequences. This is why executive search emphasizes market research, leadership assessment, cultural alignment, and long-term organizational fit.",
      "At Bucks n Bricks, we partner closely with organizations to understand not only the role but also the strategic objectives behind every leadership appointment. Our executive search process is designed to identify professionals who can create sustainable business impact."
    ]
  },
  {
    id: '3',
    category: 'Hiring Strategy',
    date: 'August 2026',
    title: 'Building High-Performance Teams Starts with Strategic Hiring',
    image: blogImg3,
    content: [
      "Behind every successful organization is a team of individuals working toward a shared vision. Building these teams requires more than simply filling vacancies it requires strategic hiring.",
      "Strategic hiring begins with understanding business objectives. Organizations should evaluate not only the technical requirements of a role but also the qualities, behaviours, and leadership capabilities that contribute to long-term success.",
      "Cultural alignment plays an equally important role. Employees who share an organization's values are more likely to remain engaged, collaborate effectively, and contribute positively to workplace culture. Recruitment decisions should therefore consider both competence and compatibility.",
      "Investing time in structured interviews, comprehensive assessments, and thoughtful onboarding significantly improves employee retention and performance. Organizations that prioritize quality over speed often experience lower turnover rates and stronger business outcomes.",
      "At Bucks n Bricks, we believe recruitment is an investment rather than an expense. Every successful placement contributes to stronger teams, improved productivity, and sustainable organizational growth."
    ]
  },
  {
    id: '4',
    category: 'Employer Brand',
    date: 'August 2026',
    title: 'Why Employer Branding Matters More Than Ever',
    image: '/assets/blogImg4-1.jpg',
    content: [
      "Today's professionals evaluate employers just as carefully as employers evaluate candidates. An organization's reputation, culture, leadership, and employee experience have become critical factors in attracting top talent.",
      "Employer branding represents how an organization is perceived as a workplace. A strong employer brand communicates purpose, values, career growth opportunities, and a positive work environment.",
      "Candidates increasingly research organizations through websites, social media platforms, employee reviews, and professional networks before applying. A compelling employer brand creates trust, increases application quality, and reduces recruitment costs.",
      "Employer branding also extends beyond recruitment. Organizations with strong workplace cultures experience higher employee engagement, stronger retention rates, and greater advocacy from existing employees.",
      "Building a strong employer brand requires consistency across every employee touchpoint—from recruitment and onboarding to learning, recognition, and career development.",
      "At Bucks n Bricks, we help organizations strengthen their employer brand by creating recruitment experiences that reflect professionalism, transparency, and organizational values."
    ]
  },
  {
    id: '5',
    category: 'Best Practices',
    date: 'August 2026',
    title: 'Reducing Hiring Mistakes: Best Practices for Smarter Recruitment',
    image: '/assets/blogImg5-1.jpg',
    content: [
      "Hiring the wrong person can be costly not only financially but also in terms of productivity, team morale, and business performance. Fortunately, many hiring mistakes can be avoided through a structured recruitment process.",
      "The foundation of successful hiring begins with a clearly defined role. Organizations should establish responsibilities, expectations, required competencies, and success indicators before initiating recruitment.",
      "Structured interviews provide a more objective method of evaluating candidates than informal conversations. Combining behavioural questions, competency-based assessments, and practical evaluations allows hiring managers to make better informed decisions.",
      "Reference checks and background verification provide additional confidence before extending an offer. Equally important is maintaining timely communication throughout the recruitment process, ensuring candidates remain engaged and informed.",
      "Finally, recruitment should not end with the offer letter. Effective onboarding plays a vital role in helping new employees integrate into the organization and perform successfully from the beginning.",
      "At Bucks n Bricks, our recruitment methodology is built around careful evaluation, market expertise, and strategic partnerships, enabling organizations to make confident hiring decisions that support long-term success."
    ]
  },
  {
    id: '6',
    category: 'Leadership',
    date: 'August 2026',
    title: 'The Skills Every Future Leader Needs',
    image: '/assets/blogImg6-1.jpg',
    content: [
      "Leadership has evolved significantly in today's dynamic business environment. Technical expertise alone is no longer sufficient. Future leaders must combine business knowledge with emotional intelligence, adaptability, and strategic thinking.",
      "One of the most valuable leadership qualities is emotional intelligence. Leaders who understand and manage emotions effectively build stronger relationships, inspire teams, and navigate challenges with confidence.",
      "Adaptability is equally important. Organizations continue to experience rapid technological advancement, changing workforce expectations, and evolving market conditions. Leaders must embrace change while guiding their teams through uncertainty.",
      "Communication remains at the heart of effective leadership. Clear communication fosters trust, alignment, collaboration, and accountability throughout an organization.",
      "Future leaders also prioritize continuous learning. They remain curious, seek feedback, and invest in developing both themselves and their teams.",
      "At Bucks n Bricks, we believe leadership is not simply about managing people it's about inspiring growth, creating opportunities, and driving meaningful organizational success. By investing in leadership development today, organizations build the resilience and capability needed to thrive tomorrow."
    ]
  }
];

const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };

const popUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.92,
  },
  visible: (index: number) => ({
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 70,
      damping: 16,
      mass: 0.8,
      delay: index * 0.12,
    } 
  }),
};

const BlogCardInner: React.FC<{ post: DetailedBlogPost; index: number; onSelect: (post: DetailedBlogPost) => void }> = ({ post, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const moveX = useTransform(x, [-100, 100], [-8, 8]);
  const moveY = useTransform(y, [-100, 100], [-8, 8]);
  const rotateY = useTransform(x, [-100, 100], [-3, 3]);

  const imageX = useSpring(moveX, springConfig);
  const imageY = useSpring(moveY, springConfig);
  const cardRotateY = useSpring(rotateY, springConfig);

  const imageScale = useMotionValue(1);
  const smoothScale = useSpring(imageScale, springConfig);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    imageScale.set(1.06);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current && cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
    if (!rectRef.current) return;
    const rect = rectRef.current;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
    imageScale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
      variants={popUpVariants}
      style={{ rotateY: cardRotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(post)}
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: '0 20px 35px rgba(0,0,0,0.06), 0 10px 15px rgba(0,0,0,0.03)',
      }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/90 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer [will-change:transform,opacity]"
    >
      <div className="relative aspect-[1.5] w-full overflow-hidden bg-[#0b132a] shrink-0 flex items-center justify-center">
        <motion.img
          src={post.image}
          alt={post.title}
          style={{
            x: imageX,
            y: imageY,
            scale: smoothScale,
          }}
          className="w-full h-full object-cover origin-center"
        />
        <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-widest text-slate-800 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded">
          {post.category}
        </span>
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-4">
        <div className="flex items-center gap-1.5 text-slate-400 font-sans text-[11px] font-semibold">
          <Calendar size={13} />
          <span>{post.date}</span>
        </div>

        <h4 className="text-[#011c30] font-bold font-display text-base sm:text-lg leading-snug group-hover:text-blue-600 transition-colors flex-1">
          {post.title}
        </h4>

        <div className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold tracking-wider uppercase mt-2 group-hover:translate-x-1.5 transition-transform duration-200">
          <span>Read Article</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export function BlogCards() {
  const [selectedPost, setSelectedPost] = useState<DetailedBlogPost | null>(null);

  // First 3 for homepage grid
  const blogPosts = PDF_BLOG_POSTS.slice(0, 3);

  return (
    <section id="blog" className="relative py-20 sm:py-28 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="mb-4 text-center"
          >
            <span className="text-[11px] font-bold text-slate-800 font-sans tracking-tight uppercase">
              Latest Insights
            </span>
          </motion.div>
          
          <AnimatedHeading
            text="Complete HR Solutions & Blog"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-none mb-4 text-center"
          />
          <AnimatedParagraph className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed">
            Stay updated with cutting-edge HR trends, tech insights, and automated operations advice from experts.
          </AnimatedParagraph>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto py-4">
          {blogPosts.map((post, index) => (
            <BlogCardInner key={post.id} post={post} index={index} onSelect={(p) => setSelectedPost(p)} />
          ))}
        </div>

        {/* Blog Article Reader Modal */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col"
              >
                {/* Header Banner */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
                  >
                    <X size={18} />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 text-white z-10 text-left">
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-slate-900 bg-white px-3 py-1 rounded-md mb-3">
                      {selectedPost.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display leading-tight mb-2" style={{ color: '#89C7F5' }}>
                      {selectedPost.title}
                    </h2>
                    <div className="flex items-center gap-4 text-xs text-slate-300 font-sans">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-sky-400" /> {selectedPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-sky-400" /> 3 min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 sm:p-10 overflow-y-auto text-left space-y-6">
                  {selectedPost.content.map((paragraph, idx) => (
                    <p key={idx} className="text-slate-700 font-sans text-sm sm:text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <BookOpen size={14} className="text-blue-600" /> Published by Bucks n Bricks
                    </span>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Close Article
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
