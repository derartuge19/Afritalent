import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  StarOff,
  ChevronDown,
  Download,
  MessageSquare,
  Calendar,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  User } from
'lucide-react';
import { motion } from 'framer-motion';
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedFor: string;
  matchScore: number;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string;
  experience: string;
  skills: string[];
  starred: boolean;
  avatar: string;
}
const candidates: Candidate[] = [
{
  id: '1',
  name: 'Sarah Kebede',
  email: 'sarah.k@email.com',
  phone: '+251 91 234 5678',
  location: 'Addis Ababa, Ethiopia',
  appliedFor: 'Senior Frontend Engineer',
  matchScore: 95,
  status: 'interview',
  appliedDate: '2024-01-20',
  experience: '6 years',
  skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
  starred: true,
  avatar: 'SK'
},
{
  id: '2',
  name: 'David Mwangi',
  email: 'david.m@email.com',
  phone: '+254 72 345 6789',
  location: 'Nairobi, Kenya',
  appliedFor: 'Product Manager',
  matchScore: 88,
  status: 'screening',
  appliedDate: '2024-01-19',
  experience: '5 years',
  skills: ['Product Strategy', 'Agile', 'Data Analysis'],
  starred: false,
  avatar: 'DM'
},
{
  id: '3',
  name: 'Amara Okonkwo',
  email: 'amara.o@email.com',
  phone: '+234 80 456 7890',
  location: 'Lagos, Nigeria',
  appliedFor: 'Data Scientist',
  matchScore: 92,
  status: 'new',
  appliedDate: '2024-01-21',
  experience: '4 years',
  skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
  starred: true,
  avatar: 'AO'
},
{
  id: '4',
  name: 'John Tesfaye',
  email: 'john.t@email.com',
  phone: '+251 92 567 8901',
  location: 'Addis Ababa, Ethiopia',
  appliedFor: 'Senior Frontend Engineer',
  matchScore: 75,
  status: 'rejected',
  appliedDate: '2024-01-18',
  experience: '3 years',
  skills: ['React', 'JavaScript', 'CSS'],
  starred: false,
  avatar: 'JT'
},
{
  id: '5',
  name: 'Fatima Hassan',
  email: 'fatima.h@email.com',
  phone: '+251 93 678 9012',
  location: 'Dire Dawa, Ethiopia',
  appliedFor: 'Senior Frontend Engineer',
  matchScore: 82,
  status: 'offer',
  appliedDate: '2024-01-15',
  experience: '5 years',
  skills: ['React', 'Vue.js', 'TypeScript', 'GraphQL'],
  starred: true,
  avatar: 'FH'
}];

const statusConfig = {
  new: {
    label: 'New',
    variant: 'default' as const,
    color: 'bg-blue-500'
  },
  screening: {
    label: 'Screening',
    variant: 'warning' as const,
    color: 'bg-amber-500'
  },
  interview: {
    label: 'Interview',
    variant: 'default' as const,
    color: 'bg-primary-500'
  },
  offer: {
    label: 'Offer Sent',
    variant: 'success' as const,
    color: 'bg-success-500'
  },
  hired: {
    label: 'Hired',
    variant: 'success' as const,
    color: 'bg-green-600'
  },
  rejected: {
    label: 'Rejected',
    variant: 'secondary' as const,
    color: 'bg-slate-400'
  }
};
const stages = [
'All',
'New',
'Screening',
'Interview',
'Offer',
'Hired',
'Rejected'];

export function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedJob, setSelectedJob] = useState('all');
  const [starredCandidates, setStarredCandidates] = useState<Set<string>>(
    new Set(candidates.filter((c) => c.starred).map((c) => c.id))
  );
  const toggleStar = (id: string) => {
    setStarredCandidates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage =
    selectedStage === 'All' ||
    candidate.status === selectedStage.toLowerCase();
    const matchesJob =
    selectedJob === 'all' || candidate.appliedFor === selectedJob;
    return matchesSearch && matchesStage && matchesJob;
  });
  const stageCounts = stages.reduce(
    (acc, stage) => {
      acc[stage] =
      stage === 'All' ?
      candidates.length :
      candidates.filter((c) => c.status === stage.toLowerCase()).length;
      return acc;
    },
    {} as Record<string, number>
  );
  return (
    <DashboardLayout role="employer">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500">
            Review and manage applicants for your job postings
          </p>
        </div>

        {/* Pipeline Stages */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage) =>
          <button
            key={stage}
            onClick={() => setSelectedStage(stage)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedStage === stage ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>

              {stage}
              <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${selectedStage === stage ? 'bg-white/20' : 'bg-slate-200'}`}>

                {stageCounts[stage]}
              </span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />} />

          </div>
          <Select
            options={[
            {
              value: 'all',
              label: 'All Jobs'
            },
            {
              value: 'Senior Frontend Engineer',
              label: 'Senior Frontend Engineer'
            },
            {
              value: 'Product Manager',
              label: 'Product Manager'
            },
            {
              value: 'Data Scientist',
              label: 'Data Scientist'
            }]
            }
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)} />

        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCandidates.map((candidate, index) =>
          <motion.div
            key={candidate.id}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.05
            }}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                    {candidate.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {candidate.appliedFor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                  onClick={() => toggleStar(candidate.id)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">

                    {starredCandidates.has(candidate.id) ?
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> :

                  <StarOff className="h-5 w-5 text-slate-400" />
                  }
                  </button>
                  <Badge variant={statusConfig[candidate.status].variant}>
                    {statusConfig[candidate.status].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  {candidate.location}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="h-4 w-4 mr-2 text-slate-400" />
                  {candidate.experience} experience
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {candidate.skills.slice(0, 4).map((skill) =>
              <span
                key={skill}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">

                    {skill}
                  </span>
              )}
                {candidate.skills.length > 4 &&
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-md">
                    +{candidate.skills.length - 4}
                  </span>
              }
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1">
                  <div
                  className={`text-lg font-bold ${candidate.matchScore >= 90 ? 'text-success-600' : candidate.matchScore >= 80 ? 'text-primary-600' : candidate.matchScore >= 70 ? 'text-amber-600' : 'text-slate-600'}`}>

                    {candidate.matchScore}%
                  </div>
                  <span className="text-xs text-slate-500">match</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {filteredCandidates.length === 0 &&
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              No candidates found matching your criteria
            </p>
          </div>
        }
      </div>
    </DashboardLayout>);

}