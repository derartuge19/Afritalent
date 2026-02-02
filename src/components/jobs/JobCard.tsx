import React from 'react';
import { MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  tags: string[];
  logoColor: string;
}
interface JobCardProps {
  job: Job;
  index?: number;
}
export function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05
      }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary-200">

      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${job.logoColor} text-white font-bold text-lg`}>

              {job.company.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center text-sm text-slate-500">
                <Building2 className="mr-1 h-3.5 w-3.5" />
                {job.company}
              </div>
            </div>
          </div>
          <Badge
            variant={
            job.type === 'Full-time' ?
            'default' :
            job.type === 'Remote' ?
            'success' :
            'secondary'
            }>

            {job.type}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-500">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-slate-400" />
            {job.location}
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-slate-400" />
            {job.salary}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.tags.map((tag) =>
          <span
            key={tag}
            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">

              {tag}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center text-xs text-slate-400">
          <Clock className="mr-1 h-3.5 w-3.5" />
          Posted {job.posted}
        </div>
        <Link to={`/jobs/${job.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200">

            View Details
          </Button>
        </Link>
      </div>
    </motion.div>);

}