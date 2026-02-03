import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from
  'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PostJobPage } from './pages/PostJobPage';
// Employer Pages
import { MyJobsPage } from './pages/employer/MyJobsPage';
import { CandidatesPage } from './pages/employer/CandidatesPage';
import { AIScreeningPage } from './pages/employer/AIScreeningPage';
import { AnalyticsPage } from './pages/employer/AnalyticsPage';
import { CompanyProfilePage } from './pages/employer/CompanyProfilePage';
import { SettingsPage } from './pages/employer/SettingsPage';
// Seeker Pages
import { ApplicationsPage } from './pages/seeker/ApplicationsPage';
import { SavedJobsPage } from './pages/seeker/SavedJobsPage';
import { CVBuilderPage } from './pages/seeker/CVBuilderPage';
import { SkillsAnalyticsPage } from './pages/seeker/SkillsAnalyticsPage';
import { CareerGuidancePage } from './pages/seeker/CareerGuidancePage';
import { SeekerSettingsPage } from './pages/seeker/SeekerSettingsPage';
// Admin Pages
import { UsersPage } from './pages/admin/UsersPage';
import { JobsManagementPage } from './pages/admin/JobsManagementPage';
import { MarketAnalyticsPage } from './pages/admin/MarketAnalyticsPage';
import { SupplyDemandPage } from './pages/admin/SupplyDemandPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
export function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes - Seeker & Jobs */}
            <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              
              <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
              <Route path="/seeker/applications" element={<ApplicationsPage />} />
              <Route path="/seeker/saved" element={<SavedJobsPage />} />
              <Route path="/seeker/cv-builder" element={<CVBuilderPage />} />
              <Route path="/seeker/skills" element={<SkillsAnalyticsPage />} />
              <Route path="/seeker/career" element={<CareerGuidancePage />} />
              <Route path="/seeker/settings" element={<SeekerSettingsPage />} />
            </Route>

            {/* Protected Routes - Employer */}
            <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/post-job" element={<PostJobPage />} />
              <Route path="/employer/jobs" element={<MyJobsPage />} />
              <Route path="/employer/candidates" element={<CandidatesPage />} />
              <Route path="/employer/screening" element={<AIScreeningPage />} />
              <Route path="/employer/analytics" element={<AnalyticsPage />} />
              <Route path="/employer/company" element={<CompanyProfilePage />} />
              <Route path="/employer/settings" element={<SettingsPage />} />
            </Route>

            {/* Protected Routes - Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/jobs" element={<JobsManagementPage />} />
              <Route path="/admin/analytics" element={<MarketAnalyticsPage />} />
              <Route path="/admin/market" element={<SupplyDemandPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>);

}