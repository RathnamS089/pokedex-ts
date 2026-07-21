import { useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';
import { padId, formatName, getPrimaryType, TYPE_BG_GRADIENT } from '../utils/typeUtils';
import type { PokemonTypeName } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const [imgError, setImgError] = useState(false);
  const primaryType = getPrimaryType(pokemon.types);
  const gradient = TYPE_BG_GRADIENT[primaryType as PokemonTypeName] ?? 'from-gray-200 to-gray-100';
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default;

  return (
    <button
      type="button"
      onClick={() => onClick(pokemon)}
      className={`group relative bg-gradient-to-br ${gradient} rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer text-left w-full`}
    >
      <div className="absolute top-3 right-3 text-xs font-mono text-gray-600/70 font-semibold">
        {padId(pokemon.id)}
      </div>

      <div className="flex flex-col items-center">
        {sprite && !imgError ? (
          <img
            src={sprite}
            alt={pokemon.name}
            width={96}
            height={96}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-24 h-24 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center text-4xl">?</div>
        )}

        <h3 className="mt-2 font-bold text-gray-800 text-center capitalize leading-tight">
          {formatName(pokemon.name)}
        </h3>

        <div className="mt-2 flex gap-1 flex-wrap justify-center">
          {pokemon.types.map(t => (
            <TypeBadge key={t.type.name} type={t.type.name as PokemonTypeName} size="sm" />
          ))}
        </div>
      </div>
    </button>
  );
}
