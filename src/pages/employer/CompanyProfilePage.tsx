import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Building2,
  Globe,
  MapPin,
  Camera,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmployerProfile, updateEmployerProfile, EmployerProfile } from '../../lib/api';

export function CompanyProfilePage() {
  const { refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [companyData, setCompanyData] = useState({
    name: '',
    tagline: '',
    industry: '',
    size: '',
    founded: '',
    website: '',
    email: '',
    phone: '',
    headquarters: '',
    description: '',
    culture: '',
    benefits: [] as string[],
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getEmployerProfile();
        setProfile(data);
        setCompanyData((prev) => ({
          ...prev,
          name: data.company_name || 'Your Company',
          industry: data.industry || 'technology',
          headquarters: data.location || '',
          description: data.description || '',
          // Other fields are currently not in the simplified EmployerProfile model from backend
          // but we keep them in state for UI completeness
        }));
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await updateEmployerProfile({
        company_name: companyData.name,
        industry: companyData.industry,
        location: companyData.headquarters,
        description: companyData.description
      });
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };


  if (loading) return <DashboardLayout role="employer"><div className="p-8 text-center text-slate-500">Loading profile...</div></DashboardLayout>;

  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Company Profile
            </h1>
            <p className="text-slate-500">
              Manage how your company appears to job seekers
            </p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? 'primary' : 'outline'}
            leftIcon={isEditing ? <Save className="h-4 w-4" /> : undefined}>

            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        {/* Company Logo & Banner */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400 relative">
            {isEditing &&
              <button className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                <Camera className="h-5 w-5" />
              </button>
            }
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-primary-600 uppercase">
                  {companyData.name.slice(0, 2)}
                </div>
                {isEditing &&
                  <button className="absolute -bottom-1 -right-1 p-1.5 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                }
              </div>
              <div className="flex-1">
                {isEditing ?
                  <div className="space-y-2">
                    <Input
                      value={companyData.name}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          name: e.target.value
                        }))
                      }
                      className="text-xl font-bold" />

                    <Input
                      value={companyData.tagline}
                      onChange={(e) =>
                        setCompanyData((prev) => ({
                          ...prev,
                          tagline: e.target.value
                        }))
                      }
                      placeholder="Company tagline" />

                  </div> :

                  <>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {companyData.name}
                    </h2>
                    <p className="text-slate-500">{companyData.tagline || 'No tagline set'}</p>
                  </>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Industry
              </label>
              {isEditing ?
                <Select
                  value={companyData.industry}
                  onChange={(e) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      industry: e.target.value
                    }))
                  }
                  options={[
                    { value: 'technology', label: 'Technology' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'education', label: 'Education' },
                    { value: 'retail', label: 'Retail' }]
                  } /> :

                <p className="text-slate-900 capitalize">
                  {companyData.industry}
                </p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Size
              </label>
              {isEditing ?
                <Select
                  value={companyData.size}
                  onChange={(e) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      size: e.target.value
                    }))
                  }
                  options={[
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-500', label: '201-500 employees' },
                    { value: '500+', label: '500+ employees' }]
                  } /> :

                <p className="text-slate-900">{companyData.size || 'Not specified'} employees</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Founded
              </label>
              {isEditing ?
                <Input
                  value={companyData.founded}
                  onChange={(e) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      founded: e.target.value
                    }))
                  } /> :

                <p className="text-slate-900">{companyData.founded || 'Not specified'}</p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Headquarters
              </label>
              {isEditing ?
                <Input
                  value={companyData.headquarters}
                  onChange={(e) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      headquarters: e.target.value
                    }))
                  }
                  icon={<MapPin className="h-4 w-4" />} /> :

                <div className="flex items-center gap-2 text-slate-900">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {companyData.headquarters || 'Not specified'}
                </div>
              }
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            About the Company
          </h3>
          {isEditing ?
            <textarea
              value={companyData.description}
              onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /> :

            <p className="text-slate-600 leading-relaxed">
              {companyData.description || 'No description provided.'}
            </p>
          }
        </div>
      </div>
    </DashboardLayout>);

}