import React from 'react';
import '../../styles/components/TouchButton.css';

interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const variantClasses = {
    primary: 'bg-primary-blue text-primary-white hover:bg-secondary-blue',
    secondary: 'bg-primary-green text-primary-white hover:bg-secondary-green',
    outline: 'bg-transparent border border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-primary-white',
    danger: 'bg-error-red text-primary-white hover:bg-dark-red'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg'
  };

  return (
    <button
      type={type}
      className={`
        touch-button
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TouchButton;