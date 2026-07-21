import type { PokemonTypeName } from '../types/pokemon';
import { TYPE_COLORS } from '../utils/typeUtils';

interface TypeBadgeProps {
  type: PokemonTypeName;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-400 text-white';
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`${color} ${padding} rounded-full font-semibold capitalize tracking-wide`}>
      {type}
    </span>
  );
}
