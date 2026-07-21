import type { PokemonTypeName } from '../types/pokemon';
import { POKEMON_TYPES } from '../utils/typeUtils';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedType: PokemonTypeName | '';
  onTypeChange: (t: PokemonTypeName | '') => void;
}

export function SearchBar({ query, onQueryChange, selectedType, onTypeChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-800 placeholder-gray-400"
        />
      </div>

      <select
        value={selectedType}
        onChange={e => onTypeChange(e.target.value as PokemonTypeName | '')}
        className="sm:w-48 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 capitalize"
      >
        <option value="">All Types</option>
        {POKEMON_TYPES.map(type => (
          <option key={type} value={type} className="capitalize">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
