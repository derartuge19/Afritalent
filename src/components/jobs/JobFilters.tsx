import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../common/Button';
export function JobFilters() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center text-lg font-semibold text-slate-900">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" className="text-xs text-slate-500">
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">Job Type</h4>
          <div className="space-y-2">
            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(
              (type) =>
              <label key={type} className="flex items-center">
                  <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" />

                  <span className="ml-2 text-sm text-slate-600">{type}</span>
                </label>

            )}
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Experience Level */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">
            Experience Level
          </h4>
          <div className="space-y-2">
            {[
            'Entry Level',
            'Mid Level',
            'Senior Level',
            'Director',
            'Executive'].
            map((level) =>
            <label key={level} className="flex items-center">
                <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600" />

                <span className="ml-2 text-sm text-slate-600">{level}</span>
              </label>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Salary Range */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">
            Salary Range
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>$0</span>
              <span>$200k+</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />

          </div>
        </div>
      </div>
    </div>);

}