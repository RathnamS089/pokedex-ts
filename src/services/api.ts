import type {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  TypeResponse,
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
  return res.json() as Promise<T>;
}

export const api = {
  getPokemonList(offset = 0, limit = 20): Promise<PokemonListResponse> {
    return fetchJSON(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  },

  getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return fetchJSON(`${BASE_URL}/pokemon/${nameOrId}`);
  },

  getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    return fetchJSON(`${BASE_URL}/pokemon-species/${nameOrId}`);
  },

  getEvolutionChain(url: string): Promise<EvolutionChain> {
    return fetchJSON(url);
  },

  getType(name: string): Promise<TypeResponse> {
    return fetchJSON(`${BASE_URL}/type/${name}`);
  },

  getAllTypes(): Promise<PokemonListResponse> {
    return fetchJSON(`${BASE_URL}/type?limit=20`);
  },
};
