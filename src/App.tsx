import { useState } from 'react';
import type { Pokemon } from './types/pokemon';
import { usePokemonGrid } from './hooks/usePokemonGrid';
import { SearchBar } from './components/SearchBar';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonModal } from './components/PokemonModal';

export default function App() {
  const {
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    filteredPokemon,
  } = usePokemonGrid();

  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-500 border-4 border-gray-800 shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Pokédex</h1>
            </div>
            <div className="w-full">
              <SearchBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <PokemonGrid
          pokemon={filteredPokemon}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onSelect={setSelectedPokemon}
        />
      </main>

      {/* Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        onNavigate={setSelectedPokemon}
      />
    </div>
  );
}
