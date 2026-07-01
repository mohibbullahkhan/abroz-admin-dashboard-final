import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rectangle';
}

export const Skeleton = ({ className, variant = 'rectangle' }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 dark:bg-white/10',
        variant === 'text' && 'h-4 w-3/4 rounded',
        variant === 'circle' && 'rounded-full h-10 w-10',
        variant === 'card' && 'h-32 w-full rounded-xl',
        variant === 'rectangle' && 'h-10 w-full rounded-lg',
        className
      )}
    />
  );
};
