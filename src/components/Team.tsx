import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, X, CheckCircle } from "lucide-react";
import {
  AnimatedHeading,
  AnimatedParagraph,
} from "./animations";
import { TeamMember } from "../types";

const teamMohsin = '/assets/team-mohsin.jpeg';
const teamShoaib = '/assets/team-shoaib.jpeg';
const teamSaima = '/assets/Team-1-1.jpeg';
const team2 = '/assets/Team-2-1.jpeg';
const team3 = '/assets/Team-3-1.jpeg';

interface ExtendedTeamMember extends TeamMember {
  quote: string;
  qualification?: string;
  company?: string;
  placeholderInitials?: string;
}

export function Team() {
  const [activeId, setActiveId] = useState<string>("1");
  const [selectedMember, setSelectedMember] = useState<ExtendedTeamMember | null>(null);

  const team: ExtendedTeamMember[] = [
    {
      id: "1",
      name: "Mohsin",
      role: "Director Operations",
      qualification: "MBA in Marketing",
      image: teamMohsin,
      bgColor: "bg-gradient-to-b from-blue-500/90 to-blue-700/95",
      quote: "Overseeing operations and client partnerships with a focus on delivering high-impact recruitment and executive search solutions. We bridge the gap between organizational ambitions and exceptional leadership talent across diverse industries.",
    },
    {
      id: "2",
      name: "Shoaib Ahmed Zafar",
      role: "Sr Manager Technical Recruitment and Accounts",
      image: teamShoaib,
      bgColor: "bg-gradient-to-b from-indigo-500/90 to-indigo-700/95",
      quote: "Leading specialized technical talent acquisition and strategic account management. We help businesses build robust engineering and technology teams that accelerate innovation and organizational growth.",
    },
    {
      id: "3",
      name: "Saima Yasir",
      role: "Manager Business Operations",
      image: teamSaima,
      bgColor: "bg-gradient-to-b from-cyan-500/90 to-cyan-700/95",
      quote: "Optimizing business operations and streamlining recruitment workflows to drive organizational growth. Committed to delivering seamless management and high-quality outcomes for our clients and team.",
    },
    {
      id: "4",
      name: "Amna Jamal",
      role: "HR Officer",
      image: team2,
      bgColor: "bg-gradient-to-b from-rose-400/90 to-rose-600/95",
      quote: "Passionate about connecting exceptional talent with the right opportunities. Being part of Bucks n Bricks has strengthened my expertise in recruitment, talent management, and delivering meaningful solutions for both clients and candidates.",
    },
    {
      id: "5",
      name: "Aiman Farooqui",
      role: "HR Officer",
      image: team3,
      bgColor: "bg-gradient-to-b from-teal-400/90 to-teal-600/95",
      quote: "Collaborating with diverse clients across multiple industries has strengthened my ability to understand unique hiring requirements and deliver quality talent within dynamic business environments.",
    },
  ];

  return (
    <section
      id="team"
      className="relative py-20 sm:py-28 bg-[#f8fafc] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-4 text-center w-full"
          >
            <span className="text-[11px] font-bold text-slate-800 font-sans tracking-tight uppercase block text-center">
              Our Professionals
            </span>
          </motion.div>

          <div className="w-full text-center flex justify-center">
            <AnimatedHeading
              text="Meet Our Team"
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-none mb-4 text-center block w-full mx-auto"
            />
          </div>

          <AnimatedParagraph className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed text-center mx-auto">
            The skilled HR experts behind our innovative services, helping you
            manage, hire, and scale with ease. Click any member to view their details.
          </AnimatedParagraph>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-3 max-w-6xl mx-auto min-h-[440px] md:h-[440px]">
          {team.map((member) => {
            const isActive = activeId === member.id;

            const flexClass = isActive
              ? "md:flex-[2.5] flex-[2.0]"
              : "md:flex-[0.6] flex-[0.5]";

            return (
              <motion.div
                key={member.id}
                layout
                style={{ willChange: 'flex-grow, transform' }}
                onMouseEnter={() => setActiveId(member.id)}
                onClick={() => setSelectedMember(member)}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 24,
                }}
                className={`relative rounded-3xl overflow-hidden shadow-lg border border-slate-100/50 cursor-pointer transition-all duration-300 flex flex-col justify-between p-6 ${flexClass} ${member.bgColor}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:10px_10px] mix-blend-overlay" />

                <div className="absolute inset-0 z-0">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover brightness-95 contrast-[1.02] transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-950 relative overflow-hidden">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                        <span className="text-3xl sm:text-4xl font-bold font-display tracking-widest text-purple-200 select-none">
                          {member.placeholderInitials || "MZA"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col text-left h-full justify-end">
                  <div className="flex flex-col items-start gap-1 pb-2">
                    <motion.h4
                      layout="position"
                      style={{ color: "#89C7F5" }}
                      className={`font-bold font-display tracking-tight leading-tight ${
                        isActive
                          ? "text-2xl sm:text-3xl md:text-4xl"
                          : "text-sm md:text-base"
                      }`}
                    >
                      {member.name}
                    </motion.h4>
                    <p className="text-white/90 font-sans text-xs sm:text-sm font-semibold">
                      {member.role}
                    </p>
                    {member.qualification && (
                      <p className="text-sky-200/90 font-sans text-[11px] sm:text-xs font-medium">
                        {member.qualification}
                      </p>
                    )}
                    {member.company && (
                      <p className="text-purple-200/90 font-sans text-[11px] sm:text-xs font-medium">
                        {member.company}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors duration-300 bg-black/20 backdrop-blur-sm p-2 rounded-full">
                  <User size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
              >
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-5 relative bg-[#0b132a] min-h-[260px] md:min-h-full flex flex-col justify-end p-6">
                    {selectedMember.image ? (
                      <img
                        src={selectedMember.image}
                        alt={selectedMember.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/90 to-slate-950 p-6">
                        <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                          <span className="text-4xl font-bold font-display text-purple-200 tracking-widest">
                            {selectedMember.placeholderInitials || "MZA"}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="relative z-10 text-white">
                      <h3 style={{ color: "#89C7F5" }} className="text-2xl font-bold font-display mb-1">
                        {selectedMember.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-200">
                        {selectedMember.role}
                      </p>
                      {selectedMember.qualification && (
                        <p className="text-xs font-medium text-sky-200 mt-0.5">
                          {selectedMember.qualification}
                        </p>
                      )}
                      {selectedMember.company && (
                        <p className="text-xs font-medium text-purple-200/90 mt-0.5">
                          {selectedMember.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between text-left">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                        Team Member Profile
                      </span>
                      
                      <h4 className="text-lg font-bold font-display text-[#011c30] mb-3">
                        About & Statement
                      </h4>

                      <blockquote className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed italic border-l-2 border-blue-500 pl-3 py-1">
                        "{selectedMember.quote}"
                      </blockquote>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
                      <span className="flex items-center gap-1">
                        <CheckCircle size={14} className="text-emerald-500" /> Dedicated HR Specialist
                      </span>
                      <span className="font-semibold text-slate-700">Bucks n Bricks</span>
                    </div>
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