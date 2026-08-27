import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { APP_ROUTES } from './constants';
import { AuthProvider } from './context/AuthContext';
import { CreateLeadPage, LeadDetailPage, LeadsListPage, NotFoundPage } from './pages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main className="container">
          <Routes>
            <Route
              path={APP_ROUTES.HOME}
              element={
                <ProtectedRoute>
                  <LeadsListPage />
                </ProtectedRoute>
              }
            />
            <Route path={APP_ROUTES.LEADS} element={<Navigate to={APP_ROUTES.HOME} replace />} />
            <Route
              path={APP_ROUTES.CREATE_LEAD}
              element={
                <ProtectedRoute>
                  <CreateLeadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={APP_ROUTES.LEAD_DETAIL_PATTERN}
              element={
                <ProtectedRoute>
                  <LeadDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
