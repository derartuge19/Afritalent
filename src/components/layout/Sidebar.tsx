import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  FileText,
  BarChart2,
  LogOut,
  Search,
  PlusCircle,
  BookOpen,
  Target,
  TrendingUp,
  Building2,
  GraduationCap,
  Calendar,
  X
} from
  'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  role: 'seeker' | 'user' | 'employer' | 'admin';
  onClose?: () => void;
  className?: string;
}
export function Sidebar({ role, onClose, className }: SidebarProps) {
  const location = useLocation();
  const { logout, profile } = useAuth();

  const menus = {
    user: [
      {
        name: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutDashboard
      },
      {
        name: 'My Applications',
        href: '/user/applications',
        icon: FileText
      },
      {
        name: 'Find Jobs',
        href: '/jobs',
        icon: Search
      },
      {
        name: 'Saved Jobs',
        href: '/user/saved',
        icon: Briefcase
      },
      {
        name: 'CV Builder',
        href: '/user/cv-builder',
        icon: BookOpen
      },
      {
        name: 'Skills Analytics',
        href: '/user/skills',
        icon: TrendingUp
      },
      {
        name: 'Career Guidance',
        href: '/user/career',
        icon: GraduationCap
      },
      {
        name: 'Interviews',
        href: '/user/interviews',
        icon: Calendar
      },
      {
        name: 'Settings',
        href: '/user/settings',
        icon: Settings
      }],

    employer: [
      {
        name: 'Dashboard',
        href: '/employer/dashboard',
        icon: LayoutDashboard
      },
      {
        name: 'Post a Job',
        href: '/employer/post-job',
        icon: PlusCircle
      },
      {
        name: 'My Jobs',
        href: '/employer/jobs',
        icon: Briefcase
      },
      {
        name: 'Candidates',
        href: '/employer/candidates',
        icon: Users
      },
      {
        name: 'AI Screening',
        href: '/employer/screening',
        icon: Target
      },
      {
        name: 'Analytics',
        href: '/employer/analytics',
        icon: BarChart2
      },
      {
        name: 'Company Profile',
        href: '/employer/company',
        icon: Building2
      },
      {
        name: 'Interviews',
        href: '/employer/interviews',
        icon: Calendar
      },
      {
        name: 'Settings',
        href: '/employer/settings',
        icon: Settings
      }],

    admin: [
      {
        name: 'Overview',
        href: '/admin/dashboard',
        icon: LayoutDashboard
      },
      {
        name: 'Users',
        href: '/admin/users',
        icon: Users
      },
      {
        name: 'Jobs',
        href: '/admin/jobs',
        icon: Briefcase
      },
      {
        name: 'Market Analytics',
        href: '/admin/analytics',
        icon: BarChart2
      },
      {
        name: 'Supply & Demand',
        href: '/admin/market',
        icon: TrendingUp
      },
      {
        name: 'Reports',
        href: '/admin/reports',
        icon: FileText
      },
      {
        name: 'Settings',
        href: '/admin/settings',
        icon: Settings
      }]

  };
  const currentMenu = menus[role === 'seeker' ? 'user' : role];
  const roleLabels = {
    seeker: 'User',
    user: 'User',
    employer: 'Employer',
    admin: 'Administrator'
  };
  const roleColors = {
    seeker: 'bg-primary-100 text-primary-700',
    user: 'bg-primary-100 text-primary-700',
    employer: 'bg-accent-100 text-accent-700',
    admin: 'bg-slate-100 text-slate-700'
  };

  const getUserName = () => {
    if ((role === 'seeker' || role === 'user') && profile) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
    } else if (role === 'employer' && profile) {
      return profile.company_name || 'Your Company';
    } else if (role === 'employer') {
      return 'Employer';
    } else {
      return 'Admin User';
    }
  };

  const getUserInitials = () => {
    if ((role === 'seeker' || role === 'user') && profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    } else if (role === 'employer' && profile?.company_name) {
      return profile.company_name.slice(0, 2).toUpperCase();
    } else if (role === 'admin') {
      return 'AD';
    } else if (role === 'employer') {
      return 'EM';
    } else {
      return 'U';
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className={cn("flex h-full w-64 flex-col border-r border-slate-200 bg-white transition-all", className)}>
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">AfriTalent</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {currentMenu.map((item) =>
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                location.pathname === item.href ?
                  'bg-primary-50 text-primary-700' :
                  'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}>

              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  location.pathname === item.href ?
                    'text-primary-600' :
                    'text-slate-400 group-hover:text-slate-500'
                )} />

              {item.name}
            </Link>
          )}
        </nav>
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center mb-4 px-2">
          <div
            className={cn(
              'h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm',
              roleColors[role]
            )}>

            {getUserInitials()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900">
              {getUserName()}
            </p>
            <p className="text-xs text-slate-500">{roleLabels[role]}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          leftIcon={<LogOut className="h-4 w-4" />}
          onClick={handleLogout}>

          Sign Out
        </Button>
      </div>
    </div>);

}