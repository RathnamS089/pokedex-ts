import type { PokemonTypeName } from '../types/pokemon';

export const TYPE_COLORS: Record<PokemonTypeName, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-purple-800 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-500 text-white',
  fairy: 'bg-pink-300 text-gray-900',
};

export const TYPE_BG_GRADIENT: Record<PokemonTypeName, string> = {
  normal: 'from-gray-300 to-gray-200',
  fire: 'from-orange-400 to-amber-300',
  water: 'from-blue-400 to-cyan-300',
  electric: 'from-yellow-300 to-amber-200',
  grass: 'from-green-400 to-lime-300',
  ice: 'from-cyan-300 to-blue-200',
  fighting: 'from-red-600 to-red-400',
  poison: 'from-purple-400 to-fuchsia-300',
  ground: 'from-yellow-600 to-amber-400',
  flying: 'from-indigo-300 to-blue-200',
  psychic: 'from-pink-400 to-rose-300',
  bug: 'from-lime-400 to-green-300',
  rock: 'from-yellow-700 to-amber-600',
  ghost: 'from-purple-700 to-indigo-600',
  dragon: 'from-indigo-600 to-blue-500',
  dark: 'from-gray-700 to-gray-600',
  steel: 'from-gray-400 to-slate-300',
  fairy: 'from-pink-300 to-rose-200',
};

export const STAT_COLORS: Record<string, string> = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-blue-500',
  'special-defense': 'bg-green-500',
  speed: 'bg-pink-500',
};

export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
};

export const POKEMON_TYPES: PokemonTypeName[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export function padId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export function formatName(name: string): string {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function getPrimaryType(types: { type: { name: string } }[]): PokemonTypeName {
  return (types[0]?.type.name ?? 'normal') as PokemonTypeName;
}
