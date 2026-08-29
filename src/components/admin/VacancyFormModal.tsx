import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, AlertCircle, Loader2, Save } from 'lucide-react';
import { JobVacancy } from '../../types';
import { createJob, updateJob } from '../../services/api';

interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialData?: JobVacancy | null;
}

export function VacancyFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: VacancyFormModalProps) {
  const isEditMode = !!initialData;

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [workplaceType, setWorkplaceType] = useState<'On-Site' | 'Remote' | 'Hybrid'>('On-Site');
  const [employmentType, setEmploymentType] = useState<'Full Time' | 'Part Time' | 'Internship' | 'Contract'>('Full Time');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [education, setEducation] = useState('');
  const [salary, setSalary] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published' | 'Closed'>('Draft');

  // Dynamic Array Fields
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [perksAndBenefits, setPerksAndBenefits] = useState<string[]>(['']);

  // Validation and Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setJobTitle(initialData.jobTitle || '');
      setCity(initialData.city || '');
      setCountry(initialData.country || '');
      setWorkplaceType(initialData.workplaceType || 'On-Site');
      setEmploymentType(initialData.employmentType || 'Full Time');
      setExperienceRequired(initialData.experienceRequired || '');
      setEducation(initialData.education || '');
      setSalary(initialData.salary || '');
      
      if (initialData.applicationDeadline) {
        const d = new Date(initialData.applicationDeadline);
        setApplicationDeadline(isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]);
      } else {
        setApplicationDeadline('');
      }

      setDescription(initialData.description || '');
      setStatus(initialData.status || 'Draft');

      setResponsibilities(
        Array.isArray(initialData.responsibilities) && initialData.responsibilities.length > 0
          ? initialData.responsibilities
          : ['']
      );
      setRequirements(
        Array.isArray(initialData.requirements) && initialData.requirements.length > 0
          ? initialData.requirements
          : ['']
      );
      setPerksAndBenefits(
        Array.isArray(initialData.perksAndBenefits) && initialData.perksAndBenefits.length > 0
          ? initialData.perksAndBenefits
          : ['']
      );
    } else {
      resetForm();
    }
    setErrors({});
    setApiError(null);
  }, [initialData, isOpen]);

  const resetForm = () => {
    setCompanyName('');
    setJobTitle('');
    setCity('');
    setCountry('');
    setWorkplaceType('On-Site');
    setEmploymentType('Full Time');
    setExperienceRequired('');
    setEducation('');
    setSalary('');
    setApplicationDeadline('');
    setDescription('');
    setStatus('Draft');
    setResponsibilities(['']);
    setRequirements(['']);
    setPerksAndBenefits(['']);
  };

  if (!isOpen) return null;

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) newErrors.companyName = 'Company Name is required.';
    if (!jobTitle.trim()) newErrors.jobTitle = 'Job Title is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!experienceRequired.trim()) newErrors.experienceRequired = 'Experience Required is required.';
    if (!description.trim()) newErrors.description = 'Job Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for dynamic list items
  const handleAddDynamicItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, '']);
  };

  const handleRemoveDynamicItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDynamicChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      city: city.trim(),
      country: country.trim(),
      workplaceType,
      employmentType,
      experienceRequired: experienceRequired.trim(),
      education: education.trim(),
      salary: salary.trim(),
      applicationDeadline: applicationDeadline ? applicationDeadline : null,
      description: description.trim(),
      status,
      responsibilities: responsibilities.map((r) => r.trim()).filter((r) => r.length > 0),
      requirements: requirements.map((r) => r.trim()).filter((r) => r.length > 0),
      perksAndBenefits: perksAndBenefits.map((p) => p.trim()).filter((p) => p.length > 0),
    };

    try {
      if (isEditMode && initialData) {
        const targetId = initialData._id || initialData.id;
        await updateJob(targetId, payload);
        onSuccess('Vacancy updated successfully!');
      } else {
        await createJob(payload);
        onSuccess('New vacancy created successfully!');
      }
      onClose();
    } catch (err: any) {
      setApiError(err.message || 'Failed to save job vacancy. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#052842] text-white flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-xl font-bold font-display">
                {isEditMode ? 'Edit Vacancy' : 'Add New Vacancy'}
              </h2>
              <p className="text-xs text-slate-300">
                {isEditMode ? 'Update job position details and specifications' : 'Publish or draft a new job position for applicants'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                1. General Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Global Systems"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-colors ${
                      errors.companyName ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-[#052842]'
                    }`}
                  />
                  {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job Title / Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-colors ${
                      errors.jobTitle ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-[#052842]'
                    }`}
                  />
                  {errors.jobTitle && <p className="text-xs text-red-500 mt-1">{errors.jobTitle}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Sydney or Karachi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-colors ${
                      errors.city ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-[#052842]'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Australia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                  />
                </div>
              </div>
            </div>

            {/* Employment Specifications */}
            <div>
              <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                2. Employment Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Workplace Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Workplace Type</label>
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
                  >
                    <option value="On-Site">On-Site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Initial Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842] bg-white cursor-pointer"
                  >
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Published">Published (Active)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                {/* Experience Required */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience Required <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(e.target.value)}
                    placeholder="e.g. 3+ Years"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-colors ${
                      errors.experienceRequired ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-[#052842]'
                    }`}
                  />
                  {errors.experienceRequired && (
                    <p className="text-xs text-red-500 mt-1">{errors.experienceRequired}</p>
                  )}
                </div>

                {/* Education */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Education <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. Bachelor in Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Salary Range <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $90,000 - $110,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-4 max-w-sm">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Deadline <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={applicationDeadline}
                  onChange={(e) => setApplicationDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                3. Job Description <span className="text-red-500">*</span>
              </h3>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a clear and comprehensive summary of the job role..."
                className={`w-full p-3.5 rounded-xl border text-sm font-sans focus:outline-none transition-colors ${
                  errors.description ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-[#052842]'
                }`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Dynamic Lists Section */}
            <div className="space-y-6">
              {/* Dynamic Responsibilities */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider">
                    Responsibilities
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddDynamicItem(setResponsibilities)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#052842] hover:underline cursor-pointer"
                  >
                    <Plus size={14} /> Add Responsibility
                  </button>
                </div>
                <div className="space-y-2">
                  {responsibilities.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setResponsibilities)}
                        placeholder={`Responsibility #${index + 1}`}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                      />
                      {responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDynamicItem(index, setResponsibilities)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Requirements */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider">
                    Requirements / Qualifications
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddDynamicItem(setRequirements)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#052842] hover:underline cursor-pointer"
                  >
                    <Plus size={14} /> Add Requirement
                  </button>
                </div>
                <div className="space-y-2">
                  {requirements.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setRequirements)}
                        placeholder={`Requirement #${index + 1}`}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                      />
                      {requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDynamicItem(index, setRequirements)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Perks & Benefits */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-[#052842] uppercase tracking-wider">
                    Perks & Benefits
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleAddDynamicItem(setPerksAndBenefits)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#052842] hover:underline cursor-pointer"
                  >
                    <Plus size={14} /> Add Benefit
                  </button>
                </div>
                <div className="space-y-2">
                  {perksAndBenefits.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleDynamicChange(index, e.target.value, setPerksAndBenefits)}
                        placeholder={`Perk or Benefit #${index + 1}`}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-[#052842]"
                      />
                      {perksAndBenefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDynamicItem(index, setPerksAndBenefits)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#052842] hover:bg-[#011c30] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {isEditMode ? 'Save Changes' : 'Create Vacancy'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
