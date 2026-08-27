import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import { APP_ROUTES } from '../../constants';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-container">
      <h2 className="not-found-title">Page Not Found</h2>
      <Link to={APP_ROUTES.HOME} className="not-found-link" aria-label="Back to Leads">
        <Button variant="primary" aria-label="Back to Leads">
          <ArrowLeft size={16} />
          Back to Leads
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
