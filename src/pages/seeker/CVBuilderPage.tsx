import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import {
  FileText,
  Plus,
  X,
  Download,
  Eye,
  Sparkles,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Save,
  Wand2 } from
'lucide-react';
import { motion } from 'framer-motion';
interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}
interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}
const templates = [
{
  id: 'modern',
  name: 'Modern',
  description: 'Clean and contemporary design'
},
{
  id: 'professional',
  name: 'Professional',
  description: 'Traditional corporate style'
},
{
  id: 'creative',
  name: 'Creative',
  description: 'Stand out with unique layout'
},
{
  id: 'minimal',
  name: 'Minimal',
  description: 'Simple and elegant'
}];

export function CVBuilderPage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Abebe',
    lastName: 'Kebede',
    email: 'abebe.kebede@email.com',
    phone: '+251 91 234 5678',
    location: 'Addis Ababa, Ethiopia',
    linkedin: 'linkedin.com/in/abebekebede',
    github: 'github.com/abebekebede',
    summary:
    'Experienced software engineer with 5+ years of expertise in building scalable web applications. Passionate about clean code and user-centric design.'
  });
  const [education, setEducation] = useState<Education[]>([
  {
    id: '1',
    school: 'Addis Ababa University',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2015-09',
    endDate: '2019-06',
    current: false
  }]
  );
  const [experience, setExperience] = useState<Experience[]>([
  {
    id: '1',
    company: 'TechAfrica',
    title: 'Senior Software Engineer',
    location: 'Addis Ababa, Ethiopia',
    startDate: '2021-03',
    endDate: '',
    current: true,
    description:
    'Lead frontend development for enterprise applications using React and TypeScript.'
  },
  {
    id: '2',
    company: 'StartupHub',
    title: 'Software Engineer',
    location: 'Addis Ababa, Ethiopia',
    startDate: '2019-07',
    endDate: '2021-02',
    current: false,
    description:
    'Developed and maintained multiple web applications for various clients.'
  }]
  );
  const [skills, setSkills] = useState([
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'AWS',
  'PostgreSQL',
  'Git',
  'Agile']
  );
  const [newSkill, setNewSkill] = useState('');
  const sections = [
  {
    id: 'personal',
    name: 'Personal Info',
    icon: Mail
  },
  {
    id: 'summary',
    name: 'Summary',
    icon: FileText
  },
  {
    id: 'experience',
    name: 'Experience',
    icon: Briefcase
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: Award
  }];

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
  return (
    <DashboardLayout role="seeker">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CV Builder</h1>
            <p className="text-slate-500">
              Create a professional CV that stands out
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<Eye className="h-4 w-4" />}>
              Preview
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}>

              Download PDF
            </Button>
            <Button leftIcon={<Save className="h-4 w-4" />}>Save</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            {/* Template Selection */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Template</h3>
              <div className="space-y-2">
                {templates.map((template) =>
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${selectedTemplate === template.id ? 'bg-primary-50 border-2 border-primary-500' : 'border-2 border-slate-200 hover:border-slate-300'}`}>

                    <p className="font-medium text-slate-900">
                      {template.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {template.description}
                    </p>
                  </button>
                )}
              </div>
            </div>

            {/* Section Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) =>
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>

                    <section.icon className="h-4 w-4" />
                    {section.name}
                  </button>
                )}
              </nav>
            </div>

            {/* AI Assistant */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm text-primary-100 mb-3">
                Let AI help you write compelling descriptions and optimize your
                CV.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-white text-primary-600 hover:bg-primary-50">

                <Wand2 className="h-4 w-4 mr-2" />
                Enhance with AI
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="bg-white rounded-xl border border-slate-200 p-6">

              {/* Personal Info */}
              {activeSection === 'personal' &&
              <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                    label="First Name"
                    value={personalInfo.firstName}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      firstName: e.target.value
                    })
                    } />

                    <Input
                    label="Last Name"
                    value={personalInfo.lastName}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      lastName: e.target.value
                    })
                    } />

                    <Input
                    label="Email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      email: e.target.value
                    })
                    }
                    icon={<Mail className="h-4 w-4" />} />

                    <Input
                    label="Phone"
                    value={personalInfo.phone}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      phone: e.target.value
                    })
                    }
                    icon={<Phone className="h-4 w-4" />} />

                    <Input
                    label="Location"
                    value={personalInfo.location}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      location: e.target.value
                    })
                    }
                    icon={<MapPin className="h-4 w-4" />} />

                    <Input
                    label="LinkedIn"
                    value={personalInfo.linkedin}
                    onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      linkedin: e.target.value
                    })
                    }
                    icon={<Linkedin className="h-4 w-4" />} />

                  </div>
                </div>
              }

              {/* Summary */}
              {activeSection === 'summary' &&
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Professional Summary
                    </h2>
                    <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Sparkles className="h-4 w-4" />}>

                      Generate with AI
                    </Button>
                  </div>
                  <textarea
                  value={personalInfo.summary}
                  onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    summary: e.target.value
                  })
                  }
                  rows={6}
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Write a brief summary of your professional background and career goals..." />

                  <p className="text-xs text-slate-500">
                    Tip: Keep your summary concise (2-4 sentences) and highlight
                    your key achievements and skills.
                  </p>
                </div>
              }

              {/* Experience */}
              {activeSection === 'experience' &&
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Work Experience
                    </h2>
                    <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                      Add Experience
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {experience.map((exp, index) =>
                  <div
                    key={exp.id}
                    className="p-4 border border-slate-200 rounded-lg">

                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {exp.title}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {exp.company} • {exp.location}
                            </p>
                            <p className="text-xs text-slate-400">
                              {exp.startDate} -{' '}
                              {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50">

                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <textarea
                      value={exp.description}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[index].description = e.target.value;
                        setExperience(updated);
                      }}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe your responsibilities and achievements..." />

                      </div>
                  )}
                  </div>
                </div>
              }

              {/* Education */}
              {activeSection === 'education' &&
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Education
                    </h2>
                    <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                      Add Education
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu) =>
                  <div
                    key={edu.id}
                    className="p-4 border border-slate-200 rounded-lg">

                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-slate-900">
                              {edu.degree} in {edu.field}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {edu.school}
                            </p>
                            <p className="text-xs text-slate-400">
                              {edu.startDate} -{' '}
                              {edu.current ? 'Present' : edu.endDate}
                            </p>
                          </div>
                          <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50">

                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              }

              {/* Skills */}
              {activeSection === 'skills' &&
              <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Skills
                  </h2>
                  <div className="flex gap-2">
                    <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()} />

                    <Button onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) =>
                  <Badge
                    key={skill}
                    variant="default"
                    className="pl-3 pr-1 py-1.5 flex items-center gap-1">

                        {skill}
                        <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 p-0.5 rounded-full hover:bg-primary-200">

                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                  )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      Suggested Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Docker', 'Kubernetes', 'GraphQL', 'MongoDB', 'Redis'].
                    filter((s) => !skills.includes(s)).
                    map((skill) =>
                    <button
                      key={skill}
                      onClick={() => setSkills([...skills, skill])}
                      className="px-3 py-1 text-xs rounded-full border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors">

                            + {skill}
                          </button>
                    )}
                    </div>
                  </div>
                </div>
              }
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}