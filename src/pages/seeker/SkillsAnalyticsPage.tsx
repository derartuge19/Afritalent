import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Zap,
  ExternalLink
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { getSkillsAnalytics } from '../../lib/api';

export function SkillsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchSkillsAnalytics = async () => {
      try {
        const data = await getSkillsAnalytics();
        setSkillsData(data.skills_data);
        setRadarData(data.radar_data);
        setMarketTrends(data.market_trends);
        setRecommendedCourses(data.recommended_courses);

        // Map metrics to include icons
        const mappedMetrics = data.metrics.map((metric: any) => {
          const iconMap: Record<string, any> = {
            'Skill Score': <Target className="h-6 w-6" />,
            'Market Fit': <TrendingUp className="h-6 w-6" />,
            'Skills Gap': <Zap className="h-6 w-6" />,
            'Certifications': <Award className="h-6 w-6" />
          };
          return {
            ...metric,
            icon: iconMap[metric.title] || <Target className="h-6 w-6" />
          };
        });
        setMetrics(mappedMetrics);
      } catch (error) {
        console.error('Failed to fetch skills analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="seeker">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                    onClick={() => window.open(course.link, '_blank')}
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