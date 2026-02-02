import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BookOpen,
  Zap,
  ArrowRight,
  ExternalLink,
  Star,
  BarChart2 } from
'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip } from
'recharts';
import { motion } from 'framer-motion';
const skillsData = [
{
  skill: 'React',
  level: 90,
  demand: 95
},
{
  skill: 'TypeScript',
  level: 85,
  demand: 90
},
{
  skill: 'Node.js',
  level: 75,
  demand: 85
},
{
  skill: 'Python',
  level: 60,
  demand: 88
},
{
  skill: 'AWS',
  level: 50,
  demand: 82
},
{
  skill: 'SQL',
  level: 70,
  demand: 78
}];

const radarData = [
{
  subject: 'Frontend',
  A: 90,
  fullMark: 100
},
{
  subject: 'Backend',
  A: 70,
  fullMark: 100
},
{
  subject: 'DevOps',
  A: 50,
  fullMark: 100
},
{
  subject: 'Data',
  A: 55,
  fullMark: 100
},
{
  subject: 'Mobile',
  A: 40,
  fullMark: 100
},
{
  subject: 'Design',
  A: 65,
  fullMark: 100
}];

const recommendedCourses = [
{
  id: '1',
  title: 'AWS Solutions Architect',
  provider: 'AWS',
  duration: '40 hours',
  level: 'Intermediate',
  relevance: 95,
  image:
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=60&fit=crop'
},
{
  id: '2',
  title: 'Python for Data Science',
  provider: 'Coursera',
  duration: '30 hours',
  level: 'Beginner',
  relevance: 88,
  image:
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=60&fit=crop'
},
{
  id: '3',
  title: 'Docker & Kubernetes',
  provider: 'Udemy',
  duration: '25 hours',
  level: 'Intermediate',
  relevance: 82,
  image:
  'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=100&h=60&fit=crop'
}];

const marketTrends = [
{
  skill: 'AI/ML',
  trend: 45,
  direction: 'up'
},
{
  skill: 'Cloud',
  trend: 38,
  direction: 'up'
},
{
  skill: 'React',
  trend: 25,
  direction: 'up'
},
{
  skill: 'DevOps',
  trend: 22,
  direction: 'up'
},
{
  skill: 'PHP',
  trend: -15,
  direction: 'down'
},
{
  skill: 'jQuery',
  trend: -28,
  direction: 'down'
}];

export function SkillsAnalyticsPage() {
  const metrics = [
  {
    title: 'Skill Score',
    value: '78/100',
    trend: 5,
    icon: <Target className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Market Fit',
    value: '85%',
    trend: 8,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Skills Gap',
    value: '3',
    trend: -2,
    icon: <Zap className="h-6 w-6" />,
    color: 'accent' as const
  },
  {
    title: 'Certifications',
    value: '4',
    trend: 1,
    icon: <Award className="h-6 w-6" />,
    color: 'blue' as const
  }];

  return (
    <DashboardLayout role="seeker">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Skills Analytics
          </h1>
          <p className="text-slate-500">
            Understand how your skills compare to market demand
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Radar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Skills Overview
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />

                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{
                      fill: '#64748b',
                      fontSize: 10
                    }} />

                  <Radar
                    name="Your Skills"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3} />

                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills vs Demand */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Your Skills vs Market Demand
            </h3>
            <div className="space-y-4">
              {skillsData.map((skill) =>
              <div key={skill.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">
                      {skill.skill}
                    </span>
                    <span className="text-slate-500">
                      {skill.level}% / {skill.demand}% demand
                    </span>
                  </div>
                  <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                    className="absolute h-full bg-slate-300 rounded-full"
                    style={{
                      width: `${skill.demand}%`
                    }} />

                    <div
                    className={`absolute h-full rounded-full ${skill.level >= skill.demand ? 'bg-success-500' : 'bg-primary-500'}`}
                    style={{
                      width: `${skill.level}%`
                    }} />

                  </div>
                  {skill.level < skill.demand &&
                <p className="text-xs text-amber-600 mt-1">
                      Gap: {skill.demand - skill.level}% below market demand
                    </p>
                }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Market Trends (6-Month Forecast)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {marketTrends.map((trend) =>
            <div
              key={trend.skill}
              className={`p-4 rounded-lg border ${trend.direction === 'up' ? 'bg-success-50 border-success-100' : 'bg-red-50 border-red-100'}`}>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {trend.skill}
                  </span>
                  {trend.direction === 'up' ?
                <TrendingUp className="h-4 w-4 text-success-600" /> :

                <TrendingDown className="h-4 w-4 text-red-600" />
                }
                </div>
                <p
                className={`text-lg font-bold ${trend.direction === 'up' ? 'text-success-600' : 'text-red-600'}`}>

                  {trend.direction === 'up' ? '+' : ''}
                  {trend.trend}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Recommended Courses
              </h3>
              <p className="text-sm text-slate-500">
                Based on your skill gaps and market demand
              </p>
            </div>
            <Button variant="ghost">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedCourses.map((course, index) =>
            <motion.div
              key={course.id}
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
              className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">

                <div className="h-24 bg-slate-100 relative overflow-hidden">
                  <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover" />

                  <div className="absolute top-2 right-2">
                    <Badge variant="success" className="text-xs">
                      {course.relevance}% relevant
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    {course.provider}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                  <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  rightIcon={<ExternalLink className="h-3 w-3" />}>

                    Start Learning
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>);

}