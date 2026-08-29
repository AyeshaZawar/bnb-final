
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Calendar, ArrowUpRight, X, BookOpen, Clock } from 'lucide-react';
import { JourneyTimeline } from './JourneyTimeline';
import { Contact } from './Contact';
import { AnimatedHeading, AnimatedParagraph } from './animations';
import { PDF_BLOG_POSTS, DetailedBlogPost } from './BlogCards';

const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };

const cardEntranceVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.94,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
      mass: 0.8,
      delay: index * 0.1,
    },
  }),
};

const BlogCard: React.FC<{ post: DetailedBlogPost; index: number; onSelect: (post: DetailedBlogPost) => void }> = ({ post, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const moveX = useTransform(x, [-120, 120], [-10, 10]);
  const moveY = useTransform(y, [-120, 120], [-10, 10]);
  const rotateY = useTransform(x, [-120, 120], [-5, 5]);
  const rotateX = useTransform(y, [-120, 120], [5, -5]);

  const imageX = useSpring(moveX, springConfig);
  const imageY = useSpring(moveY, springConfig);
  const cardRotateX = useSpring(rotateX, springConfig);
  const cardRotateY = useSpring(rotateY, springConfig);

  const imageScale = useMotionValue(1);
  const smoothScale = useSpring(imageScale, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseEnter = () => {
    imageScale.set(1.08);
  };

  const handleMouseLeave = () => {
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
      viewport={{ once: false, margin: '-40px' }}
      variants={cardEntranceVariants}
      style={{
        rotateX: cardRotateX,
        rotateY: cardRotateY,
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(post)}
      whileHover={{
        scale: 1.02,
        y: -10,
        boxShadow: '0 24px 40px rgba(0,0,0,0.06), 0 12px 20px rgba(0,0,0,0.03)',
      }}
      className="group bg-white rounded-[24px] overflow-hidden border border-slate-100/90 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer [will-change:transform,opacity]"
    >
      <div className="relative aspect-[1.4] w-full overflow-hidden bg-slate-100 shrink-0">
        <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

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
        <span className="absolute top-4 left-4 z-20 text-[10px] font-extrabold uppercase tracking-widest text-slate-800 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
          {post.category}
        </span>
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-slate-400 font-sans text-[11px] font-semibold mb-2">
            <Calendar size={13} className="text-blue-500" />
            <span>{post.date}</span>
          </div>

          <h4 className="text-[#011c30] font-bold font-display text-base sm:text-lg leading-snug group-hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold tracking-wider uppercase mt-2 group-hover:translate-x-1.5 transition-transform duration-200">
          <span>Read Article</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </div>
      </div>
    </motion.div>
  );
};

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<DetailedBlogPost | null>(null);

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
  }, []);

  const featuredPost = PDF_BLOG_POSTS[4]; // Featured post (Blog 5)
  const latestInsights = PDF_BLOG_POSTS;

  return (
    <div className="pt-24 pb-12 bg-[#f8fafc]">
      {/* 1. Our Blogs - Title & Featured Hero Card */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <AnimatedHeading
              text="Our Blogs"
              className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-[#011c30] tracking-tight text-center"
            />
          </div>

          {/* Featured Horizontal Card */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setSelectedPost(featuredPost)}
            className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-950/5 grid grid-cols-1 md:grid-cols-12 gap-0 group cursor-pointer"
          >
            <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-[#0b132a] min-h-[250px] md:min-h-[380px] flex items-center justify-center">
              <motion.img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-center items-start text-left bg-white relative">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-white bg-[#0b1c24] px-3.5 py-1.5 rounded-lg mb-6 shadow-sm">
                Featured Blog
              </span>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#011c30] leading-tight mb-4 group-hover:text-blue-500 transition-colors duration-200">
                {featuredPost.title}
              </h3>

              <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                {featuredPost.content[0]}
              </p>

              <div className="flex items-center gap-2 text-blue-600 font-bold font-sans text-xs sm:text-sm uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-200 mt-2">
                <span>Read Feature</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Latest Insights Grid Section */}
      <section className="relative py-16 sm:py-24 bg-white border-t border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <AnimatedHeading
              text="Latest Insights"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight text-center"
            />
            <AnimatedParagraph className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed mt-4">
              Explore our fresh, hand-picked insights detailing modern workforce automation strategies, performance optimization, and leadership development guidelines.
            </AnimatedParagraph>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto py-4">
            {latestInsights.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} onSelect={(p) => setSelectedPost(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* Article Modal Reader */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col"
            >
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

      <JourneyTimeline />
      <Contact />
    </div>
  );
}

