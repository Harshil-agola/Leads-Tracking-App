import type React from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { api } from '../../api/client';
import { Button, Input, Select } from '../../components/common';
import { EMAIL_REGEX, LEAD_STATUS_OPTIONS, MAX_NAME_LENGTH, PHONE_REGEX } from '../../constants';
import type { LeadStatus, LeadWithNotes } from '../../types/lead';

interface EditLeadFormInputs {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
}

export interface EditLeadFormProps {
  lead: LeadWithNotes;
  onSuccess: (updatedLead: LeadWithNotes) => void;
  onCancel: () => void;
}

export const EditLeadForm: React.FC<EditLeadFormProps> = ({ lead, onSuccess, onCancel }) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditLeadFormInputs>({
    defaultValues: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status,
    },
  });

  const currentStatus = useWatch({ control, name: 'status', defaultValue: lead.status });

  const onSubmit = async (data: EditLeadFormInputs) => {
    setServerError(null);

    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        status: data.status,
      };

      const updated = await api.updateLead(lead.id, payload);
      onSuccess({
        ...lead,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        status: updated.status,
      });
    } catch (err: unknown) {
      setServerError((err as Error).message || 'Failed to update lead');
    }
  };

  return (
    <div>
      {serverError && (
        <div className="leads-error-banner" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Edit lead form">
        <div className="edit-form-grid">
          <Input
            label="Full Name"
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
            <span className="form-label" id="edit-lead-status-label">
              Status
            </span>
            <Select
              value={currentStatus}
              options={LEAD_STATUS_OPTIONS}
              onChange={(val) => setValue('status', val as LeadStatus)}
            />
          </div>
        </div>

        <div className="edit-form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Cancel editing"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} aria-label="Save changes">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};
