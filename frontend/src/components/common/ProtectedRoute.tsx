import type React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginPage from '../../pages/LoginPage/LoginPage';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading-spinner loading-spinner-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
