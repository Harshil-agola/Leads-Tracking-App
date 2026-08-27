import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Button, Input, Select } from '../../components/common';
import {
  APP_ROUTES,
  EMAIL_REGEX,
  LEAD_STATUS_OPTIONS,
  MAX_NAME_LENGTH,
  PHONE_REGEX,
} from '../../constants';
import type { LeadStatus } from '../../types/lead';
import './CreateLeadPage.css';

interface CreateLeadFormInputs {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export const CreateLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'new',
    },
  });

  const currentStatus = useWatch({ control, name: 'status', defaultValue: 'new' });

  const onSubmit = async (data: CreateLeadFormInputs) => {
    setServerError(null);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        status: data.status,
      };

      const newLead = await api.createLead(payload);
      navigate(APP_ROUTES.LEAD_DETAIL(newLead.id));
    } catch (err: unknown) {
      setServerError((err as Error).message || 'Failed to create lead');
    }
  };

  return (
    <div className="form-page-wrapper">
      <div className="form-page-back-link-wrapper">
        <Link to={APP_ROUTES.HOME} className="form-page-back-link" aria-label="Back to leads list">
          <ArrowLeft size={14} />
          Back to Leads
        </Link>
      </div>

      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Create Lead</h1>
          <p className="form-subtitle">Enter contact details and pipeline status.</p>
        </div>

        {serverError && (
          <div className="server-error-banner" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Create lead form">
          <Input
            label="Full Name"
            placeholder="e.g. Alice Johnson"
            required
            aria-label="Full Name"
            error={errors.name?.message}
            {...register('name', {
              required: 'Full name is required',
              maxLength: {
                value: MAX_NAME_LENGTH,
                message: `Name must be ${MAX_NAME_LENGTH} characters or fewer`,
              },
            })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. alice@techcorp.io"
            required
            aria-label="Email Address"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Please enter a valid email address',
              },
            })}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g. +1 (555) 234-5678"
            aria-label="Phone Number"
            error={errors.phone?.message}
            {...register('phone', {
              validate: (val) => {
                if (!val?.trim()) return true;
                const digits = val.replace(/\D/g, '');
                if (!PHONE_REGEX.test(val.trim()) || digits.length < 7 || digits.length > 15) {
                  return 'Invalid phone format (e.g. +1 (555) 234-5678)';
                }
                return true;
              },
            })}
          />

          <div className="form-group">
            <span className="form-label" id="create-lead-status-label">
              Status
            </span>
            <Select
              value={currentStatus}
              options={LEAD_STATUS_OPTIONS}
              onChange={(val) => setValue('status', val as LeadStatus)}
            />
          </div>

          <div className="form-actions">
            <Link to={APP_ROUTES.HOME} aria-label="Cancel and return to leads list">
              <Button variant="secondary" aria-label="Cancel and return to leads list">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              aria-label="Submit and create lead"
            >
              {isSubmitting ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadPage;
