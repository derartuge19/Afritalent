import React, { useState, Fragment } from 'react';
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
  Clock,
  Users,
  FileText,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Building2,
  Globe,
  GraduationCap,
  Sparkles,
  Eye,
  Save } from
'lucide-react';
type JobFormData = {
  // Basic Info
  title: string;
  department: string;
  employmentType: string;
  workMode: string;
  experienceLevel: string;
  // Location & Compensation
  country: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  salaryPeriod: string;
  showSalary: boolean;
  // Job Details
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  // Skills
  requiredSkills: string[];
  // Application Settings
  applicationDeadline: string;
  applicationEmail: string;
  externalUrl: string;
  questionsEnabled: boolean;
  screeningQuestions: string[];
};
const initialFormData: JobFormData = {
  title: '',
  department: '',
  employmentType: 'full-time',
  workMode: 'onsite',
  experienceLevel: 'mid',
  country: 'ethiopia',
  city: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  salaryPeriod: 'yearly',
  showSalary: true,
  description: '',
  responsibilities: [''],
  requirements: [''],
  niceToHave: [''],
  benefits: [''],
  requiredSkills: [],
  applicationDeadline: '',
  applicationEmail: '',
  externalUrl: '',
  questionsEnabled: false,
  screeningQuestions: ['']
};
const steps = [
{
  id: 1,
  name: 'Basic Info',
  icon: Briefcase
},
{
  id: 2,
  name: 'Location & Pay',
  icon: MapPin
},
{
  id: 3,
  name: 'Job Details',
  icon: FileText
},
{
  id: 4,
  name: 'Skills',
  icon: Sparkles
},
{
  id: 5,
  name: 'Application',
  icon: Users
}];

const employmentTypes = [
{
  value: 'full-time',
  label: 'Full-time'
},
{
  value: 'part-time',
  label: 'Part-time'
},
{
  value: 'contract',
  label: 'Contract'
},
{
  value: 'internship',
  label: 'Internship'
},
{
  value: 'temporary',
  label: 'Temporary'
}];

const workModes = [
{
  value: 'onsite',
  label: 'On-site'
},
{
  value: 'remote',
  label: 'Remote'
},
{
  value: 'hybrid',
  label: 'Hybrid'
}];

const experienceLevels = [
{
  value: 'entry',
  label: 'Entry Level (0-2 years)'
},
{
  value: 'mid',
  label: 'Mid Level (2-5 years)'
},
{
  value: 'senior',
  label: 'Senior Level (5-8 years)'
},
{
  value: 'lead',
  label: 'Lead/Manager (8+ years)'
},
{
  value: 'executive',
  label: 'Executive/Director'
}];

const countries = [
{
  value: 'ethiopia',
  label: '🇪🇹 Ethiopia'
},
{
  value: 'kenya',
  label: '🇰🇪 Kenya'
},
{
  value: 'nigeria',
  label: '🇳🇬 Nigeria'
},
{
  value: 'south-africa',
  label: '🇿🇦 South Africa'
},
{
  value: 'ghana',
  label: '🇬🇭 Ghana'
},
{
  value: 'egypt',
  label: '🇪🇬 Egypt'
},
{
  value: 'rwanda',
  label: '🇷🇼 Rwanda'
},
{
  value: 'tanzania',
  label: '🇹🇿 Tanzania'
},
{
  value: 'uganda',
  label: '🇺🇬 Uganda'
},
{
  value: 'remote-global',
  label: '🌍 Remote (Global)'
}];

const currencies = [
{
  value: 'USD',
  label: 'USD ($)'
},
{
  value: 'ETB',
  label: 'ETB (Br)'
},
{
  value: 'KES',
  label: 'KES (KSh)'
},
{
  value: 'NGN',
  label: 'NGN (₦)'
},
{
  value: 'ZAR',
  label: 'ZAR (R)'
},
{
  value: 'EUR',
  label: 'EUR (€)'
},
{
  value: 'GBP',
  label: 'GBP (£)'
}];

const departments = [
{
  value: '',
  label: 'Select Department'
},
{
  value: 'engineering',
  label: 'Engineering'
},
{
  value: 'product',
  label: 'Product'
},
{
  value: 'design',
  label: 'Design'
},
{
  value: 'marketing',
  label: 'Marketing'
},
{
  value: 'sales',
  label: 'Sales'
},
{
  value: 'finance',
  label: 'Finance'
},
{
  value: 'hr',
  label: 'Human Resources'
},
{
  value: 'operations',
  label: 'Operations'
},
{
  value: 'customer-success',
  label: 'Customer Success'
},
{
  value: 'legal',
  label: 'Legal'
},
{
  value: 'other',
  label: 'Other'
}];

