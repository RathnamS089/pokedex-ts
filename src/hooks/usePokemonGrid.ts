import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import type { Pokemon, PokemonTypeName } from '../types/pokemon';

const PAGE_SIZE = 24;
const TOTAL_POKEMON = 1025;

interface UsePokemonGridResult {
  pokemon: Pokemon[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedType: PokemonTypeName | '';
  setSelectedType: (t: PokemonTypeName | '') => void;
  filteredPokemon: Pokemon[];
}

export function usePokemonGrid(): UsePokemonGridResult {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PokemonTypeName | ''>('');
  const [typeFilteredNames, setTypeFilteredNames] = useState<Set<string> | null>(null);
  const [isLoadingType, setIsLoadingType] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(async (pageOffset: number, append: boolean) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const list = await api.getPokemonList(pageOffset, PAGE_SIZE);
      const details = await Promise.all(
        list.results.map(r => api.getPokemon(r.name))
      );
      setAllPokemon(prev => append ? [...prev, ...details] : details);
      setOffset(pageOffset + PAGE_SIZE);
      setHasMore(pageOffset + PAGE_SIZE < TOTAL_POKEMON && list.next !== null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Pokémon');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  useEffect(() => {
    if (!selectedType) {
      setTypeFilteredNames(null);
      return;
    }
    setIsLoadingType(true);
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    api.getType(selectedType).then(data => {
      const names = new Set(data.pokemon.map(p => p.pokemon.name));
      setTypeFilteredNames(names);
      setIsLoadingType(false);
    }).catch(() => {
      setIsLoadingType(false);
    });
  }, [selectedType]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !searchQuery && !selectedType) {
      fetchPage(offset, true);
    }
  }, [isLoadingMore, hasMore, offset, fetchPage, searchQuery, selectedType]);

  const filteredPokemon = allPokemon.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilteredNames || typeFilteredNames.has(p.name);
    return matchesSearch && matchesType;
  });

  return {
    pokemon: allPokemon,
    isLoading: isLoading || isLoadingType,
    isLoadingMore,
    hasMore: !searchQuery && !selectedType && hasMore,
    error,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    filteredPokemon,
  };
}
