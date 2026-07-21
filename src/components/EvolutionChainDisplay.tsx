import type { EvolutionStage } from '../hooks/usePokemonDetail';
import { formatName } from '../utils/typeUtils';

interface EvolutionChainDisplayProps {
  stages: EvolutionStage[][];
  onSelect: (id: number, name: string) => void;
}

export function EvolutionChainDisplay({ stages, onSelect }: EvolutionChainDisplayProps) {
  if (stages.length <= 1) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Evolution</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {stages.map((stage, stageIdx) => (
          <div key={stageIdx} className="flex items-center gap-2">
            {stageIdx > 0 && (
              <div className="flex flex-col items-center">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {stages[stageIdx][0]?.minLevel && (
                  <span className="text-xs text-gray-400">Lv.{stages[stageIdx][0].minLevel}</span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-2">
              {stage.map(evo => (
                <button
                  key={evo.id}
                  type="button"
                  onClick={() => onSelect(evo.id, evo.name)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    {evo.sprite && (
                      <img
                        src={evo.sprite}
                        alt={evo.name}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-1 capitalize group-hover:text-indigo-600 transition-colors">
                    {formatName(evo.name)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
