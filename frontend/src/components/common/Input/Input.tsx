import type React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  requiredIndicator?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  requiredIndicator,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {(required || requiredIndicator) && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-field-container">
        <input
          id={inputId}
          className={`input-field ${error ? 'input-has-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="input-error-msg" role="alert">
          {error}
        </span>
      )}
      {!error && helperText && <span className="input-helper-msg">{helperText}</span>}
    </div>
  );
};

export default Input;
