import type React from 'react';
import type { LeadWithNotes } from '../../types/lead';
import { formatDate } from '../../utils';

export interface LeadInfoGridProps {
  lead: LeadWithNotes;
}

export const LeadInfoGrid: React.FC<LeadInfoGridProps> = ({ lead }) => {
  return (
    <div className="detail-grid">
      <div>
        <div className="form-label">Email Address</div>
        <div className="detail-field-value">{lead.email}</div>
      </div>

      <div>
        <div className="form-label">Phone Number</div>
        <div className="detail-field-value">{lead.phone || 'None provided'}</div>
      </div>

      <div>
        <div className="form-label">Status</div>
        <div className="detail-field-value lead-status-text">{lead.status}</div>
      </div>

      <div>
        <div className="form-label">Created At</div>
        <div className="detail-field-date">{formatDate(lead.createdAt)}</div>
      </div>
    </div>
  );
};
