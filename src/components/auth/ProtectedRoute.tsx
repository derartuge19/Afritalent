import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layout } from '../layout/Layout';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on actua role?
    // Or just a 403 Forbidden page.
    // For now, redirect to their own dashboard or home.
    if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
    if (user.role === 'seeker') return <Navigate to="/user/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
