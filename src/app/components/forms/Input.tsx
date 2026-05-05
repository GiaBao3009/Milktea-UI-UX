import React from 'react';
import { cn } from '@app/components/ui/utils';

type InputVariant = 'default' | 'compact';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  containerClassName?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, variant = 'default', containerClassName, error, className, ...rest }, ref) => {
    const isCompact = variant === 'compact';
    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label className={cn('font-medium text-slate-700 dark:text-slate-300', isCompact ? 'text-xs' : 'text-sm')}>
            {label}
            {rest.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-slate-300 bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500',
            isCompact ? 'py-1.5' : 'py-2',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500',
            className,
          )}
          {...rest}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
