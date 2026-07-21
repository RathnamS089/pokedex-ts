import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Pokemon, PokemonSpecies, ChainLink } from '../types/pokemon';

export interface EvolutionStage {
  name: string;
  id: number;
  sprite: string | null;
  minLevel: number | null;
}

export interface PokemonDetail {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evolutionStages: EvolutionStage[][];
  flavorText: string;
}

function extractEvolutionStages(chain: ChainLink): EvolutionStage[][] {
  const stages: EvolutionStage[][] = [];

  function walk(link: ChainLink, depth: number) {
    const id = parseInt(link.species.url.split('/').filter(Boolean).pop() ?? '0', 10);
    const stage: EvolutionStage = {
      name: link.species.name,
      id,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      minLevel: link.evolution_details[0]?.min_level ?? null,
    };

    if (!stages[depth]) stages[depth] = [];
    stages[depth].push(stage);

    for (const next of link.evolves_to) {
      walk(next, depth + 1);
    }
  }

  walk(chain, 0);
  return stages;
}

export function usePokemonDetail(pokemon: Pokemon | null) {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pokemon) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const species = await api.getPokemonSpecies(pokemon.id);
        const evoChain = await api.getEvolutionChain(species.evolution_chain.url);

        if (cancelled) return;

        const flavorEntry = species.flavor_text_entries.find(
          e => e.language.name === 'en'
        );
        const flavorText = flavorEntry?.flavor_text.replace(/\f|\n/g, ' ') ?? '';
        const evolutionStages = extractEvolutionStages(evoChain.chain);

        setDetail({ pokemon, species, evolutionStages, flavorText });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load details');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pokemon]);

  return { detail, isLoading, error };
}
