import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Card = ({ children, className, hoverable = false, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border/80 rounded-sm overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md',
        hoverable && 'hover:border-primary/50 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-b border-border', className)}>{children}</div>
);

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('p-6', className)}>{children}</div>
);

export const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('px-6 py-4 border-t border-border bg-white/5', className)}>{children}</div>
);
