import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-900',
        primary:
          'bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 text-white shadow-md hover:shadow-lg hover:from-slate-800 hover:to-blue-800 focus-visible:ring-blue-900 border border-blue-800/30',
        accent:
          'bg-cyan-600 text-white shadow-md hover:bg-cyan-500 hover:shadow-cyan-500/25 focus-visible:ring-cyan-600',
        amber:
          'bg-amber-500 text-slate-950 font-bold shadow-md hover:bg-amber-400 hover:shadow-amber-500/25 focus-visible:ring-amber-500',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 border border-slate-200',
        outline:
          'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400 shadow-sm',
        ghost:
          'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
        link: 'text-blue-700 underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base tracking-wide',
        xl: 'h-14 rounded-xl px-8 text-lg font-bold shadow-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />
        ) : leftIcon ? (
          <span className="mr-2 inline-flex items-center">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon ? (
          <span className="ml-2 inline-flex items-center">{rightIcon}</span>
        ) : null}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

