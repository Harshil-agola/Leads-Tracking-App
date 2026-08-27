import type React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
