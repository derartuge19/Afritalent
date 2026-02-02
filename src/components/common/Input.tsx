import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label &&
        <label className="text-sm font-medium text-slate-700 block">
            {label}
          </label>
        }
        <div className="relative">
          {icon &&
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          }
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            {...props} />

        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>);

  }
);
Input.displayName = 'Input';