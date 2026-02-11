import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { NotificationsPopover } from './NotificationsPopover';
import { Logo } from '../common/Logo';

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
      href: '/user/dashboard',
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
    if (!isAuthenticated) return link.name === 'Find Jobs';
    return link.roles.includes(user?.role || '');
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {filteredLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    location.pathname === link.href ?
                      'bg-primary-600 text-white shadow-md' :
                      'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}>
                  {link.name}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NotificationsPopover />
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="shadow-lg shadow-primary-500/30 font-semibold px-6">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 focus:outline-none">
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-slate-200/50 absolute w-full top-16 left-0 shadow-2xl backdrop-blur-2xl"
          >
            <div className="space-y-2 px-4 pb-6 pt-4">
              {filteredLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-semibold transition-all",
                    location.pathname === link.href ? "bg-primary-600 text-white shadow-lg" : "text-slate-700 hover:bg-slate-50"
                  )}
                  onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              )}
              <div className="mt-6 space-y-3 pt-4 border-t border-slate-100">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full text-lg h-12" variant="outline">Log In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full text-lg h-12 shadow-xl shadow-primary-500/20">Sign Up</Button>
                    </Link>
                  </>
                ) : (
                  <Button className="w-full text-lg h-12" variant="outline" onClick={() => { logout(); setIsOpen(false); }}>
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>
  );
}