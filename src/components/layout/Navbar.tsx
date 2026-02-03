import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  User,
  LogOut
} from
  'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const navLinks = [
    {
      name: 'Find Jobs',
      href: '/jobs',
      roles: ['seeker', 'admin']
    },
    {
      name: 'Dashboard',
      href: '/seeker/dashboard',
      roles: ['seeker']
    },
    {
      name: 'For Employers',
      href: '/employer/dashboard',
      roles: ['employer', 'admin']
    },
    {
      name: 'Market Analytics',
      href: '/admin/dashboard',
      roles: ['admin']
    }
  ];

  const filteredLinks = navLinks.filter(link => {
    // If not logged in, show only public links (or none?) 
    // User asked "even if I am a user just ord user", implying logged in.
    // Let's say if not logged in, show 'Find Jobs' and 'For Employers' (as generic landing pages?)
    // Actually, 'For Employers' usually leads to a landing page for employers to sign up.
    // But here href is /employer/dashboard which is protected.
    // Let's assume:
    // - If not logged in: Show 'Find Jobs' (public list), maybe 'For Employers' if it was a landing. 
    //   But currently /employer/dashboard is protected.
    //   Let's just show 'Find Jobs' for everyone.
    //   And filter others by role.

    if (!isAuthenticated) return link.name === 'Find Jobs';
    return link.roles.includes(user?.role || '');
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
                <Bell className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                AfriTalent
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {filteredLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === link.href ?
                      'bg-primary-50 text-primary-700' :
                      'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}>

                  {link.name}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5 text-slate-600" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">

              {isOpen ?
                <X className="h-6 w-6" /> :

                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              opacity: 0,
              height: 0
            }}
            className="md:hidden border-t border-slate-200 bg-white">

            <div className="space-y-1 px-4 pb-4 pt-2">
              {filteredLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}>

                  {link.name}
                </Link>
              )}
              <div className="mt-4 border-t border-slate-200 pt-4 space-y-2">
                <Link to="/employer/post-job" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Post a Job</Button>
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}