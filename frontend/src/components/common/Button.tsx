import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  to,
  onClick,
  type = 'button',
  className = '',
  icon,
  disabled = false,
}) => {
  const typeClass = variant === 'primary' ? 'type--A' : variant === 'secondary' ? 'type--B' : 'type--C';
  
  const combinedClasses = `button ${typeClass} ${className} flex justify-center items-center ${
    disabled ? 'opacity-50 pointer-events-none' : ''
  }`;

  const content = (
    <>
      <div className="button__line"></div>
      <div className="button__line"></div>
      <span className="button__text flex items-center justify-center gap-2">
        {children}
        {icon && (
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
            {icon}
          </span>
        )}
      </span>
      <div className="button__drow1"></div>
      <div className="button__drow2"></div>
    </>
  );

  if (to) {
    if (to.startsWith('/') || to.startsWith('#')) {
      return (
        <Link to={to} className={combinedClasses}>
          {content}
        </Link>
      );
    }
    return (
      <a href={to} className={combinedClasses}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses} style={{ background: 'transparent', border: 'none' }}>
      {content}
    </button>
  );
};
