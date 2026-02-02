import React from 'react';
import { cn } from '../../lib/utils';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
  'default' |
  'secondary' |
  'outline' |
  'success' |
  'warning' |
  'danger';
}
export const Badge = ({
  className,
  variant = 'default',
  ...props
}: BadgeProps) => {
  const variants = {
    default: 'bg-primary-100 text-primary-800 border-transparent',
    secondary: 'bg-slate-100 text-slate-800 border-transparent',
    outline: 'text-slate-800 border-slate-200',
    success: 'bg-success-100 text-success-800 border-transparent',
    warning: 'bg-accent-100 text-accent-800 border-transparent',
    danger: 'bg-red-100 text-red-800 border-transparent'
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props} />);


};