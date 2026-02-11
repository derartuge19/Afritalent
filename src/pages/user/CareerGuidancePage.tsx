import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Lightbulb,
  Target,
  MessageSquare,
  Play,
  BookOpen,
  Video,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCareerGuidance, CareerGuidance } from '../../lib/api';

const iconMap: Record<string, any> = {
  Video,
  FileText,
  BookOpen,
  Sparkles
};

export function CareerGuidancePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CareerGuidance | null>(null);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('paths');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [interviewStep, setInterviewStep] = useState(0);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const guidance = await getCareerGuidance();
        setData(guidance);
        setSelectedPath(guidance.career_paths[0]);
      } catch (error) {
        console.error('Failed to fetch career guidance:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidance();
  }, []);

  const tabs = [
    { id: 'paths', label: 'Career Paths', icon: Target },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
    { id: 'resources', label: 'Resources', icon: BookOpen }
  ];

  if (loading || !data) {
    return (
      <DashboardLayout role="user">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="user">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Career Guidance</h1>
          <p className="text-slate-500">
            Personalized career growth plan based on your profile
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          )}
        </div>

        {/* Career Paths Tab */}
        {activeTab === 'paths' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-semibold text-slate-900">Recommended Paths</h3>
              {data.career_paths.map((path) =>
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${selectedPath?.id === path.id ? 'bg-primary-50 border-2 border-primary-500' : 'bg-white border-2 border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{path.title}</h4>
                    <Badge variant={path.match >= 90 ? 'success' : 'default'}>
                      {path.match}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">{path.timeline} • {path.salary}</p>
                </button>
              )}
            </div>

            <div className="lg:col-span-2">
              {selectedPath && (
                <motion.div
                  key={selectedPath.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedPath.title}</h2>
                      <p className="text-slate-500 mt-1">{selectedPath.description}</p>
                    </div>
                    <Badge variant="success" className="text-lg px-4 py-2">{selectedPath.match}% Match</Badge>
                  </div>

                  <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-primary-600" />
                      <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">AI Insight</span>
                    </div>
                    <p className="text-sm text-primary-900 leading-relaxed italic">
                      "{selectedPath.ai_insight}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Timeline</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedPath.timeline}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500">Expected Salary</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedPath.salary}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Skills to Develop & Resources</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.skills.map((skill: { name: string; url: string }) => (
                        <button
                          key={skill.name}
                          onClick={() => skill.url !== '#' && window.open(skill.url, '_blank')}
                          className="group"
                        >
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 cursor-pointer transition-all ${skill.url !== '#' ? 'hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700' : ''}`}
                          >
                            {skill.name}
                            {skill.url !== '#' && <ExternalLink className="h-3 w-3 ml-1.5 opacity-0 group-hover:opacity-100" />}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Roadmap</h3>
                    <div className="space-y-3">
                      {[
                        { step: 1, title: 'Complete advanced certification', status: 'current' },
                        { step: 2, title: 'Build portfolio projects', status: 'pending' },
                        { step: 3, title: 'Interview and Negotiate', status: 'pending' }
                      ].map((item) => (
                        <div key={item.step} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'current' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="text-sm font-medium">{item.step}</span>
                          </div>
                          <span className={`text-sm ${item.status === 'current' ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setShowRoadmap(true)}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    View Detailed Roadmap
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        }

        {/* Interview Prep Tab */}
        {activeTab === 'interview' &&
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-slate-900">Personalized Questions</h3>
              </div>
              <div className="space-y-3">
                {data.common_questions.map((item, index) =>
                  <div
                    key={index}
                    onClick={() => {
                      setShowInterview(true);
                      setInterviewStep(index);
                    }}
                    className="p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-700 font-medium">{item.question}</span>
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 italic">Suggested: {item.hint}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">AI Mock Interview</h3>
                </div>
                <p className="text-primary-100 mb-4">Practice with our AI interviewer based on your specific profile and career goals.</p>
                <Button
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  onClick={() => {
                    setShowInterview(true);
                    setInterviewStep(0);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Practice Session
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Expert Advice</h3>
                <div className="space-y-3">
                  {data.interview_tips.map((tip, index) =>
                    <div key={index} className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }

        {/* Resources Tab */}
        {activeTab === 'resources' &&
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.interview_resources?.map((resource, index) => {
              const Icon = iconMap[resource.icon] || BookOpen;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => window.open(resource.url, '_blank')}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all group cursor-pointer hover:border-primary-300">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${resource.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{resource.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {resource.duration}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); window.open(resource.url, '_blank'); }}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        }
      </div>

      {/* Roadmap Modal */}
      <AnimatePresence>
        {showRoadmap && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-xl border border-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Detailed Roadmap: {selectedPath?.title}</h3>
                <button onClick={() => setShowRoadmap(false)} className="text-slate-400 hover:text-slate-600"><Sparkles className="h-5 w-5" /></button>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-100 before:h-full">
                {[
                  { phase: 'Phase 1: Foundation', items: ['Master core architecture patterns', 'Learn advanced ' + (selectedPath?.skills?.[0]?.name || 'relevant skill'), 'Obtain professional certification'] },
                  { phase: 'Phase 2: Execution', items: ['Build 3 high-scale portfolio projects', 'Contribute to open source', 'Peer mentoring'] },
                  { phase: 'Phase 3: Impact', items: ['Business strategy alignment', 'Leading complex deployments', 'Final interview prep'] }
                ].map((phase, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold z-10">{i + 1}</div>
                    <h4 className="font-semibold text-slate-900 mb-2">{phase.phase}</h4>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-8" onClick={() => setShowRoadmap(false)}>Close Roadmap</Button>
            </motion.div>
          </div>
        )}

        {showInterview && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">AI Interviewer</h3>
                  <p className="text-xs text-slate-500">Practicing for {selectedPath?.title}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-6 min-h-[120px]">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                    {interviewStep < data.common_questions.length ? data.common_questions[interviewStep].category : 'Complete'}
                  </Badge>
                </div>
                <p className="text-slate-700 font-medium mb-4">
                  "{interviewStep < data.common_questions.length ? data.common_questions[interviewStep].question : 'Great job! You have completed the session.'}"
                </p>
                {interviewStep < data.common_questions.length && (
                  <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <p className="text-xs text-primary-700">
                      <span className="font-bold">Suggested Focus:</span> {data.common_questions[interviewStep].hint}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {interviewStep < data.common_questions.length ? (
                  <>
                    <p className="text-xs text-slate-400 text-center">Think about your answer using the STAR method...</p>
                    <Button className="w-full" onClick={() => setInterviewStep(prev => prev + 1)}>Next Question</Button>
                  </>
                ) : (
                  <Button className="w-full" variant="outline" onClick={() => setShowInterview(false)}>Finish Session</Button>
                )}
                <button onClick={() => setShowInterview(false)} className="w-full text-xs text-slate-400 hover:text-slate-600">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}