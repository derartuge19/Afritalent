import React, { useState, createElement } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import {
  Target,
  Sparkles,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Brain,
  Zap,
  Shield,
  BarChart2 } from
'lucide-react';
import { motion } from 'framer-motion';
interface ScreeningResult {
  id: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  trainabilityScore: number;
  riskIndicators: string[];
  strengths: string[];
  gaps: string[];
  recommendation: 'strong' | 'consider' | 'review' | 'reject';
}
const screeningResults: ScreeningResult[] = [
{
  id: '1',
  candidateName: 'Sarah Kebede',
  jobTitle: 'Senior Frontend Engineer',
  overallScore: 95,
  skillMatch: 98,
  experienceMatch: 92,
  trainabilityScore: 88,
  riskIndicators: [],
  strengths: [
  'Strong React expertise',
  'Leadership experience',
  'Open source contributions'],

  gaps: ['Limited AWS experience'],
  recommendation: 'strong'
},
{
  id: '2',
  candidateName: 'David Mwangi',
  jobTitle: 'Product Manager',
  overallScore: 88,
  skillMatch: 85,
  experienceMatch: 90,
  trainabilityScore: 92,
  riskIndicators: ['Short tenure at previous role'],
  strengths: [
  'Strong analytical skills',
  'Agile certification',
  'Fintech experience'],

  gaps: ['No B2B experience'],
  recommendation: 'consider'
},
{
  id: '3',
  candidateName: 'Amara Okonkwo',
  jobTitle: 'Data Scientist',
  overallScore: 92,
  skillMatch: 95,
  experienceMatch: 88,
  trainabilityScore: 94,
  riskIndicators: [],
  strengths: ['PhD in ML', 'Published research', 'Python expert'],
  gaps: ['Limited production deployment experience'],
  recommendation: 'strong'
},
{
  id: '4',
  candidateName: 'John Tesfaye',
  jobTitle: 'Senior Frontend Engineer',
  overallScore: 65,
  skillMatch: 70,
  experienceMatch: 55,
  trainabilityScore: 78,
  riskIndicators: ['Experience gap', 'Missing key skills'],
  strengths: ['Quick learner', 'Good communication'],
  gaps: [
  'No TypeScript',
  'Limited React experience',
  'No team lead experience'],

  recommendation: 'review'
}];

const recommendationConfig = {
  strong: {
    label: 'Strong Hire',
    color: 'bg-success-100 text-success-700',
    icon: CheckCircle
  },
  consider: {
    label: 'Consider',
    color: 'bg-primary-100 text-primary-700',
    icon: TrendingUp
  },
  review: {
    label: 'Needs Review',
    color: 'bg-amber-100 text-amber-700',
    icon: AlertTriangle
  },
  reject: {
    label: 'Not Recommended',
    color: 'bg-red-100 text-red-700',
    icon: XCircle
  }
};
export function AIScreeningPage() {
  const [selectedCandidate, setSelectedCandidate] =
  useState<ScreeningResult | null>(screeningResults[0]);
  const metrics = [
  {
    title: 'Candidates Screened',
    value: '142',
    trend: 23,
    icon: <Users className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Strong Matches',
    value: '34',
    trend: 15,
    icon: <Target className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Avg. Match Score',
    value: '78%',
    trend: 5,
    icon: <BarChart2 className="h-6 w-6" />,
    color: 'blue' as const
  },
  {
    title: 'Time Saved',
    value: '45h',
    trend: 30,
    icon: <Zap className="h-6 w-6" />,
    color: 'accent' as const
  }];

  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Screening</h1>
            <p className="text-slate-500">
              Automated candidate evaluation powered by AI
            </p>
          </div>
          <Button leftIcon={<Sparkles className="h-4 w-4" />}>
            Run New Screening
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">
                Recent Screenings
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {screeningResults.map((result) => {
                const RecIcon = recommendationConfig[result.recommendation].icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => setSelectedCandidate(result)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${selectedCandidate?.id === result.id ? 'bg-primary-50' : ''}`}>

                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">
                        {result.candidateName}
                      </span>
                      <span
                        className={`text-lg font-bold ${result.overallScore >= 90 ? 'text-success-600' : result.overallScore >= 80 ? 'text-primary-600' : result.overallScore >= 70 ? 'text-amber-600' : 'text-red-600'}`}>

                        {result.overallScore}%
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      {result.jobTitle}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${recommendationConfig[result.recommendation].color}`}>

                      <RecIcon className="h-3 w-3" />
                      {recommendationConfig[result.recommendation].label}
                    </div>
                  </button>);

              })}
            </div>
          </div>

          {/* Detailed View */}
          {selectedCandidate &&
          <div className="lg:col-span-2 space-y-6">
              {/* Score Overview */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedCandidate.candidateName}
                    </h2>
                    <p className="text-slate-500">
                      {selectedCandidate.jobTitle}
                    </p>
                  </div>
                  <div
                  className={`px-4 py-2 rounded-lg ${recommendationConfig[selectedCandidate.recommendation].color}`}>

                    <div className="flex items-center gap-2">
                      {createElement(
                      recommendationConfig[selectedCandidate.recommendation].
                      icon,
                      {
                        className: 'h-5 w-5'
                      }
                    )}
                      <span className="font-semibold">
                        {
                      recommendationConfig[selectedCandidate.recommendation].
                      label
                      }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="space-y-4">
                  {[
                {
                  label: 'Overall Match',
                  value: selectedCandidate.overallScore,
                  color: 'bg-primary-500'
                },
                {
                  label: 'Skill Match',
                  value: selectedCandidate.skillMatch,
                  color: 'bg-success-500'
                },
                {
                  label: 'Experience Match',
                  value: selectedCandidate.experienceMatch,
                  color: 'bg-blue-500'
                },
                {
                  label: 'Trainability',
                  value: selectedCandidate.trainabilityScore,
                  color: 'bg-purple-500'
                }].
                map((score) =>
                <div key={score.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{score.label}</span>
                        <span className="font-semibold text-slate-900">
                          {score.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                      initial={{
                        width: 0
                      }}
                      animate={{
                        width: `${score.value}%`
                      }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeOut'
                      }}
                      className={`h-full ${score.color} rounded-full`} />

                      </div>
                    </div>
                )}
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-success-100">
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedCandidate.strengths.map((strength, idx) =>
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600">

                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                  )}
                  </ul>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Skill Gaps</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedCandidate.gaps.map((gap, idx) =>
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-slate-600">

                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        {gap}
                      </li>
                  )}
                  </ul>
                </div>
              </div>

              {/* Risk Indicators */}
              {selectedCandidate.riskIndicators.length > 0 &&
            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">
                      Risk Indicators
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedCandidate.riskIndicators.map((risk, idx) =>
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-red-700">

                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {risk}
                      </li>
                )}
                  </ul>
                </div>
            }

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">Schedule Interview</Button>
                <Button variant="outline" className="flex-1">
                  Send Assessment
                </Button>
                <Button variant="ghost">View Full Profile</Button>
              </div>
            </div>
          }
        </div>
      </div>
    </DashboardLayout>);

}