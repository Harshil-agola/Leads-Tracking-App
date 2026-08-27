import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from './constants';
import { CreateLeadPage, LeadDetailPage, LeadsListPage, NotFoundPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <main className="container">
        <Routes>
          <Route path={APP_ROUTES.HOME} element={<LeadsListPage />} />
          <Route path={APP_ROUTES.LEADS} element={<Navigate to={APP_ROUTES.HOME} replace />} />
          <Route path={APP_ROUTES.CREATE_LEAD} element={<CreateLeadPage />} />
          <Route path={APP_ROUTES.LEAD_DETAIL_PATTERN} element={<LeadDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
