import { cn } from '@/lib/utils';

const DEFAULT_COLOR = '#8DDD91';

export function CategoryBadge({ label, color, className }) {
  return (
    <span
      className={cn('px-8 py-1.5 rounded-full text-white font-bold text-[32px] shadow-sm', className)}
      style={{ backgroundColor: color || DEFAULT_COLOR }}
    >
      {label}
    </span>
  );
}
