import { STAT_COLORS, STAT_LABELS } from '../utils/typeUtils';

interface StatBarProps {
  name: string;
  value: number;
  max?: number;
}

export function StatBar({ name, value, max = 255 }: StatBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const color = STAT_COLORS[name] ?? 'bg-gray-400';
  const label = STAT_LABELS[name] ?? name;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-gray-500 w-8 shrink-0">{label}</span>
      <span className="text-sm font-bold text-gray-800 w-8 text-right shrink-0">{value}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
