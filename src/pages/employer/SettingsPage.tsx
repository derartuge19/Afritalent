import { useState, useEffect } from 'react';
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
  Check,
  Save,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getEmployerProfile, updateEmployerProfile, getSettings, updateSettings, changePassword } from '../../lib/api';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard }
];

export function SettingsPage() {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    timezone: 'eat',
    language: 'en',
    currency: 'usd'
  });

  const [notifications, setNotifications] = useState({
    email_new_applicants: true,
    email_interview_responses: true,
    email_weekly_digest: false,
    push_messages: true,
    sms_interviews: true
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profile, settings] = await Promise.all([
          getEmployerProfile(),
          getSettings()
        ]);

        // Map account data from real employer profile
        setAccountData(prev => ({
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          email: user?.email || '' // Email stays from auth
        }));

        setNotifications({
          email_new_applicants: settings.email_new_applicants,
          email_interview_responses: settings.email_interview_responses,
          email_weekly_digest: settings.email_weekly_digest,
          push_messages: settings.push_messages,
          sms_interviews: settings.sms_interviews
        });

      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSaveAccount = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    try {
      await updateEmployerProfile({
        first_name: accountData.firstName,
        last_name: accountData.lastName,
        phone: accountData.phone
      });
      await refreshProfile(); // Refresh sidebar/context
      setSuccessMessage('Account preferences updated successfully!');
    } catch (err) {
      setError('Failed to save account settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    try {
      await updateSettings(notifications);
      setSuccessMessage('Notification preferences updated!');
    } catch (err) {
      setError('Failed to update notification preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    try {
      await changePassword(securityData.currentPassword, securityData.newPassword);
      setSuccessMessage('Password changed successfully!');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <DashboardLayout role="employer"><div className="p-8 text-center text-slate-500">Loading settings...</div></DashboardLayout>;

  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your company account and preferences</p>
        </div>

        <div className="flex gap-1 mb-8 overflow-x-auto pb-4 pt-1 no-scrollbar animate-slide-in">
          {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 -translate-y-0.5' : 'text-slate-600 hover:bg-slate-100'}`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          )}
        </div>

        {successMessage && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-success-50/50 backdrop-blur-sm border border-success-200 text-success-700 rounded-2xl flex items-center gap-2 shadow-sm">
            <Check className="h-5 w-5 text-success-500" /> {successMessage}
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-error-50/50 backdrop-blur-sm border border-error-200 text-error-700 rounded-2xl flex items-center gap-2 shadow-sm">
            <Shield className="h-5 w-5 text-error-500" /> {error}
          </motion.div>
        )}

        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="pb-10">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  Personal Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" value={accountData.firstName} onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })} className="rounded-xl" />
                  <Input label="Last Name" value={accountData.lastName} onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })} className="rounded-xl" />
                  <Input label="Email Address" type="email" value={accountData.email} disabled className="bg-slate-50/50 rounded-xl" />
                  <Input label="Phone Number" value={accountData.phone} onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })} className="rounded-xl" />
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSaveAccount} isLoading={isSaving} className="w-full sm:w-auto shadow-lg shadow-primary-500/20 px-8 rounded-xl h-11" leftIcon={!isSaving && <Save className="h-4 w-4" />}>
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Globe className="h-5 w-5 text-primary-600" />
                  </div>
                  Localization
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select label="Preferred Language" value={accountData.language} onChange={(e) => setAccountData({ ...accountData, language: e.target.value })} options={[{ value: 'en', label: 'English' }, { value: 'am', label: 'አማርኛ' }]} className="rounded-xl" />
                  <Select label="Preferred Currency" value={accountData.currency} onChange={(e) => setAccountData({ ...accountData, currency: e.target.value })} options={[{ value: 'usd', label: 'USD ($)' }, { value: 'etb', label: 'ETB (Br)' }]} className="rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Mailing & Alert Preferences</h3>
              <div className="space-y-4">
                {[
                  { id: 'email_new_applicants', label: 'New Application Alerts', sub: 'Receive an email when someone applies to your job' },
                  { id: 'email_interview_responses', label: 'Interview Confirmations', sub: 'Get notified when seekers accept or reschedule interviews' },
                  { id: 'email_weekly_digest', label: 'Weekly Summary', sub: 'Receive a digest of your hiring activity' },
                  { id: 'push_messages', label: 'Direct Messages', sub: 'Get push notifications for new messages' },
                  { id: 'sms_interviews', label: 'SMS Interview Alerts', sub: 'Important scheduling reminders via SMS' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-100/50 last:border-0 hover:bg-slate-50/30 px-2 -mx-2 rounded-xl transition-colors">
                    <div className="flex-1 mr-4">
                      <h4 className="font-semibold text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500 leading-tight">{item.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input type="checkbox" className="sr-only peer" checked={(notifications as any)[item.id]} onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })} />
                      <div className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSaveNotifications} isLoading={isSaving} className="w-full sm:w-auto shadow-lg shadow-primary-500/20 px-8 rounded-xl h-11" leftIcon={!isSaving && <Save className="h-4 w-4" />}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Lock className="h-5 w-5 text-primary-600" />
                </div>
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <Input label="Current Password" type="password" value={securityData.currentPassword} onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })} required className="rounded-xl" />
                <Input label="New Password" type="password" value={securityData.newPassword} onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })} required className="rounded-xl" />
                <Input label="Confirm New Password" type="password" value={securityData.confirmPassword} onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })} required className="rounded-xl" />
                <Button type="submit" isLoading={isSaving} className="w-full shadow-lg shadow-primary-500/20 rounded-xl h-11">Update Password</Button>
              </form>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Team Management</h3>
              <p className="text-slate-500">Currently, you are the only administrator for this company.</p>
              <Button className="mt-4" variant="outline" disabled>Invite Member (Upgrade Required)</Button>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Subscription & Billing</h3>
              <p className="text-slate-500">Your company is currently on the <strong>Professional Free</strong> plan.</p>
              <Button className="mt-4" variant="primary" disabled>Upgrade to Enterprise</Button>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}