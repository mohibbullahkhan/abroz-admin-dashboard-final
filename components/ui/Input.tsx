import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, suffix, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-medium text-text-muted">{label}</label>}
        <div className="relative flex items-center">
          {icon && <div className="absolute left-3 text-text-muted">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              'w-full bg-black/5 dark:bg-white/5 border border-border rounded-lg px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 text-[var(--foreground)]',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-danger focus:ring-danger/20 focus:border-danger',
              className
            )}
            {...props}
          />
          {suffix && <div className="absolute right-3 text-text-muted">{suffix}</div>}
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
