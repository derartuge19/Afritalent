import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Target,
  Download,
  AlertTriangle,
  CheckCircle,
  ArrowRight } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine } from
'recharts';
import { motion } from 'framer-motion';
const skillSupplyDemand = [
{
  skill: 'React',
  supply: 2400,
  demand: 3200,
  gap: -800
},
{
  skill: 'Python',
  supply: 1800,
  demand: 2800,
  gap: -1000
},
{
  skill: 'Data Science',
  supply: 800,
  demand: 1500,
  gap: -700
},
{
  skill: 'DevOps',
  supply: 600,
  demand: 1200,
  gap: -600
},
{
  skill: 'Product Mgmt',
  supply: 450,
  demand: 680,
  gap: -230
},
{
  skill: 'UI/UX Design',
  supply: 1200,
  demand: 980,
  gap: 220
},
{
  skill: 'Sales',
  supply: 2100,
  demand: 1800,
  gap: 300
},
{
  skill: 'Marketing',
  supply: 1600,
  demand: 1400,
  gap: 200
}];

const sectorAnalysis = [
{
  sector: 'Technology',
  supply: 5200,
  demand: 7800,
  matchRate: 67,
  trend: 'up'
},
{
  sector: 'Finance',
  supply: 2800,
  demand: 3200,
  matchRate: 88,
  trend: 'up'
},
{
  sector: 'Healthcare',
  supply: 1200,
  demand: 1800,
  matchRate: 67,
  trend: 'up'
},
{
  sector: 'Education',
  supply: 1500,
  demand: 1200,
  matchRate: 100,
  trend: 'stable'
},
{
  sector: 'Agriculture',
  supply: 800,
  demand: 1100,
  matchRate: 73,
  trend: 'up'
},
{
  sector: 'Retail',
  supply: 2200,
  demand: 1900,
  matchRate: 100,
  trend: 'down'
}];

const locationData = [
{
  location: 'Addis Ababa',
  supply: 5400,
  demand: 4200,
  balance: 'surplus'
},
{
  location: 'Nairobi',
  supply: 4200,
  demand: 4800,
  balance: 'shortage'
},
{
  location: 'Lagos',
  supply: 3800,
  demand: 5200,
  balance: 'shortage'
},
{
  location: 'Remote',
  supply: 2800,
  demand: 3500,
  balance: 'shortage'
},
{
  location: 'Accra',
  supply: 1500,
  demand: 1200,
  balance: 'surplus'
}];

export function SupplyDemandPage() {
  const [selectedSector, setSelectedSector] = useState('all');
  const metrics = [
  {
    title: 'Talent Supply',
    value: '15,234',
    trend: 12,
    icon: <Users className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Job Demand',
    value: '18,450',
    trend: 15,
    icon: <Briefcase className="h-6 w-6" />,
    color: 'accent' as const
  },
  {
    title: 'Match Rate',
    value: '78%',
    trend: 5,
    icon: <Target className="h-6 w-6" />,
    color: 'success' as const
  },
  {
    title: 'Skill Gaps',
    value: '12',
    trend: -3,
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'blue' as const
  }];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Supply & Demand Analysis
            </h1>
            <p className="text-slate-500">
              Labor market supply and demand insights
            </p>
          </div>
          <div className="flex gap-2">
            <Select
              options={[
              {
                value: 'all',
                label: 'All Sectors'
              },
              {
                value: 'tech',
                label: 'Technology'
              },
              {
                value: 'finance',
                label: 'Finance'
              },
              {
                value: 'healthcare',
                label: 'Healthcare'
              }]
              }
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)} />

            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}>

              Export Report
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        {/* Skill Supply vs Demand Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Skill Supply vs Demand
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillSupplyDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  tick={{
                    fill: '#64748b',
                    fontSize: 12
                  }} />

                <YAxis
                  dataKey="skill"
                  type="category"
                  tick={{
                    fill: '#64748b',
                    fontSize: 12
                  }}
                  width={100} />

                <Tooltip />
                <Legend />
                <ReferenceLine x={0} stroke="#94a3b8" />
                <Bar
                  dataKey="supply"
                  fill="#6366f1"
                  name="Supply (Candidates)"
                  radius={[0, 4, 4, 0]} />

                <Bar
                  dataKey="demand"
                  fill="#f97316"
                  name="Demand (Jobs)"
                  radius={[0, 4, 4, 0]} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Analysis & Location Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Sector Analysis
            </h3>
            <div className="space-y-4">
              {sectorAnalysis.map((sector, index) =>
              <motion.div
                key={sector.sector}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.05
                }}
                className="p-4 bg-slate-50 rounded-lg">

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">
                      {sector.sector}
                    </span>
                    <div className="flex items-center gap-2">
                      {sector.trend === 'up' ?
                    <TrendingUp className="h-4 w-4 text-success-500" /> :
                    sector.trend === 'down' ?
                    <TrendingDown className="h-4 w-4 text-red-500" /> :

                    <ArrowRight className="h-4 w-4 text-slate-400" />
                    }
                      <Badge
                      variant={
                      sector.matchRate >= 90 ?
                      'success' :
                      sector.matchRate >= 70 ?
                      'warning' :
                      'danger'
                      }>

                        {sector.matchRate}% match
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Supply:</span>
                      <span className="ml-2 font-medium text-slate-900">
                        {sector.supply.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Demand:</span>
                      <span className="ml-2 font-medium text-slate-900">
                        {sector.demand.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full rounded-full ${sector.supply >= sector.demand ? 'bg-success-500' : 'bg-amber-500'}`}
                    style={{
                      width: `${Math.min(sector.supply / sector.demand * 100, 100)}%`
                    }} />

                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Location Balance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Location Balance
            </h3>
            <div className="space-y-4">
              {locationData.map((location, index) =>
              <motion.div
                key={location.location}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.05
                }}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">

                  <div>
                    <p className="font-medium text-slate-900">
                      {location.location}
                    </p>
                    <p className="text-sm text-slate-500">
                      {location.supply.toLocaleString()} candidates •{' '}
                      {location.demand.toLocaleString()} jobs
                    </p>
                  </div>
                  <Badge
                  variant={
                  location.balance === 'surplus' ? 'success' : 'warning'
                  }>

                    {location.balance === 'surplus' ?
                  <>
                        <CheckCircle className="h-3 w-3 mr-1" /> Surplus
                      </> :

                  <>
                        <AlertTriangle className="h-3 w-3 mr-1" /> Shortage
                      </>
                  }
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Recommendations */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
              <h4 className="font-medium text-primary-900 mb-2">
                Recommendations
              </h4>
              <ul className="space-y-2 text-sm text-primary-700">
                <li>
                  • Focus recruitment efforts in Lagos and Nairobi to address
                  talent shortages
                </li>
                <li>
                  • Promote remote work opportunities to balance geographic
                  demand
                </li>
                <li>
                  • Partner with training providers to address Python and Data
                  Science skill gaps
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}