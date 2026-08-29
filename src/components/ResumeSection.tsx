
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Star, Rocket, Sparkles, ChevronRight, Upload, Loader2, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';
import { AnimatedHeading, AnimatedParagraph, AnimatedButton } from './animations';
import { scoreMyResume } from '../services/api';

const client1 = '/assets/client_1-1.jpg';
const client2 = '/assets/client2-1.jpg';
const client3 = '/assets/client3-1.jpg';

export function ResumeSection() {
  const [triggerSequence, setTriggerSequence] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [atsResult, setAtsResult] = useState<{ atsScore: string; resumeFileName: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    // Automatically trigger the animation sequence when section mounts or is viewed
    setTriggerSequence(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
      setAtsResult(null);
    }
  };

  const handleScoreResume = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a PDF or Word document first.');
      return;
    }
    setIsScoring(true);
    setErrorMessage(null);
    try {
      const data = await scoreMyResume(selectedFile);
      setAtsResult({ atsScore: data.atsScore, resumeFileName: data.record.resumeFileName });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsScoring(false);
    }
  };

  // Rocket keyframe tracing the arc connecting Resume A (left) to Resume B (right)
  const rocketAnimation = {
    initial: { opacity: 0, scale: 0, x: -160, y: 40, rotate: 0 },
    animate: triggerSequence ? {
      opacity: [0, 1, 1, 1, 0.9, 1],
      scale: [0, 1.1, 1, 1, 1, 1],
      // Arc coordinates relative to the center of the double-card container
      x: [-160, -80, 0, 80, 160],
      y: [40, -100, -140, -60, -96],
      rotate: [20, -10, -20, 20, 45],
      transition: {
        duration: 1.5,
        delay: 2.0, // Begins after arrow drawing starts/completes
        ease: 'easeInOut',
      }
    } : {},
  };

  return (
    <section id="resume" className="relative py-20 sm:py-28 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Badge styled as plain text exactly like screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            style={{ willChange: 'transform, opacity' }}
            className="mb-4 text-left"
          >
            <span className="text-[11px] font-bold text-slate-800 font-sans tracking-tight">
              AI Resume Checker.
            </span>
          </motion.div>

          {/* Heading */}
          <AnimatedHeading
            text="Is Your Resume Market-Ready?"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-tight mb-6"
          />

          {/* Bullet Points / Text Blocks */}
          <div className="flex flex-col gap-5 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              style={{ willChange: 'transform, opacity' }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 text-slate-900 font-sans text-sm sm:text-base font-bold"
            >
              <span>✓</span>
              <span>Get a Professional Review Instantly.</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              style={{ willChange: 'transform, opacity' }}
              transition={{ delay: 0.4 }}
              className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed max-w-md"
            >
              Get expert-level insights powered by AI – and elevate your resume to industry standards.
            </motion.p>
          </div>

          {/* Button in mixed/lowercase case exactly like screenshot */}
          <div className="w-full mb-8">
            {!showUploader ? (
              <AnimatedButton
                onClick={() => setShowUploader(true)}
                className="bg-[#052842] hover:bg-white hover:text-[#052842] border border-[#052842] text-white font-sans text-xs font-bold py-3 px-6 rounded-full shadow-lg transition-all uppercase tracking-wide cursor-pointer flex items-center gap-2"
              >
                <Sparkles size={16} className="text-amber-300" />
                score my Resume Now
              </AnimatedButton>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 w-full max-w-md shadow-inner space-y-4 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    Upload Resume for AI Scoring
                  </h4>
                  <button
                    onClick={() => { setShowUploader(false); setSelectedFile(null); setAtsResult(null); setErrorMessage(null); }}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X size={14} /> Close
                  </button>
                </div>

                {!atsResult ? (
                  <>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 cursor-pointer bg-white transition-colors text-center">
                      <Upload size={24} className="text-blue-500 mb-2" />
                      <span className="text-xs font-bold text-slate-700">
                        {selectedFile ? selectedFile.name : 'Click or Drag PDF/Word file here'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">Supports .PDF, .DOC, .DOCX (Max 10MB)</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      onClick={handleScoreResume}
                      disabled={!selectedFile || isScoring}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        !selectedFile || isScoring
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-[#052842] hover:bg-blue-900 text-white shadow-md cursor-pointer'
                      }`}
                    >
                      {isScoring ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-blue-400" />
                          Analyzing with Gemini ATS...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="text-amber-300" />
                          Calculate ATS Score Now
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="bg-white border border-emerald-200 rounded-xl p-5 text-center space-y-3 shadow-sm animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={26} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Resume Evaluated Successfully!</h5>
                      <p className="text-xs text-slate-500 truncate max-w-[280px] mx-auto mt-0.5">{atsResult.resumeFileName}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI ATS Match Score</div>
                      <div className="text-3xl font-extrabold text-emerald-600 font-display mt-1">{atsResult.atsScore}%</div>
                    </div>
                    <button
                      onClick={() => { setSelectedFile(null); setAtsResult(null); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      Analyze Another Resume
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center gap-3.5"
          >
            {/* Avatar Stack */}
            <div className="flex -space-x-2.5">
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                src={client1}
                alt="Client 1"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                src={client2}
                alt="Client 2"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                src={client3}
                alt="Client 3"
              />
            </div>
            
            <div className="flex flex-col text-left">
              <div className="flex gap-0.5 text-slate-800">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-current text-slate-800" />
                ))}
              </div>
              <span className="text-slate-500 font-sans text-[10px] sm:text-[11px] font-bold mt-0.5 leading-tight">
                45,000+ resumes<br />checked
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Collateral: Dual Resume overlapping stack with Rocket path */}
        <div className="lg:col-span-7 flex justify-center items-center w-full mt-12 lg:mt-0 overflow-visible">
          {/* Group wrapper that scales down proportionally on smaller screens, keeping elements together in pristine alignment */}
          <div className="relative w-[540px] h-[460px] shrink-0 scale-[0.58] xs:scale-[0.72] sm:scale-[0.88] md:scale-100 origin-center transition-all duration-300 my-[-85px] xs:my-[-45px] sm:my-[-20px] md:my-0">
            
            {/* Blue Dot Grid Decoration sitting under bottom-left of Resume A */}
            <div 
              className="absolute z-0"
              style={{ left: '5px', bottom: '35px', width: '90px', height: '90px' }}
            >
              <div className="w-full h-full bg-[radial-gradient(#3b82f6_2px,transparent_2px)] bg-[size:10px_10px] opacity-40" />
            </div>

            {/* RESUME A (Left/Back Card) */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[270px] h-[380px] left-[20px] top-[20px] bg-white rounded-2xl shadow-xl border border-slate-100/80 p-4 text-left text-[7.5px] text-slate-500 flex flex-col gap-2.5 z-10 overflow-hidden"
            >
              {/* Header: Jessica Pearson */}
              <div className="text-center pb-2 relative">
                {/* Light Green highlight behind "JESSICA PEARSON" */}
                <div className="absolute inset-x-2 top-0.5 bottom-1.5 bg-emerald-50/70 -z-10 rounded" />
                <h5 className="text-[#011c30] font-bold uppercase tracking-[0.2em] text-[11px] font-display">Jessica Pearson</h5>
                <p className="text-emerald-600 font-medium text-[6.5px] mt-0.5 tracking-wider">&lt; graphic designer &gt;</p>
              </div>
              
              {/* Two Column Layout inside Resume A */}
              <div className="grid grid-cols-2 gap-3 mt-1 overflow-hidden">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <div>
                    <h6 className="text-[#011c30] font-bold uppercase text-[7px] tracking-wider mb-1">About Me</h6>
                    <p className="leading-relaxed text-[6.5px] text-slate-400">
                      A graphic designer is a professional within the graphic design and graphic arts industry who assembles together images, typography, or motion graphics to create a piece of design.
                    </p>
                  </div>
                  
                  <div>
                    <h6 className="text-[#011c30] font-bold uppercase text-[7px] tracking-wider mb-1">Experience</h6>
                    <div className="flex flex-col gap-2 pl-1 ml-0.5">
                      {/* Job 1 */}
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-700 text-[6px]">2021</span>
                          <span className="text-[5.5px] text-slate-400">|</span>
                          <span className="font-semibold text-slate-600 text-[6px]">Enterprise Design Studio</span>
                        </div>
                        <p className="text-slate-400 text-[5.5px] font-medium leading-none mt-0.5">Senior Graphic Designer</p>
                        <ul className="list-disc pl-2 mt-1 text-[5px] text-slate-400 leading-tight flex flex-col gap-0.5">
                          <li>Worked to make graphics for offline and online.</li>
                          <li>Select external photos for clients and designers.</li>
                          <li>Organization of files.</li>
                        </ul>
                      </div>
                      {/* Job 2 */}
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-700 text-[6px]">2017</span>
                          <span className="text-[5.5px] text-slate-400">|</span>
                          <span className="font-semibold text-slate-600 text-[6px]">Enterprise Design Studio</span>
                        </div>
                        <p className="text-slate-400 text-[5.5px] font-medium leading-none mt-0.5">Senior Graphic Designer</p>
                        <ul className="list-disc pl-2 mt-1 text-[5px] text-slate-400 leading-tight flex flex-col gap-0.5">
                          <li>Worked to make graphics for offline and online.</li>
                          <li>Select external photos for clients and designers.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  <div>
                    <h6 className="text-[#011c30] font-bold uppercase text-[7px] tracking-wider mb-1">Education</h6>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <span className="font-bold text-slate-700 text-[6px]">2021</span>
                        <p className="text-slate-500 font-medium text-[6px] leading-none">MFA Fine Arts</p>
                        <p className="text-slate-400 text-[5.5px]">University College</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 text-[6px]">2017</span>
                        <p className="text-slate-500 font-medium text-[6px] leading-none">BFA Graphic Design</p>
                        <p className="text-slate-400 text-[5.5px]">University College</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-[#011c30] font-bold uppercase text-[7px] tracking-wider mb-1">Skills</h6>
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <div className="flex justify-between mb-0.5 text-[5.5px] text-slate-500">
                          <span>Graphic Design</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[85%] rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-0.5 text-[5.5px] text-slate-500">
                          <span>Illustration</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[70%] rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-0.5 text-[5.5px] text-slate-500">
                          <span>Photography</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[60%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RESUME B (Right/Front Card with left dark sidebar and right content panel) */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 60 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[280px] h-[380px] left-[200px] top-[60px] bg-white rounded-2xl shadow-2xl border border-slate-100/80 flex z-20 overflow-hidden"
            >
              {/* Left Sidebar (Dark navy) */}
              <div className="w-[95px] bg-[#1e293b] text-white p-3 flex flex-col gap-3 text-[6px]">
                {/* Avatar circle */}
                <div className="flex justify-center mt-0.5">
                  <img
                    className="w-9 h-9 rounded-full border border-slate-700 object-cover shadow-sm"
                    src={client2}
                    alt="Jessica Pearson"
                    
                  />
                </div>

                {/* Contact Block */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-400 uppercase text-[5.5px] tracking-wider border-b border-slate-700/50 pb-0.5">Contact</span>
                  <div className="flex flex-col gap-0.5 text-slate-300 leading-tight">
                    <p>+1 234 567 890</p>
                    <p className="break-all">jessica@email.com</p>
                    <p>New York, NY</p>
                  </div>
                </div>

                {/* Education Block */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-400 uppercase text-[5.5px] tracking-wider border-b border-slate-700/50 pb-0.5">Education</span>
                  <div className="flex flex-col gap-1 text-slate-300 leading-tight">
                    <div>
                      <p className="font-bold text-white text-[5.5px]">2019 - 2021</p>
                      <p className="text-slate-400 text-[5px]">Master Degree</p>
                      <p className="text-slate-300 text-[5px]">University College</p>
                    </div>
                    <div>
                      <p className="font-bold text-white text-[5.5px]">2015 - 2019</p>
                      <p className="text-slate-400 text-[5px]">Bachelor Degree</p>
                      <p className="text-slate-300 text-[5px]">University College</p>
                    </div>
                  </div>
                </div>

                {/* Expertise Block */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-400 uppercase text-[5.5px] tracking-wider border-b border-slate-700/50 pb-0.5">Expertise</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-1 py-0.5 rounded-[3px] text-[5px]">SEO</span>
                    <span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-1 py-0.5 rounded-[3px] text-[5px]">SEM</span>
                    <span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-1 py-0.5 rounded-[3px] text-[5px]">Growth</span>
                    <span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-1 py-0.5 rounded-[3px] text-[5px]">PPC</span>
                  </div>
                </div>

                {/* Language Block */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-400 uppercase text-[5.5px] tracking-wider border-b border-slate-700/50 pb-0.5">Language</span>
                  <div className="flex flex-col gap-0.5 text-slate-300">
                    <p>English</p>
                    <p>Spanish</p>
                  </div>
                </div>
              </div>

              {/* Right Panel (Content) */}
              <div className="flex-1 p-4 flex flex-col gap-2.5 text-left text-[6.5px] text-slate-500 overflow-hidden bg-white">
                {/* Name & Role */}
                <div>
                  <h4 className="text-[#011c30] font-bold text-[12px] font-display leading-tight">Jessica Pearson</h4>
                  <p className="text-slate-400 text-[6.5px] font-medium tracking-wider">Marketing Manager</p>
                </div>

                {/* Experience Block */}
                <div>
                  <h6 className="text-[#011c30] font-bold uppercase text-[6.5px] tracking-wider mb-1.5 border-b border-slate-100 pb-0.5">Experience</h6>
                  <div className="flex flex-col gap-2 relative border-l border-slate-100 pl-2 ml-1">
                    {/* Item 1 */}
                    <div className="relative">
                      <span className="absolute -left-[10.5px] top-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
                      <span className="font-bold text-slate-700 text-[6px]">2021 - 2022</span>
                      <p className="font-semibold text-slate-800 text-[6.5px]">Company Name | Job position here</p>
                      <p className="text-slate-400 text-[5.5px] leading-relaxed mt-0.5">
                        Directed digital marketing campaigns, oversaw SEO/SEM strategies, and increased online search visibility.
                      </p>
                    </div>
                    {/* Item 2 */}
                    <div className="relative">
                      <span className="absolute -left-[10.5px] top-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
                      <span className="font-bold text-slate-700 text-[6px]">2017 - 2021</span>
                      <p className="font-semibold text-slate-800 text-[6.5px]">Company Name | Job position here</p>
                      <p className="text-slate-400 text-[5.5px] leading-relaxed mt-0.5">
                        Developed creative marketing content, managed social channels, and increased click-through rates.
                      </p>
                    </div>
                    {/* Item 3 */}
                    <div className="relative">
                      <span className="absolute -left-[10.5px] top-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
                      <span className="font-bold text-slate-700 text-[6px]">2015 - 2017</span>
                      <p className="font-semibold text-slate-800 text-[6.5px]">Company Name | Job position here</p>
                      <p className="text-slate-400 text-[5.5px] leading-relaxed mt-0.5">
                        Collaborated with creative designers to produce high-impact visuals and analyzed user engagement.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reference Block */}
                <div>
                  <h6 className="text-[#011c30] font-bold uppercase text-[6.5px] tracking-wider mb-1 border-b border-slate-100 pb-0.5">Reference</h6>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>
                      <p className="font-semibold text-slate-700 text-[6px]">Name Surname</p>
                      <p className="text-[5px]">Job position here</p>
                      <p className="text-[5px]">Phone: +1 234 567 890</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-[6px]">Name Surname</p>
                      <p className="text-[5px]">Job position here</p>
                      <p className="text-[5px]">Phone: +1 234 567 890</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Curved Purple Arrow SVG with integrated Rocket Emoji */}
            <div className="absolute inset-0 pointer-events-none z-30">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 540 460" fill="none">
                <defs>
                  <marker
                    id="purple-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#8b5cf6" />
                  </marker>
                </defs>
                
                {/* Starting Dot aligned with arrow */}
                <circle cx="450" cy="230" r="5" fill="#8b5cf6" />
                
                {/* Curve starting from right of Resume B and curving up-right to rocket */}
                <motion.path
                  d="M 450 230 Q 520 210 520 130"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.0, delay: 0.8, ease: 'easeInOut' }}
                  markerEnd="url(#purple-arrow)"
                />

                {/* Rocket at the tip - using the rocket emoji 🚀 requested by the user */}
                <foreignObject x="495" y="65" width="60" height="60" className="overflow-visible">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 1.6, duration: 0.5, type: 'spring' }}
                    className="flex items-center justify-center w-full h-full transform -rotate-[15deg]"
                  >
                    <span className="text-[34px] select-none leading-none">🚀</span>
                  </motion.div>
                </foreignObject>
              </svg>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
