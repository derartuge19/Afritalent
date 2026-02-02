import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { MetricsCard } from '../../components/analytics/MetricsCard';
import {
  Search,
  Filter,
  MoreVertical,
  Users,
  UserPlus,
  Building2,
  Mail,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Shield } from
'lucide-react';
import { motion } from 'framer-motion';
interface User {
  id: string;
  name: string;
  email: string;
  type: 'seeker' | 'employer' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  company?: string;
  joinDate: string;
  lastActive: string;
  avatar: string;
}
const users: User[] = [
{
  id: '1',
  name: 'Abebe Kebede',
  email: 'abebe@email.com',
  type: 'seeker',
  status: 'active',
  joinDate: '2024-01-15',
  lastActive: '2 hours ago',
  avatar: 'AK'
},
{
  id: '2',
  name: 'TechAfrica Inc.',
  email: 'hr@techafrica.com',
  type: 'employer',
  status: 'active',
  company: 'TechAfrica',
  joinDate: '2023-11-20',
  lastActive: '1 hour ago',
  avatar: 'TA'
},
{
  id: '3',
  name: 'Sarah Mwangi',
  email: 'sarah@email.com',
  type: 'seeker',
  status: 'active',
  joinDate: '2024-01-10',
  lastActive: '5 hours ago',
  avatar: 'SM'
},
{
  id: '4',
  name: 'Flutterwave',
  email: 'careers@flutterwave.com',
  type: 'employer',
  status: 'active',
  company: 'Flutterwave',
  joinDate: '2023-09-15',
  lastActive: '3 hours ago',
  avatar: 'FW'
},
{
  id: '5',
  name: 'John Okonkwo',
  email: 'john@email.com',
  type: 'seeker',
  status: 'suspended',
  joinDate: '2023-12-01',
  lastActive: '2 weeks ago',
  avatar: 'JO'
},
{
  id: '6',
  name: 'Admin User',
  email: 'admin@afritalent.com',
  type: 'admin',
  status: 'active',
  joinDate: '2023-01-01',
  lastActive: 'Just now',
  avatar: 'AD'
},
{
  id: '7',
  name: 'Safaricom',
  email: 'jobs@safaricom.com',
  type: 'employer',
  status: 'pending',
  company: 'Safaricom',
  joinDate: '2024-01-20',
  lastActive: 'Never',
  avatar: 'SF'
}];

const statusConfig = {
  active: {
    label: 'Active',
    variant: 'success' as const
  },
  suspended: {
    label: 'Suspended',
    variant: 'danger' as const
  },
  pending: {
    label: 'Pending',
    variant: 'warning' as const
  }
};
const typeConfig = {
  seeker: {
    label: 'Job Seeker',
    color: 'bg-blue-100 text-blue-700'
  },
  employer: {
    label: 'Employer',
    color: 'bg-purple-100 text-purple-700'
  },
  admin: {
    label: 'Admin',
    color: 'bg-slate-100 text-slate-700'
  }
};
export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });
  const metrics = [
  {
    title: 'Total Users',
    value: '15,234',
    trend: 12,
    icon: <Users className="h-6 w-6" />,
    color: 'primary' as const
  },
  {
    title: 'Job Seekers',
    value: '12,450',
    trend: 15,
    icon: <Users className="h-6 w-6" />,
    color: 'blue' as const
  },
  {
    title: 'Employers',
    value: '2,680',
    trend: 8,
    icon: <Building2 className="h-6 w-6" />,
    color: 'purple' as const
  },
  {
    title: 'New This Month',
    value: '1,234',
    trend: 22,
    icon: <UserPlus className="h-6 w-6" />,
    color: 'success' as const
  }];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-slate-500">Manage all platform users</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}>

              Export
            </Button>
            <Button leftIcon={<UserPlus className="h-4 w-4" />}>
              Add User
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) =>
          <MetricsCard key={metric.title} {...metric} />
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />} />

          </div>
          <Select
            options={[
            {
              value: 'all',
              label: 'All Types'
            },
            {
              value: 'seeker',
              label: 'Job Seekers'
            },
            {
              value: 'employer',
              label: 'Employers'
            },
            {
              value: 'admin',
              label: 'Admins'
            }]
            }
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)} />

          <Select
            options={[
            {
              value: 'all',
              label: 'All Status'
            },
            {
              value: 'active',
              label: 'Active'
            },
            {
              value: 'suspended',
              label: 'Suspended'
            },
            {
              value: 'pending',
              label: 'Pending'
            }]
            }
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />

        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">
                    Joined
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">
                    Last Active
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, index) =>
                <motion.tr
                  key={user.id}
                  initial={{
                    opacity: 0,
                    y: 10
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.03
                  }}
                  className="hover:bg-slate-50 transition-colors">

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${typeConfig[user.type].color}`}>

                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig[user.type].color}`}>

                        {typeConfig[user.type].label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={statusConfig[user.status].variant}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500 hidden md:table-cell">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-500 hidden lg:table-cell">
                      {user.lastActive}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="p-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() =>
                          setOpenMenu(openMenu === user.id ? null : user.id)
                          }>

                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          {openMenu === user.id &&
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Send Email
                              </button>
                              {user.status === 'active' ?
                          <button className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                                  <Ban className="h-4 w-4" /> Suspend User
                                </button> :

                          <button className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" /> Activate
                                  User
                                </button>
                          }
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Delete User
                              </button>
                            </div>
                        }
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}