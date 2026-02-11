import { Filter } from 'lucide-react';
import { Button } from '../common/Button';

interface JobFiltersProps {
  onFilterChange: (filters: { job_type?: string; experience_level?: string; salary_min?: number }) => void;
  selectedType?: string;
  selectedExperience?: string;
  selectedSalary?: number;
  onClear: () => void;
}

export function JobFilters({
  onFilterChange,
  selectedType,
  selectedExperience,
  selectedSalary = 0,
  onClear
}: JobFiltersProps) {
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center text-lg font-semibold text-slate-900">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </h3>
        <Button variant="ghost" size="sm" className="text-xs text-slate-500" onClick={onClear}>
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">Job Type</h4>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="jobType"
                  checked={selectedType === type}
                  onChange={() => onFilterChange({ job_type: type })}
                  className="h-4 w-4 rounded-full border-slate-300 text-primary-600 focus:ring-primary-600 transition-colors"
                />
                <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Experience Level */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">Experience Level</h4>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="experienceLevel"
                  checked={selectedExperience === level}
                  onChange={() => onFilterChange({ experience_level: level })}
                  className="h-4 w-4 rounded-full border-slate-300 text-primary-600 focus:ring-primary-600 transition-colors"
                />
                <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-200" />

        {/* Salary Range */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-900">Min Salary (Monthly)</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-primary-600">
              <span>$0</span>
              <span>${selectedSalary.toLocaleString()}</span>
              <span>$200k+</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={selectedSalary}
              onChange={(e) => onFilterChange({ salary_min: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}