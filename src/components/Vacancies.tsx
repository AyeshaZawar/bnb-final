import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, Search, ArrowRight, Loader2 } from 'lucide-react';
import { AnimatedHeading, AnimatedParagraph } from './animations';
import { realVacancies } from '../data/realVacancies';

export function Vacancies({
  limit = 4,
  showDetails = false,
  onSelectJob,
}: {
  limit?: number;
  showDetails?: boolean;
  onSelectJob?: (jobId: string) => void;
}) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    async function fetchPublishedJobs() {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/jobs');
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.jobs && data.data.jobs.length > 0) {
            setJobs(data.data.jobs);
            return;
          }
        }
        // Fallback to realVacancies if backend is unavailable or returns no jobs
        setJobs(realVacancies);
      } catch (err) {
        console.error('Failed to fetch public jobs from API, using real vacancies dataset:', err);
        setJobs(realVacancies);
      } finally {
        setLoading(false);
      }
    }
    fetchPublishedJobs();
  }, []);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.97,
      filter: 'blur(4px)',
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      },
    }),
  };

  const filteredVacancies = jobs.filter((job) => {
    const title = job.jobTitle || job.company || '';
    const desc = job.description || '';
    const city = job.city || '';

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const displayedVacancies = filteredVacancies.slice(0, limit);

  const handleCardClick = (id: string) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    if (onSelectJob) {
      onSelectJob(id);
    } else {
      window.location.hash = `#job-${id}`;
    }
  };

  return (
    <section id="vacancies" className="relative py-20 sm:py-28 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <AnimatedHeading
            text="Top Open Vacancies"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight mb-4 text-center"
          />
          <AnimatedParagraph className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed">
            Discover your next opportunity. Explore available roles matching your experience and skill sets.
          </AnimatedParagraph>
        </motion.div>

        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
            <Loader2 size={28} className="animate-spin text-[#052842]" />
            <p className="text-xs text-slate-500 font-medium">Fetching active job listings...</p>
          </div>
        ) : displayedVacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {displayedVacancies.map((job, idx) => (
              <motion.div
                key={job._id || job.id}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: '-40px' }}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 20px 35px -10px rgba(5, 40, 66, 0.12)',
                  borderColor: 'rgba(5, 40, 66, 0.3)',
                  transition: { duration: 0.25, ease: 'easeOut' },
                }}
                onClick={() => handleCardClick(job._id || job.id)}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 flex flex-col justify-between text-left relative overflow-hidden group cursor-pointer [will-change:transform,opacity] transition-colors duration-200"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#89c7f5] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#89c7f5]/15 text-[#89c7f5] rounded-xl group-hover:bg-[#89c7f5] group-hover:text-white transition-colors duration-300">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h3 className="text-[#011c30] font-bold font-display text-base sm:text-lg group-hover:text-[#011c30] transition-colors duration-200">
                          {job.jobTitle || job.company}
                        </h3>
                        {job.companyName && (
                          <p className="text-xs text-slate-400 font-medium">{job.companyName}</p>
                        )}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#89c7f5] bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shrink-0">
                      <MapPin size={12} className="text-[#89c7f5]" />
                      {job.city}
                    </span>
                  </div>

                  <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-[#89c7f5] group-hover:translate-x-1 transition-transform duration-200">
                  <span className="text-[#89c7f5]">View Details & Apply</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 max-w-xl mx-auto">
            <p className="text-slate-600 font-sans text-sm">No active open vacancies available right now.</p>
          </div>
        )}

      </div>
    </section>
  );
}