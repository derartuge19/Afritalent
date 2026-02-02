import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'seeker' | 'employer' | 'admin';
}
export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar role={role} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex flex-1 items-center">
            <div className="w-full max-w-lg">
              <Input
                placeholder="Search..."
                icon={<Search className="h-4 w-4" />}
                className="bg-slate-50 border-transparent focus:bg-white focus:border-teal-500" />

            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative rounded-full p-2">

              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>);

}