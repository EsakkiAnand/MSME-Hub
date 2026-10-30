import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ProblemStatus } from '@/types';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-slate-50 hover:bg-slate-800',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200',
        outline: 'border border-slate-300 text-slate-700 bg-white',
        primary: 'bg-blue-50 text-blue-700 border border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
        cyan: 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium',
        destructive: 'bg-rose-50 text-rose-700 border border-rose-200 font-medium',
        purple: 'bg-purple-50 text-purple-700 border border-purple-200 font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-emerald-500 animate-pulse',
            variant === 'warning' && 'bg-amber-500',
            variant === 'destructive' && 'bg-rose-500',
            variant === 'primary' && 'bg-blue-600',
            variant === 'cyan' && 'bg-cyan-500',
            (!variant || variant === 'default') && 'bg-slate-400'
          )}
        />
      )}
      {children}
    </div>
  );
}

// Specialized component for workflow statuses (shared with Member 3 & 4)
export function ProblemStatusBadge({ status }: { status: ProblemStatus }) {
  switch (status) {
    case 'SUBMITTED':
      return (
        <Badge variant="cyan" dot>
          Submitted (G0)
        </Badge>
      );
    case 'UNDER_REVIEW':
      return (
        <Badge variant="primary" dot>
          Under Review (G1)
        </Badge>
      );
    case 'CLARIFICATION_NEEDED':
      return (
        <Badge variant="warning" dot>
          Clarification Needed
        </Badge>
      );
    case 'ASSESSMENT_SCHEDULED':
      return (
        <Badge variant="purple" dot>
          Field Visit Scheduled (G3)
        </Badge>
      );
    case 'AWAITING_APPROVAL':
      return (
        <Badge variant="warning" dot>
          Awaiting Approval (G4)
        </Badge>
      );
    case 'APPROVED_FOR_PROJECT':
      return (
        <Badge variant="success" dot>
          Approved Project (G5)
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="primary" dot>
          In Progress (G6–G9)
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge variant="success" dot>
          Completed & Handed Over (G10)
        </Badge>
      );
    case 'DEFERRED':
      return <Badge variant="secondary">Deferred</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export { Badge, badgeVariants };

