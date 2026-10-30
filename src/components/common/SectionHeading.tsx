import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 border border-blue-200/80 mb-3 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
        {title}{' '}
        {highlight && (
          <span className="text-gradient-cyan underline decoration-cyan-400/30 decoration-wavy decoration-2">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {description}
        </p>
      )}
    </div>
  );
}

