import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Globe,
  Share2,
  Bookmark } from
'lucide-react';
import { useParams, Link } from 'react-router-dom';
export function JobDetailPage() {
  const { id } = useParams();
  // Mock data - in a real app, fetch based on ID
  const job = {
    title: 'Senior Frontend Engineer',
    company: 'TechAfrica',
    location: 'Addis Ababa, Ethiopia',
    salary: '$40k - $60k',
    type: 'Full-time',
    posted: '2 days ago',
    description: `
      <p>We are looking for an experienced Frontend Engineer to join our growing team. You will be responsible for building high-quality, responsive web applications using React and TypeScript.</p>
      
      <h3>Responsibilities</h3>
      <ul>
        <li>Develop new user-facing features using React.js</li>
        <li>Build reusable components and front-end libraries for future use</li>
        <li>Translate designs and wireframes into high quality code</li>
        <li>Optimize components for maximum performance across a vast array of web-capable devices and browsers</li>
      </ul>

      <h3>Requirements</h3>
      <ul>
        <li>Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model</li>
        <li>Thorough understanding of React.js and its core principles</li>
        <li>Experience with popular React.js workflows (such as Flux or Redux)</li>
        <li>Familiarity with newer specifications of EcmaScript</li>
        <li>Experience with data structure libraries (e.g., Immutable.js)</li>
      </ul>
    `,
    requirements: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Git'],
    benefits: [
    'Health Insurance',
    'Remote Work Options',
    'Professional Development',
    'Stock Options']

  };
  return (
    <Layout>
      <div className="bg-slate-50 min-h-screen pb-12">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  T
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    {job.title}
                  </h1>
                  <div className="mt-2 flex items-center text-slate-500">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span className="font-medium text-slate-900 mr-4">
                      {job.company}
                    </span>
                    <Globe className="mr-2 h-4 w-4" />
                    <a href="#" className="text-teal-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Posted {job.posted}
                    </div>
                    <Badge>{job.type}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-3">
                <Button size="lg" className="w-full md:w-auto px-8">
                  Apply Now
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Job Description
                </h2>
                <div
                  className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-teal-600"
                  dangerouslySetInnerHTML={{
                    __html: job.description
                  }} />

              </div>

              <div className="rounded-xl bg-white p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req) =>
                  <Badge
                    key={req}
                    variant="secondary"
                    className="text-sm py-1 px-3">

                      {req}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Job Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Salary
                    </div>
                    <div className="text-slate-900 font-medium">
                      {job.salary}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Location
                    </div>
                    <div className="text-slate-900 font-medium">
                      {job.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Job Type
                    </div>
                    <div className="text-slate-900 font-medium">{job.type}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500">
                      Experience
                    </div>
                    <div className="text-slate-900 font-medium">
                      Senior Level
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-teal-50 p-6 border border-teal-100">
                <h3 className="text-lg font-bold text-teal-900 mb-2">
                  AI Match Score
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-teal-700">
                    Your Profile Match
                  </span>
                  <span className="text-2xl font-bold text-teal-600">92%</span>
                </div>
                <div className="w-full bg-teal-200 rounded-full h-2.5">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{
                      width: '92%'
                    }}>
                  </div>
                </div>
                <p className="mt-4 text-sm text-teal-700">
                  Your skills in React and TypeScript make you a strong
                  candidate for this role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>);

}