const popularSkills = [
'JavaScript',
'Python',
'React',
'Node.js',
'TypeScript',
'Java',
'SQL',
'AWS',
'Docker',
'Kubernetes',
'Machine Learning',
'Data Analysis',
'Project Management',
'Agile',
'Scrum',
'Communication',
'Leadership',
'Excel',
'Figma',
'Adobe Creative Suite',
'Sales',
'Marketing',
'Customer Service',
'Financial Analysis',
'Accounting'];

export function PostJobPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormData, string>>>(
    {});
  const [skillInput, setSkillInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const updateField = <K extends keyof JobFormData,>(
  field: K,
  value: JobFormData[K]) =>
  {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  const addListItem = (
  field:
  'responsibilities' |
  'requirements' |
  'niceToHave' |
  'benefits' |
  'screeningQuestions') =>
  {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };
  const updateListItem = (
  field:
  'responsibilities' |
  'requirements' |
  'niceToHave' |
  'benefits' |
  'screeningQuestions',
  index: number,
  value: string) =>
  {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };
  const removeListItem = (
  field:
  'responsibilities' |
  'requirements' |
  'niceToHave' |
  'benefits' |
  'screeningQuestions',
  index: number) =>
  {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };
  const addSkill = (skill: string) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      updateField('requiredSkills', [...formData.requiredSkills, skill]);
    }
    setSkillInput('');
  };
  const removeSkill = (skill: string) => {
    updateField(
      'requiredSkills',
      formData.requiredSkills.filter((s) => s !== skill)
    );
  };
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Job title is required';
      if (!formData.department) newErrors.department = 'Department is required';
    }
    if (step === 2) {
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }
    if (step === 3) {
      if (!formData.description.trim())
      newErrors.description = 'Job description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    alert('Job posted successfully!');
  };
  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Draft saved!');
  };
  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
          <p className="text-slate-500 mt-1">
            Create a job listing to attract top talent across Africa
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) =>
            <Fragment key={step.id}>
                <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center group ${currentStep >= step.id ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                disabled={currentStep < step.id}>

                  <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${currentStep === step.id ? 'bg-primary-600 text-white ring-4 ring-primary-100' : currentStep > step.id ? 'bg-success-500 text-white' : 'bg-slate-100 text-slate-400'}
                  `}>

                    {currentStep > step.id ?
                  <CheckCircle className="w-5 h-5" /> :

                  <step.icon className="w-5 h-5" />
                  }
                  </div>
                  <span
                  className={`mt-2 text-xs font-medium hidden sm:block ${currentStep === step.id ? 'text-primary-600' : 'text-slate-500'}`}>

                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 &&
              <div
                className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-success-500' : 'bg-slate-200'}`} />

              }
              </Fragment>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}
              transition={{
                duration: 0.2
              }}
              className="p-6 sm:p-8">

              {/* Step 1: Basic Info */}
              {currentStep === 1 &&
              <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Basic Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Tell us about the position you're hiring for
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                    label="Job Title *"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    error={errors.title}
                    icon={<Briefcase className="w-4 h-4" />} />


                    <Select
                    label="Department *"
                    options={departments}
                    value={formData.department}
                    onChange={(e) =>
                    updateField('department', e.target.value)
                    }
                    error={errors.department} />


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Select
                      label="Employment Type"
                      options={employmentTypes}
                      value={formData.employmentType}
                      onChange={(e) =>
                      updateField('employmentType', e.target.value)
                      } />

                      <Select
                      label="Work Mode"
                      options={workModes}
                      value={formData.workMode}
                      onChange={(e) =>
                      updateField('workMode', e.target.value)
                      } />

                      <Select
                      label="Experience Level"
                      options={experienceLevels}
                      value={formData.experienceLevel}
                      onChange={(e) =>
                      updateField('experienceLevel', e.target.value)
                      } />

                    </div>
                  </div>
                </div>
              }

              {/* Step 2: Location & Compensation */}
              {currentStep === 2 &&
              <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Location & Compensation
                    </h2>
                    <p className="text-sm text-slate-500">
                      Where is this role based and what's the pay range?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                      label="Country *"
                      options={countries}
                      value={formData.country}
                      onChange={(e) => updateField('country', e.target.value)} />

                      <Input
                      label="City *"
                      placeholder="e.g., Addis Ababa"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      error={errors.city}
                      icon={<MapPin className="w-4 h-4" />} />

                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <h3 className="text-sm font-medium text-slate-900 mb-3">
                        Salary Range
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Input
                        label="Minimum"
                        placeholder="40,000"
                        value={formData.salaryMin}
                        onChange={(e) =>
                        updateField('salaryMin', e.target.value)
                        }
                        icon={<DollarSign className="w-4 h-4" />} />

                        <Input
                        label="Maximum"
                        placeholder="60,000"
                        value={formData.salaryMax}
                        onChange={(e) =>
                        updateField('salaryMax', e.target.value)
                        }
                        icon={<DollarSign className="w-4 h-4" />} />

                        <Select
                        label="Currency"
                        options={currencies}
                        value={formData.salaryCurrency}
                        onChange={(e) =>
                        updateField('salaryCurrency', e.target.value)
                        } />

                        <Select
                        label="Period"
                        options={[
                        {
                          value: 'yearly',
                          label: 'Per Year'
                        },
                        {
                          value: 'monthly',
                          label: 'Per Month'
                        },
                        {
                          value: 'hourly',
                          label: 'Per Hour'
                        }]
                        }
                        value={formData.salaryPeriod}
                        onChange={(e) =>
                        updateField('salaryPeriod', e.target.value)
                        } />

                      </div>
                      <label className="flex items-center mt-3 cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.showSalary}
                        onChange={(e) =>
                        updateField('showSalary', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />

                        <span className="ml-2 text-sm text-slate-600">
                          Display salary on job listing
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              }

              {/* Step 3: Job Details */}
              {currentStep === 3 &&
              <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Job Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Describe the role and what you're looking for
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Job Description *
                      </label>
                      <textarea
                      rows={5}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe the role, team, and what makes this opportunity exciting..."
                      value={formData.description}
                      onChange={(e) =>
                      updateField('description', e.target.value)
                      } />

                      {errors.description &&
                    <p className="mt-1 text-xs text-red-500">
                          {errors.description}
                        </p>
                    }
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Key Responsibilities
                      </label>
                      <div className="space-y-2">
                        {formData.responsibilities.map((item, index) =>
                      <div key={index} className="flex gap-2">
                            <Input
                          placeholder="e.g., Lead frontend development initiatives"
                          value={item}
                          onChange={(e) =>
                          updateListItem(
                            'responsibilities',
                            index,
                            e.target.value
                          )
                          } />

                            {formData.responsibilities.length > 1 &&
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          removeListItem('responsibilities', index)
                          }
                          className="text-slate-400 hover:text-red-500">

                                <X className="w-4 h-4" />
                              </Button>
                        }
                          </div>
                      )}
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem('responsibilities')}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="text-primary-600">

                          Add Responsibility
                        </Button>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Requirements
                      </label>
                      <div className="space-y-2">
                        {formData.requirements.map((item, index) =>
                      <div key={index} className="flex gap-2">
                            <Input
                          placeholder="e.g., 5+ years of experience with React"
                          value={item}
                          onChange={(e) =>
                          updateListItem(
                            'requirements',
                            index,
                            e.target.value
                          )
                          } />

                            {formData.requirements.length > 1 &&
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          removeListItem('requirements', index)
                          }
                          className="text-slate-400 hover:text-red-500">

                                <X className="w-4 h-4" />
                              </Button>
                        }
                          </div>
                      )}
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem('requirements')}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="text-primary-600">

                          Add Requirement
                        </Button>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Benefits & Perks
                      </label>
                      <div className="space-y-2">
                        {formData.benefits.map((item, index) =>
                      <div key={index} className="flex gap-2">
                            <Input
                          placeholder="e.g., Health insurance, Remote work flexibility"
                          value={item}
                          onChange={(e) =>
                          updateListItem(
                            'benefits',
                            index,
                            e.target.value
                          )
                          } />

                            {formData.benefits.length > 1 &&
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                          removeListItem('benefits', index)
                          }
                          className="text-slate-400 hover:text-red-500">

                                <X className="w-4 h-4" />
                              </Button>
                        }
                          </div>
                      )}
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem('benefits')}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="text-primary-600">

                          Add Benefit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              }

              {/* Step 4: Skills */}
              {currentStep === 4 &&
              <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Required Skills
                    </h2>
                    <p className="text-sm text-slate-500">
                      Add skills that candidates should have for this role
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(skillInput);
                        }
                      }}
                      icon={<Sparkles className="w-4 h-4" />} />

                      <Button
                      onClick={() => addSkill(skillInput)}
                      disabled={!skillInput}>

                        Add
                      </Button>
                    </div>

                    {formData.requiredSkills.length > 0 &&
                  <div className="flex flex-wrap gap-2">
                        {formData.requiredSkills.map((skill) =>
                    <Badge
                      key={skill}
                      variant="default"
                      className="pl-3 pr-1 py-1 flex items-center gap-1 bg-primary-100 text-primary-700">

                            {skill}
                            <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 p-0.5 rounded-full hover:bg-primary-200">

                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                    )}
                      </div>
                  }

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Popular Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSkills.
                      filter(
                        (skill) => !formData.requiredSkills.includes(skill)
                      ).
                      slice(0, 15).
                      map((skill) =>
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="px-3 py-1 text-xs rounded-full border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors">

                              + {skill}
                            </button>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              }

              {/* Step 5: Application Settings */}
              {currentStep === 5 &&
              <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                      Application Settings
                    </h2>
                    <p className="text-sm text-slate-500">
                      Configure how candidates can apply
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Input
                    label="Application Deadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) =>
                    updateField('applicationDeadline', e.target.value)
                    }
                    icon={<Clock className="w-4 h-4" />} />


                    <Input
                    label="Application Email (optional)"
                    type="email"
                    placeholder="hiring@company.com"
                    value={formData.applicationEmail}
                    onChange={(e) =>
                    updateField('applicationEmail', e.target.value)
                    } />


                    <Input
                    label="External Application URL (optional)"
                    type="url"
                    placeholder="https://company.com/careers/apply"
                    value={formData.externalUrl}
                    onChange={(e) =>
                    updateField('externalUrl', e.target.value)
                    }
                    icon={<Globe className="w-4 h-4" />} />


                    <div className="border-t border-slate-200 pt-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.questionsEnabled}
                        onChange={(e) =>
                        updateField('questionsEnabled', e.target.checked)
                        }
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />

                        <span className="ml-2 text-sm font-medium text-slate-700">
                          Add screening questions
                        </span>
                      </label>

                      {formData.questionsEnabled &&
                    <div className="mt-4 space-y-2">
                          {formData.screeningQuestions.map(
                        (question, index) =>
                        <div key={index} className="flex gap-2">
                                <Input
                            placeholder="e.g., What interests you about this role?"
                            value={question}
                            onChange={(e) =>
                            updateListItem(
                              'screeningQuestions',
                              index,
                              e.target.value
                            )
                            } />

                                {formData.screeningQuestions.length > 1 &&
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                            removeListItem(
                              'screeningQuestions',
                              index
                            )
                            }
                            className="text-slate-400 hover:text-red-500">

                                    <X className="w-4 h-4" />
                                  </Button>
                          }
                              </div>

                      )}
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addListItem('screeningQuestions')}
                        leftIcon={<Plus className="w-4 h-4" />}
                        className="text-primary-600">

                            Add Question
                          </Button>
                        </div>
                    }
                    </div>
                  </div>
                </div>
              }
            </motion.div>
          </AnimatePresence>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 1 &&
              <Button
                variant="outline"
                onClick={prevStep}
                leftIcon={<ChevronLeft className="w-4 h-4" />}>

                  Back
                </Button>
              }
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSaveDraft}
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}>

                Save Draft
              </Button>

              {currentStep < steps.length ?
              <Button
                onClick={nextStep}
                rightIcon={<ChevronRight className="w-4 h-4" />}>

                  Continue
                </Button> :

              <Button
                onClick={handleSubmit}
                isLoading={isSaving}
                className="bg-success-600 hover:bg-success-700">

                  Publish Job
                </Button>
              }
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 rounded-xl bg-primary-50 border border-primary-100 p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary-900">
                AI-Powered Tips
              </h3>
              <p className="mt-1 text-sm text-primary-700">
                {currentStep === 1 &&
                "Use clear, specific job titles. 'Senior Software Engineer' performs better than 'Code Ninja'."}
                {currentStep === 2 &&
                'Jobs with visible salary ranges receive 30% more applications on average.'}
                {currentStep === 3 &&
                'Keep your description concise but informative. Highlight what makes your company unique.'}
                {currentStep === 4 &&
                'Focus on must-have skills. Too many requirements can discourage qualified candidates.'}
                {currentStep === 5 &&
                'Screening questions help filter candidates early, but keep them relevant and brief.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}