import React from 'react';


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
  size = 'md',
  href,
  to,
  onClick,
  type = 'button',
  className = '',
  icon,
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-[11px]',
    md: 'px-8 py-4 text-label-caps',
    lg: 'px-10 py-5 text-label-caps',
  }[size];

  const variantClasses = {
    primary:
      'bg-primary text-[#3E2723] font-label-caps uppercase hover:bg-tertiary transition-all duration-400 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5',
    secondary:
      'border border-border-metallic text-[#3E2723] font-label-caps uppercase hover:bg-surface-container-high transition-all duration-400 ease-out relative overflow-hidden group bg-background/50 backdrop-blur-sm',
    outline:
      'border border-border-metallic text-[#3E2723] hover:text-[#3E2723] hover:border-primary/50 font-label-mono uppercase transition-colors duration-300',
    ghost:
      'text-[#3E2723] hover:text-[#3E2723] font-label-caps uppercase transition-colors duration-300',
  }[variant];

  const content = (
    <>
      {variant === 'secondary' && (
        <div className="absolute inset-0 bg-glow-accent opacity-0 group-hover:opacity-20 transition-opacity blur-md pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {icon && (
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
            {icon}
          </span>
        )}
      </span>
    </>
  );

  const combinedClasses = `inline-flex items-center justify-center rounded-full tracking-widest cursor-pointer select-none ${sizeClasses} ${variantClasses} ${className} ${
    disabled ? 'opacity-50 pointer-events-none' : ''
  }`;

  if (to) {
    return (
      <a href={to.startsWith('/') ? `#${to.substring(1)}` : to} className={combinedClasses}>
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
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
      {content}
    </button>
  );
};

