import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  User,
  Bell,
  Shield,
  Eye,
  Globe,
  Mail,
  Smartphone,
  Key,
  Trash2,
  Camera,
  MapPin,
  Briefcase } from
'lucide-react';
import { motion } from 'framer-motion';
const tabs = [
{
  id: 'profile',
  label: 'Profile',
  icon: User
},
{
  id: 'preferences',
  label: 'Job Preferences',
  icon: Briefcase
},
{
  id: 'notifications',
  label: 'Notifications',
  icon: Bell
},
{
  id: 'privacy',
  label: 'Privacy',
  icon: Eye
},
{
  id: 'security',
  label: 'Security',
  icon: Shield
}];

export function SeekerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailApplicationUpdates: true,
    emailWeeklyDigest: false,
    pushJobAlerts: true,
    pushMessages: true,
    smsInterviews: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showSalary: false,
    allowMessages: true,
    showActivity: false
  });
  return (
    <DashboardLayout role="seeker">
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

          {/* Profile Settings */}
          {activeTab === 'profile' &&
          <div className="space-y-6">
              {/* Avatar */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Profile Photo
                </h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                      AK
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" defaultValue="Abebe" />
                  <Input label="Last Name" defaultValue="Kebede" />
                  <Input
                  label="Email"
                  type="email"
                  defaultValue="abebe.kebede@email.com"
                  icon={<Mail className="h-4 w-4" />} />

                  <Input
                  label="Phone"
                  defaultValue="+251 91 234 5678"
                  icon={<Smartphone className="h-4 w-4" />} />

                  <Input
                  label="Location"
                  defaultValue="Addis Ababa, Ethiopia"
                  icon={<MapPin className="h-4 w-4" />} />

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

                </div>
                <div className="mt-6 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </div>
          }

          {/* Job Preferences */}
          {activeTab === 'preferences' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Job Preferences
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                  label="Job Type"
                  options={[
                  {
                    value: 'full-time',
                    label: 'Full-time'
                  },
                  {
                    value: 'part-time',
                    label: 'Part-time'
                  },
                  {
                    value: 'contract',
                    label: 'Contract'
                  },
                  {
                    value: 'internship',
                    label: 'Internship'
                  }]
                  }
                  defaultValue="full-time" />

                  <Select
                  label="Work Mode"
                  options={[
                  {
                    value: 'onsite',
                    label: 'On-site'
                  },
                  {
                    value: 'remote',
                    label: 'Remote'
                  },
                  {
                    value: 'hybrid',
                    label: 'Hybrid'
                  }]
                  }
                  defaultValue="hybrid" />

                  <Select
                  label="Experience Level"
                  options={[
                  {
                    value: 'entry',
                    label: 'Entry Level'
                  },
                  {
                    value: 'mid',
                    label: 'Mid Level'
                  },
                  {
                    value: 'senior',
                    label: 'Senior Level'
                  },
                  {
                    value: 'lead',
                    label: 'Lead/Manager'
                  }]
                  }
                  defaultValue="senior" />

                  <Input label="Minimum Salary" placeholder="e.g., $50,000" />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Preferred Locations
                </h3>
                <div className="space-y-4">
                  <Input
                  label="Primary Location"
                  defaultValue="Addis Ababa, Ethiopia"
                  icon={<MapPin className="h-4 w-4" />} />

                  <Input
                  label="Secondary Location"
                  placeholder="Add another location"
                  icon={<MapPin className="h-4 w-4" />} />

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />

                    <span className="text-sm text-slate-600">
                      Open to remote opportunities worldwide
                    </span>
                  </label>
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
                    key: 'emailJobAlerts',
                    label: 'New job alerts matching your profile'
                  },
                  {
                    key: 'emailApplicationUpdates',
                    label: 'Application status updates'
                  },
                  {
                    key: 'emailWeeklyDigest',
                    label: 'Weekly job market digest'
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
                    Push & SMS Notifications
                  </h4>
                  <div className="space-y-3">
                    {[
                  {
                    key: 'pushJobAlerts',
                    label: 'Push notifications for new jobs'
                  },
                  {
                    key: 'pushMessages',
                    label: 'Push notifications for messages'
                  },
                  {
                    key: 'smsInterviews',
                    label: 'SMS reminders for interviews'
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

          {/* Privacy */}
          {activeTab === 'privacy' &&
          <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Privacy Settings
              </h3>
              <div className="space-y-4">
                {[
              {
                key: 'profileVisible',
                label: 'Make my profile visible to employers',
                description: 'Employers can find and view your profile'
              },
              {
                key: 'showSalary',
                label: 'Show salary expectations',
                description: 'Display your expected salary on your profile'
              },
              {
                key: 'allowMessages',
                label: 'Allow direct messages',
                description: 'Recruiters can send you messages'
              },
              {
                key: 'showActivity',
                label: 'Show activity status',
                description: 'Show when you were last active'
              }].
              map((item) =>
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">

                    <div>
                      <p className="font-medium text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <button
                  onClick={() =>
                  setPrivacy((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev]
                  }))
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${privacy[item.key as keyof typeof privacy] ? 'bg-primary-600' : 'bg-slate-200'}`}>

                      <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy[item.key as keyof typeof privacy] ? 'translate-x-5' : ''}`} />

                    </button>
                  </div>
              )}
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
                  Add an extra layer of security to your account.
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
                  Once you delete your account, there is no going back.
                </p>
                <Button
                variant="danger"
                leftIcon={<Trash2 className="h-4 w-4" />}>

                  Delete Account
                </Button>
              </div>
            </div>
          }
        </motion.div>
      </div>
    </DashboardLayout>);

}