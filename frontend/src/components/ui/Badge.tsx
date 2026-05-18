import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'green' | 'red' | 'slate';
  className?: string;
}

export const Badge = ({ children, variant = 'slate', className }: BadgeProps) => {
  const variants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
  };

  return (
    <span className={clsx(
      "px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
