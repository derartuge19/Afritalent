import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
  Key,
  Users,
  Zap,
  Save,
  RefreshCw,
  AlertTriangle } from
'lucide-react';
import { motion } from 'framer-motion';
const tabs = [
{
  id: 'general',
  label: 'General',
  icon: Settings
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
  id: 'integrations',
  label: 'Integrations',
  icon: Zap
},
{
  id: 'database',
  label: 'Database',
  icon: Database
}];

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'AfriTalent',
    siteUrl: 'https://afritalent.com',
    supportEmail: 'support@afritalent.com',
    defaultLanguage: 'en',
    timezone: 'eat',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    autoApproveJobs: false,
    maxJobsPerEmployer: 50,
    sessionTimeout: 30
  });
  return (
    <DashboardLayout role="admin">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Platform Settings
          </h1>
          <p className="text-slate-500">
            Configure platform-wide settings and preferences
          </p>
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

          {/* General Settings */}
          {activeTab === 'general' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Site Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    siteName: e.target.value
                  })
                  } />

                  <Input
                  label="Site URL"
                  value={settings.siteUrl}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    siteUrl: e.target.value
                  })
                  }
                  icon={<Globe className="h-4 w-4" />} />

                  <Input
                  label="Support Email"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    supportEmail: e.target.value
                  })
                  }
                  icon={<Mail className="h-4 w-4" />} />

                  <Select
                  label="Default Language"
                  options={[
                  {
                    value: 'en',
                    label: 'English'
                  },
                  {
                    value: 'am',
                    label: 'Amharic'
                  }]
                  }
                  value={settings.defaultLanguage}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultLanguage: e.target.value
                  })
                  } />

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
                    value: 'wat',
                    label: 'West Africa Time (WAT)'
                  },
                  {
                    value: 'cat',
                    label: 'Central Africa Time (CAT)'
                  }]
                  }
                  value={settings.timezone}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    timezone: e.target.value
                  })
                  } />

                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Platform Controls
                </h3>
                <div className="space-y-4">
                  {[
                {
                  key: 'maintenanceMode',
                  label: 'Maintenance Mode',
                  description: 'Put the site in maintenance mode',
                  danger: true
                },
                {
                  key: 'registrationEnabled',
                  label: 'User Registration',
                  description: 'Allow new user registrations'
                },
                {
                  key: 'emailVerification',
                  label: 'Email Verification',
                  description:
                  'Require email verification for new accounts'
                },
                {
                  key: 'autoApproveJobs',
                  label: 'Auto-Approve Jobs',
                  description: 'Automatically approve new job postings'
                }].
                map((item) =>
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">

                      <div>
                        <p
                      className={`font-medium ${item.danger ? 'text-red-900' : 'text-slate-900'}`}>

                          {item.label}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.description}
                        </p>
                      </div>
                      <button
                    onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev]
                    }))
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key as keyof typeof settings] ? item.danger ? 'bg-red-600' : 'bg-primary-600' : 'bg-slate-200'}`}>

                        <span
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-5' : ''}`} />

                      </button>
                    </div>
                )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button leftIcon={<Save className="h-4 w-4" />}>
                  Save Changes
                </Button>
              </div>
            </div>
          }

          {/* Notifications */}
          {activeTab === 'notifications' &&
          <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Email Configuration
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="SMTP Host" placeholder="smtp.example.com" />
                  <Input label="SMTP Port" placeholder="587" />
                  <Input label="SMTP Username" placeholder="username" />
                  <Input
                  label="SMTP Password"
                  type="password"
                  placeholder="••••••••" />

                </div>
                <div className="flex gap-2">
                  <Button
                  variant="outline"
                  leftIcon={<RefreshCw className="h-4 w-4" />}>

                    Test Connection
                  </Button>
                  <Button>Save Configuration</Button>
                </div>
              </div>
            </div>
          }

          {/* Security */}
          {activeTab === 'security' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Security Settings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout.toString()}
                  onChange={(e) =>
                  setSettings({
                    ...settings,
                    sessionTimeout: parseInt(e.target.value)
                  })
                  } />

                  <Input
                  label="Max Login Attempts"
                  type="number"
                  defaultValue="5" />

                  <Input
                  label="Password Min Length"
                  type="number"
                  defaultValue="8" />

                  <Select
                  label="Password Policy"
                  options={[
                  {
                    value: 'basic',
                    label: 'Basic (min 8 chars)'
                  },
                  {
                    value: 'medium',
                    label: 'Medium (+ numbers)'
                  },
                  {
                    value: 'strong',
                    label: 'Strong (+ special chars)'
                  }]
                  }
                  defaultValue="medium" />

                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  API Keys
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">
                        Production API Key
                      </p>
                      <p className="text-sm text-slate-500 font-mono">
                        sk_live_••••••••••••••••
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Reveal
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Test API Key</p>
                      <p className="text-sm text-slate-500 font-mono">
                        sk_test_••••••••••••••••
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Reveal
                      </Button>
                      <Button variant="outline" size="sm">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Integrations */}
          {activeTab === 'integrations' &&
          <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Third-Party Integrations
              </h3>
              <div className="space-y-4">
                {[
              {
                name: 'OpenAI',
                description: 'AI-powered CV parsing and job matching',
                status: 'connected'
              },
              {
                name: 'Telegram',
                description: 'Send notifications via Telegram',
                status: 'connected'
              },
              {
                name: 'Twilio',
                description: 'SMS notifications',
                status: 'disconnected'
              },
              {
                name: 'Google Analytics',
                description: 'Track platform analytics',
                status: 'connected'
              },
              {
                name: 'Stripe',
                description: 'Payment processing',
                status: 'disconnected'
              }].
              map((integration) =>
              <div
                key={integration.name}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">

                    <div>
                      <p className="font-medium text-slate-900">
                        {integration.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {integration.description}
                      </p>
                    </div>
                    <Button
                  variant={
                  integration.status === 'connected' ?
                  'outline' :
                  'primary'
                  }
                  size="sm">

                      {integration.status === 'connected' ?
                  'Configure' :
                  'Connect'}
                    </Button>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Database */}
          {activeTab === 'database' &&
          <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Database Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-600">Status</p>
                    <p className="text-lg font-semibold text-green-900">
                      Connected
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Size</p>
                    <p className="text-lg font-semibold text-slate-900">
                      2.4 GB
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Last Backup</p>
                    <p className="text-lg font-semibold text-slate-900">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  Maintenance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        Create Backup
                      </p>
                      <p className="text-sm text-slate-500">
                        Create a full database backup
                      </p>
                    </div>
                    <Button variant="outline">Create Backup</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Clear Cache</p>
                      <p className="text-sm text-slate-500">
                        Clear all cached data
                      </p>
                    </div>
                    <Button variant="outline">Clear Cache</Button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900">Danger Zone</h3>
                    <p className="text-sm text-red-700 mt-1 mb-4">
                      These actions are irreversible. Please proceed with
                      caution.
                    </p>
                    <Button variant="danger" size="sm">
                      Reset Database
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }
        </motion.div>
      </div>
    </DashboardLayout>);

}