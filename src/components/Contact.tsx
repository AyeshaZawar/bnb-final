
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import { AnimatedHeading, AnimatedParagraph, AnimatedButton, StaggerContainer, StaggerItem } from './animations';
import { submitContactMessage } from '../services/api';
const professionalHandshake = '/assets/Contact-1.jpeg';

export function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await submitContactMessage(formData);
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', phoneNumber: '', subject: '', message: '' });
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-[#ffffff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Copy and Form (Form slides upward) */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full mb-6"
          >
            <Sparkles size={13} className="text-blue-600 fill-blue-100" />
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-widest font-sans">
              Get in Touch
            </span>
          </motion.div>

          <AnimatedHeading
            text="Contact Us"
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#011c30] tracking-tight leading-none mb-4"
          />

          <h3
            className="text-xl sm:text-2xl font-bold font-display mb-3"
            style={{ color: '#89C7F5' }}
          >
            Let's Build Exceptional Teams Together
          </h3>

          <div className="text-slate-500 font-sans text-sm sm:text-base leading-relaxed mb-8 max-w-lg space-y-3">
            <p>
              Whether you're looking to hire top talent, strengthen your workforce strategy, or explore your next career opportunity, we're here to help.
            </p>
            <p>
              Partner with Bucks n Bricks to access strategic recruitment, executive search, HR consulting, and talent development solutions designed to support your long-term success.
            </p>
          </div>

          {/* Form container - Slides upward */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            style={{ willChange: 'transform, opacity' }}
            transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
            className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            {formSubmitted ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 mb-4 shadow-sm">
                  <CheckCircle size={28} />
                </div>
                <h4 className="text-[#011c30] font-bold font-display text-lg mb-1">Message Sent Successfully</h4>
                <p className="text-slate-500 font-sans text-xs sm:text-sm">Thank you for writing. We will respond within 2 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {error}
                  </div>
                )}
                <StaggerContainer className="flex flex-col gap-4">
                  
                  {/* Name */}
                  <StaggerItem direction="up">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Maya"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border border-slate-200/80 rounded-xl px-4 py-3 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans w-full"
                      />
                    </div>
                  </StaggerItem>

                  {/* Email */}
                  <StaggerItem direction="up">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="maya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="border border-slate-200/80 rounded-xl px-4 py-3 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans w-full"
                      />
                    </div>
                  </StaggerItem>

                  {/* Phone Number */}
                  <StaggerItem direction="up">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phoneNumber" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        required
                        placeholder="+92 300 1234567"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="border border-slate-200/80 rounded-xl px-4 py-3 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans w-full"
                      />
                    </div>
                  </StaggerItem>

                  {/* Subject */}
                  <StaggerItem direction="up">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Subject (Optional)
                      </label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="HR Automation Request"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="border border-slate-200/80 rounded-xl px-4 py-3 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans w-full"
                      />
                    </div>
                  </StaggerItem>

                  {/* Message */}
                  <StaggerItem direction="up">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        placeholder="Type your message here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="border border-slate-200/80 rounded-xl px-4 py-3 bg-white text-slate-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none font-sans w-full"
                      />
                    </div>
                  </StaggerItem>

                  {/* Submit button using AnimatedButton wrapper */}
                  <StaggerItem direction="up">
                    <AnimatedButton
                      id="submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#052842] hover:bg-white hover:text-[#052842] border border-[#052842] text-white font-sans text-xs font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-2 cursor-pointer disabled:opacity-60"
                    >
                      <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                      <Send size={13} />
                    </AnimatedButton>
                  </StaggerItem>

                </StaggerContainer>
              </form>
            )}
          </motion.div>
        </div>

        {/* Right Side: Image comes from right */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-10% 0px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl aspect-[1.1] w-full max-w-[460px] overflow-hidden border-4 border-white shadow-2xl relative bg-[#0b132a] flex items-center justify-center"
          >
            <img
              src={professionalHandshake}
              alt="Professional Handshake Greeting"
              className="w-full h-full object-cover brightness-95"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
