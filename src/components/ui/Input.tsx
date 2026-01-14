import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      leftElement,
      rightElement,
      containerClassName,
      id: propId,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const inputId = propId || `input-${id}`;
    const hasError = Boolean(error);

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftElement}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 ring-offset-white dark:ring-offset-slate-800 transition-all duration-200',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftElement ? 'pl-10' : 'pl-3',
              rightElement ? 'pr-10' : 'pr-3',
              hasError
                ? 'border-red-500 focus-visible:ring-red-200 dark:border-red-500 dark:focus-visible:ring-red-900'
                : 'border-slate-200 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500',
              className
            )}
            ref={ref}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && !hasError && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
        {hasError && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
