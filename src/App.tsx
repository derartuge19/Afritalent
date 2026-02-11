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
import { UserDashboard } from './pages/UserDashboard';
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
import { InterviewsPage as EmployerInterviewsPage } from './pages/employer/InterviewsPage';
// User Pages
import { ApplicationsPage } from './pages/user/ApplicationsPage';
import { SavedJobsPage } from './pages/user/SavedJobsPage';
import { CVBuilderPage } from './pages/user/CVBuilderPage';
import { SkillsAnalyticsPage } from './pages/user/SkillsAnalyticsPage';
import { CareerGuidancePage } from './pages/user/CareerGuidancePage';
import { UserSettingsPage } from './pages/user/UserSettingsPage';
import { InterviewsPage as SeekerInterviewsPage } from './pages/seeker/InterviewsPage';
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

              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/applications" element={<ApplicationsPage />} />
              <Route path="/user/saved" element={<SavedJobsPage />} />
              <Route path="/user/cv-builder" element={<CVBuilderPage />} />
              <Route path="/user/skills" element={<SkillsAnalyticsPage />} />
              <Route path="/user/career" element={<CareerGuidancePage />} />
              <Route path="/user/interviews" element={<SeekerInterviewsPage />} />
              <Route path="/user/settings" element={<UserSettingsPage />} />
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
              <Route path="/employer/interviews" element={<EmployerInterviewsPage />} />
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