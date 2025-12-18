import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Map size to appropriate classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Use the global btn-primary and btn-secondary classes for consistency
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={clsx(
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin-slow w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
          <span>Chargement...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}