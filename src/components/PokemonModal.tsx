import { useEffect, useCallback } from 'react';
import type { Pokemon } from '../types/pokemon';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';
import { EvolutionChainDisplay } from './EvolutionChainDisplay';
import { padId, formatName, getPrimaryType, TYPE_BG_GRADIENT } from '../utils/typeUtils';
import type { PokemonTypeName } from '../types/pokemon';
import { api } from '../services/api';
import { useState } from 'react';

interface PokemonModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  onNavigate: (pokemon: Pokemon) => void;
}

export function PokemonModal({ pokemon, onClose, onNavigate }: PokemonModalProps) {
  const { detail, isLoading, error } = usePokemonDetail(pokemon);
  const [activeTab, setActiveTab] = useState<'stats' | 'abilities' | 'moves'>('stats');

  useEffect(() => {
    setActiveTab('stats');
  }, [pokemon?.id]);

  const handleEvoSelect = useCallback(async (id: number) => {
    try {
      const p = await api.getPokemon(id);
      onNavigate(p);
    } catch { /* ignore */ }
  }, [onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (pokemon) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [pokemon]);

  if (!pokemon) return null;

  const primaryType = getPrimaryType(pokemon.types);
  const gradient = TYPE_BG_GRADIENT[primaryType as PokemonTypeName] ?? 'from-gray-200 to-gray-100';
  const officialArt = pokemon.sprites.other['official-artwork'].front_default;
  const shinyArt = pokemon.sprites.other['official-artwork'].front_shiny;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${formatName(pokemon.name)}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${gradient} p-6 pb-4 relative`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono text-gray-600/70 font-semibold mb-1">{padId(pokemon.id)}</p>
              <h2 className="text-2xl font-extrabold text-gray-800">{formatName(pokemon.name)}</h2>
              {detail && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {detail.species.genera.find(g => g.language.name === 'en')?.genus ?? ''}
                </p>
              )}
              <div className="flex gap-2 mt-2 flex-wrap">
                {pokemon.types.map(t => (
                  <TypeBadge key={t.type.name} type={t.type.name as PokemonTypeName} />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors text-gray-700"
              aria-label="Close"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="absolute right-6 bottom-0 translate-y-1/3">
            {officialArt && (
              <img
                src={officialArt}
                alt={pokemon.name}
                className="w-32 h-32 object-contain drop-shadow-xl"
              />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 pt-12">
          {isLoading && (
            <div className="flex justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {error && <p className="text-red-500 text-center py-6">{error}</p>}

          {detail && !isLoading && (
            <div className="space-y-5">
              {/* Flavor text */}
              {detail.flavorText && (
                <p className="text-sm text-gray-600 italic bg-gray-50 rounded-xl p-3 leading-relaxed">
                  {detail.flavorText}
                </p>
              )}

              {/* Quick facts */}
              <div className="grid grid-cols-3 gap-3">
                <Fact label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
                <Fact label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
                <Fact label="Base Exp" value={String(pokemon.base_experience ?? '—')} />
              </div>

              {/* Sprites row */}
              <div className="flex gap-3 justify-center">
                {[
                  { src: pokemon.sprites.front_default, label: 'Front' },
                  { src: pokemon.sprites.back_default, label: 'Back' },
                  { src: shinyArt, label: 'Shiny' },
                ].filter(s => s.src).map(({ src, label }) => (
                  <div key={label} className="flex flex-col items-center bg-gray-50 rounded-xl p-2">
                    <img src={src!} alt={`${pokemon.name} ${label}`} className="w-16 h-16 object-contain" />
                    <span className="text-xs text-gray-400 mt-1">{label}</span>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-200 mb-4">
                  {(['stats', 'abilities', 'moves'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'stats' && (
                  <div className="space-y-2.5">
                    {pokemon.stats.map(s => (
                      <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
                    ))}
                    <p className="text-xs text-gray-400 text-right pt-1">
                      Total: {pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0)}
                    </p>
                  </div>
                )}

                {activeTab === 'abilities' && (
                  <div className="space-y-2">
                    {pokemon.abilities.map(a => (
                      <div key={a.ability.name} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-sm text-gray-800 capitalize">
                          {formatName(a.ability.name)}
                        </span>
                        {a.is_hidden && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'moves' && (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    {pokemon.moves.slice(0, 40).map(m => (
                      <span
                        key={m.move.name}
                        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full capitalize"
                      >
                        {formatName(m.move.name)}
                      </span>
                    ))}
                    {pokemon.moves.length > 40 && (
                      <span className="text-xs text-gray-400 self-center">
                        +{pokemon.moves.length - 40} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Evolution chain */}
              {detail.evolutionStages.length > 1 && (
                <div className="border-t border-gray-100 pt-4">
                  <EvolutionChainDisplay
                    stages={detail.evolutionStages}
                    onSelect={(id, _name) => handleEvoSelect(id)}
                  />
                </div>
              )}

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {detail.species.is_legendary && (
                  <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    Legendary
                  </span>
                )}
                {detail.species.is_mythical && (
                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Mythical
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="font-bold text-gray-800 text-sm">{value}</p>
    </div>
  );
}
