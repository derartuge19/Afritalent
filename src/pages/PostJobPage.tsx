import { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Plus,
  X,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Save,
  Calendar,
  Eye,
  Clock,
  Building2
} from 'lucide-react';
import { createJob } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

type JobFormData = {
  title: string;
  department: string;
  employmentType: string;
  workMode: string;
  experienceLevel: string;
  country: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  showSalary: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  requiredSkills: string[];
  applicationDeadline: string;
};

const initialFormData: JobFormData = {
  title: '',
  department: '',
  employmentType: 'full-time',
  workMode: 'onsite',
  experienceLevel: 'mid',
  country: 'Ethiopia',
  city: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  salaryPeriod: 'monthly',
  showSalary: true,
  description: '',
  responsibilities: [''],
  requirements: [''],
  niceToHave: [''],
  benefits: [''],
  requiredSkills: [],
  applicationDeadline: '',
};

const steps = [
  { id: 1, name: 'Basic Info', icon: Briefcase },
  { id: 2, name: 'Location & Pay', icon: MapPin },
  { id: 3, name: 'Job Details', icon: FileText },
  { id: 4, name: 'Skills & Finish', icon: Sparkles }
];

export function PostJobPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/employer/dashboard');
    }
  };

  const addListItem = (field: 'responsibilities' | 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'responsibilities' | 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleListChange = (field: 'responsibilities' | 'requirements' | 'benefits', index: number, value: string) => {
    const newList = [...formData[field]];
    newList[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newList
    }));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.filter(r => r.trim()).join('\n'), // Simplified for DB
        location: `${formData.city}, ${formData.country}`,
        salary_range: formData.showSalary ? `${formData.salaryCurrency} ${formData.salaryMin} - ${formData.salaryMax}` : 'Undisclosed',
        job_type: formData.employmentType
      };
      await createJob(payload);
      navigate('/employer/jobs');
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('Failed to post job. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Post a New Job</h1>
          <p className="text-slate-500 text-lg">Reach the best talent across Africa with AI-powered matching.</p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-100 -z-10" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary-600 transition-all duration-300 -z-10"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center group">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-100" :
                      isCompleted ? "bg-primary-50 border-primary-600 text-primary-600" :
                        "bg-white border-slate-200 text-slate-400"
                  )}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <span className={cn(
                    "absolute -bottom-7 text-xs font-semibold whitespace-nowrap transition-colors",
                    isActive ? "text-primary-600" : "text-slate-400"
                  )}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Basic Job Information</h2>
                      <p className="text-slate-500">Start with the most important details of the role.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Input
                          label="Job Title"
                          placeholder="e.g. Senior Product Designer"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <Input
                        label="Department"
                        placeholder="e.g. Engineering, Sales, Design"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      />
                      <Select
                        label="Employment Type"
                        value={formData.employmentType}
                        onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                        options={[
                          { value: 'full-time', label: 'Full-time' },
                          { value: 'part-time', label: 'Part-time' },
                          { value: 'contract', label: 'Contract' },
                          { value: 'internship', label: 'Internship' }
                        ]}
                      />
                      <Select
                        label="Experience Level"
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        options={[
                          { value: 'entry', label: 'Entry Level' },
                          { value: 'mid', label: 'Mid Level' },
                          { value: 'senior', label: 'Senior' },
                          { value: 'expert', label: 'Expert/Lead' }
                        ]}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Pay */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Location & Compensation</h2>
                      <p className="text-slate-500">Where is this role based and what is the budget?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        label="Workplace Type"
                        value={formData.workMode}
                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                        options={[
                          { value: 'onsite', label: 'On-site' },
                          { value: 'remote', label: 'Remote' },
                          { value: 'hybrid', label: 'Hybrid' }
                        ]}
                      />
                      <Input
                        label="Country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      />
                      <Input
                        label="City"
                        placeholder="e.g. Addis Ababa"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                      <div className="md:col-span-2 border-t border-slate-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary-600" />
                            Salary Details
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.showSalary}
                              onChange={(e) => setFormData({ ...formData, showSalary: e.target.checked })}
                              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600"
                            />
                            <span className="text-sm text-slate-600">Disclose salary range</span>
                          </label>
                        </div>

                        {formData.showSalary && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                            <Input
                              label="Min"
                              type="number"
                              placeholder="0"
                              value={formData.salaryMin}
                              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                            />
                            <Input
                              label="Max"
                              type="number"
                              placeholder="0"
                              value={formData.salaryMax}
                              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                            />
                            <Select
                              label="Currency"
                              value={formData.salaryCurrency}
                              onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
                              options={[
                                { value: 'USD', label: 'USD' },
                                { value: 'ETB', label: 'ETB' },
                                { value: 'EUR', label: 'EUR' }
                              ]}
                            />
                            <Select
                              label="Period"
                              value={formData.salaryPeriod}
                              onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value })}
                              options={[
                                { value: 'monthly', label: 'per month' },
                                { value: 'yearly', label: 'per year' },
                                { value: 'hourly', label: 'per hour' }
                              ]}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Job Details */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Job Details & Description</h2>
                      <p className="text-slate-500">Provide a clear description of the role and its expectations.</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-slate-700">About the Role</label>
                      <textarea
                        className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                        placeholder="Describe the company, the team, and what the candidate will be doing..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Responsibilities</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addListItem('responsibilities')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          Add Line
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {formData.responsibilities.map((res, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                              value={res}
                              placeholder="e.g. Design and implement UI components"
                              onChange={(e) => handleListChange('responsibilities', index, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListItem('responsibilities', index)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Requirements</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addListItem('requirements')}
                          leftIcon={<Plus className="h-4 w-4" />}
                        >
                          Add Line
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-primary-500 outline-none"
                              value={req}
                              placeholder="e.g. 3+ years of experience with React"
                              onChange={(e) => handleListChange('requirements', index, e.target.value)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListItem('requirements', index)}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Skills & Deadline */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Final Details</h2>
                      <p className="text-slate-500">Skills and application deadline.</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-slate-700">Required Skills</label>
                      <form onSubmit={addSkill} className="flex gap-2">
                        <Input
                          placeholder="Type a skill and press enter (e.g. React, UX Design)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" variant="outline" className="h-[42px] mt-6">Add</Button>
                      </form>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {formData.requiredSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="pl-3 pr-1 py-1.5 flex items-center gap-1.5 rounded-full"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="p-0.5 rounded-full hover:bg-primary-700 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {formData.requiredSkills.length === 0 && (
                          <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                      <Input
                        label="Application Deadline"
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                        icon={<Calendar className="h-4 w-4" />}
                      />
                    </div>

                    {/* Live Preview Section */}
                    <div className="pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-6">
                        <Eye className="h-5 w-5 text-primary-600" />
                        <h3 className="text-lg font-bold text-slate-900">Live Preview</h3>
                        <Badge variant="secondary" className="ml-auto">How seekers see this</Badge>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="default" className="bg-primary-100 text-primary-700 border-0 uppercase tracking-wider text-[10px]">
                                {formData.employmentType.replace('-', ' ')}
                              </Badge>
                              <span className="text-slate-400 text-sm">•</span>
                              <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Just now
                              </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                              {formData.title || "Job Title"}
                            </h2>
                            <div className="flex flex-wrap gap-y-2 gap-x-4 text-slate-600">
                              <span className="flex items-center gap-1.5 backdrop-blur-sm">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                {formData.department || "General"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {formData.city}, {formData.country} ({formData.workMode})
                              </span>
                              {formData.showSalary && (formData.salaryMin || formData.salaryMax) && (
                                <span className="flex items-center gap-1.5 text-success-700 font-medium">
                                  <DollarSign className="h-4 w-4" />
                                  {formData.salaryCurrency} {formData.salaryMin} - {formData.salaryMax} / {formData.salaryPeriod.replace('ly', '')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 gap-2">
                            <Button size="sm" disabled>Apply Now</Button>
                            <Button size="sm" variant="outline" disabled><Save className="h-4 w-4" /></Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 space-y-8">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900 mb-3">About the Role</h4>
                              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {formData.description || "No description provided yet."}
                              </p>
                            </div>

                            {formData.responsibilities.some(r => r.trim()) && (
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h4>
                                <ul className="space-y-2">
                                  {formData.responsibilities.filter(r => r.trim()).map((res, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                      {res}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {formData.requirements.some(r => r.trim()) && (
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-3">Requirements</h4>
                                <ul className="space-y-2">
                                  {formData.requirements.filter(r => r.trim()).map((req, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                      {req}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div className="bg-white rounded-xl p-5 border border-slate-200">
                              <h4 className="font-bold text-slate-900 mb-4">Role Overview</h4>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500">Experience</span>
                                  <span className="font-semibold text-slate-900 capitalize">{formData.experienceLevel}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500">Deadline</span>
                                  <span className="font-semibold text-slate-900">{formData.applicationDeadline || "Not set"}</span>
                                </div>
                              </div>
                            </div>

                            {formData.requiredSkills.length > 0 && (
                              <div className="bg-white rounded-xl p-5 border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-4">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {formData.requiredSkills.map(skill => (
                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 sm:px-10 flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
              className="px-6"
            >
              Back
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 hidden sm:inline">
                Step {currentStep} of {steps.length}
              </span>
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                  className="px-8"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={isSaving}
                  leftIcon={!isSaving && <Save className="h-4 w-4" />}
                  className="px-8 shadow-lg shadow-primary-200"
                >
                  Publish Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}