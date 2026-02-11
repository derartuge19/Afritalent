import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  User,
  Bell,
  Shield,
  Eye,
  Mail,
  Smartphone,
  Key,
  Trash2,
  Camera,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getSeekerProfile, updateSeekerProfile, api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'preferences', label: 'Job Preferences', icon: Briefcase },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'security', label: 'Security', icon: Shield }
];

export function UserSettingsPage() {
  const { refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'privacy' | 'security'>('profile');
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location: '',
    phone: ''
  });

  const [preferences, setPreferences] = useState({
    job_type: 'full-time',
    work_mode: 'hybrid',
    experience_level: 'senior',
    min_salary: '',
    primary_location: '',
    secondary_location: '',
    open_to_remote: true
  });

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

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getSeekerProfile();
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          location: data.location || '',
          phone: data.phone || ''
        });

        if (data.job_type) {
          const locs = (data.preferred_locations || '').split('|');
          setPreferences({
            job_type: data.job_type || 'full-time',
            work_mode: data.work_mode || 'hybrid',
            experience_level: data.experience_level || 'senior',
            min_salary: data.min_salary || '',
            primary_location: locs[0] || '',
            secondary_location: locs[1] || '',
            open_to_remote: true
          });
        }

        if (data.settings) {
          setNotifications({
            emailJobAlerts: data.settings.email_job_alerts,
            emailApplicationUpdates: data.settings.email_application_updates,
            emailWeeklyDigest: data.settings.email_weekly_digest,
            pushJobAlerts: data.settings.push_job_alerts,
            pushMessages: data.settings.push_messages,
            smsInterviews: data.settings.sms_interviews
          });
          setPrivacy({
            profileVisible: data.settings.profile_visible,
            showSalary: data.settings.show_salary,
            allowMessages: data.settings.allow_messages,
            showActivity: data.settings.show_activity
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSeekerProfile(formData);
      const updatedProfile = await getSeekerProfile();
      setProfile(updatedProfile);
      await refreshProfile();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Only JPG, PNG, and GIF allowed.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size exceeds 2MB limit.' });
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      await api.post('/seeker-profile/upload-photo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedProfile = await getSeekerProfile();
      setProfile(updatedProfile);
      await refreshProfile();
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to upload photo' });
    } finally {
      setUploading(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSeekerProfile({
        ...formData,
        job_type: preferences.job_type,
        work_mode: preferences.work_mode,
        experience_level: preferences.experience_level,
        min_salary: preferences.min_salary,
        preferred_locations: `${preferences.primary_location}|${preferences.secondary_location}`
      });
      setMessage({ type: 'success', text: 'Job preferences saved!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (type: 'notifications' | 'privacy') => {
    setSaving(true);
    setMessage(null);
    try {
      const data = type === 'notifications' ? {
        email_job_alerts: notifications.emailJobAlerts,
        email_application_updates: notifications.emailApplicationUpdates,
        email_weekly_digest: notifications.emailWeeklyDigest,
        push_job_alerts: notifications.pushJobAlerts,
        push_messages: notifications.pushMessages,
        sms_interviews: notifications.smsInterviews
      } : {
        profile_visible: privacy.profileVisible,
        show_salary: privacy.showSalary,
        allow_messages: privacy.allowMessages,
        show_activity: privacy.showActivity
      };
      await api.put('/settings/', data);
      setMessage({ type: 'success', text: `${type.charAt(0).toUpperCase() + type.slice(1)} settings saved!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to save ${type} settings` });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setSaving(true);
    try {
      await api.post('/settings/change-password', {
        current_password: securityForm.currentPassword,
        new_password: securityForm.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account and preferences</p>
        </div>

        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profile?.cv_url ? (
                      <img src={`http://127.0.0.1:8000${profile.cv_url}`} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                        {profile?.first_name ? profile.first_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </Button>
                    <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
                  <Input label="Last Name" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
                  <Input label="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} icon={<Mail className="h-4 w-4" />} />
                  <Input label="Phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} icon={<Smartphone className="h-4 w-4" />} />
                  <Input label="Location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} icon={<MapPin className="h-4 w-4" />} />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveChanges} isLoading={saving}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Job Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select label="Job Type" options={[{ value: 'full-time', label: 'Full-time' }, { value: 'part-time', label: 'Part-time' }, { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' }]} value={preferences.job_type} onChange={(e) => setPreferences({ ...preferences, job_type: e.target.value })} />
                  <Select label="Work Mode" options={[{ value: 'onsite', label: 'On-site' }, { value: 'remote', label: 'Remote' }, { value: 'hybrid', label: 'Hybrid' }]} value={preferences.work_mode} onChange={(e) => setPreferences({ ...preferences, work_mode: e.target.value })} />
                  <Select label="Experience Level" options={[{ value: 'entry', label: 'Entry Level' }, { value: 'mid', label: 'Mid Level' }, { value: 'senior', label: 'Senior Level' }, { value: 'lead', label: 'Lead/Manager' }]} value={preferences.experience_level} onChange={(e) => setPreferences({ ...preferences, experience_level: e.target.value })} />
                  <Input label="Minimum Salary" placeholder="e.g., $50,000" value={preferences.min_salary} onChange={(e) => setPreferences({ ...preferences, min_salary: e.target.value })} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Preferred Locations</h3>
                <div className="space-y-4">
                  <Input label="Primary Location" value={preferences.primary_location} onChange={(e) => setPreferences({ ...preferences, primary_location: e.target.value })} icon={<MapPin className="h-4 w-4" />} />
                  <Input label="Secondary Location" placeholder="Add another location" value={preferences.secondary_location} onChange={(e) => setPreferences({ ...preferences, secondary_location: e.target.value })} icon={<MapPin className="h-4 w-4" />} />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={preferences.open_to_remote} onChange={(e) => setPreferences({ ...preferences, open_to_remote: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-600">Open to remote opportunities worldwide</span>
                  </label>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSavePreferences} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save Preferences</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'emailJobAlerts', label: 'New job alerts matching your profile' },
                      { key: 'emailApplicationUpdates', label: 'Application status updates' },
                      { key: 'emailWeeklyDigest', label: 'Weekly job market digest' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <button onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))} className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-200'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} /></button>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2"><Smartphone className="h-4 w-4 text-slate-400" /> Push & SMS Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'pushJobAlerts', label: 'Push notifications for new jobs' },
                      { key: 'pushMessages', label: 'Push notifications for messages' },
                      { key: 'smsInterviews', label: 'SMS reminders for interviews' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <button onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))} className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-600' : 'bg-slate-200'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} /></button>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => handleSaveSettings('notifications')} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save Notification Settings</Button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Privacy Settings</h3>
              <div className="space-y-4">
                {[
                  { key: 'profileVisible', label: 'Make my profile visible to employers', description: 'Employers can find and view your profile' },
                  { key: 'showSalary', label: 'Show salary expectations', description: 'Display your expected salary on your profile' },
                  { key: 'allowMessages', label: 'Allow direct messages', description: 'Recruiters can send you messages' },
                  { key: 'showActivity', label: 'Show activity status', description: 'Show when you were last active' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div><p className="font-medium text-slate-900">{item.label}</p><p className="text-sm text-slate-500">{item.description}</p></div>
                    <button onClick={() => setPrivacy(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof privacy] }))} className={`relative w-11 h-6 rounded-full transition-colors ${privacy[item.key as keyof typeof privacy] ? 'bg-primary-600' : 'bg-slate-200'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${privacy[item.key as keyof typeof privacy] ? 'translate-x-5' : ''}`} /></button>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={() => handleSaveSettings('privacy')} isLoading={saving} leftIcon={<Save className="h-4 w-4" />}>Save Privacy Settings</Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <Input label="Current Password" type="password" value={securityForm.currentPassword} onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })} />
                  <Input label="New Password" type="password" value={securityForm.newPassword} onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })} />
                  <Input label="Confirm New Password" type="password" value={securityForm.confirmPassword} onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })} />
                  <Button onClick={handleUpdatePassword} isLoading={saving}>Update Password</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account.</p>
                <Button variant="outline" leftIcon={<Key className="h-4 w-4" />}>Enable 2FA</Button>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>Delete Account</Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}