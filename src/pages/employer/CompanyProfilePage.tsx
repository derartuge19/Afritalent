import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Mail,
  Phone,
  Camera,
  Save,
  Plus,
  X,
  Linkedin,
  Twitter,
  Facebook } from
'lucide-react';
import { motion } from 'framer-motion';
export function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'TechAfrica Inc.',
    tagline: 'Building the future of African tech',
    industry: 'technology',
    size: '51-200',
    founded: '2018',
    website: 'https://techafrica.com',
    email: 'careers@techafrica.com',
    phone: '+251 11 234 5678',
    headquarters: 'Addis Ababa, Ethiopia',
    description:
    'TechAfrica is a leading technology company focused on building innovative solutions for the African market. We specialize in fintech, e-commerce, and enterprise software.',
    culture:
    'We believe in fostering a collaborative, inclusive environment where every team member can thrive. Our culture is built on innovation, transparency, and continuous learning.',
    benefits: [
    'Health Insurance',
    'Remote Work Options',
    'Professional Development',
    'Stock Options',
    'Flexible Hours',
    'Gym Membership'],

    socialLinks: {
      linkedin: 'https://linkedin.com/company/techafrica',
      twitter: 'https://twitter.com/techafrica',
      facebook: ''
    }
  });
  const [newBenefit, setNewBenefit] = useState('');
  const addBenefit = () => {
    if (newBenefit.trim()) {
      setCompanyData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };
  const removeBenefit = (index: number) => {
    setCompanyData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };
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
            onClick={() => setIsEditing(!isEditing)}
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
                <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-primary-600">
                  TA
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
                    <p className="text-slate-500">{companyData.tagline}</p>
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
                {
                  value: 'technology',
                  label: 'Technology'
                },
                {
                  value: 'finance',
                  label: 'Finance'
                },
                {
                  value: 'healthcare',
                  label: 'Healthcare'
                },
                {
                  value: 'education',
                  label: 'Education'
                },
                {
                  value: 'retail',
                  label: 'Retail'
                }]
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
                {
                  value: '1-10',
                  label: '1-10 employees'
                },
                {
                  value: '11-50',
                  label: '11-50 employees'
                },
                {
                  value: '51-200',
                  label: '51-200 employees'
                },
                {
                  value: '201-500',
                  label: '201-500 employees'
                },
                {
                  value: '500+',
                  label: '500+ employees'
                }]
                } /> :


              <p className="text-slate-900">{companyData.size} employees</p>
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


              <p className="text-slate-900">{companyData.founded}</p>
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
                  {companyData.headquarters}
                </div>
              }
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Website
              </label>
              {isEditing ?
              <Input
                value={companyData.website}
                onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  website: e.target.value
                }))
                }
                icon={<Globe className="h-4 w-4" />} /> :


              <a
                href={companyData.website}
                className="flex items-center gap-2 text-primary-600 hover:underline">

                  <Globe className="h-4 w-4" />
                  {companyData.website}
                </a>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Careers Email
              </label>
              {isEditing ?
              <Input
                value={companyData.email}
                onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  email: e.target.value
                }))
                }
                icon={<Mail className="h-4 w-4" />} /> :


              <div className="flex items-center gap-2 text-slate-900">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {companyData.email}
                </div>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              {isEditing ?
              <Input
                value={companyData.phone}
                onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  phone: e.target.value
                }))
                }
                icon={<Phone className="h-4 w-4" />} /> :


              <div className="flex items-center gap-2 text-slate-900">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {companyData.phone}
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
              {companyData.description}
            </p>
          }
        </div>

        {/* Culture */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Company Culture
          </h3>
          {isEditing ?
          <textarea
            value={companyData.culture}
            onChange={(e) =>
            setCompanyData((prev) => ({
              ...prev,
              culture: e.target.value
            }))
            }
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /> :


          <p className="text-slate-600 leading-relaxed">
              {companyData.culture}
            </p>
          }
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Benefits & Perks
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {companyData.benefits.map((benefit, index) =>
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">

                {benefit}
                {isEditing &&
              <button
                onClick={() => removeBenefit(index)}
                className="ml-1 p-0.5 hover:bg-primary-100 rounded-full">

                    <X className="h-3 w-3" />
                  </button>
              }
              </span>
            )}
          </div>
          {isEditing &&
          <div className="flex gap-2">
              <Input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Add a benefit..."
              onKeyDown={(e) => e.key === 'Enter' && addBenefit()} />

              <Button
              onClick={addBenefit}
              leftIcon={<Plus className="h-4 w-4" />}>

                Add
              </Button>
            </div>
          }
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Social Media
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Linkedin className="h-5 w-5 text-[#0077b5]" />
              {isEditing ?
              <Input
                value={companyData.socialLinks.linkedin}
                onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    linkedin: e.target.value
                  }
                }))
                }
                placeholder="LinkedIn URL"
                className="flex-1" /> :


              <a
                href={companyData.socialLinks.linkedin}
                className="text-primary-600 hover:underline">

                  {companyData.socialLinks.linkedin || 'Not set'}
                </a>
              }
            </div>
            <div className="flex items-center gap-4">
              <Twitter className="h-5 w-5 text-[#1da1f2]" />
              {isEditing ?
              <Input
                value={companyData.socialLinks.twitter}
                onChange={(e) =>
                setCompanyData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    twitter: e.target.value
                  }
                }))
                }
                placeholder="Twitter URL"
                className="flex-1" /> :


              <a
                href={companyData.socialLinks.twitter}
                className="text-primary-600 hover:underline">

                  {companyData.socialLinks.twitter || 'Not set'}
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}