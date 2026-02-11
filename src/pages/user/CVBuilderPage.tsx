import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
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
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Save,
  Wand2,
  CheckCircle2,
  Trash2,
  Edit2,
  Star,
  RefreshCw,
  History as HistoryIcon,
  GitBranch,
  Upload,
  Github,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeekerProfile, updateSeekerProfile, createCV, getCVs, uploadCV, deleteCV, updateCV, setPrimaryCV, CV } from '../../lib/api';

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
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'professional', name: 'Professional', description: 'Traditional corporate style' },
  { id: 'creative', name: 'Creative', description: 'Stand out with unique layout' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }
];

export function CVBuilderPage() {
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeCV, setActiveCV] = useState<CV | null>(null); // null means "Current Builder State"

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: ''
  });
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getSeekerProfile();
        setPersonalInfo({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: '', // Not in seeker_profile model yet, usually in user model
          phone: '',
          location: profile.location || '',
          linkedin: '',
          github: '',
          summary: profile.bio || ''
        });

        if (profile.education) {
          try {
            setEducation(JSON.parse(profile.education));
          } catch (e) {
            setEducation([]);
          }
        }
        if (profile.experience) {
          try {
            setExperience(JSON.parse(profile.experience));
          } catch (e) {
            setExperience([]);
          }
        }
        if (profile.skills) {
          setSkills(profile.skills.split(',').map(s => s.trim()).filter(s => s));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- CV Versioning & Upload State ---
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionTitle, setVersionTitle] = useState('');
  const [cvVersions, setCvVersions] = useState<CV[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [cvToDelete, setCvToDelete] = useState<CV | null>(null);
  const [cvToRename, setCvToRename] = useState<CV | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const data = await getCVs();
      setCvVersions(data);
    } catch (e) { console.error(e); }
  };

  const selectVersion = (cv: CV | null) => {
    setActiveCV(cv);
    if (!cv) {
      // Switch back to builder - could optionally reload profile here
      setShowPreview(false);
      return;
    }

    if (!cv.is_uploaded && cv.content_html) {
      // If it's a builder version, we might want to "load" it into the editor 
      // but for now let's just show it in preview.
      setShowPreview(true);
    } else if (cv.is_uploaded) {
      setShowPreview(true);
    }
  };

  const handleSaveVersion = async () => {
    if (!versionTitle) return;
    setSaving(true);
    try {
      // Capture HTML similar to handleSave
      let cvHtml = '';
      const hiddenCvElement = document.getElementById('hidden-cv-container');
      if (hiddenCvElement) {
        cvHtml = hiddenCvElement.innerHTML;
      }

      const cvJson = JSON.stringify({
        personalInfo,
        education,
        experience,
        skills
      });

      await createCV({
        title: versionTitle,
        content_html: cvHtml,
        content_json: cvJson,
        is_uploaded: false
      });

      setShowVersionModal(false);
      setVersionTitle('');
      setMessage({ type: 'success', text: 'Version saved!' });
      loadVersions();
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to save version.' });
    } finally {
      setSaving(false);
    }
  }

  const handleDeleteCV = async () => {
    if (!cvToDelete) return;
    setSaving(true);
    try {
      await deleteCV(cvToDelete.id);
      setMessage({ type: 'success', text: 'CV deleted successfully' });
      setCvToDelete(null);
      loadVersions();
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setSaving(false);
    }
  };

  const handleRenameCV = async () => {
    if (!cvToRename || !newTitle.trim()) return;
    setSaving(true);
    try {
      await updateCV(cvToRename.id, { title: newTitle.trim() });
      setMessage({ type: 'success', text: 'CV renamed successfully' });
      setCvToRename(null);
      setNewTitle('');
      loadVersions();
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to rename' });
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await setPrimaryCV(id);
      setMessage({ type: 'success', text: 'Set as primary for applications' });
      loadVersions();
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Failed to set primary' });
    }
  };

  const handleLoadForEditing = (cv: CV) => {
    if (cv.is_uploaded) {
      setMessage({ type: 'error', text: 'Uploaded PDFs cannot be edited in the builder' });
      return;
    }
    if (cv.content_json) {
      try {
        const data = JSON.parse(cv.content_json);
        setPersonalInfo(data.personalInfo);
        setEducation(data.education);
        setExperience(data.experience);
        setSkills(data.skills);
        setActiveSection('personal');
        setMessage({ type: 'success', text: 'CV loaded into builder!' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        console.error(e);
        setMessage({ type: 'error', text: 'Failed to load CV data' });
      }
    }
  };

  const handleUploadCV = async () => {
    if (!uploadFile) return;
    setSaving(true);
    try {
      await uploadCV(uploadFile, versionTitle || uploadFile.name);
      setShowUploadModal(false);
      setUploadFile(null);
      setVersionTitle('');
      setMessage({ type: 'success', text: 'CV uploaded!' });
      loadVersions();
    } catch (e) {
      console.error(e);
      setMessage({ type: 'error', text: 'Upload failed.' });
    } finally {
      setSaving(false);
    }
  }
  // ------------------------------------

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Capture CV HTML
      // If preview is not open, we need to temporarily render the CV content to capture it
      // For simplicity, we can just grab the element if it exists or use the current state to generate a string representation
      // A robust way is to use the existing DOM element if visible, or warn the user to preview first (or force render off-screen)

      let cvHtml = '';
      const cvElement = document.getElementById('cv-content');

      if (cvElement) {
        cvHtml = cvElement.outerHTML;
      } else {
        // If not visible, we could try to generate it, but for now let's use a workaround
        // We can just save the data. The HTML generation usually happens in the render.
        // Actually, to ensure we capture the *styled* HTML, we might need the user to be in preview mode or we force render.
        // Let's assume for this MVP that the user views the preview or we just construct a basic HTML structure here.
        // BETTER APPROACH: We can't easily capture the DOM if it's not rendered. 
        // Let's modify the UX slightly: The 'Save' button is also in the preview. 
        // Or we can rely on the fact that the main save button saves DATA, and we add a explicit "Publish CV" or just save the HTML when they download/preview.

        // However, to satisfy the user request "display the users cv that he make", we need the HTML.
        // Let's force a render of the CV content in a hidden div if it's not visible.
        // But since we are inside a React component, we can't easily "force render" to a string without ReactDOMServer.

        // simplified strategy: We will save the HTML *only* if the preview is open, 
        // OR we can make the CV content always rendered but hidden when not in preview.
        // FOR NOW: I will update the code to render the CV content hidden on the page so it's always available to capture.
      }

      // Check if we have a hidden CV container (which I will add in the return JSX)
      const hiddenCvElement = document.getElementById('hidden-cv-container');
      if (hiddenCvElement) {
        cvHtml = hiddenCvElement.innerHTML;
      }

      await updateSeekerProfile({
        first_name: personalInfo.firstName,
        last_name: personalInfo.lastName,
        bio: personalInfo.summary,
        location: personalInfo.location,
        skills: skills.join(', '),
        education: JSON.stringify(education),
        experience: JSON.stringify(experience),
        cv_html: cvHtml // Send the captured HTML
      });
      setMessage({ type: 'success', text: 'CV saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save CV. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAIEnhance = () => {
    if (experience.length === 0) {
      setMessage({ type: 'error', text: 'Add experience entries first!' });
      setActiveSection('experience');
      return;
    }

    setEnhancing(true);
    setActiveSection('experience');

    // Simulate AI processing
    setTimeout(() => {
      const enhancedExperience = experience.map(exp => {
        // If empty, generate a base description first
        let baseDescription = exp.description;
        if (!baseDescription.trim()) {
          baseDescription = `Responsible for ${exp.title || 'tasks'} at ${exp.company || 'the company'}.`;
        }

        if (baseDescription.includes('AI Enhanced:')) return exp;

        const verbs = ['Spearheaded', 'Optimized', 'Architected', 'Engineered', 'Orchestrated'];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];

        return {
          ...exp,
          description: `AI Enhanced: ${verb} ${baseDescription.toLowerCase()} by implementing robust industry-standard patterns and optimizing critical workflows to achieve measurable performance gains and operational efficiency.`
        };
      });
      setExperience(enhancedExperience);
      setEnhancing(false);
      setMessage({ type: 'success', text: 'Experience enhanced with AI!' });
      setTimeout(() => setMessage(null), 3000);
    }, 1500);
  };

  const handleAIGenerateSummary = () => {
    if (!experience.length && !skills.length) {
      setMessage({ type: 'error', text: 'Add experience or skills first to generate a summary!' });
      return;
    }
    setGeneratingSummary(true);

    setTimeout(() => {
      const skillsText = skills.slice(0, 5).join(', ');
      const mainRole = experience[0]?.title || 'Professional';
      const summary = `AI Generated: Highly dedicated ${mainRole} with a strong foundation in ${skillsText || 'various professional tools'}. Proven ability to manage complex tasks and deliver high-quality solutions while maintaining a focus on innovation and efficiency. Passionate about solving challenges and contributing to team success within rapid-growth environments.`;
      setPersonalInfo({ ...personalInfo, summary });
      setGeneratingSummary(false);
      setMessage({ type: 'success', text: 'Professional summary generated!' });
      setTimeout(() => setMessage(null), 3000);
    }, 1200);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperience([...experience, newExp]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Math.random().toString(36).substr(2, 9),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    };
    setEducation([...education, newEdu]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handlePreview = () => {
    const primaryCV = cvVersions.find(cv => cv.is_primary);
    if (primaryCV) {
      setActiveCV(primaryCV);
    } else {
      setActiveCV(null);
    }
    setShowPreview(true);
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: Mail },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Award },
    { id: 'history', name: 'My CV Library', icon: HistoryIcon }
  ];

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CV Builder</h1>
            <p className="text-slate-500">Create a professional CV that stands out</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePreview} leftIcon={<Eye className="h-4 w-4" />}>Preview</Button>
            <Button variant="outline" onClick={() => {
              const oldTitle = document.title;
              document.title = `${personalInfo.firstName}_${personalInfo.lastName}_CV`;
              window.print();
              setTimeout(() => document.title = oldTitle, 100);
            }} leftIcon={<Download className="h-4 w-4" />}>Download PDF</Button>
            <Button variant="outline" onClick={() => setShowUploadModal(true)} leftIcon={<Upload className="h-4 w-4" />}>Upload</Button>
            <Button variant="outline" onClick={() => setShowVersionModal(true)} leftIcon={<GitBranch className="h-4 w-4" />}>Save Version</Button>
            <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
          </div>
        </div>

        {/* Message Banner */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Version Modal */}
        <AnimatePresence>
          {showVersionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Save Version</h2>
                  <button onClick={() => setShowVersionModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Version Title"
                    placeholder="e.g. Software Engineer V1"
                    value={versionTitle}
                    onChange={(e) => setVersionTitle(e.target.value)}
                  />
                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowVersionModal(false)}>Cancel</Button>
                    <Button onClick={handleSaveVersion} isLoading={saving}>Save Version</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Upload CV</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="e.g. Resume 2024"
                    value={versionTitle}
                    onChange={(e) => setVersionTitle(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CV File (PDF)</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-primary-50 file:text-primary-700
                                      hover:file:bg-primary-100"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                    <Button onClick={handleUploadCV} isLoading={saving} disabled={!uploadFile}>Upload</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Template</h3>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setActiveCV(null); // Switch back to builder when template is changed
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${selectedTemplate === template.id ? 'bg-primary-50 border-2 border-primary-500' : 'border-2 border-slate-200 hover:border-slate-300'}`}
                  >
                    <p className="font-medium text-slate-900">{template.name}</p>
                    <p className="text-xs text-slate-500">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <section.icon className="h-4 w-4" />
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <p className="text-sm text-primary-100 mb-3">Let AI help you write compelling descriptions and optimize your CV.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAIEnhance}
                isLoading={enhancing}
                className="w-full bg-white text-primary-600 hover:bg-primary-50"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Enhance Experience
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                {activeSection === 'personal' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="First Name" value={personalInfo.firstName} onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })} />
                      <Input label="Last Name" value={personalInfo.lastName} onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })} />
                      <Input label="Email" type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} icon={<Mail className="h-4 w-4" />} />
                      <Input label="Phone" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} icon={<Phone className="h-4 w-4" />} />
                      <Input label="Location" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} icon={<MapPin className="h-4 w-4" />} />
                      <Input label="LinkedIn" value={personalInfo.linkedin} onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} icon={<Linkedin className="h-4 w-4" />} />
                      <Input label="GitHub" value={personalInfo.github} onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })} icon={<Github className="h-4 w-4" />} />
                    </div>
                  </div>
                )}

                {activeSection === 'summary' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Professional Summary</h2>
                      <Button variant="ghost" size="sm" onClick={handleAIGenerateSummary} isLoading={generatingSummary} leftIcon={<Sparkles className="h-4 w-4" />}>Generate with AI</Button>
                    </div>
                    <textarea
                      value={personalInfo.summary}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                      rows={8}
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Write a brief summary of your professional background and career goals..."
                    />
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Work Experience</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleAIEnhance} leftIcon={<Wand2 className="h-4 w-4" />}>AI Enhance</Button>
                        <Button onClick={addExperience} size="sm" leftIcon={<Plus className="h-4 w-4" />}>Add Entry</Button>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {experience.map((exp, index) => (
                        <div key={exp.id} className="p-6 border border-slate-200 rounded-xl space-y-4 relative bg-slate-50/30">
                          <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><X className="h-5 w-5" /></button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Job Title" value={exp.title} onChange={(e) => { const u = [...experience]; u[index].title = e.target.value; setExperience(u); }} />
                            <Input label="Company" value={exp.company} onChange={(e) => { const u = [...experience]; u[index].company = e.target.value; setExperience(u); }} />
                            <Input label="Location" value={exp.location} onChange={(e) => { const u = [...experience]; u[index].location = e.target.value; setExperience(u); }} />
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="month" label="Start Date" value={exp.startDate} onChange={(e) => { const u = [...experience]; u[index].startDate = e.target.value; setExperience(u); }} />
                              <Input type="month" label="End Date" value={exp.endDate} disabled={exp.current} onChange={(e) => { const u = [...experience]; u[index].endDate = e.target.value; setExperience(u); }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={exp.current} onChange={(e) => { const u = [...experience]; u[index].current = e.target.checked; if (e.target.checked) u[index].endDate = ''; setExperience(u); }} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <label className="text-sm font-medium text-slate-700">I currently work here</label>
                          </div>
                          <textarea
                            value={exp.description}
                            onChange={(e) => { const u = [...experience]; u[index].description = e.target.value; setExperience(u); }}
                            rows={4}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Key responsibilities and achievements..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Education</h2>
                      <Button onClick={addEducation} size="sm" leftIcon={<Plus className="h-4 w-4" />}>Add Education</Button>
                    </div>
                    <div className="space-y-8">
                      {education.map((edu, index) => (
                        <div key={edu.id} className="p-6 border border-slate-200 rounded-xl space-y-4 relative bg-slate-50/30">
                          <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><X className="h-5 w-5" /></button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="School / University" value={edu.school} onChange={(e) => { const u = [...education]; u[index].school = e.target.value; setEducation(u); }} />
                            <Input label="Degree" value={edu.degree} onChange={(e) => { const u = [...education]; u[index].degree = e.target.value; setEducation(u); }} />
                            <Input label="Field of Study" value={edu.field} onChange={(e) => { const u = [...education]; u[index].field = e.target.value; setEducation(u); }} />
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="month" label="Start Date" value={edu.startDate} onChange={(e) => { const u = [...education]; u[index].startDate = e.target.value; setEducation(u); }} />
                              <Input type="month" label="End Date" value={edu.endDate} disabled={edu.current} onChange={(e) => { const u = [...education]; u[index].endDate = e.target.value; setEducation(u); }} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={edu.current} onChange={(e) => { const u = [...education]; u[index].current = e.target.checked; if (e.target.checked) u[index].endDate = ''; setEducation(u); }} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <label className="text-sm font-medium text-slate-700">Currently studying here</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === 'history' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">My CV Library</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)} leftIcon={<Upload className="h-4 w-4" />}>Upload New</Button>
                        <Button variant="outline" size="sm" onClick={() => setShowVersionModal(true)} leftIcon={<GitBranch className="h-4 w-4" />}>Save Current as Version</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Current Draft */}
                      <div className="p-4 border-2 border-primary-100 bg-primary-50/30 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <FileText className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Current Builder Draft</p>
                            <p className="text-xs text-slate-500">The version you are currently editing above</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => { setActiveCV(null); setShowPreview(true); }}>Preview Draft</Button>
                      </div>

                      {/* Saved Versions */}
                      {cvVersions.map(cv => (
                        <div key={cv.id} className={`p-4 border ${cv.is_primary ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-primary-200'} rounded-xl flex items-center justify-between transition-colors`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${cv.is_uploaded ? 'bg-amber-100' : 'bg-blue-100'}`}>
                              {cv.is_uploaded ? <Upload className="h-5 w-5 text-amber-600" /> : <GitBranch className="h-5 w-5 text-blue-600" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-900">{cv.title}</p>
                                {cv.is_primary && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                    <CheckCircle2 className="h-3 w-3" /> Current
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {cv.is_uploaded ? 'Uploaded PDF' : 'Builder Version'} • {new Date(cv.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!cv.is_primary && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetPrimary(cv.id)}
                                title="Use this CV for all future job applications"
                                className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                            {!cv.is_uploaded && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLoadForEditing(cv)}
                                title="Load this version into the editor to modify it"
                                className="text-slate-400 hover:text-primary-600"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCvToRename(cv);
                                setNewTitle(cv.title);
                              }}
                              title="Rename this CV"
                              className="text-slate-400 hover:text-primary-600"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => selectVersion(cv)} leftIcon={<Eye className="h-4 w-4" />}>View</Button>
                            {cv.file_url && (
                              <a
                                href={`http://localhost:8000${cv.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs bg-transparent hover:bg-slate-100 text-slate-700"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCvToDelete(cv)}
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                              title="Delete this CV"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {cvVersions.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                          <HistoryIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                          <p className="text-slate-500 italic">No saved versions yet. Use "Save Version" or "Upload" to start your library.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
                    <div className="flex gap-2">
                      <Input placeholder="Add a skill (e.g. React, Project Management)..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                      <Button onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {skills.map(skill => (
                        <Badge key={skill} variant="default" className="pl-3 pr-2 py-2 flex items-center gap-2 text-sm">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-white/80 transition-colors"><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                      {skills.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No skills added yet. Use the input above to add your professional skills.</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Eye className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">CV Preview</h2>
                    <p className="text-xs text-slate-500">
                      {activeCV ? (
                        <>Viewing: <span className="font-medium text-primary-600">{activeCV.title}</span></>
                      ) : (
                        <>Template: <span className="capitalize font-medium">{selectedTemplate}</span></>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    if (activeCV?.file_url) {
                      window.open(`http://localhost:8000${activeCV.file_url}`, '_blank');
                    } else {
                      const oldTitle = document.title;
                      document.title = activeCV ? activeCV.title : `${personalInfo.firstName}_${personalInfo.lastName}_CV`;
                      window.print();
                      setTimeout(() => document.title = oldTitle, 100);
                    }
                  }} leftIcon={<Download className="h-4 w-4" />}>Download</Button>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Modal Body (The Resume or PDF) */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                {activeCV?.is_uploaded ? (
                  <div className="w-full h-full min-h-[700px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <iframe
                      src={`http://localhost:8000${activeCV.file_url}`}
                      className="w-full h-full min-h-[700px]"
                      title="CV Viewer"
                    />
                  </div>
                ) : (
                  <div id="cv-content" className={`mx-auto bg-white shadow-sm min-h-[1000px] w-full max-w-[800px] ${selectedTemplate === 'modern' ? 'font-sans p-12' :
                    selectedTemplate === 'professional' ? 'font-serif p-16 border-t-[12px] border-slate-800' :
                      selectedTemplate === 'creative' ? 'font-sans p-0 flex' :
                        'font-sans p-12 space-y-8'
                    }`}>
                    {activeCV?.content_html ? (
                      <div dangerouslySetInnerHTML={{ __html: activeCV.content_html }} />
                    ) : (
                      <>
                        {/* Template rendering logic follows... (Original code) */}

                        {/* Template: Creative Sidebar */}
                        {selectedTemplate === 'creative' && (
                          <div className="w-64 bg-slate-900 text-white p-8 flex flex-col gap-8">
                            <div className="space-y-4">
                              <div className="h-32 w-32 bg-primary-500 rounded-2xl mx-auto flex items-center justify-center">
                                <span className="text-4xl font-bold">{personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}</span>
                              </div>
                              <h1 className="text-xl font-bold text-center uppercase tracking-wider">{personalInfo.firstName} {personalInfo.lastName}</h1>
                            </div>

                            <div className="space-y-6">
                              <section>
                                <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Contact</h3>
                                <div className="space-y-2 text-xs text-slate-300">
                                  <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> {personalInfo.email}</p>
                                  {personalInfo.phone && <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {personalInfo.phone}</p>}
                                  {personalInfo.location && <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> {personalInfo.location}</p>}
                                </div>
                              </section>

                              <section>
                                <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                  {skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-white/10 rounded text-[10px]">{s}</span>
                                  ))}
                                </div>
                              </section>
                            </div>
                          </div>
                        )}

                        {/* Main Content Area */}
                        <div className={`${selectedTemplate === 'creative' ? 'flex-1 p-10' : 'w-full'} ${selectedTemplate === 'minimal' ? 'max-w-3xl mx-auto' : ''}`}>
                          {/* Header: Modern/Professional/Minimal */}
                          {selectedTemplate !== 'creative' && (
                            <div className={`mb-10 ${selectedTemplate === 'modern' ? 'border-l-4 border-primary-600 pl-6' :
                              selectedTemplate === 'professional' ? 'text-center' :
                                'border-b border-slate-100 pb-8'
                              }`}>
                              <h1 className={`font-bold text-slate-900 uppercase tracking-wide ${selectedTemplate === 'professional' ? 'text-5xl mb-4' :
                                selectedTemplate === 'minimal' ? 'text-3xl font-light' :
                                  'text-4xl'
                                }`}>
                                {personalInfo.firstName} {personalInfo.lastName}
                              </h1>
                              <div className={`flex flex-wrap gap-4 mt-3 text-sm text-slate-600 ${selectedTemplate === 'professional' ? 'justify-center border-y py-3' : ''}`}>
                                <span className="flex items-center gap-1 font-medium"><Mail className="h-3 w-3 text-primary-500" /> {personalInfo.email}</span>
                                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-primary-500" /> {personalInfo.phone}</span>}
                                {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary-500" /> {personalInfo.location}</span>}
                              </div>
                            </div>
                          )}

                          {/* Summary Section */}
                          {personalInfo.summary && (
                            <div className="mb-10">
                              <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                                selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                                  selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                                    'text-sm text-slate-500'
                                }`}>Professional Profile</h3>
                              <p className={`text-slate-700 leading-relaxed ${selectedTemplate === 'professional' ? 'text-base text-center italic' :
                                selectedTemplate === 'minimal' ? 'text-sm font-light leading-loose' :
                                  'text-sm text-justify'
                                }`}>
                                {personalInfo.summary}
                              </p>
                            </div>
                          )}

                          {/* Experience Section */}
                          {experience.length > 0 && (
                            <div className="mb-10">
                              <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                                selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                                  selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                                    'text-sm text-slate-500'
                                }`}>Work History</h3>
                              <div className="space-y-6">
                                {experience.map((exp) => (
                                  <div key={exp.id} className={selectedTemplate === 'minimal' ? 'border-l pl-4' : ''}>
                                    <div className="flex justify-between items-baseline mb-1">
                                      <h4 className={`font-bold text-slate-800 ${selectedTemplate === 'professional' ? 'text-lg' : 'text-base'}`}>{exp.title}</h4>
                                      <span className="text-xs font-semibold text-slate-400 italic">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-primary-600 font-medium mb-2">
                                      <span>{exp.company}</span>
                                      <span className="text-slate-400 font-normal">{exp.location}</span>
                                    </div>
                                    <p className={`text-slate-600 text-sm leading-relaxed ${selectedTemplate === 'modern' ? 'ml-2 border-l-2 border-slate-100 pl-4' : ''}`}>
                                      {exp.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Education Section */}
                          {education.length > 0 && (
                            <div className="mb-10">
                              <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                                selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                                  selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                                    'text-sm text-slate-500'
                                }`}>Education</h3>
                              <div className="space-y-4">
                                {education.map((edu) => (
                                  <div key={edu.id} className={selectedTemplate === 'minimal' ? 'border-l pl-4' : ''}>
                                    <div className="flex justify-between items-baseline">
                                      <h4 className="font-bold text-slate-800 text-base">{edu.degree} in {edu.field}</h4>
                                      <span className="text-xs font-semibold text-slate-500 italic">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
                                    </div>
                                    <p className="text-sm text-primary-600 font-medium">{edu.school}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Skills Section for non-creative */}
                          {selectedTemplate !== 'creative' && skills.length > 0 && (
                            <div>
                              <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                                selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                                  'text-sm text-slate-500'
                                }`}>Core Competencies</h3>
                              <div className={`flex flex-wrap gap-2 mt-4 ${selectedTemplate === 'professional' ? 'justify-center' : ''}`}>
                                {skills.map((skill) => (
                                  <span key={skill} className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-tighter ${selectedTemplate === 'minimal' ? 'bg-white border text-slate-600' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hidden CV Container for Saving */}
      <div id="hidden-cv-container" style={{ position: 'absolute', top: '-10000px', left: '-10000px', width: '800px' }}>
        <div className={`mx-auto bg-white shadow-sm min-h-[1000px] w-full max-w-[800px] ${selectedTemplate === 'modern' ? 'font-sans p-12' :
          selectedTemplate === 'professional' ? 'font-serif p-16 border-t-[12px] border-slate-800' :
            selectedTemplate === 'creative' ? 'font-sans p-0 flex' :
              'font-sans p-12 space-y-8'
          }`}>

          {/* Template: Creative Sidebar */}
          {selectedTemplate === 'creative' && (
            <div className="w-64 bg-slate-900 text-white p-8 flex flex-col gap-8">
              <div className="space-y-4">
                <div className="h-32 w-32 bg-primary-500 rounded-2xl mx-auto flex items-center justify-center">
                  <span className="text-4xl font-bold">{personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}</span>
                </div>
                <h1 className="text-xl font-bold text-center uppercase tracking-wider">{personalInfo.firstName} {personalInfo.lastName}</h1>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Contact</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    <p className="flex items-center gap-2"><span>✉</span> {personalInfo.email}</p>
                    {personalInfo.phone && <p className="flex items-center gap-2"><span>📱</span> {personalInfo.phone}</p>}
                    {personalInfo.location && <p className="flex items-center gap-2"><span>📍</span> {personalInfo.location}</p>}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="px-2 py-1 bg-white/10 rounded text-[10px]">{s}</span>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={`${selectedTemplate === 'creative' ? 'flex-1 p-10' : 'w-full'} ${selectedTemplate === 'minimal' ? 'max-w-3xl mx-auto' : ''}`}>
            {/* Header: Modern/Professional/Minimal */}
            {selectedTemplate !== 'creative' && (
              <div className={`mb-10 ${selectedTemplate === 'modern' ? 'border-l-4 border-primary-600 pl-6' :
                selectedTemplate === 'professional' ? 'text-center' :
                  'border-b border-slate-100 pb-8'
                }`}>
                <h1 className={`font-bold text-slate-900 uppercase tracking-wide ${selectedTemplate === 'professional' ? 'text-5xl mb-4' :
                  selectedTemplate === 'minimal' ? 'text-3xl font-light' :
                    'text-4xl'
                  }`}>
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <div className={`flex flex-wrap gap-4 mt-3 text-sm text-slate-600 ${selectedTemplate === 'professional' ? 'justify-center border-y py-3' : ''}`}>
                  <span className="flex items-center gap-1 font-medium"><span>✉</span> {personalInfo.email}</span>
                  {personalInfo.phone && <span className="flex items-center gap-1"><span>📱</span> {personalInfo.phone}</span>}
                  {personalInfo.location && <span className="flex items-center gap-1"><span>📍</span> {personalInfo.location}</span>}
                </div>
              </div>
            )}

            {/* Summary Section */}
            {personalInfo.summary && (
              <div className="mb-10">
                <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                  selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                    selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                      'text-sm text-slate-500'
                  }`}>Professional Profile</h3>
                <p className={`text-slate-700 leading-relaxed ${selectedTemplate === 'professional' ? 'text-base text-center italic' :
                  selectedTemplate === 'minimal' ? 'text-sm font-light leading-loose' :
                    'text-sm text-justify'
                  }`}>
                  {personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {experience.length > 0 && (
              <div className="mb-10">
                <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                  selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                    selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                      'text-sm text-slate-500'
                  }`}>Work History</h3>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className={selectedTemplate === 'minimal' ? 'border-l pl-4' : ''}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-bold text-slate-800 ${selectedTemplate === 'professional' ? 'text-lg' : 'text-base'}`}>{exp.title}</h4>
                        <span className="text-xs font-semibold text-slate-400 italic">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="flex justify-between text-sm text-primary-600 font-medium mb-2">
                        <span>{exp.company}</span>
                        <span className="text-slate-400 font-normal">{exp.location}</span>
                      </div>
                      <p className={`text-slate-600 text-sm leading-relaxed ${selectedTemplate === 'modern' ? 'ml-2 border-l-2 border-slate-100 pl-4' : ''}`}>
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {education.length > 0 && (
              <div className="mb-10">
                <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                  selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                    selectedTemplate === 'creative' ? 'text-lg text-slate-900 border-b-2 border-primary-500 w-fit' :
                      'text-sm text-slate-500'
                  }`}>Education</h3>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className={selectedTemplate === 'minimal' ? 'border-l pl-4' : ''}>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-slate-800 text-base">{edu.degree} in {edu.field}</h4>
                        <span className="text-xs font-semibold text-slate-500 italic">{edu.startDate} — {edu.current ? 'Present' : edu.endDate}</span>
                      </div>
                      <p className="text-sm text-primary-600 font-medium">{edu.school}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section for non-creative */}
            {selectedTemplate !== 'creative' && skills.length > 0 && (
              <div>
                <h3 className={`font-bold uppercase tracking-widest mb-4 pb-1 ${selectedTemplate === 'modern' ? 'text-lg text-primary-700 border-b border-slate-200' :
                  selectedTemplate === 'professional' ? 'text-base text-center text-slate-800 border-b-2 border-slate-800 mx-auto w-fit px-8' :
                    'text-sm text-slate-500'
                  }`}>Core Competencies</h3>
                <div className={`flex flex-wrap gap-2 mt-4 ${selectedTemplate === 'professional' ? 'justify-center' : ''}`}>
                  {skills.map((skill) => (
                    <span key={skill} className={`px-3 py-1 text-xs font-bold rounded-md uppercase tracking-tighter ${selectedTemplate === 'minimal' ? 'bg-white border text-slate-600' : 'bg-slate-100 text-slate-700'
                      }`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Rename Modal */}
      <AnimatePresence>
        {cvToRename && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Edit2 className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Rename CV</h3>
              </div>

              <div className="space-y-4">
                <Input
                  label="New CV Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer CV"
                  autoFocus
                />

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCvToRename(null)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleRenameCV} isLoading={saving}>Save Changes</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {cvToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            >
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Delete CV?</h3>
              </div>

              <p className="text-slate-600 mb-8">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{cvToDelete.title}"</span>? This action cannot be undone and will remove it from your library.
              </p>

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setCvToDelete(null)}>Cancel</Button>
                <Button variant="danger" className="flex-1" onClick={handleDeleteCV} isLoading={saving}>Delete Permanentely</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout >
  );
}