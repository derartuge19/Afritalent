import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  Globe,
  Mail,
  Smartphone,
  Key,
  Trash2,
  Plus,
  Check } from
'lucide-react';
import { motion } from 'framer-motion';
const tabs = [
{
  id: 'account',
  label: 'Account',
  icon: User
},
{
  id: 'notifications',
  label: 'Notifications',
  icon: Bell
},
{
  id: 'security',
  label: 'Security',
  icon: Shield
},
{
  id: 'team',
  label: 'Team',
  icon: Users
},
{
  id: 'billing',
  label: 'Billing',
  icon: CreditCard
}];

const teamMembers = [
{
  id: '1',
  name: 'Abebe Kebede',
  email: 'abebe@techafrica.com',
  role: 'Admin',
  avatar: 'AK'
},
{
  id: '2',
  name: 'Sara Hailu',
  email: 'sara@techafrica.com',
  role: 'Recruiter',
  avatar: 'SH'
},
{
  id: '3',
  name: 'Daniel Tadesse',
  email: 'daniel@techafrica.com',
  role: 'Hiring Manager',
  avatar: 'DT'
}];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    emailNewApplicant: true,
    emailWeeklyDigest: true,
    emailInterviewReminder: true,
    pushNewApplicant: false,
    pushMessages: true,
    smsUrgent: false
  });
  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>

              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          )}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.2
          }}>

          {/* Account Settings */}
          {activeTab === 'account' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" defaultValue="Abebe" />
                  <Input label="Last Name" defaultValue="Kebede" />
                  <Input
                  label="Email"
                  type="email"
                  defaultValue="abebe@techafrica.com" />

                  <Input label="Phone" defaultValue="+251 91 234 5678" />
                  <div className="sm:col-span-2">
                    <Select
                    label="Timezone"
                    options={[
                    {
                      value: 'eat',
                      label: 'East Africa Time (EAT)'
                    },
                    {
                      value: 'utc',
                      label: 'UTC'
                    },
                    {
                      value: 'gmt',
                      label: 'GMT'
                    }]
                    }
                    defaultValue="eat" />

                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Language & Region
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                  label="Language"
                  options={[
                  {
                    value: 'en',
                    label: 'English'
                  },
                  {
                    value: 'am',
                    label: 'አማርኛ (Amharic)'
                  }]
                  }
                  defaultValue="en" />

                  <Select
                  label="Currency"
                  options={[
                  {
                    value: 'usd',
                    label: 'USD ($)'
                  },
                  {
                    value: 'etb',
                    label: 'ETB (Br)'
                  }]
                  }
                  defaultValue="usd" />

                </div>
              </div>
            </div>
          }

          {/* Notifications */}
          {activeTab === 'notifications' &&
          <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Notification Preferences
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                  {
                    key: 'emailNewApplicant',
                    label: 'New applicant notifications'
                  },
                  {
                    key: 'emailWeeklyDigest',
                    label: 'Weekly hiring digest'
                  },
                  {
                    key: 'emailInterviewReminder',
                    label: 'Interview reminders'
                  }].
                  map((item) =>
                  <label
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer">

                        <span className="text-sm text-slate-600">
                          {item.label}
                        </span>
                        <button
                      onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev]
                      }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-200'}`}>

                          <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />

                        </button>
                      </label>
                  )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                    Push Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                  {
                    key: 'pushNewApplicant',
                    label: 'New applicant alerts'
                  },
                  {
                    key: 'pushMessages',
                    label: 'Message notifications'
                  }].
                  map((item) =>
                  <label
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer">

                        <span className="text-sm text-slate-600">
                          {item.label}
                        </span>
                        <button
                      onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev]
                      }))
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-200'}`}>

                          <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />

                        </button>
                      </label>
                  )}
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Security */}
          {activeTab === 'security' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>
                <Button
                variant="outline"
                leftIcon={<Key className="h-4 w-4" />}>

                  Enable 2FA
                </Button>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Danger Zone
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button
                variant="danger"
                leftIcon={<Trash2 className="h-4 w-4" />}>

                  Delete Account
                </Button>
              </div>
            </div>
          }

          {/* Team */}
          {activeTab === 'team' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Team Members
                  </h3>
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Invite Member
                  </Button>
                </div>
                <div className="space-y-4">
                  {teamMembers.map((member) =>
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                      options={[
                      {
                        value: 'admin',
                        label: 'Admin'
                      },
                      {
                        value: 'recruiter',
                        label: 'Recruiter'
                      },
                      {
                        value: 'hiring-manager',
                        label: 'Hiring Manager'
                      },
                      {
                        value: 'viewer',
                        label: 'Viewer'
                      }]
                      }
                      defaultValue={member.role.
                      toLowerCase().
                      replace(' ', '-')} />

                        <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50">

                          Remove
                        </Button>
                      </div>
                    </div>
                )}
                </div>
              </div>
            </div>
          }

          {/* Billing */}
          {activeTab === 'billing' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Current Plan
                </h3>
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <div>
                    <p className="font-semibold text-primary-900">
                      Professional Plan
                    </p>
                    <p className="text-sm text-primary-700">
                      $99/month • Unlimited job postings
                    </p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Payment Method
                </h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        •••• •••• •••• 4242
                      </p>
                      <p className="text-sm text-slate-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Billing History
                </h3>
                <div className="space-y-3">
                  {[
                {
                  date: 'Jan 1, 2024',
                  amount: '$99.00',
                  status: 'Paid'
                },
                {
                  date: 'Dec 1, 2023',
                  amount: '$99.00',
                  status: 'Paid'
                },
                {
                  date: 'Nov 1, 2023',
                  amount: '$99.00',
                  status: 'Paid'
                }].
                map((invoice, idx) =>
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">

                      <div>
                        <p className="font-medium text-slate-900">
                          {invoice.date}
                        </p>
                        <p className="text-sm text-slate-500">
                          Professional Plan
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-slate-900">
                          {invoice.amount}
                        </span>
                        <span className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded-full">
                          {invoice.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                )}
                </div>
              </div>
            </div>
          }
        </motion.div>
      </div>
    </DashboardLayout>);

}