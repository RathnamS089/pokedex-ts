import { useEffect, useRef } from 'react';
import type { Pokemon } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';

interface PokemonGridProps {
  pokemon: Pokemon[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelect: (pokemon: Pokemon) => void;
}

export function PokemonGrid({
  pokemon,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onSelect,
}: PokemonGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (isLoading && pokemon.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && pokemon.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <span className="text-6xl mb-4">?</span>
        <p className="text-xl font-medium">No Pokémon found</p>
        <p className="text-sm mt-1">Try a different name or type</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {pokemon.map(p => (
          <PokemonCard key={p.id} pokemon={p} onClick={onSelect} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8 mt-4" />

      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <p className="text-center text-gray-400 text-sm py-6">
          Showing {pokemon.length} Pokémon
        </p>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-gray-100 animate-pulse p-4 flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full bg-gray-200" />
      <div className="h-4 w-20 rounded bg-gray-200" />
      <div className="h-5 w-14 rounded-full bg-gray-200" />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none" aria-label="Loading">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
