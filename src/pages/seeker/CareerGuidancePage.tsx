import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import {
  GraduationCap,
  Lightbulb,
  Target,
  MessageSquare,
  Play,
  BookOpen,
  Video,
  FileText,
  ChevronRight,
  Star,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle } from
'lucide-react';
import { motion } from 'framer-motion';
const careerPaths = [
{
  id: '1',
  title: 'Senior Software Engineer',
  match: 92,
  timeline: '1-2 years',
  salary: '$60k - $90k',
  skills: ['System Design', 'Leadership', 'Architecture'],
  description: 'Lead technical projects and mentor junior developers'
},
{
  id: '2',
  title: 'Engineering Manager',
  match: 78,
  timeline: '3-4 years',
  salary: '$80k - $120k',
  skills: ['People Management', 'Strategy', 'Communication'],
  description: 'Manage engineering teams and drive technical strategy'
},
{
  id: '3',
  title: 'Technical Architect',
  match: 85,
  timeline: '2-3 years',
  salary: '$70k - $100k',
  skills: ['Cloud Architecture', 'System Design', 'DevOps'],
  description: 'Design and oversee complex technical systems'
}];

const interviewResources = [
{
  id: '1',
  title: 'Technical Interview Preparation',
  type: 'Course',
  duration: '8 hours',
  icon: Video,
  color: 'bg-blue-100 text-blue-600'
},
{
  id: '2',
  title: 'Behavioral Interview Guide',
  type: 'Guide',
  duration: '30 min read',
  icon: FileText,
  color: 'bg-purple-100 text-purple-600'
},
{
  id: '3',
  title: 'System Design Interview',
  type: 'Course',
  duration: '6 hours',
  icon: Video,
  color: 'bg-amber-100 text-amber-600'
},
{
  id: '4',
  title: 'Salary Negotiation Tips',
  type: 'Article',
  duration: '15 min read',
  icon: BookOpen,
  color: 'bg-green-100 text-green-600'
}];

const commonQuestions = [
'Tell me about yourself',
'Why do you want to work here?',
'What are your greatest strengths?',
'Describe a challenging project you worked on',
'Where do you see yourself in 5 years?',
'Why are you leaving your current job?'];

export function CareerGuidancePage() {
  const [selectedPath, setSelectedPath] = useState(careerPaths[0]);
  const [activeTab, setActiveTab] = useState('paths');
  const tabs = [
  {
    id: 'paths',
    label: 'Career Paths',
    icon: Target
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    icon: MessageSquare
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: BookOpen
  }];

  return (
    <DashboardLayout role="seeker">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Career Guidance</h1>
          <p className="text-slate-500">
            Plan your career path and prepare for interviews
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
            {/* Path Options */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-semibold text-slate-900">
                Recommended Paths
              </h3>
              {careerPaths.map((path) =>
            <button
              key={path.id}
              onClick={() => setSelectedPath(path)}
              className={`w-full p-4 rounded-xl text-left transition-all ${selectedPath.id === path.id ? 'bg-primary-50 border-2 border-primary-500' : 'bg-white border-2 border-slate-200 hover:border-slate-300'}`}>

                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">{path.title}</h4>
                    <Badge
                  variant={
                  path.match >= 90 ?
                  'success' :
                  path.match >= 80 ?
                  'default' :
                  'secondary'
                  }>

                      {path.match}% match
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {path.timeline} • {path.salary}
                  </p>
                </button>
            )}
            </div>

            {/* Path Details */}
            <div className="lg:col-span-2">
              <motion.div
              key={selectedPath.id}
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="bg-white rounded-xl border border-slate-200 p-6">

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedPath.title}
                    </h2>
                    <p className="text-slate-500 mt-1">
                      {selectedPath.description}
                    </p>
                  </div>
                  <Badge variant="success" className="text-lg px-4 py-2">
                    {selectedPath.match}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Timeline</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedPath.timeline}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Expected Salary</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedPath.salary}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Skills to Develop
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPath.skills.map((skill) =>
                  <Badge
                    key={skill}
                    variant="outline"
                    className="px-3 py-1">

                        {skill}
                      </Badge>
                  )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Roadmap</h3>
                  <div className="space-y-3">
                    {[
                  {
                    step: 1,
                    title: 'Complete advanced courses',
                    status: 'done'
                  },
                  {
                    step: 2,
                    title: 'Build portfolio projects',
                    status: 'current'
                  },
                  {
                    step: 3,
                    title: 'Get certified',
                    status: 'pending'
                  },
                  {
                    step: 4,
                    title: 'Apply for senior roles',
                    status: 'pending'
                  }].
                  map((item) =>
                  <div key={item.step} className="flex items-center gap-3">
                        <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'done' ? 'bg-success-100 text-success-600' : item.status === 'current' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>

                          {item.status === 'done' ?
                      <CheckCircle className="h-5 w-5" /> :

                      <span className="text-sm font-medium">
                              {item.step}
                            </span>
                      }
                        </div>
                        <span
                      className={`text-sm ${item.status === 'done' ? 'text-slate-500 line-through' : item.status === 'current' ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>

                          {item.title}
                        </span>
                      </div>
                  )}
                  </div>
                </div>

                <Button
                className="w-full"
                rightIcon={<ArrowRight className="h-4 w-4" />}>

                  Start This Path
                </Button>
              </motion.div>
            </div>
          </div>
        }

        {/* Interview Prep Tab */}
        {activeTab === 'interview' &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Common Questions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Common Interview Questions
                </h3>
              </div>
              <div className="space-y-3">
                {commonQuestions.map((question, index) =>
              <button
                key={index}
                className="w-full p-4 text-left rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group">

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 group-hover:text-primary-700">
                        {question}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
                    </div>
                  </button>
              )}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Practice with AI
              </Button>
            </div>

            {/* Mock Interview */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">AI Mock Interview</h3>
                </div>
                <p className="text-primary-100 mb-4">
                  Practice with our AI interviewer and get instant feedback on
                  your responses.
                </p>
                <Button className="bg-white text-primary-600 hover:bg-primary-50">
                  <Play className="h-4 w-4 mr-2" />
                  Start Mock Interview
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Interview Tips
                </h3>
                <div className="space-y-3">
                  {[
                'Research the company thoroughly before the interview',
                'Prepare specific examples using the STAR method',
                'Practice your answers out loud',
                'Prepare thoughtful questions to ask the interviewer',
                'Follow up with a thank you email within 24 hours'].
                map((tip, index) =>
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
            {interviewResources.map((resource, index) =>
          <motion.div
            key={resource.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${resource.color}`}>
                    <resource.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                      <Badge variant="secondary">{resource.type}</Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {resource.duration}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
          )}
          </div>
        }
      </div>
    </DashboardLayout>);

}