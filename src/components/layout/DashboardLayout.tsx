import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import {
  Search,
  Menu,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Settings
} from 'lucide-react';
import { Input } from '../common/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { NotificationsPopover } from './NotificationsPopover';
import { Logo } from '../common/Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'seeker' | 'user' | 'employer' | 'admin';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const bottomNavItems = [
    { name: 'Dashboard', href: `/${role === 'seeker' ? 'user' : role}/dashboard`, icon: LayoutDashboard },
    { name: 'Jobs', href: role === 'employer' ? '/employer/jobs' : '/jobs', icon: Briefcase },
    { name: 'Interviews', href: `/${role === 'seeker' ? 'user' : role}/interviews`, icon: Calendar },
    { name: 'Settings', href: `/${role === 'seeker' ? 'user' : role}/settings`, icon: Settings },
  ];

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.currentTarget as HTMLInputElement).value;
      if (role === 'employer') {
        // For employers, search candidates
        // Use direct window location change or navigate to force reload if on same page logic needs it, 
        // but navigate is better. We need to handle if we are already on the page.
        // Actually, if we are on candidates page, useNavigate might not trigger a reload of the component 
        // but the URL changes, and our useEffect listens to location.search? 
        // WAIT. useEffect [] only runs on mount. 
        // I need to update useEffect logic in list pages to listen to location search changes if I use pushState.
        // But window.location.href assignment forces reload which is safer for "search engine" feel.
        // Let's use navigate and ensure pages listen to location.
        navigate(`/employer/candidates?search=${encodeURIComponent(query)}`);
      } else {
        // For seekers, search jobs
        navigate(`/jobs?search=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              <Sidebar role={role} onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-30 px-4 md:px-6 transition-all duration-300">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center md:hidden">
              <Link to="/" className="flex items-center space-x-2">
                <Logo />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex flex-1 items-center px-4 max-w-lg">
            <Input
              placeholder={role === 'employer' ? "Search candidates..." : "Search jobs..."}
              icon={<Search className="h-4 w-4" />}
              className="bg-slate-50 border-transparent focus:bg-white focus:border-primary-500"
              onKeyDown={handleSearch}
            />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full md:hidden">
              <Search className="h-5 w-5" />
            </button>
            <NotificationsPopover />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="mx-auto max-w-7xl animate-slide-in">
            {children}
          </div>
        </main>

        {/* Fancy Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 inset-x-0 glass border-t border-slate-200 px-4 py-2 z-40">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all",
                  location.pathname === item.href
                    ? "text-primary-600 bg-primary-50/50"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-6 w-6", location.pathname === item.href ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                <span className="text-[10px] mt-1 font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}