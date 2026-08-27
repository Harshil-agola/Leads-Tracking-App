import type React from 'react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setAuthError(null);
    try {
      const result = await login(data.email.trim(), data.password.trim());
      if (!result.success) {
        setAuthError(result.message || 'Invalid email or password.');
      }
    } catch {
      setAuthError('An error occurred during authentication.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Admin Access</h1>
          <p className="login-subtitle">Enter admin credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Admin Email"
            type="email"
            placeholder="admin@domain.com"
            error={errors.email?.message}
            autoFocus
            {...register('email', {
              required: 'Admin email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
            })}
          />

          <Button
            type="submit"
            variant="primary"
            className="login-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="loading-spinner" /> : 'Log In to Dashboard'}
          </Button>

          {authError && <div className="login-error-alert login-msg-below">{authError}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
